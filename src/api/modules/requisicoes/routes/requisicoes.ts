import { Router } from "express"
import { RequisicoesController } from "../controllers"

const router = Router()

router.route('/')
    .get(RequisicoesController.find)
    .post(RequisicoesController.filterTable)

router.route('/:id')
    .get(RequisicoesController.findOne)


export default router