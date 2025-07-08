
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize theme state with a safer approach
  const [theme, setTheme] = useState<Theme>(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return "light";
    }
    
    try {
      // Check for saved theme in localStorage
      const savedTheme = localStorage.getItem("grow-up-theme") as Theme;
      if (savedTheme && (savedTheme === "dark" || savedTheme === "light")) {
        return savedTheme;
      }
      
      // Check for system preference
      const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      
      return systemPreference;
    } catch (error) {
      console.warn("Error accessing localStorage or matchMedia:", error);
      return "light";
    }
  });

  // Update theme class on document
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(theme);
      localStorage.setItem("grow-up-theme", theme);
    } catch (error) {
      console.warn("Error updating theme:", error);
    }
  }, [theme]);

  const contextValue = React.useMemo(() => ({
    theme,
    setTheme
  }), [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
