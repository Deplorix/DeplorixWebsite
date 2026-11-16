export type Certificate = {
  certificate_id: string;
  student_name: string;
  domain: string;
  college_name: string;
  internship_start_date: string;
  internship_end_date: string;
  issue_date: string;
  certificate_status: string;
};

export const VERIFY_BASE_URL = "https://deplorixtechnologies.site/verify";

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

export const formatDuration = (start: string, end: string) =>
  `${formatDate(start)} to ${formatDate(end)}`;
