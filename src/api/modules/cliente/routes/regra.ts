import { Router } from "express"
import { RegraController } from "@api/modules/cliente/controllers"

const router = Router()

router.route('/')
    .get(RegraController.find)
    .post(RegraController.create)

router.route('/:id')
    .get(RegraController.findOne)
    .put(RegraController.update)
    .patch(RegraController.toggleActive)

export default router;