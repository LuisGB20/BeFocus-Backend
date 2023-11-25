import { Router } from 'express';
import {
    createTarea,
    deleteTarea,
    getTarea,
    getTareas,
    updateTarea
} from '../controller/tareas.controller.js';

const router = Router();

router.get('/tareas/:id_usuario', getTareas);
router.post('/tareas', createTarea);
router.put('/tareas/:id', updateTarea);
router.get('/tareas/tarea/:id', getTarea);
router.delete('/tareas/:id', deleteTarea);

export default router;
