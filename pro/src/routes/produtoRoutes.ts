import { Router } from "express"
import * as produtoController from "../controllers/produtoController.js"
import { validate } from "../middlewares/validate.js"
import { validatePagination } from "../middlewares/pagination.js"
import { produtoSchema, produtoUpdateSchema } from "../validations/schemas.js"

const router = Router()

router.get("/", validatePagination, produtoController.listar)
router.get("/:id", produtoController.buscarPorId)
router.post("/", validate(produtoSchema), produtoController.criar)
router.put("/:id", validate(produtoUpdateSchema), produtoController.atualizar)
router.delete("/:id", produtoController.remover)

export default router
