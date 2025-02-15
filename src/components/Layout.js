import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import MusicPlayer from "./MusicPlayer/MusicPlayer";
import Quotes from "./Quotes/Quotes";
import "./Layout.css";

function Layout() {
  const [theme, setTheme] = useState("light"); // "light" or "dark"
  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <div className={`layout ${theme}`}>
      <Navbar />
      <div className="content">
        <header className="header">
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
      <Quotes />
      <MusicPlayer />
    </div>
  );
}

export default Layout;
