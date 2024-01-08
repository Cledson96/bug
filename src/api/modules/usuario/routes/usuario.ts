import { Router } from "express";
import { UsuarioController } from "@module/usuario/controllers";
import verifyToken from "@api/middlewares/verifyToken";


const router = Router();

router.route('/')
    .get(verifyToken.isUser, UsuarioController.find)
    .post(verifyToken.isUser,UsuarioController.create)
    
router.route('/:id')
    .get(UsuarioController.findOne)
    .put(UsuarioController.update)
    // .delete(UsuarioController.delete)

export default router;