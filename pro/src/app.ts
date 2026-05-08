import "dotenv/config"
import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import swaggerUi from "swagger-ui-express"
import { env } from "./utils/env.js"
import logger from "./utils/logger.js"
import errorHandler from "./middlewares/errorHandler.js"
import filialRoutes from "./routes/filialRoutes.js"
import fornecedorRoutes from "./routes/fornecedorRoutes.js"
import produtoRoutes from "./routes/produtoRoutes.js"
import pedidoRoutes from "./routes/pedidoRoutes.js"
import filialFornecedorRoutes from "./routes/filialFornecedorRoutes.js"
import { swaggerSpec } from "./docs/swagger.js"

const app = express()

app.use(helmet())
app.use(cors({ origin: env.CORS_ORIGIN }))
app.use(express.json())

const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Muitas requisições. Tente novamente mais tarde." },
})
app.use("/api", limiter)

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get("/api", (req, res) => {
  res.json({
    name: "Grupo Tereza Gastronomia",
    version: "0.1.0",
    status: "running",
  })
})

app.use("/api/filiais", filialRoutes)
app.use("/api/fornecedores", fornecedorRoutes)
app.use("/api/produtos", produtoRoutes)
app.use("/api/pedidos", pedidoRoutes)
app.use("/api/filiais-fornecedores", filialFornecedorRoutes)

app.use(errorHandler)

export default app
