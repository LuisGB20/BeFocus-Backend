import { Router } from "express";
import { getUsers, createUser, getUser, getUserGoogle, updateUser, deleteUser} from "../controller/usuarios.controller.js";

const router = Router();

router.get("/Usuarios", getUsers)
router.get("/Usuarios/:id", getUser)
router.get("/Usuarios/google/:tokenGoogle", getUserGoogle);
router.post("/Usuarios", createUser)
router.put("/Usuarios/:id", updateUser)
router.delete("/Usuarios/:id", deleteUser)

export default router;