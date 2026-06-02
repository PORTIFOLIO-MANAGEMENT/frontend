import { FONTS } from "../data";

export const globalCss = `
  ${FONTS}
  html { scroll-behavior: smooth; }
  body { background: #080808; color: #fff; cursor: none; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #0a0a0a; }
  ::-webkit-scrollbar-thumb { background: #C8F53B; border-radius: 2px; }
  @keyframes fadeSlide { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideUp   { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes popIn     { from { transform:scale(0); } to { transform:scale(1); } }
  @keyframes pulse     { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
  @keyframes spin      { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
  @keyframes marquee   { from { transform:translateX(0); } to { transform:translateX(-50%); } }
  @keyframes float     { 0%,100% { transform:translateY(0) rotate(0deg); } 33% { transform:translateY(-20px) rotate(5deg); } 66% { transform:translateY(10px) rotate(-3deg); } }
  @keyframes glitch    { 0%,100% { clip-path:none; transform:none; } 20% { clip-path:inset(40% 0 60% 0); transform:translate(-4px); color:#FF4D6D; } 40% { clip-path:inset(20% 0 70% 0); transform:translate(4px); color:#7B61FF; } 60% { clip-path:none; transform:none; } }
  @keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
  .glitch-text:hover { animation: glitch 0.4s steps(2) infinite; }
  input, textarea, select { font-family: 'Space Mono', monospace; }
  /* ── Nav ── */
  .rsp-nav { padding:20px 48px; }
  .nav-links { display:flex; gap:40px; }
  .nav-actions { display:flex; align-items:center; gap:12px; }
  .hamburger { display:none; background:none; border:1px solid #2a2a2a; border-radius:8px; width:40px; height:40px; cursor:pointer; flex-direction:column; align-items:center; justify-content:center; gap:5px; padding:0; }
  .desktop-only { display:flex; }
  .hamburger span { display:block; width:18px; height:1.5px; background:#888; transition:all 0.3s; border-radius:2px; }
  /* ── Sidebar drawer ── */
  .sidebar-overlay { position:fixed; inset:0; z-index:98; background:transparent; pointer-events:none; transition:background 0.4s ease; }
  .sidebar-overlay.open { background:rgba(0,0,0,0.72); backdrop-filter:blur(6px); pointer-events:all; }
  .sidebar { position:fixed; top:0; right:0; width:min(82vw,340px); height:100svh; z-index:99; background:#080808; border-left:1px solid #1e1e1e; display:flex; flex-direction:column; transform:translateX(100%); transition:transform 0.45s cubic-bezier(0.16,1,0.3,1); will-change:transform; overflow:hidden; }
  .sidebar.open { transform:translateX(0); box-shadow:-24px 0 80px rgba(0,0,0,0.8); }
  .sidebar-header { display:flex; align-items:center; justify-content:space-between; padding:20px 24px; border-bottom:1px solid #111; flex-shrink:0; }
  .sidebar-logo { font-family:'Bebas Neue',sans-serif; font-size:20px; letter-spacing:4px; color:#fff; }
  .sidebar-close { width:36px; height:36px; background:none; border:1px solid #2a2a2a; border-radius:8px; cursor:pointer; color:#666; font-size:16px; display:flex; align-items:center; justify-content:center; transition:color 0.2s, border-color 0.2s; flex-shrink:0; }
  .sidebar-close:hover { color:#fff; border-color:#555; }
  .sidebar-nav { flex:1; overflow-y:auto; padding:4px 0; }
  .sidebar-link { display:flex; align-items:center; padding:20px 24px; color:#555; text-decoration:none; font-family:'Space Mono',monospace; font-size:12px; letter-spacing:3px; border-bottom:1px solid #0d0d0d; transition:color 0.25s, background 0.25s, padding-left 0.25s; position:relative; cursor:pointer; background:none; border-top:none; border-right:none; width:100%; text-align:left; box-sizing:border-box; }
  .sidebar-link::before { content:''; position:absolute; left:0; top:0; bottom:0; width:2px; background:#C8F53B; transform:scaleY(0); transition:transform 0.25s ease; transform-origin:bottom; }
  .sidebar-link:hover { color:#fff; background:#0d0d0d; padding-left:32px; }
  .sidebar-link:hover::before { transform:scaleY(1); }
  .sidebar-link-idx { font-size:9px; color:#222; letter-spacing:2px; margin-right:14px; min-width:22px; }
  .sidebar-link-arr { font-size:9px; color:#2a2a2a; transition:color 0.25s, transform 0.25s; margin-left:auto; }
  .sidebar-link:hover .sidebar-link-arr { color:#C8F53B; transform:translateX(5px); }
  .sidebar-footer { padding:20px 24px 36px; border-top:1px solid #111; flex-shrink:0; }
  .sidebar-footer-btns { display:flex; flex-direction:column; gap:10px; }
  .sidebar-footer-tagline { font-family:'Space Mono',monospace; font-size:9px; color:#222; letter-spacing:2px; margin-top:18px; text-align:center; }
  /* ── Sections ── */
  .section-pad { padding:120px 48px; }
  /* ── Hero deco / bottom ── */
  .hero-deco { display:block; }
  .hero-bottom { display:flex !important; }
  /* ── Grids ── */
  .services-grid { display:grid; grid-template-columns:1fr 1fr; gap:2px; }
  .about-grid { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; max-width:1400px; margin:0 auto; }
  /* ── Hero CTA row ── */
  .hero-cta-row { position:absolute; bottom:40px; left:50%; transform:translateX(-50%); display:flex; gap:12px; justify-content:center; z-index:3; animation:fadeSlide 1s 0.4s both; }
  /* ── Hero mobile identity ── */
  .hero-mobile-text { display:none; z-index:2; text-align:center; animation:fadeSlide 1s 0.15s both; padding:0 24px; }
  /* ── Work grid ── */
  .work-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:24px; }
  /* ── Site footer ── */
  .site-footer { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:24px; padding:48px; border-top:1px solid #111; background:#050505; }
  /* ── 1024px ── */
  @media (max-width:1024px) {
    .rsp-nav { padding:16px 32px; }
    .section-pad { padding:80px 32px; }
    .services-grid { grid-template-columns:1fr; }
    .about-grid { grid-template-columns:1fr; gap:48px; }
  }
  /* ── 768px ── */
  @media (max-width:768px) {
    .rsp-nav { padding:16px 20px; }
    .nav-links { display:none !important; }
    .hamburger { display:flex !important; }
    .desktop-only { display:none !important; }
    .section-pad { padding:60px 20px; }
    .hero-deco { display:none !important; }
    .hero-bottom { display:none !important; }
    .hero-mobile-text { display:block; }
    .hero-cta-row { position:relative; bottom:auto; left:50%; transform:translateX(-50%); flex-direction:row; align-items:center; width:calc(100% - 32px); max-width:400px; margin-top:16px; gap:8px; }
    .hero-cta-row button { flex:1; box-sizing:border-box; text-align:center; justify-content:center; padding: 12px 14px !important; }
    .work-grid { grid-template-columns:1fr; }
    .site-footer { flex-direction:column; align-items:flex-start; padding:36px 20px; }
  }
  /* ── 480px ── */
  @media (max-width:480px) {
    .rsp-nav { padding:12px 16px; }
    .section-pad { padding:48px 16px; }
    .hero-cta-row { width:calc(100% - 32px); }
    .sidebar { width:100vw; border-left:none; }
  }
  /* ── Mega Menu ── */
  .mega-overlay { position:fixed; inset:0; z-index:96; background:rgba(0,0,0,0.55); opacity:0; pointer-events:none; transition:opacity 0.35s ease; }
  .mega-overlay.open { opacity:1; pointer-events:all; }
  .mega-panel { position:fixed; top:64px; left:0; right:0; z-index:97; background:rgba(6,6,6,0.99); backdrop-filter:blur(28px); border-bottom:1px solid #1a1a1a; max-height:0; overflow:hidden; transition:max-height 0.48s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease; opacity:0; pointer-events:none; }
  .mega-panel.open { max-height:640px; opacity:1; pointer-events:all; }
  .mega-inner { padding:44px 48px; max-width:1400px; margin:0 auto; display:grid; }
  .mega-inner.srv-layout { grid-template-columns:200px 1fr 1fr 220px; }
  .mega-inner.wrk-layout { grid-template-columns:200px 1fr 1fr 1fr 220px; }
  .mega-side-label { padding-top:8px; }
  .mega-lbl { font-family:'Space Mono',monospace; font-size:10px; letter-spacing:4px; color:#2a2a2a; margin-bottom:16px; }
  .mega-side-text { font-family:'DM Serif Display',serif; font-style:italic; font-size:15px; color:#3a3a3a; line-height:1.7; max-width:160px; }
  .mega-col { border-left:1px solid #141414; }
  .mega-srv-item { padding:20px 28px; border-radius:8px; cursor:pointer; border:1px solid transparent; transition:background 0.2s, border-color 0.2s; }
  .mega-srv-item:hover { background:#0d0d0d; border-color:#C8F53B1a; }
  .mega-srv-item:hover .mega-srv-num { color:#C8F53B; }
  .mega-srv-num { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:3px; color:#222; margin-bottom:10px; transition:color 0.2s; }
  .mega-srv-head { display:flex; align-items:flex-start; gap:12px; }
  .mega-srv-icon { font-size:18px; color:#2a2a2a; margin-top:3px; flex-shrink:0; }
  .mega-srv-name { font-family:'Bebas Neue',sans-serif; font-size:21px; letter-spacing:2px; color:#fff; line-height:1; margin-bottom:7px; }
  .mega-srv-desc { font-family:'Space Mono',monospace; font-size:10px; color:#444; line-height:1.8; margin-bottom:9px; }
  .mega-srv-price { font-family:'Space Mono',monospace; font-size:10px; color:#C8F53B; letter-spacing:2px; }
  .mega-wrk-card { padding:20px 22px; border-radius:8px; cursor:pointer; border:1px solid transparent; margin:0 6px; transition:background 0.2s, border-color 0.2s; }
  .mega-wrk-card:hover { background:#0d0d0d; border-color:#1a1a1a; }
  .mega-wrk-num { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:3px; color:#222; margin-bottom:10px; }
  .mega-wrk-cat { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:3px; color:#444; margin-bottom:6px; }
  .mega-wrk-title { font-family:'Bebas Neue',sans-serif; font-size:28px; letter-spacing:2px; line-height:1; margin-bottom:8px; }
  .mega-wrk-desc { font-family:'Space Mono',monospace; font-size:10px; color:#444; line-height:1.7; }
  .mega-cta-col { border-left:1px solid #141414; padding:20px 28px; display:flex; flex-direction:column; justify-content:space-between; }
  .mega-cta-note { font-family:'Space Mono',monospace; font-size:11px; color:#444; line-height:1.8; margin-bottom:24px; }
  .mega-cta-btn { background:#C8F53B; color:#000; font-family:'Space Mono',monospace; font-size:11px; letter-spacing:2px; font-weight:700; padding:13px 16px; border-radius:8px; border:none; cursor:pointer; transition:background 0.2s; text-align:center; width:100%; }
  .mega-cta-btn:hover { background:#b8e032; }
  .nav-trigger { color:#888; cursor:pointer; background:none; border:none; padding:0; font-family:'Space Mono',monospace; font-size:11px; letter-spacing:2px; display:inline-flex; align-items:center; gap:5px; transition:color 0.2s; }
  .nav-trigger:hover, .nav-trigger.active { color:#C8F53B; }
  .nav-arrow { display:inline-block; font-size:7px; transition:transform 0.35s ease; opacity:0.5; }
  .nav-trigger.active .nav-arrow { transform:rotate(180deg); opacity:1; }
  @media (max-width:1100px) {
    .mega-inner.srv-layout { grid-template-columns:1fr 1fr; }
    .mega-inner.wrk-layout { grid-template-columns:1fr 1fr 1fr; }
    .mega-cta-col { display:none; }
    .mega-side-label { display:none; }
  }
  @media (max-width:768px) { .mega-panel { display:none; } .mega-overlay { display:none; } }
`;
