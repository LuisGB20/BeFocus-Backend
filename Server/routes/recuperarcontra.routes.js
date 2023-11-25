import { Router } from 'express';
import {forgetpassword} from '../controller/forgetpassword.controller.js'

const router = Router();

router.post('/olvido-contrasena', forgetpassword);


export default router;
