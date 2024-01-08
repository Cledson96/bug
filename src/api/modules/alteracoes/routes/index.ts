import { Router } from 'express'
import alteracoesRouter from "./alteracoes"

const router = Router();

router.use('/', alteracoesRouter)

export default router;
