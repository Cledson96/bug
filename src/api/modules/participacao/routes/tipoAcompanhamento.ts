import { Router } from 'express'
import {ParticipacaoAcompanhamentoTipoController} from '@module/participacao/controllers'

const router = Router()

router.route('/')
    .get(ParticipacaoAcompanhamentoTipoController.find)
    .post(ParticipacaoAcompanhamentoTipoController.create)

router.route('/:id')
    .get(ParticipacaoAcompanhamentoTipoController.findOne)
    .put(ParticipacaoAcompanhamentoTipoController.update)

export default router;