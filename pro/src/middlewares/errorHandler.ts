import { Request, Response, NextFunction } from "express"
import { Prisma } from "../generated/prisma/client.js"
import AppError from "../utils/AppError.js"
import logger from "../utils/logger.js"

function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message })
    return
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      res.status(404).json({ error: "Registro não encontrado" })
      return
    }
    if (err.code === "P2002") {
      const target = (err.meta?.target as string[])?.join(", ") || "campo"
      res.status(409).json({ error: `Registro duplicado: ${target}` })
      return
    }
    if (err.code === "P2003") {
      res.status(400).json({ error: "Referência inválida: registro relacionado não encontrado" })
      return
    }
  }

  logger.error({ err, method: req.method, url: req.url }, "Erro interno do servidor")
  res.status(500).json({ error: "Erro interno do servidor" })
}

export default errorHandler
