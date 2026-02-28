import { db } from "./database.js";
import bcrypt from "bcrypt";

await db.exec(`
CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario TEXT UNIQUE,
  senha TEXT,
  perfil TEXT
);

CREATE TABLE IF NOT EXISTS produtos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT,
  quantidade INTEGER DEFAULT 0,
  minimo INTEGER
);

CREATE TABLE IF NOT EXISTS movimentacoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  produto_id INTEGER,
  tipo TEXT,
  quantidade INTEGER,
  data_hora TEXT,
  usuario_id INTEGER
);
`);

const senhaHash = await bcrypt.hash("123456", 10);

await db.run(
  `INSERT OR IGNORE INTO usuarios (usuario, senha, perfil)
   VALUES (?, ?, ?)`,
  ["admin", senhaHash, "admin"]
);

console.log("Banco criado com admin padrão.");