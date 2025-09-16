import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Clock, FileText, CheckSquare, Info } from "lucide-react";
import "./Navbar.css";

function Navbar({ onWidthChange, user, openSignInModal }) {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const currentWidth = isHovered ? 200 : 60;

  useEffect(() => {
    if (typeof onWidthChange === "function") {
      onWidthChange(currentWidth);
    }
  }, [isHovered, onWidthChange, currentWidth]);

  const handleProtectedLinkClick = (path) => {
    if (user) {
      navigate(path);
    } else {
      openSignInModal();
    }
  };

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
            <Clock className="icon" />
            <span className="text">Pomodoro</span>
          </Link>
        </li>
        <li
          className={location.pathname === "/notes" ? "active" : ""}
          onClick={() => handleProtectedLinkClick("/notes")}
        >
          {/* Changed <a> to <div> */}
          <div className="navbar-item-container"> 
            <FileText className="icon" />
            <span className="text">Notes</span>
          </div>
        </li>
        <li
          className={location.pathname === "/checklist" ? "active" : ""}
          onClick={() => handleProtectedLinkClick("/checklist")}
        >
          {/* Changed <a> to <div> */}
          <div className="navbar-item-container">
            <CheckSquare className="icon" />
            <span className="text">Checklist</span>
          </div>
        </li>
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