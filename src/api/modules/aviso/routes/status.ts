import { Router } from "express"
import { AvisoStatusController } from "@api/modules/aviso/controllers";

const router = Router();

router.route('/')
    .get(AvisoStatusController.find)
    .post(AvisoStatusController.create)

router.route('/:id')
    .get(AvisoStatusController.findOne)
    .put(AvisoStatusController.update)

export default router;