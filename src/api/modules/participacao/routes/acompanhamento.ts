import { Router } from "express"
import { ParticipacaoAcompanhamentoController } from "@module/participacao/controllers";

const router = Router();

router.route('/')
    .get(ParticipacaoAcompanhamentoController.find)
    .post(ParticipacaoAcompanhamentoController.create)

router.route('/:id')
    .get(ParticipacaoAcompanhamentoController.findOne)
    .put(ParticipacaoAcompanhamentoController.update)

export default router;