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
  const phone = requiredText(payload.phone, "Phone number", 8, 18).replace(/\s+/g, " ");
  const message = requiredText(payload.message, "Message", 20, 1000);
  const division = ALLOWED_DIVISIONS.has(payload.division) ? payload.division : "tech";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createHttpError("Enter a valid email address");
  }
  if (!/^[+]?[-\d\s()]{8,18}$/.test(phone)) {
    throw createHttpError("Enter a valid phone number");
  }

  return { division, name, email, phone, message };
}

export function publicInquiryError(error) {
  const statusCode = Number.isInteger(error?.statusCode) ? error.statusCode : 500;
  const isPublic = statusCode >= 400 && statusCode < 500;
  return {
    statusCode,
    body: {
      error: isPublic ? error.message : "We could not submit your inquiry just now. Please try again.",
      code: error?.code || "INTERNAL_ERROR",
    },
  };
}
