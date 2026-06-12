import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";

const SESSION_KEY = "pm_analytics_session";
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

function sessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID?.() ?? `a-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

// First-party engagement tracker: records page views, time-on-page, max scroll
// depth, and click targets, buffered and flushed in batches (and on unload via
// sendBeacon). Mounted once inside the Router. Renders its children untouched.
export function AnalyticsProvider({ children }) {
  const { pathname } = useLocation();
  const buffer = useRef([]);
  // enteredAt is set in the navigation effect (Date.now() must not run in render).
  const page = useRef({ path: pathname, enteredAt: 0, maxDepth: 0 });

  const push = (event) => {
    buffer.current.push(event);
    if (buffer.current.length >= 12) flush();
  };

  const flush = (useBeacon = false) => {
    if (buffer.current.length === 0) return;
    const payload = { session_id: sessionId(), events: buffer.current };
    buffer.current = [];

    if (useBeacon && navigator.sendBeacon) {
      navigator.sendBeacon(`${API_URL}/analytics`, new Blob([JSON.stringify(payload)], { type: "application/json" }));
    } else {
      api.post("/analytics", payload).catch(() => { /* analytics is best-effort */ });
    }
  };

  // Emit the leaving page's accumulated timing + scroll-depth, then a fresh
  // pageview for the new route. Runs on every navigation.
  useEffect(() => {
    const prev = page.current;
    const duration = Date.now() - prev.enteredAt;
    if (prev.path && prev.enteredAt && duration > 250) {
      push({ type: "timing", path: prev.path, meta: { duration } });
    }
    if (prev.maxDepth > 0) {
      push({ type: "scroll", path: prev.path, meta: { depth: prev.maxDepth } });
    }

    push({ type: "pageview", path: pathname, referrer: document.referrer || null });
    page.current = { path: pathname, enteredAt: Date.now(), maxDepth: 0 };
    flush();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Global listeners (scroll depth, clicks, unload) — attached once.
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const depth = total > 0 ? Math.min(100, Math.round(((window.scrollY) / total) * 100)) : 0;
      if (depth > page.current.maxDepth) page.current.maxDepth = depth;
    };

    const onClick = (e) => {
      const el = e.target.closest("[data-analytics], a, button");
      if (!el) return;
      const label = (el.getAttribute("data-analytics") || el.getAttribute("aria-label") || el.textContent || "")
        .trim().replace(/\s+/g, " ").slice(0, 80);
      if (label) push({ type: "click", path: page.current.path, meta: { label } });
    };

    const onHide = () => {
      const d = Date.now() - page.current.enteredAt;
      if (d > 250) buffer.current.push({ type: "timing", path: page.current.path, meta: { duration: d } });
      if (page.current.maxDepth > 0) buffer.current.push({ type: "scroll", path: page.current.path, meta: { depth: page.current.maxDepth } });
      flush(true);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("click", onClick, true);
    window.addEventListener("pagehide", onHide);

    const interval = setInterval(() => flush(), 15000);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("pagehide", onHide);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
}
