import { createContext, useCallback, useContext, useEffect, useState } from "react";

// Site-wide light/dark theme. The actual palette lives in CSS variables
// (globalCss.js); this context just flips <html data-theme> and remembers the
// choice. Default is dark to match the studio's original look.
const ThemeContext = createContext({ theme: "dark", toggle: () => {} });

const STORAGE_KEY = "pm_theme";

function initialTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === "light" || saved === "dark" ? saved : "dark";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  return useContext(ThemeContext);
}
