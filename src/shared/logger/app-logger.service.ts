import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import { inspect } from 'node:util';

type ErrLike = { message?: unknown; stack?: unknown };
type Normalized = { message: string; stack?: string };

const asString = (v: unknown): string | undefined =>
  typeof v === 'string' ? v : undefined;

const isErrLike = (v: unknown): v is ErrLike =>
  !!v && typeof v === 'object' && ('message' in (v as any) || 'stack' in (v as any));

const stringify = (v: unknown, depth = 5) =>
  typeof v === 'string'
    ? v
    : inspect(v, { depth, maxArrayLength: 50, breakLength: 120 });

const normalize = (err: unknown): Normalized => {
  if (err instanceof Error) return { message: err.message, stack: err.stack };

  if (isErrLike(err)) {
    const msg = asString(err.message) ?? stringify(err);
    const stk = asString(err.stack);
    return { message: msg, stack: stk };
  }

  return { message: stringify(err, 3) };
};

const splitOptionalParams = (params: unknown[]) => {
  const [p0, p1, ...rest] = params;
  return {
    stack: asString(p0),
    context: asString(p1),
    rest,
  };
};

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger extends ConsoleLogger {
  constructor() {
    super({ timestamp: true });
  }

  override error(message: any, stack?: string, context?: string): void;
  override error(message: any, ...optionalParams: any[]): void;

  override error(message: unknown, ...optionalParams: unknown[]): void {
    const { stack, context, rest } = splitOptionalParams(optionalParams);

    if (stack) {
      super.error(message as any, stack, context);
      if (rest.length) super.error('extra', undefined, context, ...rest);
      return;
    }

    const n = normalize(message);
    super.error(n.message, n.stack, context, ...rest);
  }
}
