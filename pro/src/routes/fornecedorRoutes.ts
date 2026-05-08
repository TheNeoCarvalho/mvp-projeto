import { Router } from "express"
import * as fornecedorController from "../controllers/fornecedorController.js"
import { validate } from "../middlewares/validate.js"
import { validatePagination } from "../middlewares/pagination.js"
import { fornecedorSchema, fornecedorUpdateSchema } from "../validations/schemas.js"

const router = Router()

router.get("/", validatePagination, fornecedorController.listar)
router.get("/:id", fornecedorController.buscarPorId)
router.post("/", validate(fornecedorSchema), fornecedorController.criar)
router.put("/:id", validate(fornecedorUpdateSchema), fornecedorController.atualizar)
router.delete("/:id", fornecedorController.remover)

export default router
