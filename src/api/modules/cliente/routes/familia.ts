import { Router } from "express";
import { FamiliaController } from "../controllers";

const router = Router();

router.route('/')
    .get(FamiliaController.find)
    .post(FamiliaController.create)
    
router.route('/:id')
    .get(FamiliaController.findOne)
    .put(FamiliaController.update)
    .patch(FamiliaController.toggleActive)

router.route('/:id/tags')
    .get(FamiliaController.findTags)

router.route('/:id/regras')
    .get(FamiliaController.findRegras)

router.route('/:id/grupos')
    .get(FamiliaController.findByGroupClient)

export default router;