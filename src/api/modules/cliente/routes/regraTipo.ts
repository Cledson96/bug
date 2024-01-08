import { Router } from "express"
import { RegraTipoController } from "@api/modules/cliente/controllers"

const router = Router()

router.route('/')
    .get(RegraTipoController.find)
    .post(RegraTipoController.create)

router.route('/:id')
    .get(RegraTipoController.findOne)
    .put(RegraTipoController.update)
    .patch(RegraTipoController.toggleActive)

export default router;