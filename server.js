import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import contactRoutes from "./routes/contactRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import caseStudyRoutes from "./routes/caseStudyRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  })
);

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many requests, please try again later" },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/contact", formLimiter);
app.use("/api/newsletter", formLimiter);

app.use("/api", contactRoutes);
app.use("/api", newsletterRoutes);
app.use("/api", testimonialRoutes);
app.use("/api", clientRoutes);
app.use("/api", caseStudyRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Infofit Software API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
