import prisma from "../config/prisma.js"
import { Prisma } from "../generated/prisma/client.js"

export async function listar(params: { page: number; limit: number; nome?: string; categoria?: string }) {
  const { page, limit, nome, categoria } = params
  const where: Prisma.ProdutoWhereInput = {}
  if (nome) where.nome = { contains: nome, mode: "insensitive" }
  if (categoria) where.categoria = { contains: categoria, mode: "insensitive" }

  const [data, total] = await Promise.all([
    prisma.produto.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.produto.count({ where }),
  ])
  return { data, total }
}

export async function buscarPorId(id: number) {
  return prisma.produto.findUnique({ where: { id } })
}

export async function criar(data: { nome: string; descricao?: string; preco: number; categoria?: string }) {
  return prisma.produto.create({ data })
}

export async function atualizar(id: number, data: Partial<{ nome: string; descricao: string; preco: number; categoria: string }>) {
  return prisma.produto.update({ where: { id }, data })
}

export async function remover(id: number) {
  return prisma.produto.delete({ where: { id } })
}
