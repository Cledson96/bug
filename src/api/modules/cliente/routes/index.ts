import { Router } from "express"
import ClienteGrupoRouter from "./grupo"
import familiaRouter from "./familia"
import tagRouter from "./tag"
import clienteRouter from "./cliente"
import regraRouter from "./regra"
import regraTipoRouter from "./regraTipo"

const router = Router()

router.use('/grupos', ClienteGrupoRouter)
router.use('/familias', familiaRouter)
router.use('/tags', tagRouter)
router.use('/regras/tipos', regraTipoRouter)
router.use('/regras', regraRouter)
router.use('/', clienteRouter)


export default router;