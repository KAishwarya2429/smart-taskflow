import { pool } from "../config/db.js";

export async function getTasks(req, res) {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM tasks ORDER BY created_at DESC",
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
}

export async function createTask(req, res) {
  try {
    const { title, description, status } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO tasks (title, description, status)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, description, status],
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
