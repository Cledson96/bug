import { Router } from "express"
import abreviaturaRouter from "./abreviatura"
import analiseRouter from "./analise"
const router = Router()

router.use('/analises', analiseRouter)
router.use('/', abreviaturaRouter)


export default router;