import { Router } from "express"
import { ParticipacaoStatusController } from "../controllers";

const router = Router();

router.route('/')
    .get(ParticipacaoStatusController.find)
    .post(ParticipacaoStatusController.create)

router.route('/:scope')
    .get(ParticipacaoStatusController.findAvailable)

export default router;