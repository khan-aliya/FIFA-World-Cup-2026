// src/context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("fifa-theme");
    return saved === "vivid" ? "vivid" : "electric";
  });

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "vivid") {
      root.setAttribute("data-theme", "vivid");
    } else {
      root.removeAttribute("data-theme");
    }

    localStorage.setItem("fifa-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "electric" ? "vivid" : "electric"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used inside a ThemeProvider");
  }
  return context;
}
