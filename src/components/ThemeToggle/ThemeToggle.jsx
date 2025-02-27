import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import "./ThemeToggle.css";

function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button className="theme-toggle-button" onClick={toggleTheme}>
      <AnimatePresence mode="wait" initial={false}>
        {theme === "light" ? (
          <motion.div
            key="to-dark"
            className="theme-toggle-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Moon className="theme-toggle-icon" />
            <span className="theme-toggle-text">Dark Mode</span>
          </motion.div>
        ) : (
          <motion.div
            key="to-light"
            className="theme-toggle-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Sun className="theme-toggle-icon" />
            <span className="theme-toggle-text">Light Mode</span>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

export default ThemeToggle;
