import { Router } from "express"
import { AvisoTipoController } from "@api/modules/aviso/controllers";

const router = Router()

router.route('/')
    .get(AvisoTipoController.find)
    .post(AvisoTipoController.create)

router.route('/:id')
    .get(AvisoTipoController.findOne)
    .put(AvisoTipoController.update)


export default router;