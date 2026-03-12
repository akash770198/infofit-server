import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import contactRoutes from "./routes/contactRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import caseStudyRoutes from "./routes/caseStudyRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// --------------------
// Security Middleware
// --------------------

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "https://ui-avatars.com"],
        connectSrc: ["'self'"],
      },
    },
  })
);


// --------------------
// CORS Configuration
// --------------------

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  })
);


// --------------------
// Rate Limiting
// --------------------

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many requests, please try again later" },
});


// --------------------
// Body Parsers
// --------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// --------------------
// Apply Rate Limiter
// --------------------

app.use("/api/contact", formLimiter);
app.use("/api/newsletter", formLimiter);


// --------------------
// API Routes
// --------------------

app.use("/api", contactRoutes);
app.use("/api", newsletterRoutes);
app.use("/api", testimonialRoutes);
app.use("/api", clientRoutes);
app.use("/api", caseStudyRoutes);


// --------------------
// Health Check Endpoint
// --------------------

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "infofit-backend",
    timestamp: new Date(),
  });
});


// --------------------
// Serve React Frontend
// --------------------

app.use(express.static(path.join(__dirname, "client", "dist")));

// React SPA fallback (for React Router)
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }

  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});


// --------------------
// Start Server
// --------------------

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});