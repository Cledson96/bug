import { Router } from "express";
import unidadeRouter from "@module/unidade/routes/unidade";
import orgaoRouter from "@module/unidade/routes/orgao";
import municipioRouter from "@module/unidade/routes/municipio";

const router = Router();

router.use('/unidades', unidadeRouter);
router.use('/orgaos', orgaoRouter);
router.use('/municipios', municipioRouter);

export default router;