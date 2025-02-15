import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaStickyNote, FaListAlt } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();

  return (
    <div className="navbar">
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
      </ul>
    </div>
  );
}

export default Navbar;
