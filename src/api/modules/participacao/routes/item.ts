import { Router } from "express"
import { ItemController } from "@module/participacao/controllers";

const router = Router();


router.route('/')
.get(ItemController.find)

router.route('/status')
    .get(ItemController.findStatus)

router.route('/:id')
    .get(ItemController.findOne)
    .put(ItemController.update)
    .patch(ItemController.toggleActive)


export default router;