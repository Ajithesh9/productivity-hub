// src/components/Layout.js
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import MusicPlayer from "./MusicPlayer/MusicPlayer";
import ThemeToggle from "./ThemeToggle/ThemeToggle";
import SignInModal from "./SignInModal/SignInModal";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { LogIn, LogOut } from "lucide-react";
import "./Layout.css";

function Layout() {
  const [theme, setTheme] = useState("light");
  const [navbarWidth, setNavbarWidth] = useState(60);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = () => {
    setIsModalOpen(false);
    signInWithPopup(auth, googleProvider).catch((error) => {
      console.error(error.code, error.message);
    });
  };

  const handleSignOut = () => {
    signOut(auth).catch((error) => console.error("Sign out error", error));
  };

  const handleNavbarWidthChange = (newWidth) => setNavbarWidth(newWidth);
  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <div className={`layout ${theme}`} data-theme={theme}>
      <Navbar onWidthChange={handleNavbarWidthChange} user={user} openSignInModal={() => setIsModalOpen(true)} />
      <div className="content" style={{ marginLeft: navbarWidth }}>
        <header className="header">
          {user ? (
            <button onClick={handleSignOut} className="auth-button">
              <LogOut className="auth-button-icon" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button onClick={handleSignIn} className="auth-button">
              <LogIn className="auth-button-icon" />
              <span>Sign In with Google</span>
            </button>
          )}
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </header>
        <main><Outlet context={{ user, loading }} /></main>
      </div>
      <MusicPlayer />
      <SignInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSignIn={handleSignIn} />
    </div>
  );
}
export default Layout;