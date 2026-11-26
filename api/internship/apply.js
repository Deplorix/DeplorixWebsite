import {
  prepareInternshipApplication,
  publicInternshipError,
  sendInternshipApplicationEmail,
} from "../../server/internship-email.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method === "GET") {
    return res.status(200).json({
      status: "ok",
      endpoint: "/api/internship/apply",
      description: "DeploriX Internship Application API",
      methods: ["POST", "GET"],
    });
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const prepared = prepareInternshipApplication(req.body || {});
    if (prepared.isSpam) {
      return res.status(201).json({ success: true, message: "Application received" });
    }

    const email = await sendInternshipApplicationEmail(prepared.application, prepared.resume);

    return res.status(201).json({
      success: true,
      message: "Application received successfully",
      emailId: email ? email.id : null,
    });
  } catch (error) {
    console.error("Vercel Serverless Error /api/internship/apply:", error);
    const response = publicInternshipError(error);
    return res.status(response.statusCode).json(response.body);
  }
}
