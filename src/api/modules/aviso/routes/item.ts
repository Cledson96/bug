import { Router } from "express"
import { AvisoItemController } from "@api/modules/aviso/controllers";

const router = Router();

router.route('/')
    .get(AvisoItemController.find)
    .post(AvisoItemController.create)

router.route('/:id')
    .get(AvisoItemController.findOne)
    .put(AvisoItemController.update)

export default router;