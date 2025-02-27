import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
// Import modern Lucide React icons
import { Clock, FileText, CheckSquare, Info } from "lucide-react";
import "./Navbar.css";

function Navbar({ onWidthChange }) {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const currentWidth = isHovered ? 200 : 60;

  useEffect(() => {
    if (typeof onWidthChange === "function") {
      onWidthChange(currentWidth);
    }
  }, [isHovered, onWidthChange, currentWidth]);

  return (
    <div
      className="navbar"
      style={{ width: currentWidth }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ul>
        {/* Pomodoro Section */}
        <li className={location.pathname === "/" ? "active" : ""}>
          <Link to="/">
            <Clock className="icon" />
            <span className="text">Pomodoro</span>
          </Link>
        </li>

        {/* Notes Section */}
        <li className={location.pathname === "/notes" ? "active" : ""}>
          <Link to="/notes">
            <FileText className="icon" />
            <span className="text">Notes</span>
          </Link>
        </li>

        {/* Checklist Section */}
        <li className={location.pathname === "/checklist" ? "active" : ""}>
          <Link to="/checklist">
            <CheckSquare className="icon" />
            <span className="text">Checklist</span>
          </Link>
        </li>

        {/* About Section */}
        <li className="about">
          <Link to="/about">
            <Info className="icon" />
            <span className="text">About</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
