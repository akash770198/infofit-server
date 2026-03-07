import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.post("/newsletter", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  db.query(
    "INSERT INTO newsletter (email) VALUES (?)",
    [email],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ error: "Email already subscribed" });
        }
        return res.status(500).json({ error: "Something went wrong" });
      }

      res.json({ success: true });
    }
  );
});

export default router;
