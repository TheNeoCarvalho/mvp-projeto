import { Router } from "express"
import * as filialFornecedorController from "../controllers/filialFornecedorController.js"
import { validate } from "../middlewares/validate.js"
import { filialFornecedorSchema } from "../validations/schemas.js"

const router = Router()

router.post("/", validate(filialFornecedorSchema), filialFornecedorController.associar)
router.delete("/:filialId/:fornecedorId", filialFornecedorController.desassociar)
router.get("/filial/:filialId", filialFornecedorController.listarPorFilial)
router.get("/fornecedor/:fornecedorId", filialFornecedorController.listarPorFornecedor)

export default router
