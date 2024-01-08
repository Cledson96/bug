import { Router } from "express"
import { AvisoAcompanhamentoController, AvisoArquivoController, AvisoController, AvisoItemController, AvisoMovimentacaoController } from "@module/aviso/controllers";
import verifyToken from "@api/middlewares/verifyToken";

const router = Router();

router.route('/')
    .get(verifyToken.isAdmin ,AvisoController.find)
    .post(AvisoController.create)

router.route('/movimentacoes')
    .post(AvisoMovimentacaoController.findAll)
    
router.route('/escopo/:scope/:id/itens')
    .get(AvisoController.findItens)
    
router.route('/escopo/:scope')
    .get(AvisoController.getByScope)

router.route('/:id')
    .get(AvisoController.findOne)
    .put(AvisoController.update)

router.route('/:id/movimentacoes')
    .get(AvisoMovimentacaoController.find)
    .put(AvisoMovimentacaoController.update)

router.route('/:id/acompanhamentos')
    .get(AvisoAcompanhamentoController.findAcompanhamentos)

router.route('/:id/emails')
    .get(AvisoController.findEmails)

router.route('/:id/arquivos')
    .get(AvisoArquivoController.find)
    
router.route('/:id/itens')
    .get(AvisoItemController.find)
    .patch(AvisoItemController.update)
    
router.route('/:id/pesquisa-ia')
    .post(AvisoController.pesquisaAnaliseIA)

router.route('/:id/preanalise-ia')
    .put(AvisoController.preAnaliseIA)

export default router;