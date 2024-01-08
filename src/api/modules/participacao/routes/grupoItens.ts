import { Router } from "express"
import { GrupoItemController } from "@module/participacao/controllers";

const router = Router();

router.route('/')
    .get(GrupoItemController.find)
    
router.route('/:id')
    .get(GrupoItemController.findOne)
    .put(GrupoItemController.update)

router.route('/:id/concorrentes/')
    .get(GrupoItemController.findItensConcorrentes)

export default router;