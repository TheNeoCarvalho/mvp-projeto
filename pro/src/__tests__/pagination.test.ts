import { describe, it, expect } from "vitest"
import { paginationSchema, paginatedResponse } from "../utils/pagination.js"

describe("paginationSchema", () => {
  it("deve usar defaults para page e limit", () => {
    const result = paginationSchema.parse({})
    expect(result.page).toBe(1)
    expect(result.limit).toBe(20)
  })

  it("deve aceitar valores válidos", () => {
    const result = paginationSchema.parse({ page: "2", limit: "10" })
    expect(result.page).toBe(2)
    expect(result.limit).toBe(10)
  })
})

describe("paginatedResponse", () => {
  it("deve montar resposta paginada corretamente", () => {
    const data = [{ id: 1 }, { id: 2 }]
    const result = paginatedResponse(data, 50, { page: 1, limit: 2 })
    expect(result.data).toEqual(data)
    expect(result.meta.page).toBe(1)
    expect(result.meta.limit).toBe(2)
    expect(result.meta.total).toBe(50)
    expect(result.meta.totalPages).toBe(25)
  })
})
