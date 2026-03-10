import express from "express";
import validator from "validator";
import db from "../config/db.js";
import resend from "../config/resend.js";

const router = express.Router();

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

router.post("/contact", async (req, res) => {
  const { name, email, company, phone, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: "Name, email and message are required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Please provide a valid email address" });
  }

  const sanitizedName = validator.trim(validator.escape(name));
  const sanitizedEmail = validator.normalizeEmail(email) || email;
  const sanitizedCompany = company ? validator.trim(validator.escape(company)) : null;
  const sanitizedPhone = phone ? validator.trim(phone) : null;
  const sanitizedMessage = validator.trim(validator.escape(message));

  try {
    await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO leads (name, email, company, phone, message) VALUES (?, ?, ?, ?, ?)",
        [sanitizedName, sanitizedEmail, sanitizedCompany, sanitizedPhone, sanitizedMessage],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    await resend.emails.send({
      from: "Infofit Contact <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL,
      subject: `New Contact: ${sanitizedName}`,
      html: `
        <h2>New Contact Form Message</h2>
        <p><strong>Name:</strong> ${escapeHtml(sanitizedName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(sanitizedEmail)}</p>
        <p><strong>Company:</strong> ${sanitizedCompany ? escapeHtml(sanitizedCompany) : "N/A"}</p>
        <p><strong>Phone:</strong> ${sanitizedPhone ? escapeHtml(sanitizedPhone) : "N/A"}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(sanitizedMessage)}</p>
      `,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;