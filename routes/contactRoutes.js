import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.post("/contact", (req, res) => {
  const { name, email, company, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email and message are required" });
  }

  db.query(
    "INSERT INTO leads (name, email, company, phone, message) VALUES (?, ?, ?, ?, ?)",
    [name, email, company, phone || null, message],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Something went wrong" });

      res.json({ success: true });
    }
  );
});

export default router;