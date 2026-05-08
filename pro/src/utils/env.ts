import { cleanEnv, str, port, num } from "envalid"

export const env = cleanEnv(process.env, {
  DATABASE_URL: str(),
  PORT: port({ default: 3000 }),
  NODE_ENV: str({ choices: ["development", "production", "test"], default: "development" }),
  LOG_LEVEL: str({ default: "info" }),
  CORS_ORIGIN: str({ default: "*" }),
  RATE_LIMIT_WINDOW_MS: num({ default: 15 * 60 * 1000 }),
  RATE_LIMIT_MAX: num({ default: 100 }),
})
