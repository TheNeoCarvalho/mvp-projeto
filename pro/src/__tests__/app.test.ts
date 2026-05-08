import { describe, it, expect } from "vitest"
import request from "supertest"
import app from "../app.js"

describe("GET /api", () => {
  it("deve retornar status running", async () => {
    const res = await request(app).get("/api")
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty("status", "running")
    expect(res.body).toHaveProperty("name", "Grupo Tereza Gastronomia")
  })
})

describe("GET /api-docs/", () => {
  it("deve retornar a página do Swagger UI", async () => {
    const res = await request(app).get("/api-docs/")
    expect(res.status).toBe(200)
    expect(res.text).toContain("swagger")
  })
})
