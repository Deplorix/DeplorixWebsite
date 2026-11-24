import React, { useState, useId, useRef } from "react";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Cloud,
  Cpu,
  Download,
  FileText,
  FileUp,
  GraduationCap,
  Layers,
  Link as LinkIcon,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Palette,
  Phone,
  Plus,
  Printer,
  RotateCcw,
  Server,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const WHATSAPP_NUMBER = "919945831090";
const DISPLAY_PHONE = "+91 99458 31090";
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxOWxqEPAZKVZ-vWtQmVzt1jTPlcQ8dZCiUhhYbNmXPeUfU4akclJjp0lWSLVGJfkr-/exec";
const MAX_RESUME_BYTES = 5 * 1024 * 1024; // 5 MB

const TRACK_OPTIONS = [
  {
    id: "fullstack",
    title: "Full-Stack Web Development",
    desc: "React, Next.js, Node.js, REST APIs & Deployment",
    icon: Layers,
    colorClass: "bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300",
  },
  {
    id: "java",
    title: "Java & Backend Engineering",
    desc: "Core Java, Spring Boot, Microservices & Security",
    icon: Server,
    colorClass: "bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300",
  },
  {
    id: "python",
    title: "Python & Data Science",
    desc: "Python, Pandas, Machine Learning & Analytics",
    icon: Cpu,
    colorClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300",
  },
  {
    id: "cloud",
    title: "Cloud Computing & Databases",
    desc: "AWS, Docker, CI/CD Pipelines, SQL & NoSQL",
    icon: Cloud,
    colorClass: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300",
  },
  {
    id: "uiux",
    title: "UI/UX Design & Product Prototyping",
    desc: "Figma, Design Systems, User Research & Interactive Wireframing",
    icon: Palette,
    colorClass: "bg-pink-100 text-pink-700 dark:bg-pink-950/70 dark:text-pink-300",
    fullWidth: true,
  },
];

const BATCH_OPTIONS = [
  "December 1, 2026 (Winter Fast-Track)",
  "December 15, 2026 (Mid-December Batch)",
  "January 5, 2027 (New Year Cohort)",
  "February 1, 2027 (Spring Cohort)",
];

const SKILL_PILLS = [
  "HTML/CSS/JS",
  "React",
  "Node.js",
  "Java",
  "Python",
  "SQL/MySQL",
  "MongoDB",
  "Git & GitHub",
];

const SEMESTER_OPTIONS = [
  { value: "1st Year (Sem 1-2)", label: "1st Year (Semester 1–2)" },
  { value: "2nd Year (Sem 3-4)", label: "2nd Year (Semester 3–4)" },
  { value: "3rd Year (Sem 5-6)", label: "3rd Year (Semester 5–6)" },
  { value: "4th Year (Sem 7-8)", label: "4th Year / Final Year (Semester 7–8)" },
  { value: "Recent Graduate", label: "Recent Graduate" },
];

const GRAD_YEAR_OPTIONS = ["2024", "2025", "2026", "2027", "2028", "2029"];

export interface SubmittedEnrollmentData {
  appId: string;
  timestamp: string;
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  cityState: string;
  college: string;
  degreeBranch: string;
  currentSemester: string;
  gradYear: string;
  track: string;
  batchDate: string;
  skills: string[];
  profileUrl: string;
  resumeName: string;
}

interface InternshipEnrollmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InternshipEnrollmentDialog: React.FC<InternshipEnrollmentDialogProps> = ({
  open,
  onOpenChange,
}) => {
  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [cityState, setCityState] = useState("");
  const [college, setCollege] = useState("");
  const [degreeBranch, setDegreeBranch] = useState("");
  const [currentSemester, setCurrentSemester] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [track, setTrack] = useState("");
  const [batchDate, setBatchDate] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [profileUrl, setProfileUrl] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [declaration, setDeclaration] = useState(false);

  // Status & Validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasSubmittedAttempt, setHasSubmittedAttempt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<SubmittedEnrollmentData | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const titleId = useId();

  // Progress Calculation
  const requiredChecks = [
    fullName.trim().length >= 2,
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
    phone.replace(/\D/g, "").length >= 10,
    dob.trim() !== "",
    cityState.trim().length >= 2,
    college.trim().length >= 3,
    degreeBranch.trim().length >= 2,
    currentSemester !== "",
    gradYear !== "",
    track !== "",
    batchDate !== "",
    declaration === true,
  ];
  const completedCount = requiredChecks.filter(Boolean).length;
  const progressPercentage = Math.round((completedCount / requiredChecks.length) * 100);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setResumeFile(null);
      return;
    }
    const validExtensions = [".pdf", ".doc", ".docx"];
    const hasValidExt = validExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );
    if (!hasValidExt) {
      setErrors((prev) => ({
        ...prev,
        resumeFile: "Please select a valid PDF or Word document (.pdf, .doc, .docx).",
      }));
      setResumeFile(null);
      return;
    }
    if (file.size > MAX_RESUME_BYTES) {
      setErrors((prev) => ({
        ...prev,
        resumeFile: "Your resume file must be 5 MB or smaller.",
      }));
      setResumeFile(null);
      return;
    }
    setErrors((prev) => {
      const next = { ...prev };
      delete next.resumeFile;
      return next;
    });
    setResumeFile(file);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (fullName.trim().length < 2) {
      newErrors.fullName = "Please enter your full name (at least 2 letters).";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }
    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      newErrors.phone = "Please enter a valid 10-digit phone/WhatsApp number.";
    }
    if (!dob) {
      newErrors.dob = "Please select your date of birth.";
    }
    if (cityState.trim().length < 2) {
      newErrors.cityState = "Please enter your current city and state.";
    }
    if (college.trim().length < 3) {
      newErrors.college = "Please enter your college or university name.";
    }
    if (degreeBranch.trim().length < 2) {
      newErrors.degreeBranch = "Please enter your degree and specialization / branch.";
    }
    if (!currentSemester) {
      newErrors.currentSemester = "Please select your current semester or academic status.";
    }
    if (!gradYear) {
      newErrors.gradYear = "Please select your expected or completed graduation year.";
    }
    if (!track) {
      newErrors.track = "Please choose an internship or course track.";
    }
    if (!batchDate) {
      newErrors.batchDate = "Please select a preferred cohort batch start date.";
    }
    if (profileUrl.trim()) {
      try {
        new URL(profileUrl.trim().startsWith("http") ? profileUrl.trim() : `https://${profileUrl.trim()}`);
      } catch {
        newErrors.profileUrl = "Please enter a valid URL (e.g., https://github.com/username).";
      }
    }
    if (!declaration) {
      newErrors.declaration = "You must agree to the declaration before submitting.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmittedAttempt(true);

    if (!validate()) {
      const firstInvalidEl = formRef.current?.querySelector(".border-destructive");
      if (firstInvalidEl) {
        firstInvalidEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);

    const appId = `DX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    const year = now.getFullYear();
    let hours = now.getHours();
    const minutes = pad(now.getMinutes());
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const timestampStr = `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;

    const resumeName = resumeFile?.name || (profileUrl.trim() ? "Profile Link Provided" : "None attached");

    const submissionPayload: SubmittedEnrollmentData = {
      appId,
      timestamp: timestampStr,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      dob,
      cityState: cityState.trim(),
      college: college.trim(),
      degreeBranch: degreeBranch.trim(),
      currentSemester,
      gradYear,
      track,
      batchDate,
      skills: selectedSkills,
      profileUrl: profileUrl.trim() || "Not provided",
      resumeName,
    };

    const googleRecord = {
      applicationId: appId,
      timestamp: timestampStr,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim().startsWith("+") ? `'${phone.trim()}` : phone.trim(),
      college: college.trim(),
      degree: `${degreeBranch.trim()} (${currentSemester})`,
      gradYear,
      enrollmentType: "Direct Enrollment",
      domain: track,
      notes: `DOB: ${dob} | Location: ${cityState.trim()} | Batch: ${batchDate} | Skills: ${selectedSkills.join(", ")} | Profile: ${profileUrl.trim() || "None"} | Resume: ${resumeName}`,
      dob,
      cityState: cityState.trim(),
      degreeBranch: degreeBranch.trim(),
      currentSemester,
      track,
      batchDate,
      skills: selectedSkills.join(", "),
      profileUrl: profileUrl.trim() || "Not provided",
      resumeName,
      createdAtMs: Date.now(),
    };

    // 1. Local backup (reliable offline/browser persistence)
    try {
      const existing = JSON.parse(localStorage.getItem("deplorix_enrollments_v1") || "[]");
      existing.unshift(googleRecord);
      localStorage.setItem("deplorix_enrollments_v1", JSON.stringify(existing));
    } catch {
      // ignore storage quota errors safely
    }

    // 2. Submit to Google Webhook
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(googleRecord),
      });
    } catch (err) {
      console.warn("Enrollment webhook ping:", err);
    }

    // 3. Notify backend API endpoint /api/internship/apply
    try {
        await fetch("/api/internship/apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: fullName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            college: college.trim(),
            resumeLink: profileUrl.trim() || undefined,
          }),
        });
      } catch {
        // safe fallback for standalone frontend / static deployments
      }

      setIsSubmitting(false);
      setSubmittedData(submissionPayload);
    };

    const handleResetForm = () => {
      setFullName("");
      setEmail("");
      setPhone("");
      setDob("");
      setCityState("");
      setCollege("");
      setDegreeBranch("");
      setCurrentSemester("");
      setGradYear("");
      setTrack("");
      setBatchDate("");
      setSelectedSkills([]);
      setProfileUrl("");
      setResumeFile(null);
      setDeclaration(false);
      setErrors({});
      setHasSubmittedAttempt(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    const handleDownloadTxtReceipt = () => {
      if (!submittedData) return;
      const d = submittedData;
      const content = [
        "====================================================",
        "      DEPLORIX TECHNOLOGIES - ENROLLMENT RECEIPT    ",
        "====================================================",
        `Application ID : ${d.appId}`,
        `Submitted Date : ${d.timestamp}`,
        "----------------------------------------------------",
        "1. PERSONAL INFORMATION",
        `   Full Name   : ${d.fullName}`,
        `   Email       : ${d.email}`,
        `   Phone       : ${d.phone}`,
        `   DOB         : ${d.dob}`,
        `   City/State  : ${d.cityState}`,
        "",
        "2. ACADEMIC BACKGROUND",
        `   Institution : ${d.college}`,
        `   Degree      : ${d.degreeBranch}`,
        `   Status      : ${d.currentSemester} (Graduating ${d.gradYear})`,
        "",
        "3. PROGRAM SELECTION",
        `   Track       : ${d.track}`,
        `   Batch Start : ${d.batchDate}`,
        "",
        "4. SKILLS & PORTFOLIO",
        `   Skills      : ${d.skills.length ? d.skills.join(", ") : "None listed"}`,
        `   Profile URL : ${d.profileUrl}`,
        `   Resume File : ${d.resumeName}`,
        "====================================================",
        "Thank you for enrolling with DeploriX Technologies!",
        "Official Admissions Desk: +91 99458 31090",
      ].join("\n");

      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${d.appId}_DeploriX_Enrollment.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("Receipt summary downloaded as text file!");
    };

    const buildWhatsAppShareUrl = (data: SubmittedEnrollmentData) => {
      const waText = [
        "🎓 *DEPLORIX INTERNSHIP ENROLLMENT APPLICATION*",
        "━━━━━━━━━━━━━━━━━━━━━━━━━",
        `🆔 *Application ID:* ${data.appId}`,
        `👤 *Full Name:* ${data.fullName}`,
        `📱 *Phone / WhatsApp:* ${data.phone}`,
        `📧 *Email:* ${data.email}`,
        `🏛️ *College:* ${data.college}`,
        `🎓 *Degree / Sem:* ${data.degreeBranch} (${data.currentSemester})`,
        `🚀 *Track:* ${data.track}`,
        `📅 *Cohort Batch:* ${data.batchDate}`,
        `📄 *Resume/Profile:* ${data.resumeName || data.profileUrl}`,
        "━━━━━━━━━━━━━━━━━━━━━━━━━",
        "Hi DeploriX Team, I have submitted my internship enrollment application on your portal. Looking forward to the review!",
      ].join("\n");

      return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(waText)}`;
    };

    const escapeHtml = (str: string) => {
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    const handlePrint = () => {
      if (!submittedData) return;
      const d = submittedData;

      const printFrame = document.createElement("iframe");
      printFrame.style.position = "fixed";
      printFrame.style.right = "0";
      printFrame.style.bottom = "0";
      printFrame.style.width = "0";
      printFrame.style.height = "0";
      printFrame.style.border = "none";
      document.body.appendChild(printFrame);

      const frameDoc = printFrame.contentWindow?.document || printFrame.contentDocument;
      if (!frameDoc) {
        window.print();
        return;
      }

      const skillsHtml =
        d.skills.length > 0
          ? d.skills.map((s) => `<span class="skill-tag">${escapeHtml(s)}</span>`).join(" ")
          : `<span class="no-skills">None listed (Beginner friendly track)</span>`;

      frameDoc.open();
      frameDoc.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>DeploriX_Receipt_${escapeHtml(d.appId)}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 12mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      padding: 8px 12px;
      line-height: 1.35;
      font-size: 11.5px;
    }
    .receipt-container {
      border: 1.5px solid #059669;
      border-radius: 12px;
      overflow: hidden;
      max-width: 100%;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .receipt-header {
      background: linear-gradient(135deg, #059669 0%, #0d9488 100%);
      color: #ffffff;
      padding: 14px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand-title {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: -0.02em;
    }
    .brand-subtitle {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      opacity: 0.9;
      margin-top: 2px;
    }
    .app-badge {
      background: rgba(255, 255, 255, 0.22);
      border: 1px solid rgba(255, 255, 255, 0.4);
      padding: 6px 12px;
      border-radius: 8px;
      text-align: right;
    }
    .app-badge-label {
      font-size: 8.5px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      display: block;
      opacity: 0.9;
    }
    .app-badge-id {
      font-family: monospace;
      font-size: 13.5px;
      font-weight: 800;
    }
    .receipt-body {
      padding: 16px 20px;
    }
    .meta-bar {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 10px;
      margin-bottom: 12px;
      font-size: 10.5px;
      color: #64748b;
    }
    .section-title {
      font-size: 10.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      color: #059669;
      margin-top: 10px;
      margin-bottom: 6px;
      border-bottom: 1px dashed #cbd5e1;
      padding-bottom: 3px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 18px;
    }
    .col-span-2 {
      grid-column: span 2;
    }
    .field-label {
      font-size: 9.5px;
      font-weight: 600;
      text-transform: uppercase;
      color: #64748b;
      letter-spacing: 0.05em;
    }
    .field-val {
      font-size: 11.5px;
      font-weight: 600;
      color: #0f172a;
      margin-top: 1px;
    }
    .field-val.track-val {
      color: #059669;
      font-size: 12.5px;
      font-weight: 700;
    }
    .skills-box {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: 4px;
    }
    .skill-tag {
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
      padding: 2.5px 7px;
      border-radius: 5px;
      font-size: 9.5px;
      font-weight: 600;
      display: inline-block;
    }
    .no-skills {
      font-size: 10px;
      color: #94a3b8;
      font-style: italic;
    }
    .receipt-footer {
      margin-top: 16px;
      padding-top: 10px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9.5px;
      color: #64748b;
    }
    .confirmed-pill {
      border: 1.5px solid #059669;
      color: #059669;
      background: #ecfdf5;
      padding: 3.5px 9px;
      border-radius: 6px;
      font-weight: 800;
      text-transform: uppercase;
      font-size: 9px;
      letter-spacing: 0.06em;
    }
  </style>
</head>
<body>
  <div class="receipt-container">
    <div class="receipt-header">
      <div>
        <div class="brand-title">DeploriX Technologies</div>
        <div class="brand-subtitle">Student & Internship Enrollment Receipt</div>
      </div>
      <div class="app-badge">
        <span class="app-badge-label">Application ID</span>
        <span class="app-badge-id">${escapeHtml(d.appId)}</span>
      </div>
    </div>

    <div class="receipt-body">
      <div class="meta-bar">
        <span>Issued by: <strong>DeploriX Technologies Pvt Ltd</strong></span>
        <span>Submitted on: <strong>${escapeHtml(d.timestamp)}</strong></span>
      </div>

      <div class="section-title">1. Candidate Information</div>
      <div class="grid-2">
        <div>
          <div class="field-label">Applicant Name</div>
          <div class="field-val">${escapeHtml(d.fullName)}</div>
        </div>
        <div>
          <div class="field-label">Email Address</div>
          <div class="field-val">${escapeHtml(d.email)}</div>
        </div>
        <div>
          <div class="field-label">Phone / WhatsApp</div>
          <div class="field-val">${escapeHtml(d.phone)}</div>
        </div>
        <div>
          <div class="field-label">Date of Birth & Location</div>
          <div class="field-val">${escapeHtml(d.dob)} • ${escapeHtml(d.cityState)}</div>
        </div>
      </div>

      <div class="section-title">2. Academic Background</div>
      <div class="grid-2">
        <div class="col-span-2">
          <div class="field-label">College / University</div>
          <div class="field-val">${escapeHtml(d.college)}</div>
        </div>
        <div>
          <div class="field-label">Degree & Specialization</div>
          <div class="field-val">${escapeHtml(d.degreeBranch)}</div>
        </div>
        <div>
          <div class="field-label">Academic Status & Graduation</div>
          <div class="field-val">${escapeHtml(d.currentSemester)} (Class of ${escapeHtml(d.gradYear)})</div>
        </div>
      </div>

      <div class="section-title">3. Program Track & Cohort</div>
      <div class="grid-2">
        <div>
          <div class="field-label">Selected Track</div>
          <div class="field-val track-val">${escapeHtml(d.track)}</div>
        </div>
        <div>
          <div class="field-label">Cohort Batch Start Date</div>
          <div class="field-val">${escapeHtml(d.batchDate)}</div>
        </div>
      </div>

      <div class="section-title">4. Skills & Portfolio</div>
      <div class="grid-2" style="margin-bottom: 6px;">
        <div>
          <div class="field-label">Resume / CV Document</div>
          <div class="field-val">${escapeHtml(d.resumeName)}</div>
        </div>
        <div>
          <div class="field-label">Portfolio / Profile Link</div>
          <div class="field-val" style="word-break: break-all;">${escapeHtml(d.profileUrl)}</div>
        </div>
      </div>
      <div>
        <div class="field-label" style="margin-bottom: 3px;">Declared Technical Skills</div>
        <div class="skills-box">${skillsHtml}</div>
      </div>

      <div class="receipt-footer">
        <div>
          <strong>Official Admissions Desk:</strong> +91 99458 31090 | admissions@deplorix.tech<br>
          <span>Bangalore, Karnataka • Official Computer-Generated Enrollment Document</span>
        </div>
        <div class="confirmed-pill">✓ ENROLLMENT CONFIRMED</div>
      </div>
    </div>
  </div>
</body>
</html>`);
      frameDoc.close();

      setTimeout(() => {
        try {
          printFrame.contentWindow?.focus();
          printFrame.contentWindow?.print();
        } finally {
          setTimeout(() => {
            if (printFrame.parentNode) {
              printFrame.parentNode.removeChild(printFrame);
            }
          }, 1500);
        }
      }, 250);
    };

    const handleClose = () => {
      onOpenChange(false);
      setTimeout(() => {
        setSubmittedData(null);
        setErrors({});
        setHasSubmittedAttempt(false);
      }, 250);
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl w-[96vw] sm:w-[92vw] md:w-[88vw] max-h-[92vh] p-0 overflow-y-auto rounded-3xl border border-border/80 bg-background shadow-2xl">
          <DialogTitle className="sr-only" id={titleId}>
            Student & Internship Enrollment — DeploriX Technologies
          </DialogTitle>

          {/* Confirmation / Receipt View */}
          {submittedData ? (
            <div className="p-4 sm:p-7 md:p-9 space-y-6 animate-in fade-in zoom-in-95 duration-200">
              {/* Confirmation Banner */}
              <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-5 sm:p-7 text-white shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/20 backdrop-blur-md">
                      <CheckCircle2 className="h-7 w-7 text-white" />
                    </span>
                    <div>
                      <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-100">
                        Enrollment Confirmed
                      </span>
                      <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight">
                        Application Receipt
                      </h3>
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/15 px-3.5 py-2 backdrop-blur-sm self-start sm:self-auto text-left sm:text-right border border-white/20">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-emerald-100">
                      Application ID
                    </span>
                    <span className="font-mono text-base font-bold text-white tracking-wide">
                      {submittedData.appId}
                    </span>
                  </div>
                </div>
              </div>

              {/* Receipt Summary Grid */}
              <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-7 shadow-[var(--shadow-soft)] space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3 text-xs text-muted-foreground">
                  <span>
                    Issued by: <strong className="text-foreground">DeploriX Technologies</strong>
                  </span>
                  <span>Submitted on {submittedData.timestamp}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm">
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Applicant Name
                    </span>
                    <p className="mt-1 font-bold text-foreground text-base">
                      {submittedData.fullName}
                    </p>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Email & Phone
                    </span>
                    <p className="mt-1 font-medium text-foreground">
                      {submittedData.email} • {submittedData.phone}
                    </p>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Date of Birth & Location
                    </span>
                    <p className="mt-1 font-medium text-foreground">
                      DOB: {submittedData.dob} | {submittedData.cityState}
                    </p>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Institution
                    </span>
                    <p className="mt-1 font-medium text-foreground">
                      {submittedData.college}
                    </p>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Degree & Graduation
                    </span>
                    <p className="mt-1 font-medium text-foreground">
                      {submittedData.degreeBranch} ({submittedData.currentSemester}, Class of {submittedData.gradYear})
                    </p>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Selected Track
                    </span>
                    <p className="mt-1 font-bold text-brand text-base">
                      {submittedData.track}
                    </p>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Cohort Batch / Start Date
                    </span>
                    <p className="mt-1 font-medium text-foreground">
                      {submittedData.batchDate}
                    </p>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Resume / Portfolio Link
                    </span>
                    <p className="mt-1 font-medium text-foreground break-all">
                      {submittedData.resumeName}
                      {submittedData.profileUrl && submittedData.profileUrl !== "Not provided" && (
                        <span className="block text-xs text-muted-foreground mt-0.5">
                          Link: {submittedData.profileUrl}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Skills Tags */}
                <div className="border-t border-border/60 pt-4">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Declared Technical Skills
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {submittedData.skills.length > 0 ? (
                      submittedData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg border border-brand/20 bg-brand-soft px-3 py-1 text-xs font-semibold text-accent-foreground"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs italic text-muted-foreground">
                        None selected (Beginner friendly track)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Forward Action */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#25D366] text-white shadow-sm">
                    <MessageCircle size={20} className="fill-white" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      Direct WhatsApp Admissions Support
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Forward your application receipt directly to our admissions team at <strong>{DISPLAY_PHONE}</strong>
                    </p>
                  </div>
                </div>
                <a
                  href={buildWhatsAppShareUrl(submittedData)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#1fb855] hover:shadow-lg shrink-0"
                >
                  <MessageCircle size={15} className="fill-white" />
                  Open in WhatsApp ({DISPLAY_PHONE})
                </a>
              </div>

              {/* Receipt Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadTxtReceipt}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground shadow-xs transition-colors hover:bg-secondary"
                >
                  <Download size={14} />
                  Download Summary (.txt)
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-brand/30 bg-brand-soft px-4 py-2.5 text-xs font-semibold text-accent-foreground shadow-xs transition-colors hover:bg-brand/20"
                >
                  <Printer size={14} />
                  Print Receipt
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleResetForm();
                    setSubmittedData(null);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background px-5 py-2.5 text-xs font-semibold shadow-sm transition-all hover:opacity-90"
                >
                  <Plus size={14} />
                  Submit Another Application
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Main Enrollment Form View */
            <div className="space-y-6 p-4 sm:p-7 md:p-8">
              {/* Top Bar with Logo & Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white font-display font-extrabold text-sm shadow-md shadow-brand/25">
                    DX
                  </div>
                  <div>
                    <span className="font-display text-base font-bold tracking-tight text-foreground block leading-tight">
                      DeploriX
                    </span>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block">
                      Technologies
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  2026 Cohort Open
                </span>
              </div>

              {/* Hero Banner Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 p-6 sm:p-7 text-white shadow-xl">
                <div className="relative z-10 max-w-2xl">
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-brand-100 backdrop-blur-sm">
                    <Sparkles size={13} className="text-amber-300" />
                    Industry-Ready Training & Internship Program
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
                    Student & Internship Enrollment
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Launch your engineering career with hands-on live projects, mentorship from senior architects, and industry certification at DeploriX Technologies.
                  </p>
                </div>
                {/* Subtle background glow */}
                <div
                  className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-brand-500/25 blur-3xl pointer-events-none"
                  aria-hidden="true"
                />
              </div>

              {/* Live Progress Bar */}
              <div className="rounded-2xl border border-border/80 bg-card p-4 sm:px-6 shadow-xs">
                <div className="mb-2 flex items-center justify-between text-xs font-semibold text-muted-foreground">
                  <span className="flex items-center gap-1.5 text-foreground">
                    <CheckCircle2 size={14} className="text-brand" />
                    Application Completion
                  </span>
                  <span className="font-bold text-brand">{progressPercentage}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-brand to-indigo-600 transition-all duration-300 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Global Validation Alert Banner */}
              {hasSubmittedAttempt && Object.keys(errors).length > 0 && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-xs sm:text-sm text-destructive shadow-xs animate-in fade-in duration-200"
                >
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Please review highlighted fields</p>
                    <p className="mt-0.5 text-xs opacity-90">
                      {Object.values(errors)[0] || "Some required fields are missing or contain invalid information."}
                    </p>
                  </div>
                </div>
              )}

              {/* Enrollment Form */}
              <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* SECTION 01: Personal Information */}
                <section className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-colors hover:border-border">
                  <div className="flex items-center gap-3 border-b border-border/70 bg-secondary/40 px-5 py-3.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-accent-foreground font-display text-xs font-bold">
                      01
                    </span>
                    <div>
                      <h3 className="font-display text-sm sm:text-base font-bold text-foreground">
                        Personal Information
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        Basic contact details for enrollment verification and offer letter issuance
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5">
                    {/* Full Name */}
                    <div className="sm:col-span-2">
                      <label htmlFor="dx-full-name" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Full Name <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground pointer-events-none">
                          <User size={15} />
                        </span>
                        <input
                          id="dx-full-name"
                          type="text"
                          required
                          autoComplete="name"
                          placeholder="e.g., Aarav Sharma"
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value);
                            if (errors.fullName) {
                              setErrors((prev) => {
                                const n = { ...prev };
                                delete n.fullName;
                                return n;
                              });
                            }
                          }}
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-foreground bg-background placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all ${errors.fullName ? "border-destructive ring-2 ring-destructive/20" : "border-border focus:border-brand"
                            }`}
                        />
                      </div>
                      {errors.fullName && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                          <AlertCircle size={12} /> {errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="dx-email" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Email Address <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground pointer-events-none">
                          <Mail size={15} />
                        </span>
                        <input
                          id="dx-email"
                          type="email"
                          required
                          autoComplete="email"
                          placeholder="aarav.sharma@example.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) {
                              setErrors((prev) => {
                                const n = { ...prev };
                                delete n.email;
                                return n;
                              });
                            }
                          }}
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-foreground bg-background placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all ${errors.email ? "border-destructive ring-2 ring-destructive/20" : "border-border focus:border-brand"
                            }`}
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                          <AlertCircle size={12} /> {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone / WhatsApp */}
                    <div>
                      <label htmlFor="dx-phone" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Phone / WhatsApp Number <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground pointer-events-none">
                          <Phone size={15} />
                        </span>
                        <input
                          id="dx-phone"
                          type="tel"
                          required
                          autoComplete="tel"
                          placeholder="+91 99458 31090"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            if (errors.phone) {
                              setErrors((prev) => {
                                const n = { ...prev };
                                delete n.phone;
                                return n;
                              });
                            }
                          }}
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-foreground bg-background placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all ${errors.phone ? "border-destructive ring-2 ring-destructive/20" : "border-border focus:border-brand"
                            }`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                          <AlertCircle size={12} /> {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label htmlFor="dx-dob" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Date of Birth <span className="text-destructive">*</span>
                      </label>
                      <input
                        id="dx-dob"
                        type="date"
                        required
                        value={dob}
                        onChange={(e) => {
                          setDob(e.target.value);
                          if (errors.dob) {
                            setErrors((prev) => {
                              const n = { ...prev };
                              delete n.dob;
                              return n;
                            });
                          }
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all ${errors.dob ? "border-destructive ring-2 ring-destructive/20" : "border-border focus:border-brand"
                          }`}
                      />
                      {errors.dob && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                          <AlertCircle size={12} /> {errors.dob}
                        </p>
                      )}
                    </div>

                    {/* City & State */}
                    <div>
                      <label htmlFor="dx-city-state" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        City & State <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground pointer-events-none">
                          <MapPin size={15} />
                        </span>
                        <input
                          id="dx-city-state"
                          type="text"
                          required
                          placeholder="e.g., Bengaluru, Karnataka"
                          value={cityState}
                          onChange={(e) => {
                            setCityState(e.target.value);
                            if (errors.cityState) {
                              setErrors((prev) => {
                                const n = { ...prev };
                                delete n.cityState;
                                return n;
                              });
                            }
                          }}
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-foreground bg-background placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all ${errors.cityState ? "border-destructive ring-2 ring-destructive/20" : "border-border focus:border-brand"
                            }`}
                        />
                      </div>
                      {errors.cityState && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                          <AlertCircle size={12} /> {errors.cityState}
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                {/* SECTION 02: Academic Background */}
                <section className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-colors hover:border-border">
                  <div className="flex items-center gap-3 border-b border-border/70 bg-secondary/40 px-5 py-3.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-accent-foreground font-display text-xs font-bold">
                      02
                    </span>
                    <div>
                      <h3 className="font-display text-sm sm:text-base font-bold text-foreground">
                        Academic Background
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        Your current institution, degree specialization, and graduation timeline
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5">
                    {/* College */}
                    <div className="sm:col-span-2">
                      <label htmlFor="dx-college" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        College / University Name <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground pointer-events-none">
                          <GraduationCap size={15} />
                        </span>
                        <input
                          id="dx-college"
                          type="text"
                          required
                          placeholder="e.g., RV College of Engineering, Bengaluru"
                          value={college}
                          onChange={(e) => {
                            setCollege(e.target.value);
                            if (errors.college) {
                              setErrors((prev) => {
                                const n = { ...prev };
                                delete n.college;
                                return n;
                              });
                            }
                          }}
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-foreground bg-background placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all ${errors.college ? "border-destructive ring-2 ring-destructive/20" : "border-border focus:border-brand"
                            }`}
                        />
                      </div>
                      {errors.college && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                          <AlertCircle size={12} /> {errors.college}
                        </p>
                      )}
                    </div>

                    {/* Degree & Branch */}
                    <div className="sm:col-span-2">
                      <label htmlFor="dx-degree-branch" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Degree & Specialization / Branch <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground pointer-events-none">
                          <BookOpen size={15} />
                        </span>
                        <input
                          id="dx-degree-branch"
                          type="text"
                          required
                          placeholder="e.g., B.Tech Computer Science & Engineering / MCA / BCA"
                          value={degreeBranch}
                          onChange={(e) => {
                            setDegreeBranch(e.target.value);
                            if (errors.degreeBranch) {
                              setErrors((prev) => {
                                const n = { ...prev };
                                delete n.degreeBranch;
                                return n;
                              });
                            }
                          }}
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-foreground bg-background placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all ${errors.degreeBranch ? "border-destructive ring-2 ring-destructive/20" : "border-border focus:border-brand"
                            }`}
                        />
                      </div>
                      {errors.degreeBranch && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                          <AlertCircle size={12} /> {errors.degreeBranch}
                        </p>
                      )}
                    </div>

                    {/* Current Semester / Academic Status */}
                    <div>
                      <label htmlFor="dx-current-sem" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Current Semester / Academic Status <span className="text-destructive">*</span>
                      </label>
                      <select
                        id="dx-current-sem"
                        required
                        value={currentSemester}
                        onChange={(e) => {
                          setCurrentSemester(e.target.value);
                          if (errors.currentSemester) {
                            setErrors((prev) => {
                              const n = { ...prev };
                              delete n.currentSemester;
                              return n;
                            });
                          }
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all ${errors.currentSemester ? "border-destructive ring-2 ring-destructive/20" : "border-border focus:border-brand"
                          }`}
                      >
                        <option value="">Select current status...</option>
                        {SEMESTER_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {errors.currentSemester && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                          <AlertCircle size={12} /> {errors.currentSemester}
                        </p>
                      )}
                    </div>

                    {/* Graduation Year */}
                    <div>
                      <label htmlFor="dx-grad-year" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Expected / Completed Graduation Year <span className="text-destructive">*</span>
                      </label>
                      <select
                        id="dx-grad-year"
                        required
                        value={gradYear}
                        onChange={(e) => {
                          setGradYear(e.target.value);
                          if (errors.gradYear) {
                            setErrors((prev) => {
                              const n = { ...prev };
                              delete n.gradYear;
                              return n;
                            });
                          }
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all ${errors.gradYear ? "border-destructive ring-2 ring-destructive/20" : "border-border focus:border-brand"
                          }`}
                      >
                        <option value="">Select year...</option>
                        {GRAD_YEAR_OPTIONS.map((yr) => (
                          <option key={yr} value={yr}>
                            {yr}
                          </option>
                        ))}
                      </select>
                      {errors.gradYear && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                          <AlertCircle size={12} /> {errors.gradYear}
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                {/* SECTION 03: Track & Program Selection */}
                <section className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-colors hover:border-border">
                  <div className="flex items-center gap-3 border-b border-border/70 bg-secondary/40 px-5 py-3.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-accent-foreground font-display text-xs font-bold">
                      03
                    </span>
                    <div>
                      <h3 className="font-display text-sm sm:text-base font-bold text-foreground">
                        Track & Program Selection
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        Choose your specialized engineering track and cohort start date
                      </p>
                    </div>
                  </div>

                  <div className="p-5 space-y-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                        Course / Internship Track <span className="text-destructive">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {TRACK_OPTIONS.map((option) => {
                          const IconComponent = option.icon;
                          const isSelected = track === option.title;
                          return (
                            <label
                              key={option.id}
                              className={`relative flex items-start p-4 rounded-xl border cursor-pointer transition-all select-none ${option.fullWidth ? "sm:col-span-2" : ""
                                } ${isSelected
                                  ? "border-brand bg-brand-soft/60 ring-2 ring-brand/20 shadow-xs"
                                  : "border-border bg-background hover:border-brand/40 hover:bg-secondary/40"
                                }`}
                            >
                              <input
                                type="radio"
                                name="track"
                                value={option.title}
                                checked={isSelected}
                                onChange={() => {
                                  setTrack(option.title);
                                  if (errors.track) {
                                    setErrors((prev) => {
                                      const n = { ...prev };
                                      delete n.track;
                                      return n;
                                    });
                                  }
                                }}
                                className="sr-only"
                              />
                              <div
                                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mr-3.5 ${option.colorClass}`}
                              >
                                <IconComponent size={18} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="block text-sm font-bold text-foreground">
                                  {option.title}
                                </span>
                                <span className="block text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                  {option.desc}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                      {errors.track && (
                        <p className="mt-2 flex items-center gap-1 text-xs text-destructive">
                          <AlertCircle size={12} /> {errors.track}
                        </p>
                      )}
                    </div>

                    {/* Batch Start Date */}
                    <div className="pt-1">
                      <label htmlFor="dx-batch-date" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Preferred Batch / Start Date <span className="text-destructive">*</span>
                      </label>
                      <select
                        id="dx-batch-date"
                        required
                        value={batchDate}
                        onChange={(e) => {
                          setBatchDate(e.target.value);
                          if (errors.batchDate) {
                            setErrors((prev) => {
                              const n = { ...prev };
                              delete n.batchDate;
                              return n;
                            });
                          }
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all ${errors.batchDate ? "border-destructive ring-2 ring-destructive/20" : "border-border focus:border-brand"
                          }`}
                      >
                        <option value="">Select upcoming cohort...</option>
                        {BATCH_OPTIONS.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                      {errors.batchDate && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                          <AlertCircle size={12} /> {errors.batchDate}
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                {/* SECTION 04: Technical Skills & Portfolio */}
                <section className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-colors hover:border-border">
                  <div className="flex items-center gap-3 border-b border-border/70 bg-secondary/40 px-5 py-3.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-accent-foreground font-display text-xs font-bold">
                      04
                    </span>
                    <div>
                      <h3 className="font-display text-sm sm:text-base font-bold text-foreground">
                        Technical Skills & Portfolio
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        Highlight your current familiarity with tools and share your profile links
                      </p>
                    </div>
                  </div>

                  <div className="p-5 space-y-5">
                    {/* Skills Checkbox Pills */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                        Current Technical Skills <span className="text-[10px] lowercase font-normal">(select all that apply)</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {SKILL_PILLS.map((skill) => {
                          const isChecked = selectedSkills.includes(skill);
                          return (
                            <label
                              key={skill}
                              className={`cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all select-none ${isChecked
                                  ? "bg-brand-soft text-accent-foreground border-brand/50 shadow-xs"
                                  : "bg-secondary/40 text-muted-foreground border-border hover:border-brand/30 hover:text-foreground"
                                }`}
                            >
                              <input
                                type="checkbox"
                                value={skill}
                                checked={isChecked}
                                onChange={() => handleSkillToggle(skill)}
                                className="rounded border-border text-brand focus:ring-brand h-3.5 w-3.5"
                              />
                              {skill}
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Profile URL */}
                      <div>
                        <label htmlFor="dx-profile-url" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                          GitHub or LinkedIn Profile URL <span className="text-[10px] lowercase font-normal">(optional)</span>
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground pointer-events-none">
                            <LinkIcon size={14} />
                          </span>
                          <input
                            id="dx-profile-url"
                            type="url"
                            placeholder="https://github.com/username"
                            value={profileUrl}
                            onChange={(e) => {
                              setProfileUrl(e.target.value);
                              if (errors.profileUrl) {
                                setErrors((prev) => {
                                  const n = { ...prev };
                                  delete n.profileUrl;
                                  return n;
                                });
                              }
                            }}
                            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-foreground bg-background placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all ${errors.profileUrl ? "border-destructive ring-2 ring-destructive/20" : "border-border focus:border-brand"
                              }`}
                          />
                        </div>
                        {errors.profileUrl && (
                          <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                            <AlertCircle size={12} /> {errors.profileUrl}
                          </p>
                        )}
                      </div>

                      {/* Resume Upload */}
                      <div>
                        <label htmlFor="dx-resume-upload" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Upload Resume / CV <span className="text-[10px] lowercase font-normal">(PDF, DOC, DOCX • max 5MB)</span>
                        </label>
                        <label
                          htmlFor="dx-resume-upload"
                          className={`flex items-center justify-between px-3.5 py-2 rounded-xl border border-dashed cursor-pointer transition-all ${resumeFile
                              ? "border-brand bg-brand-soft/40"
                              : "border-border bg-secondary/30 hover:border-brand/40 hover:bg-secondary/60"
                            }`}
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-card border border-border text-brand shadow-xs">
                              <FileUp size={14} />
                            </span>
                            <span className="text-xs text-foreground truncate max-w-[150px] sm:max-w-[180px]">
                              {resumeFile ? resumeFile.name : "Choose file..."}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-brand bg-brand-soft px-2.5 py-1 rounded-lg shrink-0 ml-2">
                            Browse
                          </span>
                          <input
                            ref={fileInputRef}
                            id="dx-resume-upload"
                            type="file"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={handleFileChange}
                            className="sr-only"
                          />
                        </label>
                        {resumeFile && (
                          <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                            <span>{(resumeFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                            <button
                              type="button"
                              onClick={() => {
                                setResumeFile(null);
                                if (fileInputRef.current) fileInputRef.current.value = "";
                              }}
                              className="text-destructive hover:underline"
                            >
                              Remove file
                            </button>
                          </div>
                        )}
                        {errors.resumeFile && (
                          <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                            <AlertCircle size={12} /> {errors.resumeFile}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                {/* SECTION 05: Declaration & Submit */}
                <section className="rounded-2xl border border-border/80 bg-card p-5 space-y-5 shadow-xs">
                  <div className="flex items-start gap-3">
                    <input
                      id="dx-declaration"
                      type="checkbox"
                      checked={declaration}
                      onChange={(e) => {
                        setDeclaration(e.target.checked);
                        if (errors.declaration) {
                          setErrors((prev) => {
                            const n = { ...prev };
                            delete n.declaration;
                            return n;
                          });
                        }
                      }}
                      className="mt-1 h-4 w-4 rounded border-border text-brand focus:ring-brand cursor-pointer shrink-0"
                    />
                    <label htmlFor="dx-declaration" className="text-xs sm:text-sm text-muted-foreground leading-relaxed cursor-pointer select-none">
                      I hereby declare that all information provided in this enrollment form is true, complete, and accurate to the best of my knowledge. I agree to abide by the training guidelines and code of conduct of <strong className="text-foreground">DeploriX Technologies</strong>. <span className="text-destructive">*</span>
                    </label>
                  </div>
                  {errors.declaration && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle size={12} /> {errors.declaration}
                    </p>
                  )}

                  <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/60">
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                    >
                      <RotateCcw size={13} />
                      Clear Form
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-brand text-white font-semibold text-sm shadow-md shadow-brand/25 hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin text-white" />
                          Submitting Application...
                        </>
                      ) : (
                        <>
                          Submit Enrollment Application
                          <ArrowRight size={15} />
                        </>
                      )}
                    </button>
                  </div>
                </section>
              </form>

              {/* Footer Notice */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-border/60 pt-4 text-[11px] text-muted-foreground">
                <p>&copy; 2026 DeploriX Technologies. All rights reserved.</p>
                <p>
                  Admissions desk WhatsApp: <span className="font-semibold text-foreground">{DISPLAY_PHONE}</span>
                </p>
              </div>
            </div>
          )}

          {/* In-modal Toast */}
          {toastMessage && (
            <div
              role="status"
              className="fixed bottom-6 right-6 z-50 rounded-xl bg-foreground text-background px-4 py-2.5 text-xs font-medium shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-150"
            >
              {toastMessage}
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  };

  export default InternshipEnrollmentDialog;
