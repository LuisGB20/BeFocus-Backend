import { Router } from 'express';
import {
    createTarea,
    deleteTarea,
    getTarea,
    getTareas,
    updateTarea
} from '../controller/tareas.controller.js';

const router = Router();

router.get('/tareas', getTareas);
router.post('/tareas', createTarea);
router.put('/tareas/:id', updateTarea);
router.get('/tareas/:id', getTarea);
router.delete('/tareas/:id', deleteTarea);

export default router;
