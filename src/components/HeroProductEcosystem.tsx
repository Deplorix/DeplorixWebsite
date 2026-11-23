import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { Activity, ArrowUpRight, Check, Pause, Play, Rocket, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import HeroPhone from "./HeroPhone";
import { divisions } from "@/data/divisions";
import { projectsForDivision } from "@/data/projects";

const finePointerQuery = "(hover: hover) and (pointer: fine)";
const ease = [0.22, 1, 0.36, 1] as const;
const deliveryProgress = [86, 78, 92, 81, 88] as const;

const nodePositions: CSSProperties[] = [
  { left: "3%", top: "23%" },
  { left: "18%", top: "3%" },
  { right: "2%", top: "13%" },
  { left: "6%", bottom: "13%" },
  { right: "1%", bottom: "19%" },
];

const HeroProductEcosystem = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const pointerBounds = useRef<DOMRect | null>(null);
  const pointerFrame = useRef(0);
  const pendingPointer = useRef({ x: 0, y: 0 });
  const manualPauseTimer = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();
  const isInView = useInView(rootRef, { amount: 0.12 });

  const [activeIndex, setActiveIndex] = useState(0);
  const [hasFinePointer, setHasFinePointer] = useState(
    () => typeof window !== "undefined" && window.matchMedia(finePointerQuery).matches,
  );
  const [pageVisible, setPageVisible] = useState(
    () => typeof document === "undefined" || document.visibilityState === "visible",
  );
  const [hasFocus, setHasFocus] = useState(false);
  const [sceneHovered, setSceneHovered] = useState(false);
  const [manualPause, setManualPause] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const mappedRotateY = useTransform(pointerX, [-0.5, 0.5], [-5.5, 5.5]);
  const mappedRotateX = useTransform(pointerY, [-0.5, 0.5], [3.8, -3.8]);
  const rotateX = useSpring(mappedRotateX, { stiffness: 145, damping: 23, mass: 0.7 });
  const rotateY = useSpring(mappedRotateY, { stiffness: 145, damping: 23, mass: 0.7 });
  const pointerLift = useSpring(useTransform(pointerY, [-0.5, 0.5], [-5, 5]), {
    stiffness: 150,
    damping: 24,
    mass: 0.65,
  });

  const motionEnabled = isInView && pageVisible && !reduceMotion;
  const automaticMotion = motionEnabled && hasFinePointer && !userPaused;
  const autoCycle = motionEnabled && !userPaused && !hasFocus && !manualPause;
  const active = divisions[activeIndex];
  const featuredProject = projectsForDivision(active.id)[0];
  const progress = deliveryProgress[activeIndex];

  useEffect(() => {
    const media = window.matchMedia(finePointerQuery);
    const updatePointerMode = () => setHasFinePointer(media.matches);
    const updateVisibility = () => setPageVisible(document.visibilityState === "visible");

    updatePointerMode();
    document.addEventListener("visibilitychange", updateVisibility);
    media.addEventListener("change", updatePointerMode);

    return () => {
      document.removeEventListener("visibilitychange", updateVisibility);
      media.removeEventListener("change", updatePointerMode);
    };
  }, []);

  useEffect(() => {
    if (!autoCycle) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % divisions.length);
    }, 4800);
    return () => window.clearInterval(timer);
  }, [autoCycle]);

  useEffect(() => {
    if (motionEnabled && hasFinePointer) return;
    pointerBounds.current = null;
    if (pointerFrame.current) window.cancelAnimationFrame(pointerFrame.current);
    pointerFrame.current = 0;
    pointerX.set(0);
    pointerY.set(0);
  }, [hasFinePointer, motionEnabled, pointerX, pointerY]);

  useEffect(
    () => () => {
      if (pointerFrame.current) window.cancelAnimationFrame(pointerFrame.current);
      if (manualPauseTimer.current) window.clearTimeout(manualPauseTimer.current);
    },
    [],
  );

  const pauseAfterSelection = () => {
    setManualPause(true);
    if (manualPauseTimer.current) window.clearTimeout(manualPauseTimer.current);
    manualPauseTimer.current = window.setTimeout(() => setManualPause(false), 10000);
  };

  const selectDivision = (index: number) => {
    setActiveIndex(index);
    pauseAfterSelection();
  };

  const selectDivisionById = (id: string) => {
    const index = divisions.findIndex((division) => division.id === id);
    if (index >= 0) selectDivision(index);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!motionEnabled || !hasFinePointer) return;
    const target = event.target as HTMLElement;
    if (target.closest("[data-scene-interactive]")) {
      pointerBounds.current = null;
      pointerX.set(0);
      pointerY.set(0);
      return;
    }
    pointerBounds.current ??= event.currentTarget.getBoundingClientRect();
    pendingPointer.current = { x: event.clientX, y: event.clientY };
    if (pointerFrame.current) return;

    pointerFrame.current = window.requestAnimationFrame(() => {
      pointerFrame.current = 0;
      const bounds = pointerBounds.current;
      if (!bounds) return;
      pointerX.set((pendingPointer.current.x - bounds.left) / bounds.width - 0.5);
      pointerY.set((pendingPointer.current.y - bounds.top) / bounds.height - 0.5);
    });
  };

  const resetPointer = () => {
    pointerBounds.current = null;
    if (pointerFrame.current) window.cancelAnimationFrame(pointerFrame.current);
    pointerFrame.current = 0;
    pointerX.set(0);
    pointerY.set(0);
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget as HTMLElement | null;
    if (
      !nextTarget ||
      !event.currentTarget.contains(nextTarget) ||
      nextTarget.closest("[data-showcase-toggle]")
    ) {
      setHasFocus(false);
    }
  };

  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    setHasFocus(!target.closest("[data-showcase-toggle]"));
  };

  return (
    <div
      ref={rootRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setSceneHovered(true)}
      onPointerLeave={() => {
        setSceneHovered(false);
        resetPointer();
      }}
      onPointerCancel={resetPointer}
      onFocusCapture={handleFocus}
      onBlurCapture={handleBlur}
      className="relative mx-auto h-[570px] w-full max-w-[660px] sm:h-[630px] lg:mx-0 lg:h-[590px]"
      style={{ perspective: "1650px" }}
      aria-label="Interactive DeploriX product ecosystem"
    >
      <div className="absolute left-1/2 top-1/2 h-[67%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/20 blur-[72px]" aria-hidden />
      <div className="absolute left-1/2 top-1/2 h-[82%] w-[83%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand/15" aria-hidden />
      <div className="absolute left-1/2 top-1/2 h-[66%] w-[67%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-brand/20" aria-hidden />
      <div className="absolute left-1/2 top-1/2 h-[49%] w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand/10" aria-hidden />

      <motion.div
        animate={automaticMotion ? { y: [0, -7, 0], rotateZ: [-0.3, 0.3, -0.3] } : { y: 0, rotateZ: 0 }}
        transition={automaticMotion ? { duration: 9, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
        className="absolute inset-0 will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div
          animate={
            automaticMotion && !hasFinePointer
              ? { rotateX: [-1.3, 1, -1.3], rotateY: [-2.4, 2.4, -2.4] }
              : { rotateX: 0, rotateY: 0 }
          }
          transition={
            automaticMotion && !hasFinePointer
              ? { duration: 10, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.2 }
          }
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.div
            className="absolute inset-0 will-change-transform"
            animate={sceneHovered && motionEnabled ? { scale: 1.018 } : { scale: 1 }}
            transition={{ duration: 0.32, ease }}
            style={{ rotateX, rotateY, y: pointerLift, transformStyle: "preserve-3d" }}
          >
            <div
              className="absolute inset-[15%_9%_14%_8%] hidden rounded-[2.5rem] border border-brand/15 bg-brand/5 sm:block"
              style={{ transform: "translate3d(-14px, 18px, -145px) rotateZ(4deg)" }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-[11%_13%_17%_4%] hidden rounded-[2.5rem] border border-white/55 bg-white/25 sm:block"
              style={{ transform: "translate3d(10px, 8px, -105px) rotateZ(-2deg)" }}
              aria-hidden="true"
            />

            <div
              className="absolute -left-[2%] top-[15%] hidden w-[72%] sm:block lg:-left-[5%]"
              style={{ transform: "translateZ(-55px) rotateY(8deg) rotateZ(-3deg)" }}
              aria-hidden="true"
            >
              <motion.div
                animate={automaticMotion ? { y: [0, 5, 0] } : { y: 0 }}
                transition={automaticMotion ? { duration: 7.5, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
                className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d0b13] shadow-[0_38px_90px_-42px_hsl(var(--foreground)/0.75)]"
              >
                <div className="flex h-11 items-center justify-between border-b border-white/[0.08] px-4">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#ff6b6b]" />
                    <span className="h-2 w-2 rounded-full bg-[#ffd166]" />
                    <span className="h-2 w-2 rounded-full bg-[#06d6a0]" />
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[8px] font-bold uppercase tracking-[0.16em] text-white/45">
                    product.deplorix.live
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    initial={reduceMotion ? false : { opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: reduceMotion ? 0 : 0.4, ease }}
                    className="grid h-[255px] grid-cols-[1.08fr_.92fr] gap-3 p-4"
                  >
                    <div className="flex min-w-0 flex-col rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4">
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand/15 text-brand">
                          <active.icon size={17} />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[9px] font-extrabold uppercase tracking-[0.16em] text-brand">
                            Live division
                          </span>
                          <span className="block truncate text-sm font-extrabold text-white">{active.name}</span>
                        </span>
                      </div>

                      <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.15em] text-white/35">
                        Delivery system
                      </p>
                      <div className="mt-2 space-y-2">
                        {active.subServices.slice(0, 3).map((service, index) => (
                          <div key={service.title} className="rounded-xl border border-white/[0.07] bg-[#17141f] px-3 py-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="truncate text-[10px] font-bold text-white/85">{service.title}</span>
                              <Check size={11} className={index < 2 ? "text-emerald-300" : "text-brand"} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-brand/20 via-white/[0.04] to-peach/10 p-3">
                      {featuredProject ? (
                        <>
                          <img
                            src={featuredProject.image}
                            alt={`${featuredProject.title} project showcase`}
                            width={360}
                            height={260}
                            className="absolute inset-0 h-full w-full object-cover opacity-70"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b13] via-[#0d0b13]/30 to-transparent" />
                          <div className="absolute inset-x-3 bottom-3">
                            <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-brand">Featured build</span>
                            <p className="mt-1 text-sm font-extrabold text-white">{featuredProject.title}</p>
                            <p className="text-[9px] text-white/50">{featuredProject.category}</p>
                          </div>
                        </>
                      ) : (
                        <div className="relative flex h-full flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-white/40">Launch pulse</span>
                            <Activity size={14} className="text-brand" />
                          </div>
                          <div className="flex h-24 items-end gap-1.5">
                            {[35, 52, 44, 68, 61, 82, 96].map((height) => (
                              <span
                                key={height}
                                className="flex-1 rounded-t-full bg-gradient-to-t from-brand/30 to-brand"
                                style={{ height: `${height}%` }}
                              />
                            ))}
                          </div>
                          <div>
                            <p className="text-lg font-extrabold text-white">{progress}%</p>
                            <p className="text-[9px] text-white/45">Delivery momentum</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>

            <div
              className="absolute left-1/2 top-[10%] z-20 -translate-x-1/2 sm:top-[4%] lg:left-auto lg:right-[2%] lg:translate-x-0"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div style={{ transform: "translateZ(105px)" }}>
                <HeroPhone
                  autoRotate={false}
                  activeId={active.id}
                  onActiveChange={selectDivisionById}
                  source="hero"
                  interactiveTilt={false}
                  ambientFloat={false}
                  showStats={false}
                />
              </div>
            </div>

            <div
              className="absolute left-[1%] top-[1%] z-30 sm:left-[8%] sm:top-[20%] lg:left-[3%]"
              style={{ transform: "translateZ(145px)" }}
            >
              <motion.div
                animate={automaticMotion ? { y: [0, -9, 0] } : { y: 0 }}
                transition={automaticMotion ? { duration: 5.5, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
                className="flex items-center gap-2 rounded-2xl border border-white/80 bg-card/90 p-2.5 pr-3.5 shadow-[var(--shadow-card)] backdrop-blur-xl"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand">
                  <active.icon size={17} />
                </span>
                <span>
                  <span className="block max-w-[110px] truncate text-[10px] font-extrabold text-foreground sm:max-w-[150px] sm:text-xs">
                    {active.short}
                  </span>
                  <span className="block text-[8px] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:text-[9px]">
                    Active division
                  </span>
                </span>
              </motion.div>
            </div>

            <div
              className="absolute bottom-[12%] right-[1%] z-30 sm:right-[8%] lg:right-0"
              style={{ transform: "translateZ(160px)" }}
            >
              <motion.div
                animate={automaticMotion ? { y: [0, 9, 0] } : { y: 0 }}
                transition={automaticMotion ? { duration: 6, delay: 0.5, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
                className="min-w-[118px] rounded-2xl border border-white/15 bg-foreground px-3.5 py-3 text-white shadow-[0_22px_50px_-25px_hsl(var(--foreground)/0.8)] sm:min-w-[145px] sm:px-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-white/45">Live sprint</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,.9)]" />
                </div>
                <p className="mt-1 font-display text-lg font-extrabold sm:text-xl">{progress}%</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <motion.span
                    className="block h-full origin-left rounded-full bg-brand"
                    animate={{ scaleX: progress / 100 }}
                    transition={{ duration: reduceMotion ? 0 : 0.5, ease }}
                  />
                </div>
              </motion.div>
            </div>

            <div
              className="absolute bottom-[7%] left-[17%] hidden lg:block"
              style={{ transform: "translateZ(125px)" }}
            >
              <motion.div
                animate={automaticMotion ? { y: [0, -6, 0] } : { y: 0 }}
                transition={automaticMotion ? { duration: 6.4, delay: 0.8, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
                className="flex items-center gap-2.5 rounded-2xl border border-white/80 bg-card/90 px-3.5 py-3 shadow-[var(--shadow-card)] backdrop-blur-xl"
              >
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-gradient text-white">
                  <Rocket size={15} />
                </span>
                <span>
                  <span className="block text-[10px] font-extrabold text-foreground">Launch ready</span>
                  <span className="block text-[9px] text-muted-foreground">Weekly delivery rhythm</span>
                </span>
              </motion.div>
            </div>

            {divisions.map((division, index) => (
              <div
                key={division.id}
                className="absolute z-40 hidden lg:block"
                style={{ ...nodePositions[index], transform: "translateZ(175px)" }}
              >
                <motion.button
                  type="button"
                  onClick={() => selectDivision(index)}
                  aria-label={`Show ${division.name}`}
                  aria-pressed={index === activeIndex}
                  animate={automaticMotion ? { y: [0, index % 2 ? 5 : -5, 0] } : { y: 0 }}
                  transition={
                    automaticMotion
                      ? { duration: 5.4 + index * 0.25, repeat: Infinity, ease: "easeInOut" }
                      : { duration: 0 }
                  }
                  className={`grid h-11 w-11 place-items-center rounded-2xl border shadow-[var(--shadow-soft)] transition-colors ${
                    index === activeIndex
                      ? "border-brand/45 bg-brand text-white shadow-[var(--shadow-brand)]"
                      : "border-white/80 bg-card/90 text-muted-foreground backdrop-blur-xl hover:border-brand/30 hover:text-brand"
                  }`}
                >
                  <division.icon size={17} />
                </motion.button>
              </div>
            ))}

            <div
              className="absolute bottom-[5%] left-1/2 h-[8%] w-[55%] -translate-x-1/2 rounded-[50%] bg-foreground/20 blur-2xl"
              style={{ transform: "translate3d(-50%, 18px, -120px) rotateX(74deg)" }}
              aria-hidden="true"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      <button
        type="button"
        onClick={() => setUserPaused((paused) => !paused)}
        data-showcase-toggle
        aria-pressed={userPaused}
        className={`absolute right-2 top-2 z-50 grid h-11 w-11 place-items-center rounded-full border shadow-[var(--shadow-soft)] backdrop-blur-xl transition-[color,background-color,border-color,transform] hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
          userPaused
            ? "border-brand/40 bg-brand text-white"
            : "border-white/80 bg-card/85 text-muted-foreground hover:text-brand"
        }`}
        aria-label={userPaused ? "Resume automatic showcase" : "Pause automatic showcase"}
        title={userPaused ? "Resume automatic showcase" : "Pause automatic showcase"}
      >
        {userPaused ? <Play size={15} /> : <Pause size={15} />}
      </button>

      <div className="pointer-events-none absolute left-[8%] top-[9%] hidden items-center gap-1.5 rounded-full border border-brand/15 bg-white/50 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.14em] text-brand sm:flex" aria-hidden="true">
        <Sparkles size={11} /> Interactive product universe
      </div>

      <Link
        to={`/work/${active.id}`}
        className="absolute bottom-2 left-1/2 z-50 hidden -translate-x-1/2 items-center gap-1.5 rounded-full border border-border/70 bg-card/80 px-4 py-2 text-[10px] font-bold text-foreground shadow-[var(--shadow-soft)] backdrop-blur transition-colors hover:border-brand/30 hover:text-brand sm:inline-flex lg:hidden"
      >
        Explore {active.short} <ArrowUpRight size={12} />
      </Link>
    </div>
  );
};

export default HeroProductEcosystem;
