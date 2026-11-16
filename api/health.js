import { getDb } from "./_db.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    return res.status(200).json({ status: "ok", database: "connected" });
  } catch (err) {
    console.error("Vercel Serverless Error /api/health:", err);
    return res.status(500).json({ status: "error", message: "Service unavailable" });
  }
}
