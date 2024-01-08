import { Router } from 'express'
import marcaRouter from "./marca"
import modeloRouter from "./modelo"
import setorRouter from "./setor"
import tipoRouter from "./tipo"

const router = Router();

router.use('/marcas', marcaRouter)
router.use('/modelos', modeloRouter)
router.use('/setor', setorRouter)
router.use('/tipo', tipoRouter)

export default router;