import { Request, Response, NextFunction } from "express"
import { paginationSchema } from "../utils/pagination.js"
import AppError from "../utils/AppError.js"

export function validatePagination(req: Request, _res: Response, next: NextFunction) {
  const result = paginationSchema.safeParse(req.query)
  if (!result.success) {
    next(new AppError("Parâmetros de paginação inválidos", 400))
    return
  }
  req.query.page = String(result.data.page)
  req.query.limit = String(result.data.limit)
  next()
}
