import { Router } from "express";
import { validationResult, body } from "express-validator"; // Importa 'body' de 'express-validator'
import { getUsers, createUser, getUser, getUserGoogle, updateUser, deleteUser} from "../controller/usuarios.controller.js";

const router = Router();

router.get("/Usuarios", getUsers)
router.get("/Usuarios/:id", getUser)
router.get("/Usuarios/google/:tokenGoogle", getUserGoogle);
router.post('/Registro', [
  body('Nombre').isLength({ min: 1 }).withMessage('El nombre es obligatorio'),
  body('Correo').isEmail().withMessage('Correo electrónico no válido'),
], createUser);
router.put("/Usuarios/:id", updateUser)
router.delete("/Usuarios/:id", deleteUser)

export default router;