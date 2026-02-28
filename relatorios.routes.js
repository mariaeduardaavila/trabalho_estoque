import express from "express";
import { db } from "../db/database.js";
import { autenticar } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/baixo-estoque", autenticar, async (req, res) => {
  const produtos = await db.all(
    "SELECT * FROM produtos WHERE quantidade <= minimo"
  );

  res.json(produtos);
});

export default router;