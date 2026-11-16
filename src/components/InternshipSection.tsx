import { useState } from "react";
import { ArrowRight, Briefcase, CheckCircle2, Code2, FileText, GitBranch, Link2, Loader2, MessageCircle, Presentation, Upload, Users, X } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import internshipImg from "@/assets/internship.jpg";
import { submitInternshipApplication } from "@/lib/api";

const WHATSAPP_NUMBER = "919945831090";
const DISPLAY_PHONE = "+91 99458 31090";

const journey = [
  {
    number: "01",
    title: "Join a product squad",
    description: "Work alongside developers, designers and testers with clear weekly ownership.",
    icon: Users,
  },
  {
    number: "02",
    title: "Ship real work",
    description: "Contribute to live briefs, product builds and practical review cycles—not tutorial clones.",
    icon: Code2,
  },
  {
    number: "03",
    title: "Leave with proof",
    description: "Turn your contribution into a stronger GitHub, portfolio story and interview narrative.",
    icon: Briefcase,
  },
];

const outcomes = [
  { icon: GitBranch, label: "Git workflow" },
  { icon: Presentation, label: "Demo confidence" },
  { icon: Users, label: "Team communication" },
  { icon: CheckCircle2, label: "Placement readiness" },
];

const MAX_RESUME_BYTES = 3 * 1024 * 1024; // Keep the encoded request below common serverless limits.

const resumeMimeType = (file: File) => {
  if (file.type) return file.type;
  const name = file.name.toLowerCase();
  if (name.endsWith(".docx")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (name.endsWith(".doc")) return "application/msword";
  return "application/pdf";
};

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      const [, data = ""] = result.split(",", 2);
      if (!data) reject(new Error("We couldn't read the selected resume."));
      else resolve(data);
    };
    reader.onerror = () => reject(new Error("We couldn't read the selected resume."));
    reader.readAsDataURL(file);
  });

const formatWhatsAppMessage = (data: {
  name: string;
  email: string;
  phone: string;
  college: string;
  resumeName?: string;
  resumeLink?: string;
  sendInChatDirectly?: boolean;
}) => {
  let resumeStatus = "Will attach in WhatsApp chat";
  if (data.resumeLink) {
    resumeStatus = data.resumeLink.trim();
  } else if (data.resumeName) {
    resumeStatus = `${data.resumeName.trim()} (Attaching file in chat)`;
  }

  return [
    "🎓 *INTERNSHIP APPLICATION — DEPLORIX*",
    "━━━━━━━━━━━━━━━━━━━━━━━",
    `👤 *Full Name:* ${data.name.trim()}`,
    `📧 *Email:* ${data.email.trim()}`,
    `📱 *WhatsApp/Phone:* ${data.phone.trim()}`,
    `🏛️ *College / University:* ${data.college.trim()}`,
    `📄 *Resume:* ${resumeStatus}`,
    "━━━━━━━━━━━━━━━━━━━━━━━",
    "🚀 *Applied via DeploriX Careers WhatsApp Form*",
  ].join("\n");
};

const InternshipSection = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", college: "", website: "" });
  const [resume, setResume] = useState<File | null>(null);
  const [resumeLink, setResumeLink] = useState("");
  const [sendInChat, setSendInChat] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [lastSubmittedResumeName, setLastSubmittedResumeName] = useState<string | null>(null);
  const [lastWaUrl, setLastWaUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleApply = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.college.trim()) {
      setError("Please fill in all the required fields.");
      return;
    }

    if (!resume && !resumeLink.trim() && !sendInChat) {
      setError("Please select a resume file, enter a portfolio/Drive link, or choose to attach it in WhatsApp chat.");
      return;
    }

    if (resume && resume.size > MAX_RESUME_BYTES) {
      setError("Your resume file must be 3 MB or smaller.");
      return;
    }

    setSubmitting(true);
    const resumeFileName = resume ? resume.name : undefined;
    setLastSubmittedResumeName(resumeFileName || null);

    const waText = formatWhatsAppMessage({
      name: form.name,
      email: form.email,
      phone: form.phone,
      college: form.college,
      resumeName: resumeFileName,
      resumeLink: resumeLink.trim() || undefined,
      sendInChatDirectly: sendInChat,
    });

    const waUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(waText)}`;
    setLastWaUrl(waUrl);

    const whatsappWindow = window.open("about:blank", "_blank");
    if (whatsappWindow) whatsappWindow.opener = null;

    try {
      const resumeData = resume ? await fileToBase64(resume) : undefined;
      await submitInternshipApplication({
        ...form,
        resumeLink: resumeLink.trim() || undefined,
        attachInWhatsApp: sendInChat,
        resume: resume && resumeData ? {
          name: resume.name,
          type: resumeMimeType(resume),
          data: resumeData,
        } : null,
      });

      if (whatsappWindow && !whatsappWindow.closed) {
        whatsappWindow.location.href = waUrl;
      }
      setSent(true);
    } catch (submissionError) {
      whatsappWindow?.close();
      setError(submissionError instanceof Error ? submissionError.message : "We couldn't send your application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResume = (file: File | null) => {
    setError(null);
    if (!file) {
      setResume(null);
      return;
    }
    const validExtensions = [".pdf", ".doc", ".docx"];
    const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!hasValidExt) {
      setResume(null);
      setError("Please choose a PDF or Word document (.pdf, .doc, .docx).");
      return;
    }
    if (file.size > MAX_RESUME_BYTES) {
      setResume(null);
      setError("Your resume must be 3 MB or smaller.");
      return;
    }
    setResume(file);
    setSendInChat(false);
  };

  return (
    <section id="resources" className="section-padding bg-surface-elevated">
      <div className="site-container">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
          <AnimatedSection>
            <div className="relative">
              <div className="absolute -inset-5 rounded-[2.5rem] bg-glow opacity-80 blur-2xl" aria-hidden />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-card p-2 shadow-[var(--shadow-elevated)] md:rounded-[2.5rem]">
                <img
                  src={internshipImg}
                  alt="DeploriX interns collaborating on a product project"
                  className="aspect-[4/3] w-full rounded-[1.65rem] object-cover md:rounded-[2.1rem]"
                  loading="lazy"
                  width={1024}
                  height={768}
                />
                <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-white/20 bg-foreground/85 p-4 text-white backdrop-blur-md md:inset-x-8 md:bottom-8 md:p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.13em] text-white/65">The promise</p>
                  <p className="mt-1.5 font-display text-lg font-bold tracking-tight md:text-xl">Work that becomes proof—not just a certificate.</p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.12}>
            <span className="pill-label">Careers & training</span>
            <h2 className="section-heading mt-6">An internship built around doing the work.</h2>
            <p className="section-copy mt-6 max-w-xl">
              Learn in a working team, get direct feedback and build the habits companies actually expect from early-career talent.
            </p>

            <div className="mt-9 space-y-3">
              {journey.map((step) => (
                <article key={step.number} className="group grid grid-cols-[auto_1fr] gap-4 rounded-2xl border border-border/70 bg-card p-4 shadow-[var(--shadow-soft)] transition-all hover:border-brand/25 md:p-5">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-accent-foreground"><step.icon size={19} /></span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-brand">{step.number}</span>
                      <h3 className="text-base font-bold text-foreground">{step.title}</h3>
                    </div>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{step.description}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {outcomes.map((outcome) => (
                <div key={outcome.label} className="rounded-xl border border-border/60 bg-background px-3 py-3 text-center">
                  <outcome.icon size={16} className="mx-auto text-brand" />
                  <p className="mt-2 text-[11px] font-bold leading-4 text-muted-foreground">{outcome.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button variant="brand" className="h-12 px-7" onClick={() => setDialogOpen(true)}>
                Apply for the internship <ArrowRight size={16} />
              </Button>
              <p className="text-xs leading-5 text-muted-foreground">Applications are reviewed on a rolling basis.</p>
            </div>
          </AnimatedSection>
        </div>
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setError(null);
            setSent(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366]/15 px-3 py-1 text-xs font-bold text-[#128C7E]">
                <MessageCircle size={14} className="fill-[#25D366] text-[#25D366]" />
                Internship Application
              </span>
            </div>
            <DialogTitle className="text-2xl mt-1">Apply for Internship</DialogTitle>
            <DialogDescription>
              Your details and resume are emailed directly to our careers inbox. After confirmation, we also open WhatsApp at <strong className="text-foreground">{DISPLAY_PHONE}</strong> for an easy follow-up.
            </DialogDescription>
          </DialogHeader>

          {sent ? (
            <div role="status" aria-live="polite" className="mt-4 rounded-3xl border border-[#25D366]/30 bg-[#25D366]/10 p-6 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-md">
                <MessageCircle size={28} className="fill-white" />
              </span>
              <h3 className="mt-4 font-display text-xl font-bold text-foreground">
                Application sent successfully!
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Your application was emailed directly to our careers inbox. We also prepared a WhatsApp chat with <strong>{DISPLAY_PHONE}</strong> as a convenient follow-up.
              </p>

              {lastSubmittedResumeName && (
                <div className="mt-4 rounded-xl border border-[#25D366]/40 bg-white/90 p-3.5 text-xs text-foreground text-left shadow-sm">
                  <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                    <FileText size={16} className="text-emerald-700 shrink-0" />
                    Resume document: {lastSubmittedResumeName}
                  </p>
                  <p className="mt-1.5 text-[11px] text-muted-foreground">
                    📎 <strong>Tip:</strong> In the open WhatsApp chat, tap the <strong>attachment icon</strong> (📎 or +) and select your resume to send it along with your application.
                  </p>
                </div>
              )}

              {lastWaUrl && (
                <a
                  href={lastWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#1fb855] hover:shadow-lg w-full"
                >
                  <MessageCircle size={18} className="fill-white stroke-white" />
                  Open WhatsApp Chat ({DISPLAY_PHONE})
                </a>
              )}

              <Button
                type="button"
                variant="outline"
                className="mt-3 h-11 w-full rounded-full"
                onClick={() => setDialogOpen(false)}
              >
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleApply} className="mt-3 space-y-4">
              <div>
                <Label htmlFor="intern-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Full name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="intern-name"
                  required
                  autoComplete="name"
                  placeholder="e.g. Rahul Sharma"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={submitting}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="intern-email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Email address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="intern-email"
                    required
                    autoComplete="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    disabled={submitting}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="intern-phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    WhatsApp / Phone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="intern-phone"
                    required
                    autoComplete="tel"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    disabled={submitting}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="intern-college" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  College / University <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="intern-college"
                  required
                  placeholder="e.g. BMS College of Engineering"
                  value={form.college}
                  onChange={(e) => setForm({ ...form, college: e.target.value })}
                  disabled={submitting}
                  className="mt-1"
                />
              </div>

              {/* Resume / Portfolio Options */}
              <div className="space-y-2.5 rounded-2xl border border-border/80 bg-secondary/30 p-3.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Resume / Portfolio
                  </Label>
                  <span className="text-[10px] text-brand font-semibold">Choose any 1 option</span>
                </div>

                {resume ? (
                  <div className="flex items-center justify-between rounded-xl border border-brand/40 bg-white p-3 shadow-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="h-5 w-5 text-brand shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">{resume.name}</p>
                        <p className="text-[10px] text-muted-foreground">{(resume.size / (1024 * 1024)).toFixed(2)} MB • Ready</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setResume(null)}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Remove file"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor="intern-resume"
                      className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card px-4 py-2.5 text-xs font-semibold transition-colors hover:border-brand/40 hover:bg-brand-soft"
                    >
                      <Upload size={15} className="shrink-0 text-brand" />
                      <span>Upload Resume Document (PDF / DOCX, max 3 MB)</span>
                    </label>
                    <input
                      id="intern-resume"
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="hidden"
                      onChange={(event) => handleResume(event.target.files?.[0] ?? null)}
                      disabled={submitting}
                    />
                  </div>
                )}

                <div className="relative flex items-center py-0.5">
                  <div className="flex-grow border-t border-border/60"></div>
                  <span className="flex-shrink mx-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">or paste link</span>
                  <div className="flex-grow border-t border-border/60"></div>
                </div>

                <div className="relative">
                  <Link2 size={15} className="absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    id="intern-resumelink"
                    type="url"
                    placeholder="Google Drive, Notion, or LinkedIn link"
                    className="pl-9 text-xs bg-card"
                    value={resumeLink}
                    onChange={(e) => {
                      setResumeLink(e.target.value);
                      if (e.target.value.trim()) setSendInChat(false);
                    }}
                    disabled={submitting}
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={sendInChat}
                    onChange={(e) => {
                      setSendInChat(e.target.checked);
                      if (e.target.checked) {
                        setResume(null);
                        setResumeLink("");
                      }
                    }}
                    className="rounded border-border text-brand focus:ring-brand h-4 w-4"
                  />
                  <span className="text-xs text-muted-foreground">
                    I will attach my resume document directly inside WhatsApp chat
                  </span>
                </label>
              </div>

              {/* Live Preview Card */}
              {(form.name || form.college) && (
                <div className="rounded-xl border border-[#25D366]/30 bg-[#25D366]/5 p-3 text-xs">
                  <p className="font-bold text-[#128C7E] flex items-center gap-1 mb-1">
                    <MessageCircle size={13} className="fill-[#25D366] text-[#25D366]" />
                    WhatsApp message that will be sent:
                  </p>
                  <p className="font-mono text-[11px] text-muted-foreground leading-relaxed whitespace-pre-line">
                    {`🎓 INTERNSHIP APPLICATION\n👤 Name: ${form.name || "..."}\n📱 Phone: ${form.phone || "..."}\n🏛️ College: ${form.college || "..."}`}
                  </p>
                </div>
              )}

              <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                <Label htmlFor="intern-website">Website</Label>
                <Input
                  id="intern-website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(event) => setForm({ ...form, website: event.target.value })}
                />
              </div>

              {error && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}

              <Button
                type="submit"
                className="h-12 w-full rounded-full bg-[#25D366] hover:bg-[#1fb855] text-white font-bold text-sm shadow-md transition-all hover:shadow-lg gap-2"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-white" /> Sending application…
                  </>
                ) : (
                  <>
                    <MessageCircle size={18} className="fill-white stroke-white" />
                    Email application & open WhatsApp
                  </>
                )}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default InternshipSection;
