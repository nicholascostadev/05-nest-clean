import z from 'zod/v4';

export const EnvSchema = z.object({
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().default(8080),
});

export type Env = z.infer<typeof EnvSchema>;
