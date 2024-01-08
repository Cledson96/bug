import { Router } from "express"
import { TipoController } from "../controllers"

const router = Router()

router.route('/')
    .get(TipoController.find)

export default router;