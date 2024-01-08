import { Router } from "express"
import { AvisoAcompanhamentoController } from "@api/modules/aviso/controllers";

const router = Router();

router.route('/')
    .get(AvisoAcompanhamentoController.find)
    .post(AvisoAcompanhamentoController.create)

router.route('/:id')
    .get(AvisoAcompanhamentoController.findOne)
    .put(AvisoAcompanhamentoController.update)

export default router;