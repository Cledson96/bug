import { NextFunction, Router } from "express"
import { AvisoArquivoController } from "@api/modules/aviso/controllers";
const fileUpload = require('express-fileupload');

const router = Router();

router.route('/')
    .post(AvisoArquivoController.getDirectory)
    // .post(AvisoArquivoController.create)

router.route('/open')
    .post(AvisoArquivoController.getFile)

router.route('/copy')
    .put(AvisoArquivoController.copyFile)

router.route('/rename')
    .put(AvisoArquivoController.renameFile)

router.route('/directory')
    .post(AvisoArquivoController.createDirectory)

router.route('/upload')
    .post(fileUpload({createParentPath: { createParentPath: true }}), AvisoArquivoController.upload, AvisoArquivoController.filesPayloadExist)

router.route('/delete')
    .delete(AvisoArquivoController.deleteFile)



export default router;