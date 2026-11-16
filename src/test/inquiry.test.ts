import { describe, expect, it } from "vitest";
import { prepareInquiry, publicInquiryError } from "../../server/inquiry.js";

const validInquiry = {
  division: "tech",
  name: "  Test   User  ",
  email: "TEST@example.com ",
  phone: "+91 99458 31090",
  message: "I need a fast, accessible company website for my business.",
};

describe("prepareInquiry", () => {
  it("normalizes a valid inquiry", () => {
    expect(prepareInquiry(validInquiry)).toEqual({
      division: "tech",
      name: "Test User",
      email: "test@example.com",
      phone: "+91 99458 31090",
      message: validInquiry.message,
    });
  });

  it("falls back to a known division and rejects invalid fields", () => {
    expect(prepareInquiry({ ...validInquiry, division: "unknown" }).division).toBe("tech");

    try {
      prepareInquiry({ ...validInquiry, email: "invalid" });
      throw new Error("Expected validation to fail");
    } catch (error) {
      expect(publicInquiryError(error)).toMatchObject({
        statusCode: 400,
        body: { code: "VALIDATION_ERROR" },
      });
    }
  });
});
