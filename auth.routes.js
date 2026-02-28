import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { db } from "../db/database.js";

const router = express.Router();

const SECRET = "segredo"; // depois pode colocar em .env


// 🔐 LOGIN
router.post("/login", async (req, res) => {
  const { usuario, senha } = req.body;

  const user = await db.get(
    "SELECT * FROM usuarios WHERE usuario = ?",
    [usuario]
  );

  if (!user) {
    return res.status(401).json({ erro: "Usuário não encontrado" });
  }

  const senhaCorreta = await bcrypt.compare(senha, user.senha);

  if (!senhaCorreta) {
    return res.status(401).json({ erro: "Senha incorreta" });
  }

  const token = jwt.sign(
    { id: user.id, perfil: user.perfil },
    SECRET,
    { expiresIn: "8h" }
  );

  res.json({ token });
});

export default router;