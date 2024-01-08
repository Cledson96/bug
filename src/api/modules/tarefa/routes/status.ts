import {Router} from 'express'
import { TarefaStatusController } from '../controllers'

const router = Router()

router.route('/')
    .get(TarefaStatusController.find)
    .post(TarefaStatusController.create)

router.route('/:id')
    .get(TarefaStatusController.findOne)
    .put(TarefaStatusController.update)

export default router;
