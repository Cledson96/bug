import { Router } from "express";
import usuarioRouter from "./usuario";

const router = Router();

router.use('/', usuarioRouter);

export default router;