import { Router } from "express"
import { ClienteGrupoController } from "@api/modules/cliente/controllers"

const router = Router()

router.route('/')
    .get(ClienteGrupoController.find)
    .post(ClienteGrupoController.create)

router.route('/:id')
    .get(ClienteGrupoController.findOne)
    .put(ClienteGrupoController.update)
    .patch(ClienteGrupoController.toggleActive)

router.route('/:id/clientes')
    .get(ClienteGrupoController.findClientes)

router.route('/:id/familias')
    .get(ClienteGrupoController.findFamilias)

router.route('/:id/aviso')
    .get(ClienteGrupoController.findByAviso)

export default router;