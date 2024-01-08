import { Router } from 'express'
import { AlteracoesController } from '../controllers'

const router = Router()

router.route('/')
    .get(AlteracoesController.find)
    .post(AlteracoesController.filterTable)

router.route('/:id')
    .get(AlteracoesController.findOne)

export default router