import { Request, Response } from "express"
import * as filialFornecedorService from "../services/filialFornecedorService.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import AppError from "../utils/AppError.js"

export const associar = asyncHandler(async (req: Request, res: Response) => {
  const { filialId, fornecedorId } = req.body
  const relacao = await filialFornecedorService.associar(filialId, fornecedorId)
  res.status(201).json({ data: relacao })
})

export const desassociar = asyncHandler(async (req: Request, res: Response) => {
  const filialId = Number(req.params.filialId)
  const fornecedorId = Number(req.params.fornecedorId)
  await filialFornecedorService.desassociar(filialId, fornecedorId)
  res.status(204).end()
})

export const listarPorFilial = asyncHandler(async (req: Request, res: Response) => {
  const filialId = Number(req.params.filialId)
  const relacoes = await filialFornecedorService.listarPorFilial(filialId)
  res.json({ data: relacoes })
})

export const listarPorFornecedor = asyncHandler(async (req: Request, res: Response) => {
  const fornecedorId = Number(req.params.fornecedorId)
  const relacoes = await filialFornecedorService.listarPorFornecedor(fornecedorId)
  res.json({ data: relacoes })
})
