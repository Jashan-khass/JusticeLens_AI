import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import SearchPage from "./pages/SearchPage";
import LawsPage from "./pages/LawsPage";
import DocumentsPage from "./pages/DocumentsPage";
import RAGSearchPage from "./pages/RAGSearchPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatHistoryPage from "./pages/ChatHistoryPage";
import "./App.css";

// ── Auth Context ──
export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

function NavBar({ theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  const linkClass = ({ isActive }) => isActive ? "act" : "";

  return (
    <nav className={scrolled ? "scrolled" : ""}>
      <NavLink to="/" className="nlogo" end>
        <div className="nico">⚖</div>
        <div>
          <div className="nbrand">JusticeLens</div>
          <div className="nsub">AI Legal · RAG Powered</div>
        </div>
      </NavLink>

      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        <span/><span/><span/>
      </button>

      <ul className={`nlinks ${menuOpen ? "open" : ""}`}>
        {[
          ["/", "Home"],
          ["/dashboard", "Analytics"],
          ["/search", "Case Search"],
          ["/rag", "RAG Query"],
          ["/laws", "Laws"],
          ["/documents", "Documents"],
          ["/chats", "Chat History"],
        ].map(([to, lbl]) => (
          <li key={to}>
            <NavLink to={to} end={to === "/"} className={linkClass} onClick={() => setMenuOpen(false)}>
              {lbl}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="nright">
        <button className="theme-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
        <i className="fas fa-globe" style={{ color: "var(--gold)", fontSize: 14 }} />
        <select value={lang} onChange={(e) => setLang(e.target.value)}>
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
          <option value="pa">ਪੰਜਾਬੀ</option>
          <option value="ur">اردو</option>
          <option value="hx">Hinglish</option>
        </select>

        {user ? (
          <div className="user-menu" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button className="btn btn-o btn-sm" onClick={() => nav("/chats")} title="Chat History" style={{ padding: "6px 10px", fontSize: 13 }}>
              💬
            </button>
            <span className="user-badge" title={user.email}>
              {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
            </span>
            <button className="btn" onClick={handleLogout} style={{ padding: "6px 14px", fontSize: 12 }}>
              Logout
            </button>
          </div>
        ) : (
          <NavLink to="/login" className="btn btn-g" style={{ padding: "6px 14px", fontSize: 12 }}>
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("jl_theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme === "light" ? "bw" : "dark");
    localStorage.setItem("jl_theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  useEffect(() => {
    const stored = localStorage.getItem("jl_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("jl_user", JSON.stringify(userData));
    localStorage.setItem("jl_token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("jl_user");
    localStorage.removeItem("jl_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <div className="app-container">
          <div className="bg-fx">
            <div className="bg-grid" />
            <div className="orb o1" />
            <div className="orb o2" />
            <div className="orb o3" />
          </div>

          <NavBar theme={theme} toggleTheme={toggleTheme} />

          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/rag" element={<RAGSearchPage />} />
              <Route path="/laws" element={<LawsPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/chats" element={<ChatHistoryPage />} />
            </Routes>
          </main>

          <footer>
            <div className="flogo">⚖ JusticeLens AI</div>
            <p>RAG-Powered · TF-IDF Vector Search · 149 SC Judgments · Open Source</p>
            <p style={{ marginTop: 8, fontSize: 11, opacity: 0.5 }}>
              ⚠️ Educational purposes only.
            </p>
          </footer>

          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--panel)",
                border: "1px solid var(--gold)",
                color: "var(--gold)",
                fontFamily: "DM Sans",
              },
              duration: 3000,
            }}
          />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

