import { Request, Response } from "express"
import * as pedidoService from "../services/pedidoService.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { paginatedResponse } from "../utils/pagination.js"
import AppError from "../utils/AppError.js"

export const listar = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 20
  const filialId = req.query.filialId ? Number(req.query.filialId) : undefined
  const status = req.query.status as string | undefined
  const { data, total } = await pedidoService.listar({
    page,
    limit,
    filialId,
    status,
  })
  res.json(paginatedResponse(data, total, { page, limit }))
})

export const buscarPorId = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const pedido = await pedidoService.buscarPorId(id)
  if (!pedido) throw new AppError("Pedido não encontrado", 404)
  res.json({ data: pedido })
})

export const criar = asyncHandler(async (req: Request, res: Response) => {
  const pedido = await pedidoService.criar(req.body)
  res.status(201).json({ data: pedido })
})

export const atualizarStatus = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const { status } = req.body
  const pedido = await pedidoService.atualizarStatus(id, status)
  res.json({ data: pedido })
})

export const remover = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  await pedidoService.remover(id)
  res.json({ message: "Pedido excluído com sucesso" })
})
