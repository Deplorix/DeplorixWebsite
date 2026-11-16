import { describe, expect, it } from "vitest";
import {
  prepareInternshipApplication,
  publicInternshipError,
} from "../../server/internship-email.js";

const baseApplication = {
  name: "Test User",
  email: "test@example.com",
  phone: "9945831090",
  college: "Test College",
};

describe("prepareInternshipApplication", () => {
  it("accepts a WhatsApp follow-up resume", () => {
    const result = prepareInternshipApplication({
      ...baseApplication,
      attachInWhatsApp: true,
    });

    expect(result.resume).toBeNull();
    expect(result.application.attachInWhatsApp).toBe(true);
  });

  it("accepts http resume links and rejects unsafe protocols", () => {
    const result = prepareInternshipApplication({
      ...baseApplication,
      resumeLink: "https://example.com/resume.pdf",
    });
    expect(result.application.resumeLink).toBe("https://example.com/resume.pdf");

    try {
      prepareInternshipApplication({
        ...baseApplication,
        resumeLink: "javascript:alert(1)",
      });
      throw new Error("Expected validation to fail");
    } catch (error) {
      expect(publicInternshipError(error)).toMatchObject({
        statusCode: 400,
        body: { code: "VALIDATION_ERROR" },
      });
    }
  });

  it("rejects disguised attachment types", () => {
    expect(() =>
      prepareInternshipApplication({
        ...baseApplication,
        resume: {
          name: "resume.exe",
          type: "application/octet-stream",
          data: "dGVzdA==",
        },
      }),
    ).toThrow("Resume must be a PDF or Word document");
  });
});
