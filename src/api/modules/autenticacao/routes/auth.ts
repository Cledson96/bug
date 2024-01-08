import { Router } from "express";
import { AuthController } from "../controllers";

const router = Router();

router.route('/')
    .post(AuthController.authenticate)

router.route('/esqueci-senha')
    .post(AuthController.resetPassword)

router.route('/esqueci-senha')
    .put(AuthController.newPassword)    


router.route('/usuario')
    .get(AuthController.getUser)
    .put(AuthController.changePassword)

export default router;