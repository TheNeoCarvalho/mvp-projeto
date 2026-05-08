import { Router } from "express"
import * as filialController from "../controllers/filialController.js"
import { validate } from "../middlewares/validate.js"
import { validatePagination } from "../middlewares/pagination.js"
import { filialSchema, filialUpdateSchema } from "../validations/schemas.js"

const router = Router()

/**
 * @openapi
 * /filiais:
 *   get:
 *     tags: [Filiais]
 *     summary: Listar filiais
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: nome
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lista paginada de filiais
 */
router.get("/", validatePagination, filialController.listar)

/**
 * @openapi
 * /filiais/{id}:
 *   get:
 *     tags: [Filiais]
 *     summary: Buscar filial por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Filial encontrada
 *       404:
 *         description: Filial não encontrada
 */
router.get("/:id", filialController.buscarPorId)

/**
 * @openapi
 * /filiais:
 *   post:
 *     tags: [Filiais]
 *     summary: Criar filial
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, endereco]
 *             properties:
 *               nome: { type: string }
 *               endereco: { type: string }
 *               telefone: { type: string }
 *     responses:
 *       201:
 *         description: Filial criada
 */
router.post("/", validate(filialSchema), filialController.criar)

/**
 * @openapi
 * /filiais/{id}:
 *   put:
 *     tags: [Filiais]
 *     summary: Atualizar filial
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome: { type: string }
 *               endereco: { type: string }
 *               telefone: { type: string }
 *     responses:
 *       200:
 *         description: Filial atualizada
 */
router.put("/:id", validate(filialUpdateSchema), filialController.atualizar)

/**
 * @openapi
 * /filiais/{id}:
 *   delete:
 *     tags: [Filiais]
 *     summary: Remover filial
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Filial removida
 */
router.delete("/:id", filialController.remover)

export default router
