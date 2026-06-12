// Static design assets shared by the chrome. All domain data (projects,
// services, team, bookings) now comes from the API — see src/services/*.
export const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Serif+Display:ital@0;1&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');`;

const _noise = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="200" height="200" filter="url(#noise)" opacity="0.4"/></svg>`;
export const noiseUrl = `url("data:image/svg+xml,${encodeURIComponent(_noise)}")`;
