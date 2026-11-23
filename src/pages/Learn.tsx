import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CirclePlay,
  Clock3,
  Code2,
  GraduationCap,
  Laptop,
  Megaphone,
  Palette,
  Rocket,
  Sparkles,
  Target,
  Trophy,
  Users,
  UserRoundSearch,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { openInquiry } from "@/lib/inquiry";

const tracks = [
  {
    Icon: Code2,
    eyebrow: "Software development",
    title: "Python Full Stack",
    description: "Build complete web applications with Python, modern interfaces, APIs and databases.",
    skills: ["Python foundations", "Frontend development", "APIs & databases", "Live project"],
    level: "Beginner friendly",
  },
  {
    Icon: Code2,
    eyebrow: "Enterprise development",
    title: "Java Full Stack",
    description: "Learn Java application development from core programming through production-ready web systems.",
    skills: ["Core Java", "Web interfaces", "Backend services", "Database integration"],
    level: "Career focused",
  },
  {
    Icon: Palette,
    eyebrow: "Product design",
    title: "UI/UX Design",
    description: "Turn user problems into thoughtful, polished digital experiences and portfolio-ready case studies.",
    skills: ["User research", "Wireframing", "Interface design", "Figma projects"],
    level: "Creative track",
  },
  {
    Icon: UserRoundSearch,
    eyebrow: "People operations",
    title: "Human Resources",
    description: "Develop practical HR knowledge across recruitment, employee experience and workplace operations.",
    skills: ["Recruitment", "HR operations", "Employee engagement", "Workplace skills"],
    level: "Industry ready",
  },
  {
    Icon: Megaphone,
    eyebrow: "Growth & marketing",
    title: "Digital Marketing",
    description: "Plan, create and measure campaigns across content, social media, search and digital channels.",
    skills: ["Content strategy", "Social media", "SEO basics", "Campaign analytics"],
    level: "Practical track",
  },
] as const;

const advantages = [
  { Icon: BookOpenCheck, title: "Industry-relevant courses", text: "Five in-demand pathways designed around the skills modern teams actually expect." },
  { Icon: Laptop, title: "Hands-on learning", text: "Practical assignments, guided builds and step-by-step mentorship—not passive watching." },
  { Icon: Users, title: "Expert guidance", text: "Learn with experienced instructors and industry professionals who support your growth." },
  { Icon: BriefcaseBusiness, title: "Career preparation", text: "Strengthen your portfolio, résumé, LinkedIn presence and interview confidence." },
  { Icon: Trophy, title: "Certificates & recognition", text: "Earn course-completion recognition that helps communicate your progress and achievement." },
  { Icon: Rocket, title: "Campus & internship opportunities", text: "Connect learning to internships, campus ambassador opportunities and real responsibility." },
] as const;

const learningSteps = [
  { number: "01", title: "Learn the concept", text: "Short mentor-led sessions turn complex ideas into clear, usable foundations." },
  { number: "02", title: "Practise with feedback", text: "Apply each skill immediately through guided exercises and live reviews." },
  { number: "03", title: "Build something real", text: "Complete a portfolio-ready project or role simulation that proves your ability." },
  { number: "04", title: "Prepare for the next step", text: "Get review support for your portfolio, interview, assessment or workplace transition." },
] as const;

const outcomes = [
  { Icon: GraduationCap, value: "5", label: "career-focused courses" },
  { Icon: Laptop, value: "1", label: "student-first platform" },
  { Icon: Target, value: "1", label: "goal: your future" },
  { Icon: BadgeCheck, value: "100%", label: "learning by doing" },
] as const;

const faqs = [
  {
    question: "Who is DeploriX Learn for?",
    answer: "It is designed for students, fresh graduates, career switchers and early professionals who want structured, practical learning with direct mentor feedback.",
  },
  {
    question: "Are the programs online or offline?",
    answer: "Programs are designed to work online with live sessions and guided reviews. Bangalore-based hybrid sessions may be offered for selected cohorts.",
  },
  {
    question: "Will I build a real project?",
    answer: "Yes. Every pathway includes meaningful practical work—such as a live build, portfolio case study, campaign or realistic role-based assignment.",
  },
  {
    question: "Do you guarantee placement?",
    answer: "No responsible training provider can guarantee a job. We focus on job readiness, portfolio quality, interview preparation and relevant opportunities where available.",
  },
] as const;

const Learn = () => {
  const reduceMotion = useReducedMotion();
  const inquire = (track?: string) =>
    openInquiry("training", {
      service: track ? `DeploriX Learn — ${track}` : "DeploriX Learn programs",
      message: track
        ? `I'm interested in the ${track} learning pathway. Please share the next cohort, schedule and enrolment details.`
        : "I'm interested in DeploriX Learn. Please help me choose the right practical learning pathway.",
    });

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="DeploriX Learn – Practical, Mentor-Led Career Training & Internships"
        description="Build job-ready skills with DeploriX Learn through five industry-relevant courses, hands-on projects, expert guidance and career preparation."
        canonical="https://deplorixtechnologies.site/learn"
        keywords="DeploriX Learn, Python Full Stack Course, Java Full Stack Training, UI UX Design Course, Digital Marketing Training Bangalore, Software Internship, Student Tech Programs"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: "DeploriX Learn",
            provider: { "@type": "Organization", name: "DeploriX Technologies" },
            areaServed: "Worldwide",
            description: "A student-first learning platform offering five industry-relevant courses, practical projects, expert guidance and career preparation.",
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://deplorixtechnologies.site/" },
              { "@type": "ListItem", position: 2, name: "Learn", item: "https://deplorixtechnologies.site/learn" },
            ],
          },
        ]}
      />
      <Navbar />

      <main id="main-content">
        <section className="relative isolate overflow-hidden px-5 pb-20 pt-32 sm:px-6 md:px-10 md:pb-24 md:pt-40 lg:px-16 lg:pb-28">
          <div className="absolute inset-0 -z-20 bg-glow" />
          <div className="bg-grid absolute inset-0 -z-10 opacity-70" aria-hidden />
          <div className="site-container grid items-center gap-14 lg:grid-cols-[1.02fr_.98fr] lg:gap-20">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="pill-label"><Sparkles size={13} /> DeploriX Learn</span>
              <h1 className="mt-7 max-w-4xl font-display text-[clamp(2.75rem,7vw,5.75rem)] font-extrabold leading-[0.96] tracking-[-0.06em] text-foreground">
                Learn by building. <span className="text-gradient">Grow by doing.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
                A student-first learning platform built to help you develop real skills, work on meaningful projects and prepare confidently for what comes next.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button variant="brand" size="lg" className="h-13 min-h-12 px-7" onClick={() => inquire()}>
                  Find your learning path <ArrowRight size={16} />
                </Button>
                <Button asChild variant="hero-outline" size="lg" className="h-13 min-h-12 px-7">
                  <a href="#tracks"><CirclePlay size={16} /> Explore programs</a>
                </Button>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-muted-foreground sm:text-sm">
                {["Learn", "Build", "Practise", "Grow"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-2"><Check size={15} className="text-brand" /> {item}</span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto w-full max-w-[620px]"
            >
              <div className="absolute -inset-5 rounded-[3rem] bg-brand/10 blur-3xl" aria-hidden />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-foreground p-5 text-white shadow-[var(--shadow-elevated)] sm:p-7 md:rounded-[2.75rem] md:p-9">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_5%,hsl(var(--brand)/0.38),transparent_36%)]" aria-hidden />
                <div className="relative flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Your learning cockpit</p>
                    <p className="mt-1 font-display text-xl font-extrabold">Your route from learning to doing</p>
                  </div>
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-[#bda8ff]"><BookOpenCheck size={20} /></span>
                </div>
                <div className="relative mt-6 grid gap-3">
                  {[
                    ["Learn", "Understand the essentials", "100%"],
                    ["Build", "Create with mentor feedback", "72%"],
                    ["Grow", "Prepare for your next step", "Next"],
                  ].map(([title, text, status], index) => (
                    <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 gap-3">
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-brand/20 text-xs font-extrabold text-[#c8b6ff]">0{index + 1}</span>
                          <div><p className="font-display text-base font-bold">{title}</p><p className="mt-1 text-xs leading-5 text-white/55">{text}</p></div>
                        </div>
                        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-[#c8b6ff]">{status}</span>
                      </div>
                      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#c7a4ff]" style={{ width: index === 0 ? "100%" : index === 1 ? "72%" : "18%" }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="relative mt-5 flex items-center justify-between rounded-2xl bg-brand-gradient p-4 shadow-[var(--shadow-brand)]">
                  <div><p className="text-[10px] font-bold uppercase tracking-widest text-white/65">The DeploriX rhythm</p><p className="mt-1 font-display text-lg font-extrabold">Learn · Build · Practise · Grow</p></div>
                  <Clock3 size={23} />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="border-y border-border/70 bg-card px-5 py-8 sm:px-6 md:px-10 lg:px-16">
          <div className="site-container grid grid-cols-2 gap-4 md:grid-cols-4">
            {outcomes.map(({ Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background px-4 py-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand"><Icon size={18} /></span>
                <div><p className="font-display text-lg font-extrabold text-foreground">{value}</p><p className="text-[11px] leading-4 text-muted-foreground">{label}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section id="tracks" className="section-padding bg-surface-elevated scroll-mt-24">
          <div className="site-container">
            <div className="grid gap-7 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
              <div><span className="pill-label">Five in-demand courses</span><h2 className="section-heading mt-6">Choose the future you want to build.</h2></div>
              <p className="section-copy max-w-xl lg:justify-self-end">Each course combines clear foundations, guided practice and project work—so you leave with skills you can demonstrate, not only notes you have completed.</p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              {tracks.map((track, index) => (
                <article key={track.title} className={`group relative flex h-full flex-col overflow-hidden rounded-[2rem] border p-6 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)] ${index === 2 ? "border-brand/30 bg-brand-soft/35" : "border-border/70 bg-card"}`}>
                  <span className="absolute right-5 top-5 font-display text-4xl font-black text-brand/10">0{index + 1}</span>
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-foreground text-white"><track.Icon size={21} /></span>
                  </div>
                  <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.15em] text-brand">{track.eyebrow}</p>
                  <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-foreground">{track.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{track.description}</p>
                  <ul className="mt-6 grid gap-2.5">
                    {track.skills.map((skill) => <li key={skill} className="flex items-center gap-2 text-xs font-semibold text-foreground/75"><Check size={14} className="text-brand" /> {skill}</li>)}
                  </ul>
                  <div className="mt-auto flex items-center justify-between border-t border-border/70 pt-6 mt-7">
                    <span className="inline-flex items-center gap-2 text-[11px] font-bold text-muted-foreground"><Clock3 size={14} /> {track.level}</span>
                    <button type="button" onClick={() => inquire(track.title)} className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-bold text-foreground transition-colors hover:text-brand" aria-label={`Enquire about ${track.title}`}>
                      Enquire <ArrowRight size={14} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="site-container">
            <div className="mx-auto max-w-3xl text-center">
              <span className="pill-label">More than just learning</span>
              <h2 className="section-heading mt-6">Everything around the course matters too.</h2>
              <p className="section-copy mx-auto mt-6">DeploriX Learn is a complete student-development experience—from the first practical lesson to career preparation and opportunities beyond the classroom.</p>
            </div>
            <div className="relative mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <div className="pointer-events-none absolute inset-x-[12%] top-1/2 hidden border-t border-dashed border-brand/20 lg:block" aria-hidden />
              {advantages.map(({ Icon, title, text }, index) => (
                <article key={title} className="group relative rounded-[2rem] border border-border/70 bg-card p-6 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[var(--shadow-card)] sm:p-7">
                  <span className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-background bg-brand shadow-[0_4px_12px_hsl(var(--brand)/0.35)]" aria-hidden />
                  <div className="flex items-start justify-between gap-5">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105"><Icon size={21} /></span>
                    <span className="font-display text-sm font-extrabold text-brand/45">0{index + 1}</span>
                  </div>
                  <h3 className="mt-6 font-display text-xl font-extrabold tracking-tight text-foreground">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-surface-elevated">
          <div className="site-container grid gap-12 xl:grid-cols-[.86fr_1.14fr] xl:items-start xl:gap-20">
            <div className="xl:sticky xl:top-28">
              <span className="pill-label">How learning works</span>
              <h2 className="section-heading mt-6">A system that turns practice into confidence.</h2>
              <p className="section-copy mt-6 max-w-xl">The learning loop is intentionally simple: understand, practise, prove and prepare. Mentors stay close enough to unblock you without doing the work for you.</p>
              <div className="mt-8 rounded-[2rem] bg-foreground p-6 text-white shadow-[var(--shadow-card)] sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/45">What you leave with</p>
                <ul className="mt-5 grid gap-4">
                  {["A completed applied project or role simulation", "Specific mentor feedback on your gaps", "A practical assessment of your readiness", "Clear next steps for interviews or deeper learning"].map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-white/75"><BadgeCheck size={18} className="mt-0.5 shrink-0 text-[#bba5ff]" /> {item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="grid gap-4">
              {learningSteps.map((step, index) => (
                <motion.div key={step.number} initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : index * 0.06 }} className="grid gap-4 rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)] sm:grid-cols-[auto_1fr] sm:p-7">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft font-display text-sm font-extrabold text-brand">{step.number}</span>
                  <div><h3 className="font-display text-xl font-extrabold text-foreground">{step.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-surface-elevated">
          <div className="site-container grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-20">
            <div><span className="pill-label">Common questions</span><h2 className="section-heading mt-6">What to know before you begin.</h2><p className="section-copy mt-6 max-w-lg">If you still have a question, tell us your goal and we’ll help you choose honestly.</p></div>
            <div className="grid gap-3">
              {faqs.map((faq) => (
                <details key={faq.question} className="group rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-display text-base font-extrabold text-foreground [&::-webkit-details-marker]:hidden">
                    {faq.question}<ChevronDown size={18} className="shrink-0 text-brand transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-4 border-t border-border/70 pt-4 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-6 md:px-10 md:py-24 lg:px-16">
          <div className="site-container relative isolate overflow-hidden rounded-[2rem] bg-foreground px-6 py-12 text-center text-white shadow-[var(--shadow-elevated)] sm:px-10 md:rounded-[2.75rem] md:py-16">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_100%,hsl(var(--brand)/0.4),transparent_34%),radial-gradient(circle_at_92%_5%,hsl(var(--peach)/0.14),transparent_30%)]" />
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white/65"><Sparkles size={13} /> Your next step</span>
            <h2 className="mx-auto mt-6 max-w-3xl font-display text-3xl font-extrabold leading-tight tracking-[-0.045em] sm:text-4xl md:text-5xl">Start with the outcome you want—not the course everyone else is taking.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-white/65 md:text-base md:leading-7">Share your current level and goal. We’ll recommend the most useful pathway, even if that means starting smaller.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="brand" size="lg" className="h-12 px-7" onClick={() => inquire()}>Talk to a learning advisor <ArrowRight size={16} /></Button>
              <Button asChild size="lg" className="h-12 rounded-full border border-white/15 bg-white/[0.08] px-7 text-white hover:bg-white/[0.14]">
                <Link to="/work/training">View training division</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Learn;
