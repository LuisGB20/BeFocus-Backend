import { Router } from 'express';
import {forgetpassword, verificarCodigo, actualizarContrasena} from '../controller/forgetpassword.controller.js'

const router = Router();

router.post('/olvido-contrasena', forgetpassword);
router.post('/verificar-codigo', verificarCodigo);
router.post('/Cambiar-contrasena', actualizarContrasena)


export default router;
