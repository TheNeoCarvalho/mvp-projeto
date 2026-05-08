import swaggerJsdoc from "swagger-jsdoc"

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Grupo Tereza Gastronomia API",
      version: "0.1.0",
      description: "API RESTful para gestão de filiais, fornecedores, produtos e pedidos",
    },
    servers: [{ url: "/api" }],
    components: {
      schemas: {
        Error: {
          type: "object",
          properties: { error: { type: "string" } },
        },
        PaginationMeta: {
          type: "object",
          properties: {
            page: { type: "integer" },
            limit: { type: "integer" },
            total: { type: "integer" },
            totalPages: { type: "integer" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
}

export const swaggerSpec = swaggerJsdoc(options)
