import { Router } from "express";
import { getUsers, createUser, getUser, updateUser, deleteUser} from "../controller/usuarios.controller.js";

const router = Router();

router.get("/Usuarios", getUsers)
router.get("/Usuarios/:id", getUser)
router.post("/Usuarios", createUser)
router.put("/Usuarios/:id", updateUser)
router.delete("/Usuarios/:id", deleteUser)

export default router;