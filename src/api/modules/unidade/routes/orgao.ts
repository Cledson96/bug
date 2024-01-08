import { Router } from "express";
import { OrgaoController } from "../controllers";

const router = Router();

router.route('/')
    .get(OrgaoController.find)
    .post(OrgaoController.create)
    
router.route('/:id')
    .get(OrgaoController.findOne)
    .put(OrgaoController.update)

export default router;