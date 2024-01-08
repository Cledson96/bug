import { Router } from "express"
import { AvisoModalidadeController } from "@api/modules/aviso/controllers"

const router = Router()

router.route('/')
    .get(AvisoModalidadeController.find)
    .post(AvisoModalidadeController.create)

router.route('/:id')
    .get(AvisoModalidadeController.findOne)
    .put(AvisoModalidadeController.update)


export default router;