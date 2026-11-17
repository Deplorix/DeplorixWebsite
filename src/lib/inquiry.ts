export const INQUIRY_EVENT = "deplorix:inquiry";

export type InquiryDetail = {
  divisionId: string;
  /** Optional service name to mention in the message. */
  service?: string;
  /** Optional pre-filled message body (e.g. an AI generated brief). */
  message?: string;
};

const PENDING_KEY = "deplorix:pending-inquiry";

export const openInquiry = (divisionId: string, extra: Omit<InquiryDetail, "divisionId"> = {}) => {
  const detail: InquiryDetail = { divisionId, ...extra };
  if (!document.getElementById("service-inquiry")) {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(detail));
    const contactSection = document.querySelector<HTMLElement>('[data-deferred-section="contact"]');
    const destination = `/?division=${encodeURIComponent(divisionId)}#contact`;

    if (window.location.pathname === "/" && contactSection) {
      window.history.replaceState(null, "", destination);
      contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    window.location.href = destination;
    return;
  }
  window.dispatchEvent(new CustomEvent<InquiryDetail>(INQUIRY_EVENT, { detail }));
};

export const getPendingInquiry = (): InquiryDetail | null => {
  const pending = sessionStorage.getItem(PENDING_KEY);
  if (!pending) return null;
  sessionStorage.removeItem(PENDING_KEY);
  try {
    return JSON.parse(pending) as InquiryDetail;
  } catch {
    return null;
  }
};
