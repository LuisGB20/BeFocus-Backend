import express from 'express';
import { inicioSesion } from '../controller/auth.controller.js';

const router = express.Router();

router.post('/login', inicioSesion);

export default router;