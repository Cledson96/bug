import { Router } from "express"
import { ParticipacaoArquivoController } from "../controllers";

const router = Router()

router.route('/')
    .get(ParticipacaoArquivoController.find)
    .post(ParticipacaoArquivoController.create)

router.route('/:id')
    .get(ParticipacaoArquivoController.findOne)

export default router;