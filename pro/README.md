# Grupo Tereza Gastronomia

Backend RESTful para gestão de filiais e fornecedores de uma rede de restaurantes.

## Stack

- **Runtime:** Node.js + TypeScript (tsx)
- **Framework:** Express.js
- **ORM:** Prisma 7
- **Banco:** PostgreSQL
- **Validação:** Zod
- **Logging:** Pino
- **Testes:** Vitest + Supertest
- **Documentação:** Swagger (OpenAPI 3.0)

## Estrutura

```
src/
├── __tests__/         Testes automatizados
├── config/            Conexão com banco (Prisma)
├── controllers/       Handlers das requisições HTTP
├── docs/              Configuração do Swagger
├── middlewares/       Interceptadores (erro, auth, validação, paginação)
├── routes/            Definição das rotas Express
├── services/          Lógica de negócio
├── utils/             Utilitários (AppError, logger, env, asyncHandler, pagination)
├── validations/       Schemas Zod
├── app.ts             Configuração do Express
└── server.ts          Inicialização do servidor
prisma/
└── schema.prisma      Modelos do banco de dados
```

## Endpoints

### `GET /api` — Health-check
### `GET /api-docs` — Swagger UI

### Filiais `/api/filiais`
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Listar todas (paginado, filtra por `?nome=`) |
| GET | `/:id` | Buscar por ID |
| POST | `/` | Criar |
| PUT | `/:id` | Atualizar |
| DELETE | `/:id` | Remover |

### Fornecedores `/api/fornecedores`
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Listar todos (paginado, filtra por `?nome=`) |
| GET | `/:id` | Buscar por ID |
| POST | `/` | Criar |
| PUT | `/:id` | Atualizar |
| DELETE | `/:id` | Remover |

### Produtos `/api/produtos`
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Listar todos (paginado, filtra por `?nome=&categoria=`) |
| GET | `/:id` | Buscar por ID |
| POST | `/` | Criar |
| PUT | `/:id` | Atualizar |
| DELETE | `/:id` | Remover |

### Pedidos `/api/pedidos`
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Listar todos (paginado, filtra por `?filialId=&status=`) |
| GET | `/:id` | Buscar por ID |
| POST | `/` | Criar |
| PATCH | `/:id/status` | Atualizar status |
| DELETE | `/:id` | Remover |

### Filiais-Fornecedores `/api/filiais-fornecedores`
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/` | Associar filial e fornecedor |
| DELETE | `/:filialId/:fornecedorId` | Desassociar |
| GET | `/filial/:filialId` | Listar fornecedores de uma filial |
| GET | `/fornecedor/:fornecedorId` | Listar filiais de um fornecedor |

## Como rodar

```bash
# 1. Instalar dependências
npm install

# 2. Copiar e configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com sua conexão PostgreSQL

# 3. Criar banco e rodar migrations
npx prisma migrate dev --name init

# 4. Gerar Prisma Client
npm run prisma:generate

# 5. Iniciar servidor (desenvolvimento)
npm run dev
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor com hot-reload (nodemon + tsx) |
| `npm start` | Servidor de produção |
| `npm test` | Rodar testes |
| `npm run test:watch` | Rodar testes em watch mode |
| `npm run prisma:migrate` | Rodar migrations |
| `npm run prisma:generate` | Gerar Prisma Client |
| `npm run prisma:studio` | Abrir Prisma Studio |
| `npm run prisma:seed` | Popular banco com dados iniciais |

## Melhorias implementadas

- ✅ Validação de dados com Zod
- ✅ Paginação e filtros nas listagens
- ✅ Tratamento de erros do Prisma (P2025 → 404, P2002 → 409, P2003 → 400)
- ✅ Remoção de boilerplate try/catch com asyncHandler
- ✅ CRUD de FilialFornecedor
- ✅ Segurança: helmet + rate limiting + validação de env
- ✅ Logging estruturado com Pino
- ✅ Documentação Swagger em `/api-docs`
- ✅ Response envelope padronizado (`{ data, meta }`)
- ✅ Testes de unidade e integração com Vitest

## Modelos

- **Filial** — nome, endereco, telefone
- **Fornecedor** — nome, contato, email, telefone
- **Produto** — nome, descricao, preco, categoria
- **Pedido** — vinculado a uma filial, com status e itens
- **FilialFornecedor** — relação N:N entre filiais e fornecedores
- **PedidoProduto** — relação N:N entre pedidos e produtos
