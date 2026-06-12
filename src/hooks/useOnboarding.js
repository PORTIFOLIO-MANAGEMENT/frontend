import { useCallback, useEffect, useState } from "react";

const KEY = "pm_onboarded";

/**
 * Drives the first-login onboarding tour. Auto-starts once (when `enabled` and
 * the user hasn't been onboarded), and exposes `start` to replay on demand and
 * `finish` to dismiss + remember.
 */
export function useOnboarding(enabled) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!enabled || localStorage.getItem(KEY)) return;
    // Let the landing page paint before spotlighting elements.
    const t = setTimeout(() => setActive(true), 900);
    return () => clearTimeout(t);
  }, [enabled]);

  const start = useCallback(() => setActive(true), []);
  const finish = useCallback(() => {
    localStorage.setItem(KEY, "1");
    setActive(false);
  }, []);

  return { active, start, finish };
}
