import { useEffect, useRef, useState } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Reveal-on-scroll. Returns [ref, visible]; `visible` flips true once the
 * element scrolls into view and stays true (one-shot). With reduced-motion the
 * element starts visible so nothing is hidden.
 *
 * Usage: const [ref, shown] = useReveal();
 *        <div ref={ref} className={"reveal" + (shown ? " in" : "")}>…</div>
 */
export function useReveal({ threshold = 0.15, rootMargin = "0px 0px -10% 0px" } = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(() => prefersReducedMotion());

  useEffect(() => {
    if (visible) return; // already shown (reduced-motion) — skip observing
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible, threshold, rootMargin]);

  return [ref, visible];
}
