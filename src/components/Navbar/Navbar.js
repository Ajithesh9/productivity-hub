import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaStickyNote, FaListAlt } from "react-icons/fa";
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
        <li className={location.pathname === "/" ? "active" : ""}>
          <Link to="/">
            <FaHome className="icon" />
            <span className="text">Pomodoro</span>
          </Link>
        </li>
        <li className={location.pathname === "/notes" ? "active" : ""}>
          <Link to="/notes">
            <FaStickyNote className="icon" />
            <span className="text">Notes</span>
          </Link>
        </li>
        <li className={location.pathname === "/checklist" ? "active" : ""}>
          <Link to="/checklist">
            <FaListAlt className="icon" />
            <span className="text">Checklist</span>
          </Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
