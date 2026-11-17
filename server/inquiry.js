const ALLOWED_DIVISIONS = new Set(["tech", "digital", "projects", "bps", "training"]);

function createHttpError(message, statusCode = 400, code = "VALIDATION_ERROR") {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  return error;
}

function requiredText(value, label, minLength, maxLength) {
  if (typeof value !== "string") {
    throw createHttpError(`${label} is required`);
  }

  const text = value.trim();
  if (text.length < minLength) {
    throw createHttpError(`${label} is too short`);
  }
  if (text.length > maxLength) {
    throw createHttpError(`${label} is too long`);
  }
  return text;
}

export function prepareInquiry(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw createHttpError("Invalid inquiry payload");
  }

  const name = requiredText(payload.name, "Full name", 2, 100).replace(/\s+/g, " ");
  const email = requiredText(payload.email, "Email address", 3, 254).toLowerCase();
  const phone = requiredText(payload.phone, "Phone number", 6, 25).replace(/\s+/g, " ");
  const message = requiredText(payload.message, "Message", 2, 1000);
  const division = ALLOWED_DIVISIONS.has(payload.division) ? payload.division : "tech";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createHttpError("Enter a valid email address");
  }
  if (!/^[+]?[\d\s\-().]{6,25}$/.test(phone)) {
    throw createHttpError("Enter a valid phone number");
  }

  return { division, name, email, phone, message };
}

export function publicInquiryError(error) {
  const statusCode = Number.isInteger(error?.statusCode) ? error.statusCode : 500;
  const isPublic = statusCode >= 400 && statusCode < 500;

  let message = "We could not submit your inquiry just now. Please try again.";

  if (isPublic && error?.message) {
    message = error.message;
  } else if (error?.message) {
    const msg = error.message.toLowerCase();
    if (msg.includes("mongodb_uri")) {
      message = "Database configuration missing: MONGODB_URI is not set in environment variables.";
    } else if (msg.includes("bad auth") || msg.includes("authentication failed")) {
      message = "MongoDB authentication failed. Please check the database credentials in .env.";
    } else if (
      msg.includes("mongoserverselectionerror") ||
      msg.includes("whitelist") ||
      msg.includes("ssl alert") ||
      msg.includes("timed out") ||
      msg.includes("etimedout") ||
      msg.includes("enotfound")
    ) {
      message = "Database connection timed out. Please check your network or ensure 0.0.0.0/0 is whitelisted in MongoDB Atlas Network Access.";
    } else {
      message = `Database error: ${error.message}`;
    }
  }

  return {
    statusCode,
    body: {
      error: message,
      code: error?.code || "INTERNAL_ERROR",
      details: error?.message,
    },
  };
}
