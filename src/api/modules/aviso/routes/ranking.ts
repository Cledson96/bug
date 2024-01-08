import { Router } from "express"
import { AvisoRankingController } from "@api/modules/aviso/controllers"

const router = Router()

router.route('/')
    .get(AvisoRankingController.find)
    .post(AvisoRankingController.create)

router.route('/:id')
    .get(AvisoRankingController.findOne)
    .put(AvisoRankingController.update)


export default router;