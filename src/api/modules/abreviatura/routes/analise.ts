import { Router } from "express"
import { AnaliseController } from "@api/modules/abreviatura/controllers";

const router = Router();

router.route('/')
    .get(AnaliseController.find)
    .post(AnaliseController.create)

router.route('/:id')
    .get(AnaliseController.findOne)
    .put(AnaliseController.update)
    .patch(AnaliseController.toggleActive)

export default router;