import { Router } from "express"
import { ItemConcorrenteController } from "@module/participacao/controllers";

const router = Router();


router.route('/')
    .get(ItemConcorrenteController.find)
    .post(ItemConcorrenteController.create)


router.route('/:id')
    .get(ItemConcorrenteController.findOne)
    .put(ItemConcorrenteController.update)


export default router;