import { Request, Response } from "express"
import * as fornecedorService from "../services/fornecedorService.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { paginatedResponse } from "../utils/pagination.js"
import AppError from "../utils/AppError.js"

export const listar = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 20
  const nome = req.query.nome as string | undefined
  const { data, total } = await fornecedorService.listar({ page, limit, nome })
  res.json(paginatedResponse(data, total, { page, limit }))
})

export const buscarPorId = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const fornecedor = await fornecedorService.buscarPorId(id)
  if (!fornecedor) throw new AppError("Fornecedor não encontrado", 404)
  res.json({ data: fornecedor })
})

export const criar = asyncHandler(async (req: Request, res: Response) => {
  const fornecedor = await fornecedorService.criar(req.body)
  res.status(201).json({ data: fornecedor })
})

export const atualizar = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const fornecedor = await fornecedorService.atualizar(id, req.body)
  res.json({ data: fornecedor })
})

export const remover = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  await fornecedorService.remover(id)
  res.json({ message: "Fornecedor excluído com sucesso" })
})
