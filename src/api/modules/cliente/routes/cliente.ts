import { Router } from "express"
import { ClienteController } from "@api/modules/cliente/controllers"

const router = Router()

router.route('/')
    .get(ClienteController.find)
    .post(ClienteController.create)

router.route('/:id')
    .get(ClienteController.findOne)
    .put(ClienteController.update)
    .patch(ClienteController.toggleActive)


export default router;