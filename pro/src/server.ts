import app from "./app.js"
import { env } from "./utils/env.js"
import logger from "./utils/logger.js"

app.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, "Servidor rodando")
})
