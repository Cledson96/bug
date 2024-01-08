import { Router } from "express"
import { MarcaController } from "../controllers"

const router = Router()

router.route('/')
    .get(MarcaController.find)
    .post(MarcaController.create)

router.route('/:id')
    .get(MarcaController.findOne)
    .put(MarcaController.update)
    .patch(MarcaController.find)

router.route('/:id/modelos')
    .get(MarcaController.findModelos)

router.route('/:id/tipos')
    .get(MarcaController.find)
    
export default router;