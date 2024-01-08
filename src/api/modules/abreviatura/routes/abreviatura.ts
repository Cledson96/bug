import { Router } from "express"
import { AbreviaturaController } from "@api/modules/abreviatura/controllers";

const router = Router();

router.route('/')
    .get(AbreviaturaController.find)
    .post(AbreviaturaController.create)
    
router.route('/:id')
    .get(AbreviaturaController.findOne)
    .put(AbreviaturaController.update)
    .patch(AbreviaturaController.toggleActive)

router.route('/abreviar/unico')
    .post(AbreviaturaController.abreviar)

router.route('/abreviar/multi')
    .post(AbreviaturaController.multiAbreviar)

export default router;