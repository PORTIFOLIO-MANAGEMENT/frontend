import { useState, useEffect, useRef } from "react";

export default function Counter({ target, suffix = "", dur = 2000 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const start = Date.now();
      const tick = () => {
        const prog = Math.min((Date.now() - start) / dur, 1);
        setVal(Math.floor((1 - Math.pow(1 - prog, 3)) * target));
        if (prog < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.disconnect();
    }, { threshold: 0.5 });

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, dur]);

  return <span ref={ref}>{val}{suffix}</span>;
}
