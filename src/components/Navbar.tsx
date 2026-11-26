import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/deplorix-logo.png";

const StartProjectDialog = lazy(() => import("./StartProjectDialog"));

interface NavLinkItem {
  label: string;
  href: string;
  sectionId?: string;
}

const navLinks: NavLinkItem[] = [
  { label: "About", href: "/about", sectionId: "solutions" },
  { label: "Services", href: "/services", sectionId: "products" },
  { label: "Work", href: "/products", sectionId: "pricing" },
  { label: "Process", href: "/#process", sectionId: "process" },
  { label: "Internships", href: "/internship", sectionId: "internship" },
  { label: "Learn", href: "/learn" },
  { label: "Explore", href: "/explore" },
];

interface SectionTarget {
  id: string;
  altIds?: string[];
  endpoint: string;
  navHref: string;
}

const SECTION_TARGETS: SectionTarget[] = [
  { id: "solutions", endpoint: "/about", navHref: "/about" },
  { id: "products", endpoint: "/services", navHref: "/services" },
  { id: "pricing", endpoint: "/products", navHref: "/products" },
  { id: "process", endpoint: "/#process", navHref: "/#process" },
  { id: "internship", altIds: ["resources"], endpoint: "/internship", navHref: "/internship" },
  { id: "contact", endpoint: "/contact", navHref: "/contact" },
];

const INDEX_PATHS = new Set([
  "/",
  "/about",
  "/services",
  "/products",
  "/contact",
  "/internship",
  "/internships",
]);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const isIndexPage = INDEX_PATHS.has(location.pathname) || location.pathname === "";

  const getInitialActiveHref = () => {
    if (location.pathname === "/learn" || location.pathname === "/explore") {
      return location.pathname;
    }
    if (location.pathname !== "/" && INDEX_PATHS.has(location.pathname)) {
      if (location.pathname.startsWith("/internship")) return "/internship";
      return location.pathname;
    }
    if (location.hash) {
      return `/${location.hash}`;
    }
    return "";
  };

  const [activeNavHref, setActiveNavHref] = useState<string>(getInitialActiveHref);
  const activeNavHrefRef = useRef<string>(activeNavHref);
  const lastEndpointRef = useRef<string>(location.pathname + location.hash);
  const isClickScrollingRef = useRef<boolean>(false);
  const clickScrollTimeoutRef = useRef<number | null>(null);

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 24,
    mass: 0.35,
  });

  // Keep ref in sync
  useEffect(() => {
    activeNavHrefRef.current = activeNavHref;
  }, [activeNavHref]);

  // Sync scroll navbar glass background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: automatically detect section & auto-update browser endpoint and navbar highlight
  useEffect(() => {
    if (!isIndexPage) return;

    let rafId: number | null = null;

    const findActiveSection = (): { endpoint: string; navHref: string } => {
      const scrollY = window.scrollY;

      // When near the top of the page, active is home ("/")
      if (scrollY < 180) {
        return { endpoint: "/", navHref: "" };
      }

      // When scrolled near the bottom of the page, activate Contact
      const isBottom =
        window.innerHeight + scrollY >=
        (document.documentElement.scrollHeight || document.body.scrollHeight) - 60;
      if (isBottom) {
        const contactTarget = SECTION_TARGETS.find((s) => s.id === "contact");
        if (contactTarget) return contactTarget;
      }

      const readingLine = scrollY + Math.min(window.innerHeight * 0.35, 260);
      const found: { target: SectionTarget; top: number }[] = [];

      for (const target of SECTION_TARGETS) {
        let el = document.getElementById(target.id);
        if (!el && target.altIds) {
          for (const altId of target.altIds) {
            el = document.getElementById(altId);
            if (el) break;
          }
        }
        if (!el) {
          el = document.querySelector<HTMLElement>(`[data-deferred-section="${target.id}"]`);
        }

        if (el) {
          const rect = el.getBoundingClientRect();
          const top = rect.top + scrollY;
          found.push({ target, top });
        }
      }

      found.sort((a, b) => a.top - b.top);

      let active = found[0];
      for (const item of found) {
        if (item.top <= readingLine) {
          active = item;
        } else {
          break;
        }
      }

      return active ? active.target : { endpoint: "/", navHref: "" };
    };

    const syncActiveSection = () => {
      if (isClickScrollingRef.current) return;

      const active = findActiveSection();
      if (!active) return;

      if (active.navHref !== activeNavHrefRef.current) {
        activeNavHrefRef.current = active.navHref;
        setActiveNavHref(active.navHref);
      }

      if (
        active.endpoint &&
        active.endpoint !== lastEndpointRef.current &&
        !window.location.pathname.includes("/apply")
      ) {
        lastEndpointRef.current = active.endpoint;
        window.history.replaceState(null, "", active.endpoint);
      }
    };

    const handleScroll = () => {
      if (isClickScrollingRef.current) return;
      if (rafId === null) {
        rafId = window.requestAnimationFrame(() => {
          rafId = null;
          syncActiveSection();
        });
      }
    };

    // Run initial sync after elements render
    const initialTimer = window.setTimeout(syncActiveSection, 120);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.clearTimeout(initialTimer);
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [isIndexPage]);

  // Mobile menu focus trap and inert background management
  useEffect(() => {
    const menuButton = menuButtonRef.current;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    window.dispatchEvent(new CustomEvent("deplorix:nav-open", { detail: mobileOpen }));

    const backgroundRegions = () =>
      [document.querySelector("main"), document.querySelector("footer")].filter(
        (region): region is Element => Boolean(region),
      );

    const syncBackgroundRegions = () => {
      backgroundRegions().forEach((region) => {
        if (mobileOpen) region.setAttribute("inert", "");
        else region.removeAttribute("inert");
      });
    };

    syncBackgroundRegions();
    const regionObserver = new MutationObserver(syncBackgroundRegions);
    if (mobileOpen) regionObserver.observe(document.body, { childList: true, subtree: true });

    const focusableElements = () =>
      Array.from(
        mobileMenuRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    const handleMenuKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const focusables = focusableElements();
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    let focusFrame = 0;
    if (mobileOpen) {
      window.addEventListener("keydown", handleMenuKeys);
      focusFrame = window.requestAnimationFrame(() => focusableElements()[0]?.focus());
    }

    return () => {
      document.body.style.overflow = "";
      regionObserver.disconnect();
      backgroundRegions().forEach((region) => region.removeAttribute("inert"));
      window.removeEventListener("keydown", handleMenuKeys);
      if (focusFrame) window.cancelAnimationFrame(focusFrame);
      if (mobileOpen) menuButton?.focus();
    };
  }, [mobileOpen]);

  const handleNavClick = (href: string, sectionId?: string) => {
    setMobileOpen(false);

    // If navigating to separate pages like /learn, /explore
    if (!sectionId && href.startsWith("/")) {
      navigate(href);
      return;
    }

    // If currently not on the Index page, use navigate
    if (!isIndexPage) {
      navigate(href);
      return;
    }

    // On Index page: smooth-scroll to target section
    const targetId =
      sectionId ||
      (href.startsWith("/#") ? href.slice(2) : href.startsWith("#") ? href.slice(1) : undefined);

    if (targetId) {
      const el =
        document.getElementById(targetId) ||
        document.querySelector<HTMLElement>(`[data-deferred-section="${targetId}"]`);

      if (el) {
        isClickScrollingRef.current = true;
        activeNavHrefRef.current = href;
        setActiveNavHref(href);
        lastEndpointRef.current = href;
        window.history.replaceState(null, "", href);

        el.scrollIntoView({ behavior: "smooth", block: "start" });

        if (clickScrollTimeoutRef.current) {
          window.clearTimeout(clickScrollTimeoutRef.current);
        }
        clickScrollTimeoutRef.current = window.setTimeout(() => {
          isClickScrollingRef.current = false;
        }, 850);
        return;
      }
    }

    navigate(href);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setMobileOpen(false);
    activeNavHrefRef.current = "";
    setActiveNavHref("");

    if (isIndexPage) {
      e.preventDefault();
      isClickScrollingRef.current = true;
      lastEndpointRef.current = "/";
      window.history.replaceState(null, "", "/");

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      document.documentElement.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      document.body.scrollTo({ top: 0, left: 0, behavior: "smooth" });

      if (clickScrollTimeoutRef.current) {
        window.clearTimeout(clickScrollTimeoutRef.current);
      }
      clickScrollTimeoutRef.current = window.setTimeout(() => {
        isClickScrollingRef.current = false;
      }, 700);
    } else {
      navigate("/");
    }
  };

  const isActive = (href: string) => {
    if (href === "/learn" || href === "/explore") {
      return location.pathname === href;
    }
    if (!isIndexPage) return false;
    return activeNavHref === href;
  };

  return (
    <>
      <motion.header
        initial={{ y: -90 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled || mobileOpen ? "nav-glass" : "bg-transparent"
        }`}
      >
        <nav
          className="site-container flex h-[72px] items-center justify-between gap-4 px-5 md:h-20 md:px-10"
          aria-label="Main navigation"
        >
          <Link
            to="/"
            onClick={handleLogoClick}
            className="group flex shrink-0 items-center gap-2.5 text-foreground"
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

          <div className="hidden items-center gap-1 rounded-full border border-border/70 bg-card/75 p-1.5 shadow-[var(--shadow-soft)] backdrop-blur-xl lg:flex">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => handleNavClick(link.href, link.sectionId)}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-secondary"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={() => handleNavClick("/contact", "contact")}
              className={`px-2 text-sm font-semibold transition-colors duration-200 ${
                isActive("/contact")
                  ? "text-foreground font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Contact
            </button>
            <Button variant="hero" className="h-11 px-5" onClick={() => setProjectOpen(true)}>
              Start a project <ArrowUpRight size={16} />
            </Button>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card text-foreground shadow-[var(--shadow-soft)] lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              ref={mobileMenuRef}
              id="mobile-navigation"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-full h-[calc(100dvh-72px)] overflow-y-auto border-t border-border/70 bg-background/95 backdrop-blur-2xl lg:hidden"
            >
              <div className="grid min-h-full content-start gap-1 px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-5">
                {navLinks.map((link, index) => {
                  const active = isActive(link.href);
                  return (
                    <motion.button
                      key={link.label}
                      type="button"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.035 }}
                      onClick={() => handleNavClick(link.href, link.sectionId)}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-left text-base font-semibold transition-colors ${
                        active ? "bg-secondary text-foreground" : "text-foreground/80"
                      }`}
                    >
                      {link.label}
                      <ArrowUpRight size={16} className="text-muted-foreground" />
                    </motion.button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => handleNavClick("/contact", "contact")}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-left text-base font-semibold transition-colors ${
                    isActive("/contact") ? "bg-secondary text-foreground" : "text-foreground/80"
                  }`}
                >
                  Contact <ArrowUpRight size={16} className="text-muted-foreground" />
                </button>
                <Button
                  variant="brand"
                  className="mt-3 h-12"
                  onClick={() => {
                    setMobileOpen(false);
                    setProjectOpen(true);
                  }}
                >
                  Start a project <ArrowUpRight size={16} />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-brand-gradient"
          style={{ scaleX: reduceMotion ? scrollYProgress : smoothScrollProgress }}
        />
      </motion.header>

      {projectOpen && (
        <Suspense fallback={null}>
          <StartProjectDialog open={projectOpen} onOpenChange={setProjectOpen} />
        </Suspense>
      )}
    </>
  );
};

export default Navbar;