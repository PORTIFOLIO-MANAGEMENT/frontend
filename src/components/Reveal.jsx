import { useReveal } from "../hooks/useReveal";

// Wraps children in a scroll-triggered fade/slide. `delay` (seconds) staggers
// grids; `as` picks the wrapper element. Styling comes from the .reveal classes
// in globalCss (and is neutralized under prefers-reduced-motion).
export default function Reveal({ children, delay = 0, as: Tag = "div", style, className = "", ...rest }) {
  const [ref, shown] = useReveal();

  return (
    <Tag
      ref={ref}
      className={`reveal${shown ? " in" : ""}${className ? ` ${className}` : ""}`}
      style={{ transitionDelay: delay ? `${delay}s` : undefined, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
