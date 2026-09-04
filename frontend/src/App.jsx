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
import ProfilePage from "./pages/ProfilePage";
import "./App.css";
import { getChatsAPI, chatAPI, saveChatAPI } from "./services/api";

// ── Auth Context ──
export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

function NavBar({ theme, toggleTheme, onOpenChat }) {
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
          <div style={{ display: "flex", alignItems: "center", gap: 8, position: 'relative' }}>
            <div className="avatar-display" title="Profile" onClick={() => nav('/profile')} style={{cursor:'pointer'}}>
              { user?.avatar_url ? (
                <img src={user.avatar_url} alt="avatar" style={{width:28,height:28,borderRadius:8}} />
              ) : (
                <div className="user-initial">{(user.name || user.email || 'U').charAt(0).toUpperCase()}</div>
              )}
            </div>
            <button className="btn btn-o btn-sm" onClick={() => nav('/profile')}>Profile</button>
            <button className="btn btn-o btn-sm" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button className="avatar-btn" onClick={() => nav('/login')} title="Login">
            <div className="user-initial">J</div>
          </button>
        )}
      </div>
    </nav>
  );
}

function LeftSidebar({ onOpenChat }){
  // Always show three compact ChatGPT-style items (works without login as placeholders)
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  useEffect(() => {
    let mounted = true;
    if (!user) {
      // show placeholders
      setChats([{id:'p1',message:'Start a new chat', timestamp: Date.now()},{id:'p2',message:'Ask about a case', timestamp: Date.now()},{id:'p3',message:'Generate a notice', timestamp: Date.now()}]);
      return () => { mounted = false; };
    }
    getChatsAPI().then(res => {
      if (!mounted) return;
      if (res && res.messages) setChats(res.messages.slice(-3).reverse());
    }).catch(() => {
      // fallback placeholders
      if (mounted && chats.length === 0) setChats([{id:'p1',message:'Start a new chat', timestamp: Date.now()},{id:'p2',message:'Ask about a case', timestamp: Date.now()},{id:'p3',message:'Generate a notice', timestamp: Date.now()}]);
    });
    return () => { mounted = false; }
  }, [user]);

  return (
    <div className="side-card small-sidebar">
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {chats.slice(0,3).map(m => (
          <button key={m.id} className="chat-gpt-line" onClick={() => onOpenChat(user ? m : null)} title={m.message}>
            <div className="cgl-top">
              <div className="cgl-dot" />
              <div className="cgl-title">Conversation</div>
            </div>
            <div className="cgl-body">{(m.message || '').slice(0,80)}</div>
            <div className="cgl-time">{new Date(m.timestamp).toLocaleTimeString()}</div>
          </button>
        ))}
      </div>
    </div>
  );
}


function ChatPanel({ open, onClose, selected }){
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!user) return;
    getChatsAPI().then(res => { if (!mounted) { return } if (res && res.messages) setChats(res.messages.reverse()); }).catch(() => {});
    return () => { mounted = false };
  }, [user, open]);

  // When selected chat changes (user clicked a chat line), prefill message
  useEffect(() => {
    if (selected && selected.message) setMessage(selected.message);
  }, [selected]);

  const detectLang = (txt) => {
    if (!txt) return 'en';
    // Basic script-based detection: Devanagari -> hi, Gurmukhi -> pa, Arabic-script -> ur, Latin -> en
    if (/[\u0900-\u097F]/.test(txt)) return 'hi'; // Hindi (Devanagari)
    if (/[\u0A00-\u0A7F]/.test(txt)) return 'pa'; // Punjabi (Gurmukhi)
    if (/[\u0600-\u06FF\u0750-\u077F]/.test(txt)) return 'ur'; // Urdu / Arabic script
    return 'en';
  };

  const send = async () => {
    if (!message.trim()) return;
    setLoading(true);
    const lang = detectLang(message);
    try {
      const resp = await chatAPI(message, 'both', lang);
      // Save chat history server-side
      try{ await saveChatAPI(message, resp, 'both'); } catch {}
      setChats(c => [{ id: Date.now(), timestamp: new Date().toISOString(), message, response_preview: (resp.gemini_answer||'').slice(0,100) }, ...c]);
      setMessage("");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`slide-panel fullscreen ${open ? 'open' : ''}`}>
      <div className="panel-head">
        <strong>Chat</strong>
        <button className="btn btn-o" onClick={onClose}>Close</button>
      </div>
      <div className="panel-body">
        {chats.length === 0 && <div style={{color:'var(--dim)'}}>No chats yet</div>}
        {chats.map(c => (
          <div key={c.id} style={{marginBottom:10}}>
            <div style={{fontSize:12,color:'var(--dim)'}}>{new Date(c.timestamp).toLocaleString()}</div>
            <div style={{marginTop:4}}>{c.message}</div>
            <div style={{marginTop:6,fontSize:13,color:'var(--dim)'}}>{c.response_preview}</div>
          </div>
        ))}
      </div>
      <div className="panel-footer">
        <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Ask JusticeLens..." rows={3} />
        <div style={{display:'flex',gap:8,marginTop:8}}>
          <button className="btn btn-g" onClick={send} disabled={loading}>{loading ? 'Sending...' : 'Send'}</button>
          <button className="btn btn-o" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
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

  const [showChat, setShowChat] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  // expose profile in AuthContext for small components
  const authValue = { user, login, logout };

  return (
    <AuthContext.Provider value={authValue}>
      <Router>
        <div className="app-container">
          <div className="bg-fx">
            <div className="bg-grid" />
            <div className="orb o1" />
            <div className="orb o2" />
            <div className="orb o3" />
          </div>

          <NavBar theme={theme} toggleTheme={toggleTheme} onOpenChat={() => setShowChat(true)} />

          <div className="layout">
            <aside className="left-sidebar"><LeftSidebar onOpenChat={(chat) => { setSelectedChat(chat); setShowChat(true); }} /></aside>
            <div className="main-content">
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
                  <Route path="/profile" element={<ProfilePage />} />
                </Routes>
              </main>
            </div>
            <ChatPanel open={showChat} onClose={() => { setShowChat(false); setSelectedChat(null); }} selected={selectedChat} />
          </div>

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
