import { z } from "zod"

export const filialSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(255),
  endereco: z.string().min(1, "Endereço é obrigatório").max(500),
  telefone: z.string().max(20).optional(),
})

export const filialUpdateSchema = filialSchema.partial()

export const fornecedorSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(255),
  contato: z.string().max(255).optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  telefone: z.string().max(20).optional(),
})

export const fornecedorUpdateSchema = fornecedorSchema.partial()

export const produtoSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(255),
  descricao: z.string().max(1000).optional(),
  preco: z.number().positive("Preço deve ser positivo"),
  categoria: z.string().max(100).optional(),
})

export const produtoUpdateSchema = produtoSchema.partial()

export const pedidoItemSchema = z.object({
  produtoId: z.number().int().positive(),
  quantidade: z.number().int().positive().default(1),
  precoUnitario: z.number().positive(),
})

export const pedidoSchema = z.object({
  filialId: z.number().int().positive("Filial é obrigatória"),
  itens: z.array(pedidoItemSchema).min(1, "Pedido deve ter pelo menos 1 item"),
})

export const statusSchema = z.object({
  status: z.enum(["pendente", "confirmado", "preparando", "entregue", "cancelado"]),
})

export const filialFornecedorSchema = z.object({
  filialId: z.number().int().positive(),
  fornecedorId: z.number().int().positive(),
})
