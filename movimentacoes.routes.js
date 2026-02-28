import express from "express";
import { db } from "../db/database.js";
import { autenticar } from "../middlewares/auth.middleware.js";
import { permitir } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/entrada",
  autenticar,
  permitir("admin", "estoquista"),
  async (req, res) => {
    const { produto_id, quantidade } = req.body;

    const produto = await db.get(
      "SELECT * FROM produtos WHERE id = ?",
      [produto_id]
    );

    if (!produto) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    await db.run(
      "UPDATE produtos SET quantidade = quantidade + ? WHERE id = ?",
      [quantidade, produto_id]
    );

    await db.run(
      `INSERT INTO movimentacoes 
      (produto_id, tipo, quantidade, data_hora, usuario_id)
      VALUES (?, 'entrada', ?, datetime('now'), ?)`,
      [produto_id, quantidade, req.user.id]
    );

    res.json({ mensagem: "Entrada registrada" });
  }
);
router.post(
  "/saida",
  autenticar,
  permitir("admin", "estoquista"),
  async (req, res) => {
    const { produto_id, quantidade } = req.body;

    const produto = await db.get(
      "SELECT * FROM produtos WHERE id = ?",
      [produto_id]
    );

    if (!produto) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    if (produto.quantidade < quantidade) {
      return res.status(400).json({ erro: "Estoque insuficiente" });
    }

    await db.run(
      "UPDATE produtos SET quantidade = quantidade - ? WHERE id = ?",
      [quantidade, produto_id]
    );

    await db.run(
      `INSERT INTO movimentacoes 
      (produto_id, tipo, quantidade, data_hora, usuario_id)
      VALUES (?, 'saida', ?, datetime('now'), ?)`,
      [produto_id, quantidade, req.user.id]
    );

    res.json({ mensagem: "Saída registrada" });
  }
);


router.get(
  "/",
  autenticar,
  permitir("admin", "estoquista", "consulta"),
  async (req, res) => {
    const movimentacoes = await db.all(`
      SELECT m.id, p.nome as produto, m.tipo, m.quantidade,
             m.data_hora, u.usuario
      FROM movimentacoes m
      JOIN produtos p ON m.produto_id = p.id
      JOIN usuarios u ON m.usuario_id = u.id
    `);

    res.json(movimentacoes);
  }
);

export default router;