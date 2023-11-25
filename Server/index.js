import cors from "cors";
import express from "express";
import tareasRoutes from "../Server/routes/tareas.routes.js";
import { PORT } from "./config.js";
import indexRoutes from "./routes/index.routes.js";
import notasRoutes from "./routes/notas.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import authRoutes from "./routes/auth.routes.js";
import recuperarcontra from "./routes/recuperarcontra.routes.js"






const app = express();

app.use(cors({
    origin: "http://localhost:3000"
}));

app.use(express.json());

app.use(indexRoutes);
app.use(notasRoutes);
app.use(usuariosRoutes);
app.use(tareasRoutes);
app.use(authRoutes);
app.use(recuperarcontra);
app.get('/', (req, res) => {
    res.send('Bienvenido a Befocus');
});
app.listen(PORT);
console.log(`Server on port ${PORT}`);
