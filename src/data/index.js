export const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Serif+Display:ital@0;1&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');`;

export const projects = [
  {
    id: 1,
    title: "NEXUS PROTOCOL",
    category: "3D · INTERACTIVE",
    year: "2024",
    tags: ["Blender", "Three.js", "React"],
    description: "A real-time 3D configurator for a futuristic product line. Built from polygon to pixel.",
    color: "#C8F53B",
    gradient: "linear-gradient(135deg, #0a0a0a 0%, #1a2a0a 100%)",
    accent: "#C8F53B",
    stats: { views: "12.4K", likes: "847", hires: "3" },
  },
  {
    id: 2,
    title: "PHANTOM UI",
    category: "FULL-STACK · WEB",
    year: "2024",
    tags: ["React", "Laravel", "PostgreSQL"],
    description: "SaaS dashboard with sub-100ms response times. Data visualization redefined.",
    color: "#FF4D6D",
    gradient: "linear-gradient(135deg, #0a0a0a 0%, #2a0a12 100%)",
    accent: "#FF4D6D",
    stats: { views: "9.1K", likes: "623", hires: "5" },
  },
  {
    id: 3,
    title: "VOID MOTION",
    category: "3D · ANIMATION",
    year: "2025",
    tags: ["Blender", "GSAP", "WebGL"],
    description: "Abstract identity animation for an architectural firm. 240 hours of render time.",
    color: "#7B61FF",
    gradient: "linear-gradient(135deg, #0a0a0a 0%, #12082a 100%)",
    accent: "#7B61FF",
    stats: { views: "21.7K", likes: "1.2K", hires: "2" },
  },
];

export const services = [
  { id: 1, name: "Interactive Web Apps",    icon: "◈", desc: "Full-stack systems that perform under load and look unlike anything you've seen.",              price: "From $2,400" },
  { id: 2, name: "3D & Motion Design",      icon: "◉", desc: "Blender assets, product visualization, looping brand animations, WebGL experiences.",           price: "From $1,200" },
  { id: 3, name: "Brand Identity Systems",  icon: "◎", desc: "Visual language, typography, motion — built to own a market position.",                          price: "From $1,800" },
  { id: 4, name: "Creative Direction",      icon: "◐", desc: "We audit your current product and tell you exactly why it's not converting.",                    price: "From $600"   },
];

export const TICKER_ITEMS = [
  "INTERACTIVE EXPERIENCES",
  "3D DESIGN",
  "FULL-STACK DEVELOPMENT",
  "BRAND IDENTITY",
  "MOTION GRAPHICS",
  "CREATIVE DIRECTION",
];

export const bookingFields = [
  { key: "service",     label: "WHAT SERVICE DO YOU NEED?",  placeholder: "e.g. Full-stack web app, 3D animation, brand identity…", type: "text"     },
  { key: "budget",      label: "WHAT'S YOUR BUDGET RANGE?",  placeholder: "e.g. $2,000 – $5,000",                                   type: "text"     },
  { key: "timeline",    label: "WHAT'S YOUR TIMELINE?",      placeholder: "e.g. 6 weeks, ASAP, flexible",                           type: "text"     },
  { key: "description", label: "DESCRIBE YOUR PROJECT",      placeholder: "Tell us everything. The more detail, the better.",        type: "textarea" },
];

const _noise = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="200" height="200" filter="url(#noise)" opacity="0.4"/></svg>`;
export const noiseUrl = `url("data:image/svg+xml,${encodeURIComponent(_noise)}")`;
