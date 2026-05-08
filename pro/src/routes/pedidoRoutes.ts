import { Router } from "express"
import * as pedidoController from "../controllers/pedidoController.js"
import { validate } from "../middlewares/validate.js"
import { validatePagination } from "../middlewares/pagination.js"
import { pedidoSchema, statusSchema } from "../validations/schemas.js"

const router = Router()

router.get("/", validatePagination, pedidoController.listar)
router.get("/:id", pedidoController.buscarPorId)
router.post("/", validate(pedidoSchema), pedidoController.criar)
router.patch("/:id/status", validate(statusSchema), pedidoController.atualizarStatus)
router.delete("/:id", pedidoController.remover)

export default router
