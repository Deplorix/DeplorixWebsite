import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  minHeight?: string;
  mobileMinHeight?: string;
  rootMargin?: string;
  sectionId?: string;
};

const DeferredSection = ({
  children,
  minHeight = "720px",
  mobileMinHeight,
  rootMargin = "700px 0px",
  sectionId,
}: Props) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const placeholderStyle = {
    minHeight,
    "--deferred-mobile-height": mobileMinHeight ?? minHeight,
  } as React.CSSProperties;
  const suspenseFallbackStyle = {
    minHeight,
    "--deferred-mobile-height": mobileMinHeight ?? minHeight,
  } as React.CSSProperties;

  useEffect(() => {
    if (ready) return;
    const anchor = anchorRef.current;
    if (!anchor || !("IntersectionObserver" in window)) {
      setReady(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setReady(true);
        observer.disconnect();
      },
      { rootMargin },
    );

    observer.observe(anchor);
    return () => observer.disconnect();
  }, [ready, rootMargin]);

  return (
    <div
      ref={anchorRef}
      id={!ready ? sectionId : undefined}
      data-deferred-section={sectionId}
      className={ready ? "deferred-section" : "deferred-section deferred-section-placeholder"}
      style={ready ? undefined : placeholderStyle}
    >
      {ready ? <Suspense fallback={<div className="deferred-section-placeholder" style={suspenseFallbackStyle} aria-hidden="true" />}>{children}</Suspense> : null}
    </div>
  );
};

export default DeferredSection;
