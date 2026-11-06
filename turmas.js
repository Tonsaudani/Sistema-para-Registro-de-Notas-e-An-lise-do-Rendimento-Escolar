import { Router } from "express";
import { pool } from "../db/pool.js";

const router = Router();

// Lista todas as turmas cadastradas.
router.get("/", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, nome, serie, ano FROM turmas ORDER BY ano DESC, nome"
    );
    res.json(rows);
  } catch (error) {
    console.error("Erro ao consultar turmas:", error);
    res.status(500).json({ error: "Erro ao consultar turmas." });
  }
});

// Cadastra uma nova turma.
router.post("/", async (req, res) => {
  const { nome, serie, ano } = req.body;
  const anoNumerico = Number(ano);

  if (!nome?.trim() || !Number.isInteger(anoNumerico) || anoNumerico < 2000 || anoNumerico > 2100) {
    return res.status(400).json({
      error: "Informe o nome da turma e um ano válido (entre 2000 e 2100)."
    });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO turmas (nome, serie, ano)
       VALUES ($1, $2, $3)
       RETURNING id, nome, serie, ano`,
      [nome.trim(), serie?.trim() || null, anoNumerico]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Erro ao cadastrar turma:", error);
    res.status(500).json({ error: "Não foi possível cadastrar a turma." });
  }
});

// Atualiza uma turma existente.
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { nome, serie, ano } = req.body;
  const anoNumerico = Number(ano);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Identificador de turma inválido." });
  }
  if (!nome?.trim() || !Number.isInteger(anoNumerico) || anoNumerico < 2000 || anoNumerico > 2100) {
    return res.status(400).json({
      error: "Informe o nome da turma e um ano válido (entre 2000 e 2100)."
    });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE turmas
       SET nome = $1, serie = $2, ano = $3
       WHERE id = $4
       RETURNING id, nome, serie, ano`,
      [nome.trim(), serie?.trim() || null, anoNumerico, id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Turma não encontrada." });
    res.json(rows[0]);
  } catch (error) {
    console.error("Erro ao atualizar turma:", error);
    res.status(500).json({ error: "Não foi possível atualizar a turma." });
  }
});

// Exclui uma turma. O banco também exclui os alunos vinculados (ON DELETE CASCADE).
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Identificador de turma inválido." });
  }

  try {
    const { rowCount } = await pool.query("DELETE FROM turmas WHERE id = $1", [id]);
    if (rowCount === 0) return res.status(404).json({ error: "Turma não encontrada." });
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao excluir turma:", error);
    res.status(500).json({ error: "Não foi possível excluir a turma." });
  }
});

export default router;
