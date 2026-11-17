import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { getDb, saveInquiry } from "./db.js";
import { prepareInquiry, publicInquiryError } from "./inquiry.js";
import {
  prepareInternshipApplication,
  publicInternshipError,
  sendInternshipApplicationEmail,
} from "./internship-email.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    res.json({ status: "ok", database: "connected" });
  } catch (err) {
    console.error("Health check failed:", err);
    res.status(500).json({ status: "error", message: "Service unavailable" });
  }
});

// Service Inquiry Form Endpoint (p-6 sm:p-9 lg:p-10)
app.post("/api/inquiry", async (req, res) => {
  try {
    const inquiry = prepareInquiry(req.body || {});
    const saved = await saveInquiry(inquiry);

    res.status(201).json({ success: true, message: "Inquiry saved successfully", id: saved.id });
  } catch (err) {
    console.error("Error saving inquiry to MongoDB:", err);
    const response = publicInquiryError(err);
    res.status(response.statusCode).json(response.body);
  }
});

app.post("/api/internship", async (req, res) => {
  try {
    const prepared = prepareInternshipApplication(req.body || {});
    if (prepared.isSpam) {
      return res.status(201).json({ success: true, message: "Application received" });
    }

    const email = await sendInternshipApplicationEmail(prepared.application, prepared.resume);

    res.status(201).json({
      success: true,
      message: "Application emailed successfully",
      emailId: email.id,
    });
  } catch (error) {
    console.error("Error emailing internship application:", error);
    const response = publicInternshipError(error);
    res.status(response.statusCode).json(response.body);
  }
});

// Serve static build in production
const distPath = path.resolve(__dirname, "../dist");
app.use(express.static(distPath));

app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`🚀 DeploriX Server running at http://localhost:${port}`);
  console.log(`📡 MongoDB Connected: /api/inquiry`);
});
