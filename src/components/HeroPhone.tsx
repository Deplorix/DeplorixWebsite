import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowRight, BatteryMedium, Signal, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { divisions } from "@/data/divisions";
import { caseStudyHref, projectsForDivision } from "@/data/projects";
import { trackEvent } from "@/lib/analytics";

const formatLocalTime = () =>
  new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());

type Props = {
  /** Pause the auto-rotation (used on the explore page where the user drives it). */
  autoRotate?: boolean;
  /** Controlled active division id. */
  activeId?: string;
  onActiveChange?: (id: string) => void;
  source?: string;
  interactiveTilt?: boolean;
  ambientFloat?: boolean;
  showStats?: boolean;
};

/**
 * Floating 3D phone mockup. Cycles through the service divisions, showing what
 * each division does plus real work we've shipped, each linking to its case study.
 */
const HeroPhone = ({
  autoRotate = true,
  activeId,
  onActiveChange,
  source = "hero",
  interactiveTilt = true,
  ambientFloat = true,
  showStats = true,
}: Props) => {
  const [internalIndex, setInternalIndex] = useState(0);
  const [localTime, setLocalTime] = useState(formatLocalTime);
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerBounds = useRef<DOMRect | null>(null);
  const pointerFrame = useRef(0);
  const pendingPointer = useRef({ x: 0, y: 0 });
  const reduceMotion = useReducedMotion();
  const isInView = useInView(containerRef, { amount: 0.15 });
  const ambientMotion = ambientFloat && isInView && !reduceMotion;

  const controlledIndex = activeId ? divisions.findIndex((d) => d.id === activeId) : -1;
  const index = controlledIndex >= 0 ? controlledIndex : internalIndex;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [18, -6]), { stiffness: 120, damping: 18 });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [-10, 12]), { stiffness: 120, damping: 18 });

  useEffect(() => {
    if (!autoRotate || !ambientMotion) return;
    const t = setInterval(() => setInternalIndex((i) => (i + 1) % divisions.length), 4600);
    return () => clearInterval(t);
  }, [ambientMotion, autoRotate]);

  useEffect(() => {
    let minuteTimer = 0;

    const updateTime = () => {
      setLocalTime(formatLocalTime());
      const now = new Date();
      const delayUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds() + 25;
      minuteTimer = window.setTimeout(updateTime, delayUntilNextMinute);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        window.clearTimeout(minuteTimer);
        updateTime();
      }
    };

    updateTime();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearTimeout(minuteTimer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const active = divisions[index];
  const work = projectsForDivision(active.id);

  const select = (i: number) => {
    setInternalIndex(i);
    onActiveChange?.(divisions[i].id);
    trackEvent("hero_phone_division_click", { division: divisions[i].id, source });
  };

  const handleMove = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el || !interactiveTilt || reduceMotion) return;
    pointerBounds.current ??= el.getBoundingClientRect();
    pendingPointer.current = { x: e.clientX, y: e.clientY };
    if (pointerFrame.current) return;
    pointerFrame.current = window.requestAnimationFrame(() => {
      pointerFrame.current = 0;
      const bounds = pointerBounds.current;
      if (!bounds) return;
      mx.set((pendingPointer.current.x - bounds.left) / bounds.width - 0.5);
      my.set((pendingPointer.current.y - bounds.top) / bounds.height - 0.5);
    });
  };

  const reset = () => {
    pointerBounds.current = null;
    if (pointerFrame.current) window.cancelAnimationFrame(pointerFrame.current);
    pointerFrame.current = 0;
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={interactiveTilt ? handleMove : undefined}
      onMouseLeave={interactiveTilt ? reset : undefined}
      className="relative flex items-center justify-center"
      style={{ perspective: 1200 }}
    >
      {/* Ambient glow */}
      <div className="absolute w-64 h-64 md:w-72 md:h-72 rounded-full bg-secondary blur-3xl opacity-70" aria-hidden />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 60, rotateY: 24 }}
        animate={{ opacity: 1, y: ambientMotion ? [0, -14, 0] : 0, rotateY: 0 }}
        transition={{
          opacity: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
          rotateY: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
          y: { duration: ambientMotion ? 6 : 0, repeat: ambientMotion ? Infinity : 0, ease: "easeInOut" },
        }}
        style={{ rotateX, rotateY, transformStyle: showStats ? "preserve-3d" : "flat" }}
        className="relative"
      >
        {/* Phone body */}
        <div
          className="relative w-[240px] h-[500px] sm:w-[268px] sm:h-[556px] rounded-[3rem] p-[10px] bg-foreground"
          style={{ boxShadow: "0 45px 80px -30px hsl(0 0% 0% / 0.55), 0 0 0 1px hsl(0 0% 0% / 0.25)" }}
        >
          {/* Side buttons */}
          <span className="absolute -left-[3px] top-28 h-10 w-[3px] rounded-l bg-foreground/70" />
          <span className="absolute -left-[3px] top-44 h-14 w-[3px] rounded-l bg-foreground/70" />
          <span className="absolute -right-[3px] top-40 h-16 w-[3px] rounded-r bg-foreground/70" />

          {/* Screen */}
          <div className="relative h-full w-full rounded-[2.5rem] bg-background overflow-hidden">
            {/* Notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 h-6 w-24 rounded-full bg-foreground z-20" />

            {/* Status bar */}
            <div className="relative z-10 flex items-center justify-between px-6 pt-4 text-[11px] font-semibold text-foreground">
              <time dateTime={new Date().toISOString()} aria-label={`Current local time ${localTime}`}>
                {localTime}
              </time>
              <span className="flex items-center gap-1 text-foreground/70" aria-label="Strong connection and battery">
                <Signal size={10} strokeWidth={2.4} />
                <Wifi size={10} strokeWidth={2.4} />
                <BatteryMedium size={12} strokeWidth={2.4} />
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="px-4 pt-5 pb-16 h-full overflow-hidden"
              >
                <div className={`w-11 h-11 rounded-2xl ${active.iconBg} flex items-center justify-center`}>
                  <active.icon size={20} className="text-foreground" />
                </div>
                <p className="mt-3 text-lg font-bold tracking-tight text-foreground leading-tight">{active.name}</p>
                <p className="mt-1 text-[12px] text-muted-foreground leading-snug">{active.tagline}</p>

                <div className="mt-3 space-y-1.5">
                  {active.subServices.slice(0, 2).map((s) => (
                    <div key={s.title} className="rounded-xl bg-secondary px-3 py-1.5">
                      <p className="text-[12px] font-semibold text-foreground leading-tight">{s.title}</p>
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Our work
                </p>
                <div className="mt-2 space-y-2">
                  {work.length > 0
                    ? work.slice(0, 2).map((p) => (
                        <Link
                          key={p.slug}
                          to={caseStudyHref(active.id)}
                          onClick={() =>
                            trackEvent("hero_phone_work_click", { division: active.id, project: p.slug, source })
                          }
                          className="flex items-center gap-2 rounded-xl border border-border/60 p-1.5 hover:border-foreground/40 transition-colors"
                        >
                          <img
                            src={p.image}
                            alt={`${p.title} screenshot`}
                            loading="lazy"
                            className="h-10 w-14 rounded-lg object-cover"
                          />
                          <span className="min-w-0">
                            <span className="block text-[12px] font-semibold text-foreground leading-tight truncate">
                              {p.title}
                            </span>
                            <span className="block text-[10px] text-muted-foreground leading-tight truncate">
                              {p.category}
                            </span>
                          </span>
                        </Link>
                      ))
                    : active.work.slice(0, 2).map((w) => (
                        <Link
                          key={w.title}
                          to={caseStudyHref(active.id)}
                          className="block rounded-xl border border-border/60 px-3 py-2 hover:border-foreground/40 transition-colors"
                        >
                          <p className="text-[12px] font-semibold text-foreground leading-tight">{w.title}</p>
                          <p className="text-[10px] text-muted-foreground leading-tight">{w.type}</p>
                        </Link>
                      ))}
                </div>

                <Button
                  asChild
                  variant="hero"
                  size="sm"
                  className="group/phone-cta relative z-40 mt-3 w-full !translate-y-0 overflow-hidden border border-transparent text-[12px] hover:!translate-y-0 hover:!border-brand/40 hover:!bg-brand hover:!text-brand-foreground hover:!shadow-[0_0_0_3px_hsl(var(--brand)/0.14),0_14px_30px_-15px_hsl(var(--brand)/0.95)] focus-visible:!border-brand/40 focus-visible:!bg-brand focus-visible:!text-brand-foreground active:scale-[0.985]"
                >
                  <Link
                    to={caseStudyHref(active.id)}
                    data-scene-interactive
                    onClick={() => trackEvent("hero_phone_cta_click", { division: active.id, source })}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-18deg] bg-white/20 opacity-0 transition-[left,opacity] duration-500 group-hover/phone-cta:left-[115%] group-hover/phone-cta:opacity-100 group-focus-visible/phone-cta:left-[115%] group-focus-visible/phone-cta:opacity-100"
                    />
                    <span className="relative">See case study</span>
                    <ArrowRight
                      size={13}
                      className="relative translate-x-0 transition-transform duration-200 group-hover/phone-cta:translate-x-1 group-focus-visible/phone-cta:translate-x-1"
                    />
                  </Link>
                </Button>
              </motion.div>
            </AnimatePresence>

            {/* Tab bar */}
            <div
              className="absolute bottom-0 inset-x-0 flex justify-center border-t border-border/60 bg-background/90 backdrop-blur"
              role="group"
              aria-label="Choose a DeploriX division"
            >
              {divisions.map((d, i) => (
                <Button
                  key={d.id}
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label={d.name}
                  aria-pressed={i === index}
                  onClick={() => select(i)}
                  className={`h-11 min-h-11 w-11 min-w-11 rounded-full p-0 transition-all duration-300 after:h-1.5 after:rounded-full ${
                    i === index ? "after:w-6 after:bg-foreground" : "after:w-1.5 after:bg-border"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Floating stat chips */}
        {showStats && (
          <>
            <motion.div
              animate={{ y: ambientMotion ? [0, -10, 0] : 0 }}
              transition={{ duration: ambientMotion ? 5 : 0, repeat: ambientMotion ? Infinity : 0, ease: "easeInOut", delay: ambientMotion ? 0.6 : 0 }}
              style={{ transform: "translateZ(60px)" }}
              className="absolute -left-10 top-24 hidden lg:block glass-card px-4 py-3"
            >
              <p className="text-xl font-bold tracking-tight text-foreground">5</p>
              <p className="text-[11px] text-muted-foreground">Divisions</p>
            </motion.div>
            <motion.div
              animate={{ y: ambientMotion ? [0, 12, 0] : 0 }}
              transition={{ duration: ambientMotion ? 5.5 : 0, repeat: ambientMotion ? Infinity : 0, ease: "easeInOut", delay: ambientMotion ? 1.2 : 0 }}
              style={{ transform: "translateZ(60px)" }}
              className="absolute -right-10 bottom-28 hidden lg:block glass-card px-4 py-3"
            >
              <p className="text-xl font-bold tracking-tight text-foreground">40+</p>
              <p className="text-[11px] text-muted-foreground">Products shipped</p>
            </motion.div>
          </>
        )}
      </motion.div>

    </div>
  );
};

export default HeroPhone;
