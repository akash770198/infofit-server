import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/case-studies", (req, res) => {
  db.query(
    "SELECT cs.*, c.name AS client_name FROM case_studies cs LEFT JOIN clients c ON cs.client_id = c.id ORDER BY cs.created_at DESC",
    (err, results) => {
      if (err) return res.status(500).json({ error: "Something went wrong" });

      res.json(results);
    }
  );
});

router.get("/case-studies/:slug", (req, res) => {
  db.query(
    "SELECT cs.*, c.name AS client_name FROM case_studies cs LEFT JOIN clients c ON cs.client_id = c.id WHERE cs.slug = ?",
    [req.params.slug],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Something went wrong" });

      if (results.length === 0) {
        return res.status(404).json({ error: "Case study not found" });
      }

      res.json(results[0]);
    }
  );
});

export default router;
