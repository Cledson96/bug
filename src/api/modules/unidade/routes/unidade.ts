import { Router } from "express";
import { UnidadeController } from "@module/unidade/controllers";

const router = Router();

router.route('/')
    .get(UnidadeController.find)
    .post(UnidadeController.create)
    
router.route('/:id')
    .get(UnidadeController.findOne)
    .put(UnidadeController.update)

export default router;