import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import MusicPlayer from "./MusicPlayer/MusicPlayer";
import ThemeToggle from "./ThemeToggle/ThemeToggle"; // Import the new ThemeToggle component
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
    <div className={`layout ${theme}`} data-theme={theme}>
      <Navbar onWidthChange={handleNavbarWidthChange} />
      <div className="content" style={{ marginLeft: navbarWidth }}>
        <header className="header">
          {/* Use the new creative ThemeToggle component */}
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </header>
        <main>
          <Outlet />
        </main>
      </div>
      <MusicPlayer />
    </div>
  );
}

export default Layout;
