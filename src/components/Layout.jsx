import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useStore } from "../hooks/useStore";

export default function Layout() {
  const { user, logout } = useAuth();
  const { resetDemo } = useStore();
  const nav = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const doLogout = () => {
    setMenuOpen(false);
    logout();
    nav("/login");
  };

  const links = (
    <>
      <NavLink to="/app" end>
        Dashboard
      </NavLink>
      <NavLink to="/app/chatbot">Chatbot</NavLink>
      <NavLink to="/app/documents">Documents</NavLink>
      <NavLink to="/app/chat">Try chat</NavLink>
      {user?.isAdmin ? <NavLink to="/app/admin">Admin</NavLink> : null}
    </>
  );

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/app" className="brand">
          <img src="/brand-mark.png" alt="" />
          <span>ChatAI</span>
        </NavLink>

        <nav className="nav-links nav-links-desktop">{links}</nav>

        <div className="topbar-actions topbar-actions-desktop">
          <span className="user-chip">{user?.fullName}</span>
          <button type="button" className="btn btn-ghost" onClick={resetDemo}>
            Reset demo
          </button>
          <button type="button" className="btn btn-ghost" onClick={doLogout}>
            Log out
          </button>
        </div>

        <button
          type="button"
          className={`menu-toggle${menuOpen ? " is-open" : ""}`}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <div
        className={`menu-backdrop${menuOpen ? " is-open" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden={!menuOpen}
      />

      <aside
        id="mobile-nav"
        className={`mobile-drawer${menuOpen ? " is-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="mobile-drawer-head">
          <span className="user-chip">{user?.fullName}</span>
          <button
            type="button"
            className="menu-toggle is-open"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
        <nav className="mobile-nav-links">{links}</nav>
        <div className="mobile-drawer-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              resetDemo();
              setMenuOpen(false);
            }}
          >
            Reset demo
          </button>
          <button type="button" className="btn btn-primary" onClick={doLogout}>
            Log out
          </button>
        </div>
      </aside>

      <main className="page">
        <Outlet />
      </main>
    </div>
  );
}
