import { saveInquiry } from "./_db.js";
import { prepareInquiry, publicInquiryError } from "../server/inquiry.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const saved = await saveInquiry(prepareInquiry(req.body || {}));

    return res.status(201).json({
      success: true,
      message: "Inquiry saved successfully",
      id: saved.id,
      data: saved,
    });
  } catch (err) {
    console.error("Vercel Serverless Error /api/inquiry:", err);
    const response = publicInquiryError(err);
    return res.status(response.statusCode).json(response.body);
  }
}
