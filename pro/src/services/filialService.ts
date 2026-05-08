import prisma from "../config/prisma.js"
import { Prisma } from "../generated/prisma/client.js"

export async function listar(params: { page: number; limit: number; nome?: string }) {
  const { page, limit, nome } = params
  const where: Prisma.FilialWhereInput = {}
  if (nome) where.nome = { contains: nome, mode: "insensitive" }

  const [data, total] = await Promise.all([
    prisma.filial.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.filial.count({ where }),
  ])
  return { data, total }
}

export async function buscarPorId(id: number) {
  return prisma.filial.findUnique({
    where: { id },
    include: { pedidos: true, filialFornecedores: { include: { fornecedor: true } } },
  })
}

export async function criar(data: { nome: string; endereco: string; telefone?: string }) {
  return prisma.filial.create({ data })
}

export async function atualizar(id: number, data: Partial<{ nome: string; endereco: string; telefone: string }>) {
  return prisma.filial.update({ where: { id }, data })
}

export async function remover(id: number) {
  return prisma.filial.delete({ where: { id } })
}
