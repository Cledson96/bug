import { Router } from "express"
import { NotificacaoController } from "@api/modules/notificacao/controllers"

const router = Router()

router.route('/')
    .get(NotificacaoController.find)
    .post(NotificacaoController.create)

router.route('/:id')
    .get(NotificacaoController.findOne)
    .put(NotificacaoController.update)


export default router;