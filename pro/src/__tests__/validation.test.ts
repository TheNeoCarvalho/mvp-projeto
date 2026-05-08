import { describe, it, expect } from "vitest"
import { filialSchema, produtoSchema, pedidoSchema, statusSchema } from "../validations/schemas.js"

describe("filialSchema", () => {
  it("deve validar filial correta", () => {
    const result = filialSchema.safeParse({ nome: "Filial Centro", endereco: "Rua A, 123" })
    expect(result.success).toBe(true)
  })

  it("deve rejeitar filial sem nome", () => {
    const result = filialSchema.safeParse({ endereco: "Rua A, 123" })
    expect(result.success).toBe(false)
  })

  it("deve rejeitar filial sem endereco", () => {
    const result = filialSchema.safeParse({ nome: "Filial Centro" })
    expect(result.success).toBe(false)
  })
})

describe("produtoSchema", () => {
  it("deve validar produto com preco positivo", () => {
    const result = produtoSchema.safeParse({ nome: "Produto X", preco: 10.5 })
    expect(result.success).toBe(true)
  })

  it("deve rejeitar produto com preco negativo", () => {
    const result = produtoSchema.safeParse({ nome: "Produto X", preco: -5 })
    expect(result.success).toBe(false)
  })
})

describe("pedidoSchema", () => {
  it("deve validar pedido com itens", () => {
    const result = pedidoSchema.safeParse({
      filialId: 1,
      itens: [{ produtoId: 1, quantidade: 2, precoUnitario: 15.0 }],
    })
    expect(result.success).toBe(true)
  })

  it("deve rejeitar pedido sem itens", () => {
    const result = pedidoSchema.safeParse({ filialId: 1, itens: [] })
    expect(result.success).toBe(false)
  })
})

describe("statusSchema", () => {
  it("deve aceitar status válido", () => {
    const result = statusSchema.safeParse({ status: "entregue" })
    expect(result.success).toBe(true)
  })

  it("deve rejeitar status inválido", () => {
    const result = statusSchema.safeParse({ status: "invalido" })
    expect(result.success).toBe(false)
  })
})
