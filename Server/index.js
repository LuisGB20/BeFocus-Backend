import express from "express";
import { PORT } from "./config.js";
import indexRoutes  from "./routes/index.routes.js";
import notasRoutes from "./routes/notas.routes.js";
import cors from "cors";

const app = express();

app.use(cors({
    origin: "http://localhost:3000"
}));

app.use(express.json());

app.use(indexRoutes);
app.use(notasRoutes);

app.listen(PORT);
console.log(`Server on port ${PORT}`);