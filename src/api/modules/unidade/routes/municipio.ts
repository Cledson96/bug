import { Router } from "express";
import { MunicipioController } from "../controllers";

const router = Router();

router.route('/')
    .get(MunicipioController.find)
    .post(MunicipioController.create)
    
router.route('/:id')
    .get(MunicipioController.findOne)
    .put(MunicipioController.update)

export default router;