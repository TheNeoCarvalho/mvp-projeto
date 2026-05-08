import prisma from "../config/prisma.js"
import { Prisma } from "../generated/prisma/client.js"

export async function listar(params: { page: number; limit: number; filialId?: number; status?: string }) {
  const { page, limit, filialId, status } = params
  const where: Prisma.PedidoWhereInput = {}
  if (filialId) where.filialId = filialId
  if (status) where.status = status

  const [data, total] = await Promise.all([
    prisma.pedido.findMany({
      where,
      include: { filial: true, itens: { include: { produto: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.pedido.count({ where }),
  ])
  return { data, total }
}

export async function buscarPorId(id: number) {
  return prisma.pedido.findUnique({
    where: { id },
    include: { filial: true, itens: { include: { produto: true } } },
  })
}

export async function criar(data: {
  filialId: number
  itens: { produtoId: number; quantidade: number; precoUnitario: number }[]
}) {
  const { filialId, itens } = data
  return prisma.pedido.create({
    data: {
      filialId,
      itens: { create: itens },
    },
  })
}

export async function atualizarStatus(id: number, status: string) {
  return prisma.pedido.update({ where: { id }, data: { status } })
}

export async function remover(id: number) {
  return prisma.pedido.delete({ where: { id } })
}
