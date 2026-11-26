import { ArrowRight, BookOpen, CheckCircle2, Code2, Compass, Presentation, Sparkles } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { Button } from "@/components/ui/button";
import { openInquiry } from "@/lib/inquiry";

const supportLevels = [
  {
    name: "Guided",
    ideal: "For students who have started and need expert direction",
    timeline: "2 mentorship sessions",
    features: ["Topic and scope review", "Architecture guidance", "Code and documentation review"],
  },
  {
    name: "Build Together",
    ideal: "For teams that want structured weekly support",
    timeline: "Weekly milestones",
    features: ["Development guidance", "Documentation support", "Deployment and presentation prep"],
  },
  {
    name: "End-to-End",
    ideal: "For ambitious projects needing complete project support",
    timeline: "From proposal to viva",
    features: ["Advanced stack guidance", "Research and testing support", "Mock viva and post-submission help"],
  },
];

const outcomes = [
  { icon: Compass, label: "A clear, feasible scope" },
  { icon: Code2, label: "Original, explainable code" },
  { icon: BookOpen, label: "University-ready documentation" },
  { icon: Presentation, label: "A confident final presentation" },
];

const FYPSection = () => {
  const startPlan = (plan: string) => {
    openInquiry("projects", {
      service: `${plan} final-year project support`,
      message: `I'm interested in the ${plan} support level for my final-year project. Please help me understand the right scope and next steps.`,
    });
  };

  return (
    <section id="fyp" className="section-padding scroll-mt-24 bg-background md:scroll-mt-28">
      <div className="site-container">
        <AnimatedSection className="grid gap-8 xl:grid-cols-[.88fr_1.12fr] xl:gap-12">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-fyp-gradient p-5 text-white shadow-[var(--shadow-brand)] sm:rounded-[2rem] sm:p-9 md:rounded-[2.5rem] lg:p-11">
            <div className="absolute inset-0 bg-grid-accent opacity-45" aria-hidden />
            <div className="absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-white/20 blur-3xl" aria-hidden />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-white/80">
                <Sparkles size={13} /> For students
              </span>
              <h2 className="mt-5 sm:mt-7 font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.05] tracking-[-0.04em] text-white">
                Build A Project You Can Actually Defend.
              </h2>
              <p className="mt-4 sm:mt-5 max-w-lg text-sm sm:text-base leading-6 sm:leading-7 text-white/80">
                Thoughtful mentorship for final-year teams—from choosing the right problem to explaining every decision during your viva.
              </p>

              <div className="mt-8 grid gap-2.5 sm:mt-10 sm:grid-cols-2">
                {outcomes.map((outcome) => (
                  <div key={outcome.label} className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/15"><outcome.icon size={17} /></span>
                    <p className="text-sm font-semibold text-white/90">{outcome.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="min-w-0 rounded-[1.75rem] border border-border/70 bg-card p-4 shadow-[var(--shadow-soft)] sm:rounded-[2rem] sm:p-7 md:rounded-[2.5rem] md:p-10">
            <div className="flex items-start justify-between gap-3">
              <p className="min-w-0 text-[11px] font-bold uppercase leading-4 tracking-[0.12em] text-muted-foreground sm:text-xs sm:tracking-[0.13em]">
                Choose your level of support
              </p>
              <span className="shrink-0 whitespace-nowrap pt-0.5 text-[10px] font-semibold text-brand sm:hidden">
                3 options
              </span>
            </div>

            <div className="mt-5 flex flex-col gap-4 sm:gap-5 lg:mt-6 lg:block lg:gap-0 lg:p-0">
              {supportLevels.map((level, index) => {
                const isFeatured = index === 1;
                return (
                  <div
                    key={level.name}
                    className={`group grid w-full gap-4 rounded-2xl border p-4 sm:p-6 lg:w-auto lg:min-w-0 lg:grid-cols-[1fr_auto] lg:items-center lg:rounded-none lg:border-x-0 lg:border-b-0 lg:border-t lg:bg-transparent lg:px-0 lg:py-7 lg:first:border-t-0 lg:first:pt-0 lg:last:pb-0 ${isFeatured
                        ? "border-brand/40 bg-brand-soft/25 ring-1 ring-brand/20 lg:ring-0 lg:bg-transparent lg:border-border/70"
                        : "border-border/70 bg-secondary/35"
                      }`}
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-display text-xs font-bold text-brand">0{index + 1}</span>
                        <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                          {level.name}
                        </h3>
                        {isFeatured && (
                          <span className="rounded-full bg-brand px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-foreground shadow-xs">
                            Recommended
                          </span>
                        )}
                      </div>

                      <p className="mt-1.5 max-w-xl text-xs sm:text-sm leading-relaxed text-muted-foreground">
                        {level.ideal}
                      </p>

                      <div className="mt-2.5">
                        <span className="inline-flex rounded-full bg-brand-soft px-3 py-1 text-[11px] sm:text-xs font-bold text-accent-foreground">
                          {level.timeline}
                        </span>
                      </div>

                      <ul className="mt-3.5 grid gap-2 sm:grid-cols-2">
                        {level.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                            <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-brand" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 lg:pt-0">
                      <Button
                        variant={isFeatured ? "brand" : "hero-outline"}
                        className="min-h-11 w-full touch-manipulation font-semibold active:scale-[0.985] sm:w-auto"
                        onClick={() => startPlan(level.name)}
                        aria-label={`Discuss ${level.name} support option`}
                      >
                        Discuss this option <ArrowRight size={15} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FYPSection;
