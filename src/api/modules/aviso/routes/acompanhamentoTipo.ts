import { Router } from "express"
import { AvisoAcompanhamentoTipoController } from "@api/modules/aviso/controllers";

const router = Router();

router.route('/')
    .get(AvisoAcompanhamentoTipoController.find)
    .post(AvisoAcompanhamentoTipoController.create)

router.route('/:id')
    .get(AvisoAcompanhamentoTipoController.findOne)
    .put(AvisoAcompanhamentoTipoController.update)

export default router;