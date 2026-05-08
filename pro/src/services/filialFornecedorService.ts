import prisma from "../config/prisma.js"

export async function associar(filialId: number, fornecedorId: number) {
  return prisma.filialFornecedor.create({
    data: { filialId, fornecedorId },
    include: { filial: true, fornecedor: true },
  })
}

export async function desassociar(filialId: number, fornecedorId: number) {
  return prisma.filialFornecedor.delete({
    where: { filialId_fornecedorId: { filialId, fornecedorId } },
  })
}

export async function listarPorFilial(filialId: number) {
  return prisma.filialFornecedor.findMany({
    where: { filialId },
    include: { fornecedor: true },
  })
}

export async function listarPorFornecedor(fornecedorId: number) {
  return prisma.filialFornecedor.findMany({
    where: { fornecedorId },
    include: { filial: true },
  })
}
