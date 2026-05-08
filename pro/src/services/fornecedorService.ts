import prisma from "../config/prisma.js"
import { Prisma } from "../generated/prisma/client.js"

export async function listar(params: { page: number; limit: number; nome?: string }) {
  const { page, limit, nome } = params
  const where: Prisma.FornecedorWhereInput = {}
  if (nome) where.nome = { contains: nome, mode: "insensitive" }

  const [data, total] = await Promise.all([
    prisma.fornecedor.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.fornecedor.count({ where }),
  ])
  return { data, total }
}

export async function buscarPorId(id: number) {
  return prisma.fornecedor.findUnique({
    where: { id },
    include: { filialFornecedores: { include: { filial: true } } },
  })
}

export async function criar(data: { nome: string; contato?: string; email?: string; telefone?: string }) {
  return prisma.fornecedor.create({ data })
}

export async function atualizar(id: number, data: Partial<{ nome: string; contato: string; email: string; telefone: string }>) {
  return prisma.fornecedor.update({ where: { id }, data })
}

export async function remover(id: number) {
  return prisma.fornecedor.delete({ where: { id } })
}
