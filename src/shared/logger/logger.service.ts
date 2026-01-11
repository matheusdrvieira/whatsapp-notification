import { ConsoleLogger, HttpException, Injectable, Optional, Scope } from '@nestjs/common';
import { inspect } from 'node:util';
import { EventSystemErrorInput } from 'src/modules/notifications/domain/types/webhook/disconnected.types';
import { DiscordService } from 'src/modules/notifications/infra/services/discord.service';

type ErrLike = { name?: unknown; message?: unknown; stack?: unknown; cause?: unknown };
type NormalizedError = {
  name?: string;
  message: string;
  stack?: string;
  details?: Record<string, unknown>;
};

const asString = (v: unknown): string | undefined => (typeof v === 'string' ? v : undefined);
const isObject = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object';

const stringify = (v: unknown, depth = 6) =>
  typeof v === 'string'
    ? v
    : inspect(v, {
      depth,
      maxArrayLength: 80,
      breakLength: 120,
      compact: false,
    });

const isErrLike = (v: unknown): v is ErrLike =>
  isObject(v) && ('message' in v || 'stack' in v || 'name' in v || 'cause' in v);

const looksLikeAxiosError = (e: any): boolean =>
  !!e && (e.isAxiosError === true || (!!e.config && (e.response || e.request)));

const compactUrl = (baseURL?: string, url?: string) => {
  if (!baseURL && !url) return undefined;
  if (!baseURL) return url;
  if (!url) return baseURL;
  if (url.startsWith('http')) return url;
  return `${baseURL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
};

const safeJson = (v: unknown, maxLen = 2000): string => {
  try {
    const s = typeof v === 'string' ? v : JSON.stringify(v);
    return s.length <= maxLen ? s : s.slice(0, maxLen - 1) + '…';
  } catch {
    const s = stringify(v, 3);
    return s.length <= maxLen ? s : s.slice(0, maxLen - 1) + '…';
  }
};

const pickHttpExceptionDetails = (e: HttpException) => {
  const status = e.getStatus?.();
  const response = e.getResponse?.();
  return {
    httpStatus: status,
    response: typeof response === 'string' ? response : response,
  };
};

const pickAxiosDetails = (e: any) => {
  const method = asString(e?.config?.method)?.toUpperCase();
  const url = compactUrl(asString(e?.config?.baseURL), asString(e?.config?.url));
  const status = typeof e?.response?.status === 'number' ? e.response.status : undefined;
  const responseData = e?.response?.data !== undefined ? safeJson(e.response.data, 2500) : undefined;

  return {
    axios: true,
    method,
    url,
    status,
    responseData,
  };
};

const pickCauseChain = (err: any, limit = 3) => {
  const causes: Array<{ name?: string; message?: string }> = [];
  let cur = err?.cause;
  let i = 0;

  while (cur && i < limit) {
    if (cur instanceof Error) {
      causes.push({ name: cur.name, message: cur.message });
      cur = (cur as any).cause;
    } else if (isErrLike(cur)) {
      causes.push({
        name: asString((cur as any).name),
        message: asString((cur as any).message) ?? stringify(cur, 2),
      });
      cur = (cur as any).cause;
    } else {
      causes.push({ message: stringify(cur, 2) });
      break;
    }
    i++;
  }

  return causes.length ? causes : undefined;
};

const normalizeError = (err: unknown): NormalizedError => {
  if (err instanceof Error) {
    const details: Record<string, unknown> = {};

    if (err instanceof HttpException) Object.assign(details, pickHttpExceptionDetails(err));
    if (looksLikeAxiosError(err as any)) Object.assign(details, pickAxiosDetails(err as any));

    const causes = pickCauseChain(err);
    if (causes) details.causes = causes;

    if ((err as any)?.name === 'AggregateError' && Array.isArray((err as any)?.errors)) {
      details.aggregateErrors = (err as any).errors
        .slice(0, 5)
        .map((e: unknown) => (e instanceof Error ? `${e.name}: ${e.message}` : stringify(e, 1)));
      if ((err as any).errors.length > 5) details.aggregateErrorsTruncated = true;
    }

    return {
      name: err.name,
      message: err.message || err.toString(),
      stack: err.stack,
      details: Object.keys(details).length ? details : undefined,
    };
  }

  if (isErrLike(err)) {
    const msg = asString(err.message) ?? stringify(err, 3);
    const stk = asString(err.stack);
    const name = asString((err as any).name);

    const details: Record<string, unknown> = {};
    const causes = pickCauseChain(err);
    if (causes) details.causes = causes;

    return {
      name,
      message: msg,
      stack: stk,
      details: Object.keys(details).length ? details : undefined,
    };
  }

  return { message: stringify(err, 3) };
};

const splitOptionalParams = (params: unknown[]) => {
  const [p0, p1, ...rest] = params;

  const stack = asString(p0);
  const context = asString(p1);

  if (!stack) {
    return {
      stack: undefined,
      context: asString(p0),
      rest: [p1, ...rest].filter((x) => x !== undefined),
    };
  }

  return { stack, context, rest };
};

const pickMetaFromRest = (rest: unknown[]) => {
  const metas: Record<string, unknown>[] = [];
  for (const r of rest) {
    if (isObject(r) && !(r instanceof Error) && !Array.isArray(r)) metas.push(r);
  }
  if (!metas.length) return undefined;
  if (metas.length === 1) return metas[0];
  return Object.assign({}, ...metas);
};

const fingerprintOf = (headline: string, context?: string) => {
  const key = `${context ?? ''}|${headline}`;
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return h.toString(16);
};

@Injectable({ scope: Scope.TRANSIENT })
export class Logger extends ConsoleLogger {
  private static lastSentAtByFp = new Map<string, number>();

  constructor(@Optional() private readonly discord: DiscordService) {
    super({ timestamp: true });
  }

  override error(message: any, stack?: string, context?: string): void;
  override error(message: any, ...optionalParams: any[]): void;

  override error(message: unknown, ...optionalParams: unknown[]): void {
    const { stack, context, rest } = splitOptionalParams(optionalParams);

    if (stack) {
      super.error(message as any, stack, context);

      if (rest.length) super.error(`details: ${stringify(rest, 4)}`, undefined, context);

      const headline = typeof message === 'string' ? message : stringify(message, 2);
      void this.notifyDiscordIfNeeded({
        message: headline,
        stack,
        context,
        details: rest.length ? { extra: rest } : undefined,
      });

      return;
    }

    const n = normalizeError(message);
    const headline = n.name ? `${n.name}: ${n.message}` : n.message;

    const meta = pickMetaFromRest(rest);
    const mergedDetails = n.details || meta ? { ...(n.details ?? {}), ...(meta ?? {}) } : undefined;

    super.error(headline, n.stack, context);

    if (mergedDetails && Object.keys(mergedDetails).length) {
      super.error(`details: ${stringify(mergedDetails, 5)}`, undefined, context);
    }

    const extras = rest.filter((r) => !(isObject(r) && !(r instanceof Error) && !Array.isArray(r)));
    if (extras.length) {
      super.error(`extra: ${stringify(extras, 4)}`, undefined, context);
    }

    void this.notifyDiscordIfNeeded({
      message: headline,
      stack: n.stack,
      context,
      details: mergedDetails,
    });
  }

  private async notifyDiscordIfNeeded(input: EventSystemErrorInput): Promise<void> {
    const fp = fingerprintOf(input.message, input.context);
    const now = Date.now();
    const last = Logger.lastSentAtByFp.get(fp) ?? 0;

    if (now - last < 30_000) return;
    Logger.lastSentAtByFp.set(fp, now);

    await this.discord?.notifyErrors(input);
  }
}
