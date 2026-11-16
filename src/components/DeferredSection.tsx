import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  minHeight?: string;
  rootMargin?: string;
};

const DeferredSection = ({ children, minHeight = "720px", rootMargin = "700px 0px" }: Props) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

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
    <div ref={anchorRef} style={ready ? undefined : { minHeight }}>
      {ready ? <Suspense fallback={<div style={{ minHeight }} aria-hidden="true" />}>{children}</Suspense> : null}
    </div>
  );
};

export default DeferredSection;
