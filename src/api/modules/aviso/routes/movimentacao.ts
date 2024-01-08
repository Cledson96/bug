import { Router } from "express"
import { AvisoMovimentacaoController } from "@api/modules/aviso/controllers";

const router = Router();

router.route('/')
    .get(AvisoMovimentacaoController.find)
    .post(AvisoMovimentacaoController.create)

router.route('/:id')
    .get(AvisoMovimentacaoController.findOne)
    .put(AvisoMovimentacaoController.update)
    // .delete(AvisoMovimentacaoController.delete)

export default router;