import { Router } from "express"
import { ParticipacaoEmailController } from "../controllers";

const router = Router()

router.route('/')
    .get(ParticipacaoEmailController.find)
    .post(ParticipacaoEmailController.create)

router.route('/:id')
    .get(ParticipacaoEmailController.findOne)

router.route('/templates')
    .post(ParticipacaoEmailController.getTemplate)
    .put(ParticipacaoEmailController.update)

export default router;