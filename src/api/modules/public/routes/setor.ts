import { Router } from "express"
import { SetorController } from "../controllers"

const router = Router()

router.route('/')
    .get(SetorController.find)

export default router;