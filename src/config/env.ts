import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),

  DATABASE_URL: z.url(),

  API_KEY: z.string().min(1),

  ZAPI_INSTANCE_ID: z.string().min(1),
  ZAPI_TOKEN: z.string().min(1),
  ZAPI_CLIENT_TOKEN: z.string().min(1),

  DISCORD_WEBHOOK_CLIENT: z.string().min(1),
  DISCORD_WEBHOOK_TOKEN: z.string().min(1),
});

const parsed = envSchema.parse(process.env);

export const env = parsed;
