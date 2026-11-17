/**
 * Client API utilities for submitting the Service Inquiry form to MongoDB.
 */

export type InquiryPayload = {
  division: string;
  name: string;
  email: string;
  phone: string;
  message: string;
};

export type InternshipApplicationPayload = {
  name: string;
  email: string;
  phone: string;
  college: string;
  website?: string;
  resumeLink?: string;
  attachInWhatsApp?: boolean;
  resume?: {
    name: string;
    type: string;
    data: string;
  } | null;
};

const REQUEST_TIMEOUT_MS = 30_000;

async function requestJson(endpoint: string, init?: RequestInit) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response: Response;

  try {
    response = await fetch(endpoint, { ...init, signal: controller.signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("The request timed out. Please check your internet connection and try again.");
    }
    throw new Error("We couldn't connect to the server. Please check your network connection and try again.");
  } finally {
    window.clearTimeout(timeout);
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 403 && typeof window !== "undefined" && window.location.port === "8080") {
      throw new Error(
        "Port 8080 is blocked by Jenkins/another process on this computer. Please open http://localhost:8081 in your browser instead."
      );
    }
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    const fullMsg = data.details && data.details !== data.error ? `${errorMsg} (${data.details})` : errorMsg;
    throw new Error(fullMsg);
  }

  return data;
}

async function postJson(endpoint: string, payload: unknown) {
  return requestJson(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function submitInquiry(payload: InquiryPayload) {
  return postJson("/api/inquiry", payload);
}

export async function submitInternshipApplication(payload: InternshipApplicationPayload) {
  return postJson("/api/internship", payload);
}

export async function checkApiHealth() {
  return requestJson("/api/health", { headers: { Accept: "application/json" } });
}
