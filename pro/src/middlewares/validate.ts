import { Request, Response, NextFunction } from "express"
import { ZodSchema, ZodError } from "zod"
import AppError from "../utils/AppError.js"

export function validate(schema: ZodSchema, source: "body" | "query" | "params" = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req[source] = schema.parse(req[source])
      next()
    } catch (err) {
      if (err instanceof ZodError) {
        const message = err.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ")
        next(new AppError(message, 400))
      } else {
        next(err)
      }
    }
  }
}
