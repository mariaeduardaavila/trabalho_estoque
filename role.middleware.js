export function permitir(...perfisPermitidos) {
  return (req, res, next) => {
    if (!perfisPermitidos.includes(req.user.perfil)) {
      return res.status(403).json({ erro: "Acesso negado" });
    }
    next();
  };
}