import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, MessageCircle } from "lucide-react";
import logo from "@/assets/deplorix-logo.png";
import Seo from "@/components/Seo";
import InternshipEnrollmentDialog from "@/components/InternshipEnrollmentDialog";

const DISPLAY_PHONE = "+91 99458 31090";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    name: "DeploriX Industry-Ready Engineering Internship",
    description:
      "Hands-on engineering internship working in live product squads across full-stack web, backend, data science, cloud, and UI/UX.",
    provider: {
      "@type": "Organization",
      name: "DeploriX Technologies",
      url: "https://deplorixtechnologies.site/",
    },
    timeToComplete: "P3M",
    educationalProgramMode: "hybrid",
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://deplorixtechnologies.site/" },
      { "@type": "ListItem", position: 2, name: "Internship", item: "https://deplorixtechnologies.site/internship" },
      { "@type": "ListItem", position: 3, name: "Apply", item: "https://deplorixtechnologies.site/internship/apply" },
    ],
  },
];

const InternshipApply = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Seo
        title="Apply for Internship – DeploriX Technologies | Student & Early-Career Enrollment"
        description="Apply for the DeploriX 2026 Cohort Internship. Submit your academic background, preferred tech track, and portfolio to join our product squads."
        canonical="https://deplorixtechnologies.site/internship/apply"
        keywords="Apply Internship Bangalore, Deplorix Internship Application, Software Internship Enrollment, Student Tech Internship Apply, Bangalore Tech Internship"
        jsonLd={jsonLd}
      />

      {/* Top Navigation Bar */}
      <header className="border-b border-border/70 bg-card/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="site-container flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="group flex items-center gap-2.5 text-foreground"
            aria-label="DeploriX Technologies home"
          >
            <span className="grid h-10 w-10 place-items-center rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)] transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
              <img
                src={logo}
                alt="DeploriX Technologies logo"
                className="h-8 w-8 rounded-full object-contain"
                width={32}
                height={32}
              />
            </span>
            <span className="font-display text-[15px] font-extrabold leading-[1.05] tracking-[-0.03em]">
              DeploriX
              <span className="block font-sans text-[11px] font-semibold tracking-[0.12em] text-muted-foreground">
                TECHNOLOGIES
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-5">
            <a
              href="https://wa.me/919945831090"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#1fbd5c] hover:underline"
            >
              <MessageCircle size={15} /> Admissions Help
            </a>

            <Link
              to="/#internship"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs sm:text-sm font-semibold text-foreground shadow-[var(--shadow-soft)] transition-colors hover:bg-secondary"
            >
              <ArrowLeft size={14} /> Back to Internships
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="site-container px-3 sm:px-6 py-8 sm:py-12 flex-1">
        <div className="max-w-4xl mx-auto mb-6 sm:mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-soft px-3.5 py-1 text-xs font-bold text-accent-foreground mb-3">
              <Sparkles size={13} className="text-brand" /> 2026 Cohort Application
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Internship Enrollment Application
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
              Complete your profile and choose your track to join our live product squads. Applications are reviewed within 48 hours.
            </p>
          </div>
          <p className="text-xs text-muted-foreground shrink-0">
            Helpline: <strong className="text-foreground">{DISPLAY_PHONE}</strong>
          </p>
        </div>

        <InternshipEnrollmentDialog embedded={true} />
      </main>

      {/* Page Footer */}
      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground bg-surface-elevated mt-12">
        <div className="site-container px-4">
          <p>&copy; {new Date().getFullYear()} DeploriX Technologies. Bangalore, India. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default InternshipApply;
