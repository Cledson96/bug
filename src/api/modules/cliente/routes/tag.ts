import { Router } from "express"
import { TagController } from "@api/modules/cliente/controllers"

const router = Router()

router.route('/')
    .get(TagController.find)
    .post(TagController.create)

router.route('/:id')
    .get(TagController.findOne)
    .put(TagController.update)
    .patch(TagController.toggleActive)

router.route('/:id/familia')
    .get(TagController.findTagByFamily)

export default router;