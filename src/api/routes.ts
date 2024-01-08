import { Router } from "express";
import usuarioRoute from "@module/usuario/routes";
import avisoRouter from "@module/aviso/routes";
import clienteRouter from "@module/cliente/routes";
import tarefaRouter from "@module/tarefa/routes";
import unidadeRouter from "@module/unidade/routes";
import participacaoRouter from "@module/participacao/routes";
import geraisRouter from "@module/public/routes";
import arquivosRouter from "@module/public/routes"
import abreviaturasRouter from "@module/abreviatura/routes"
import requisicoesRouter from "@module/requisicoes/routes"
import alteracoesRouter from "@module/alteracoes/routes"
import authRoutes from "@module/autenticacao/routes";
import notificacaoRouter from "@module/notificacao/routes"

const router = Router();

router.use('/usuarios', usuarioRoute);
router.use('/avisos', avisoRouter);
router.use('/clientes', clienteRouter);
router.use('/tarefas', tarefaRouter);
router.use('/unidades', unidadeRouter);
router.use('/participacao', participacaoRouter)
router.use('/gerais', geraisRouter)
router.use('/arquivos', arquivosRouter)
router.use('/abreviaturas', abreviaturasRouter)
router.use('/requisicoes', requisicoesRouter)
router.use('/alteracoes', alteracoesRouter)
router.use('/auth', authRoutes);
router.use('/notificacao', notificacaoRouter)

export default router;