import React from "react";
import { Moon, Sun } from "lucide-react";
import "./ThemeToggle.css";

function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button className="theme-toggle-button" onClick={toggleTheme}>
      {theme === "light" ? (
        <>
          <Moon className="theme-toggle-icon" />
          <span className="theme-toggle-text">Dark Mode</span>
        </>
      ) : (
        <>
          <Sun className="theme-toggle-icon" />
          <span className="theme-toggle-text">Light Mode</span>
        </>
      )}
    </button>
  );
}

export default ThemeToggle;
