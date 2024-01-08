import { Router } from "express"
import { ModeloController } from "../controllers"

const router = Router()

router.route('/')
    .get(ModeloController.find)
    .post(ModeloController.create)

router.route('/:id')
    .get(ModeloController.findOne)
    .put(ModeloController.update)

export default router;
