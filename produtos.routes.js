import express from "express";
import { db } from "../db/database.js";
import { autenticar } from "../middlewares/auth.middleware.js";
import { permitir } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/",
  autenticar,
  permitir("admin", "estoquista"),
  async (req, res) => {
    const { nome, minimo } = req.body;

    await db.run(
      "INSERT INTO produtos (nome, minimo) VALUES (?, ?)",
      [nome, minimo]
    );

    res.status(201).json({ mensagem: "Produto criado" });
  }
);

router.get("/", autenticar, async (req, res) => {
  const produtos = await db.all("SELECT * FROM produtos");
  res.json(produtos);
});

export default router;