import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import MusicPlayer from "./MusicPlayer/MusicPlayer";
import "./Layout.css";

function Layout() {
  const [theme, setTheme] = useState("light");
  const [navbarWidth, setNavbarWidth] = useState(60);

  const handleNavbarWidthChange = (newWidth) => {
    setNavbarWidth(newWidth);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className={`layout ${theme}`}>
      <Navbar onWidthChange={handleNavbarWidthChange} />
      <div className="content" style={{ marginLeft: navbarWidth }}>
        <header className="header">
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
      {/* Removed the Quotes component */}
      <MusicPlayer />
    </div>
  );
}

export default Layout;
