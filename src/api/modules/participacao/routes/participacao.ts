import { Router } from "express"
import { GrupoItemController, ParticipacaoController, ParticipacaoMovimentacaoController } from "../controllers";
import { TarefaController } from "@api/modules/tarefa/controllers";
import { ParticipacaoMovimentacaoService } from "../services";

const router = Router();

router.route('/')
    .get(ParticipacaoController.find)
    .post(ParticipacaoController.create)

router.route('/:id/movimentacoes/')
    .get(ParticipacaoController.find)

router.route('/movimentacoes')
    .post(ParticipacaoMovimentacaoController.find)

router.route('/:id/itens/')
    .get(ParticipacaoController.getItens)
    .post(ParticipacaoController.createItem)

router.route('/:id/grupos-itens/')
    .get(ParticipacaoController.getGruposItens)
    .post(GrupoItemController.create)

    
router.route('/:scope/:id')
    .get(ParticipacaoController.findOne)
    .put(ParticipacaoController.update)

router.route('/:scope/:id/tarefas')
    .get(TarefaController.findTaskByProject)


router.route('/:scope/:id/grupos-itens/')
    .get(ParticipacaoController.getGruposItens)
    .post(GrupoItemController.create)

router.route('/:scope/:id/itens/')
    .get(ParticipacaoController.getItens)
    .post(ParticipacaoController.createItem)


router.route('/:scope')
    .get(ParticipacaoController.getByScope)


router.route('/email')
    .post(ParticipacaoController.sendmail)


export default router;