import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let client;
let clientPromise;

export async function getDb() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "deplorix";

  if (!uri) {
    throw new Error("MONGODB_URI is not set in environment variables.");
  }

  if (!client) {
    client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000,
    });
    clientPromise = client.connect().catch(async (error) => {
      const failedClient = client;
      client = undefined;
      clientPromise = undefined;
      await failedClient?.close().catch(() => undefined);
      throw error;
    });
  }

  await clientPromise;
  return client.db(dbName);
}

/**
 * Saves an inquiry submitted from the main service inquiry form.
 * Required parts only: division, name, email, phone, message.
 */
export async function saveInquiry(data) {
  const db = await getDb();
  const collection = db.collection("inquiries");
  const doc = {
    division: data.division || "tech",
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    message: data.message.trim(),
    createdAt: new Date(),
  };
  const result = await collection.insertOne(doc);
  return { id: result.insertedId, ...doc };
}
