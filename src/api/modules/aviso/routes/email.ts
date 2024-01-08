import { Router } from "express"
import { AvisoEmailController } from "../controllers";

const router = Router()

router.route('/')
    .get(AvisoEmailController.find)
    .post(AvisoEmailController.create)

router.route('/:id')
    .get(AvisoEmailController.findOne)

router.route('/templates')
    .post(AvisoEmailController.getTemplate)
    .put(AvisoEmailController.update)

export default router;