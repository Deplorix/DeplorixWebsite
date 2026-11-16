const MAX_RESUME_BYTES = 3 * 1024 * 1024;
const DEFAULT_RECIPIENT = "deplorixtechnologies@gmail.com";
const DEFAULT_SENDER = "DeploriX Careers <onboarding@resend.dev>";
const ALLOWED_RESUME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const ALLOWED_RESUME_EXTENSIONS = [".pdf", ".doc", ".docx"];

function createHttpError(message, statusCode, code) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  return error;
}

function requiredText(value, label, maxLength) {
  if (typeof value !== "string" || !value.trim()) {
    throw createHttpError(`${label} is required`, 400, "VALIDATION_ERROR");
  }
  const text = value.trim();
  if (text.length > maxLength) {
    throw createHttpError(`${label} is too long`, 400, "VALIDATION_ERROR");
  }
  return text;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeBase64(value) {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }
  const data = value.includes(",") ? value.slice(value.indexOf(",") + 1) : value;
  const normalized = data.replace(/\s/g, "");
  if (!normalized || !/^[A-Za-z0-9+/]+={0,2}$/.test(normalized)) {
    throw createHttpError("Resume data is invalid", 400, "VALIDATION_ERROR");
  }
  return normalized;
}

function hasExpectedFileSignature(buffer, mimeType) {
  if (mimeType === "application/pdf") {
    return buffer.subarray(0, 5).toString("ascii") === "%PDF-";
  }
  if (mimeType === "application/msword") {
    return buffer.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]));
  }
  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    return buffer.subarray(0, 2).toString("ascii") === "PK";
  }
  return false;
}

export function prepareInternshipApplication(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw createHttpError("Invalid application payload", 400, "VALIDATION_ERROR");
  }

  // Honeypot field: accept silently so bots do not learn how they were detected.
  if (typeof payload.website === "string" && payload.website.trim()) {
    return { isSpam: true };
  }

  const name = requiredText(payload.name, "Full name", 120).replace(/\s+/g, " ");
  const email = requiredText(payload.email, "Email address", 254).toLowerCase();
  const phone = requiredText(payload.phone, "Phone number", 24).replace(/\s+/g, " ");
  const college = requiredText(payload.college, "College name", 180).replace(/\s+/g, " ");
  const rawResumeLink = typeof payload.resumeLink === "string" ? payload.resumeLink.trim() : "";
  const attachInWhatsApp = payload.attachInWhatsApp === true;
  let resumeLink = "";

  if (rawResumeLink) {
    try {
      const url = new URL(rawResumeLink);
      if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("Invalid protocol");
      resumeLink = url.toString();
    } catch {
      throw createHttpError("Enter a valid http or https resume link", 400, "VALIDATION_ERROR");
    }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createHttpError("Enter a valid email address", 400, "VALIDATION_ERROR");
  }
  if (!/^[+]?[-\d\s()]{8,24}$/.test(phone)) {
    throw createHttpError("Enter a valid phone number", 400, "VALIDATION_ERROR");
  }

  const resumeInput = payload.resume;
  let resume = null;

  if (resumeInput && typeof resumeInput === "object" && resumeInput.data) {
    const originalName = requiredText(resumeInput.name || "resume.pdf", "Resume file name", 180);
    if (resumeInput.type !== undefined && typeof resumeInput.type !== "string") {
      throw createHttpError("Resume type is invalid", 400, "VALIDATION_ERROR");
    }
    const mimeType = (resumeInput.type || "application/pdf").toLowerCase();
    const lowerName = originalName.toLowerCase();
    const expectedExtensionByType = {
      "application/pdf": ".pdf",
      "application/msword": ".doc",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
    };
    if (
      !ALLOWED_RESUME_EXTENSIONS.some((extension) => lowerName.endsWith(extension)) ||
      !ALLOWED_RESUME_TYPES.has(mimeType) ||
      !lowerName.endsWith(expectedExtensionByType[mimeType])
    ) {
      throw createHttpError("Resume must be a PDF or Word document", 400, "VALIDATION_ERROR");
    }
    const base64 = normalizeBase64(resumeInput.data);
    const resumeBuffer = Buffer.from(base64, "base64");

    if (!hasExpectedFileSignature(resumeBuffer, mimeType)) {
      throw createHttpError("Resume file contents do not match the selected file type", 400, "VALIDATION_ERROR");
    }

    if (resumeBuffer.length > MAX_RESUME_BYTES) {
      throw createHttpError("Resume must be 3 MB or smaller", 400, "VALIDATION_ERROR");
    }

    const safeFileName = originalName.replace(/[^a-zA-Z0-9._ -]/g, "_");
    resume = {
      name: safeFileName,
      type: mimeType,
      data: base64,
      size: resumeBuffer.length,
    };
  } else if (!resumeLink && !attachInWhatsApp) {
    throw createHttpError("A resume document or portfolio/drive link is required", 400, "VALIDATION_ERROR");
  }

  return {
    isSpam: false,
    application: { name, email, phone, college, resumeLink, attachInWhatsApp },
    resume,
  };
}

export async function sendInternshipApplicationEmail(application, resume) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw createHttpError(
      "Email delivery is not configured yet. Please contact us on WhatsApp while we fix it.",
      503,
      "EMAIL_NOT_CONFIGURED",
    );
  }

  const recipients = (process.env.INTERNSHIP_TO_EMAIL || DEFAULT_RECIPIENT)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const from = process.env.INTERNSHIP_FROM_EMAIL || DEFAULT_SENDER;
  const name = escapeHtml(application.name);
  const email = escapeHtml(application.email);
  const phone = escapeHtml(application.phone);
  const college = escapeHtml(application.college);
  const resumeLink = application.resumeLink ? escapeHtml(application.resumeLink) : "";

  const attachments = resume ? [{ filename: resume.name, content: resume.data }] : [];

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: recipients,
      reply_to: application.email,
      subject: `Internship application — ${application.name} — ${application.college}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#17151f">
          <div style="background:#17151f;color:#fff;padding:24px 28px;border-radius:18px 18px 0 0">
            <p style="margin:0 0 8px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#b9a8ff">DeploriX Careers</p>
            <h1 style="margin:0;font-size:24px">New internship application</h1>
          </div>
          <div style="border:1px solid #e5e1ed;border-top:0;padding:28px;border-radius:0 0 18px 18px">
            <table style="width:100%;border-collapse:collapse;font-size:15px">
              <tr><td style="padding:9px 0;color:#6d6878;width:120px">Name</td><td style="padding:9px 0;font-weight:700">${name}</td></tr>
              <tr><td style="padding:9px 0;color:#6d6878">Email</td><td style="padding:9px 0"><a href="mailto:${email}" style="color:#7347ee">${email}</a></td></tr>
              <tr><td style="padding:9px 0;color:#6d6878">Phone</td><td style="padding:9px 0"><a href="tel:${phone}" style="color:#7347ee">${phone}</a></td></tr>
              <tr><td style="padding:9px 0;color:#6d6878">College</td><td style="padding:9px 0">${college}</td></tr>
              ${resumeLink ? `<tr><td style="padding:9px 0;color:#6d6878">Resume Link</td><td style="padding:9px 0"><a href="${resumeLink}" target="_blank" style="color:#7347ee">${resumeLink}</a></td></tr>` : ""}
            </table>
            <p style="margin:22px 0 0;padding:14px 16px;background:#f6f2ff;border-radius:12px;font-size:13px;color:#514b5c">
              ${resume ? "The applicant's resume is attached to this email." : resumeLink ? "The applicant provided an online resume link above." : "The applicant will attach the resume in the WhatsApp follow-up chat."}
            </p>
          </div>
        </div>
      `,
      text: [
        "New DeploriX internship application",
        `Name: ${application.name}`,
        `Email: ${application.email}`,
        `Phone: ${application.phone}`,
        `College: ${application.college}`,
        resumeLink ? `Resume Link: ${resumeLink}` : "",
        application.attachInWhatsApp ? "Resume: Applicant will attach it in the WhatsApp follow-up chat." : "",
        "",
        resume ? "The applicant's resume is attached." : "",
      ].filter(Boolean).join("\n"),
      attachments,
    }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error("Resend email delivery failed:", response.status, result);
    throw createHttpError(
      "We could not deliver the application email just now. Please try again or contact us on WhatsApp.",
      502,
      "EMAIL_DELIVERY_FAILED",
    );
  }

  if (!result.id) {
    throw createHttpError(
      "The email provider did not confirm delivery. Please try again.",
      502,
      "EMAIL_DELIVERY_UNCONFIRMED",
    );
  }

  return { id: result.id };
}

export function publicInternshipError(error) {
  const statusCode = Number.isInteger(error?.statusCode) ? error.statusCode : 500;
  const safeMessage =
    statusCode >= 400 && statusCode < 500
      ? error?.message
      : "We could not process your application just now. Please try again.";
  return { statusCode, body: { error: safeMessage, code: error?.code || "INTERNAL_ERROR" } };
}
