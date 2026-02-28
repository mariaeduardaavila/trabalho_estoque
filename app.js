import express from "express";

import authRoutes from "./routes/auth.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import produtosRoutes from "./routes/produtos.routes.js";
import movimentacoesRoutes from "./routes/movimentacoes.routes.js";
import relatoriosRoutes from "./routes/relatorios.routes.js";

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/produtos", produtosRoutes);
app.use("/movimentacoes", movimentacoesRoutes);
app.use("/relatorios", relatoriosRoutes);

export default app;