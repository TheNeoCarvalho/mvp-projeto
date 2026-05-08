import { Request, Response } from "express"
import * as filialService from "../services/filialService.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { paginatedResponse } from "../utils/pagination.js"
import AppError from "../utils/AppError.js"

export const listar = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, nome } = req.query as any
  const { data, total } = await filialService.listar({ page, limit, nome })
  res.json(paginatedResponse(data, total, { page, limit }))
})

export const buscarPorId = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const filial = await filialService.buscarPorId(id)
  if (!filial) throw new AppError("Filial não encontrada", 404)
  res.json({ data: filial })
})

export const criar = asyncHandler(async (req: Request, res: Response) => {
  const filial = await filialService.criar(req.body)
  res.status(201).json({ data: filial })
})

export const atualizar = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const filial = await filialService.atualizar(id, req.body)
  res.json({ data: filial })
})

export const remover = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  await filialService.remover(id)
  res.status(204).end()
})
