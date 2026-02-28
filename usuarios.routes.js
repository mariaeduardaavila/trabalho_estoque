import express from "express";
import bcrypt from "bcrypt";
import { db } from "../db/database.js";
import { autenticar } from "../middlewares/auth.middleware.js";
import { permitir } from "../middlewares/role.middleware.js";

const router = express.Router();

// Criar usuário (apenas admin)
router.post(
  "/",
  autenticar,
  permitir("admin"),
  async (req, res) => {
    const { usuario, senha, perfil } = req.body;

    const senhaHash = await bcrypt.hash(senha, 10);

    try {
      await db.run(
        "INSERT INTO usuarios (usuario, senha, perfil) VALUES (?, ?, ?)",
        [usuario, senhaHash, perfil]
      );

      res.status(201).json({ mensagem: "Usuário criado" });
    } catch {
      res.status(400).json({ erro: "Usuário já existe" });
    }
  }
);

// Listar usuários (admin)
router.get(
  "/",
  autenticar,
  permitir("admin"),
  async (req, res) => {
    const usuarios = await db.all(
      "SELECT id, usuario, perfil FROM usuarios"
    );

    res.json(usuarios);
  }
);

// Alterar perfil (admin)
router.patch(
  "/:id/perfil",
  autenticar,
  permitir("admin"),
  async (req, res) => {
    const { id } = req.params;
    const { perfil } = req.body;

    await db.run(
      "UPDATE usuarios SET perfil = ? WHERE id = ?",
      [perfil, id]
    );

    res.json({ mensagem: "Perfil atualizado" });
  }
);

export default router;