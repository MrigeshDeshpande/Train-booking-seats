import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "../db.js";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      username,
      hashed,
    ]);
    res.send("User created");
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Username may already exist" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (!result.rows.length) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Server error" }, err);
  }
});

export default router;
