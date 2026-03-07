import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/testimonials", (req, res) => {
  db.query(
    "SELECT * FROM testimonials ORDER BY created_at DESC",
    (err, results) => {
      if (err) return res.status(500).json({ error: "Something went wrong" });

      res.json(results);
    }
  );
});

export default router;
