import { Router } from "express";
import {
    getNotas,
    createNota,
    updateNota,
    getNota,
    deleteNota
} from "../controller/notas.controller.js";

const router = Router();

router.get("/Notas", getNotas)
router.get("/Notas/:id", getNota)
router.post("/Notas", createNota)
router.put("/Notas/:id", updateNota)
router.delete("/Notas/:id", deleteNota)

export default router;