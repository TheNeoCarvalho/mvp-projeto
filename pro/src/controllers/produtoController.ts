import { Request, Response } from "express"
import * as produtoService from "../services/produtoService.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { paginatedResponse } from "../utils/pagination.js"
import AppError from "../utils/AppError.js"

export const listar = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, nome, categoria } = req.query as any
  const { data, total } = await produtoService.listar({ page, limit, nome, categoria })
  res.json(paginatedResponse(data, total, { page, limit }))
})

export const buscarPorId = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const produto = await produtoService.buscarPorId(id)
  if (!produto) throw new AppError("Produto não encontrado", 404)
  res.json({ data: produto })
})

export const criar = asyncHandler(async (req: Request, res: Response) => {
  const produto = await produtoService.criar(req.body)
  res.status(201).json({ data: produto })
})

export const atualizar = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const produto = await produtoService.atualizar(id, req.body)
  res.json({ data: produto })
})

export const remover = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  await produtoService.remover(id)
  res.status(204).end()
})
