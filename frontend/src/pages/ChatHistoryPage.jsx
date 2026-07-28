import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getChatsAPI, clearChatsAPI } from "../services/api";
import toast from "react-hot-toast";

export default function ChatHistoryPage() {
  const [chats, setChats] = useState(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jl_token");
    if (!token) { nav("/login"); return; }
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const data = await getChatsAPI();
      setChats(data);
    } catch (err) {
      if (err?.response?.status === 401) nav("/login");
      else toast.error("Failed to load chat history");
    }
    setLoading(false);
  };

  const handleClear = async () => {
    if (!window.confirm("Clear all chat history?")) return;
    try {
      await clearChatsAPI();
      setChats({ messages: [], sessions: [] });
      toast.success("Chat history cleared");
    } catch (err) {
      toast.error("Failed to clear");
    }
  };

  const user = JSON.parse(localStorage.getItem("jl_user") || "{}");

  if (loading) {
    return (
      <div className="page" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <span className="ldr"><span/><span/><span/></span>
      </div>
    );
  }

  const messages = chats?.messages || [];

  return (
    <div className="page" style={{ maxWidth: 800, margin: "0 auto" }}>
      <div className="shdr" style={{ marginBottom: 36 }}>
        <div className="stag">💬 Your Conversations</div>
        <h1 className="stit">Chat History</h1>
        <p style={{ color: "var(--dim)", marginTop: 12, fontSize: 14 }}>
          {messages.length} messages saved · {user?.name || user?.email || "User"}
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
          <h3 style={{ color: "var(--gold)", marginBottom: 8 }}>No conversations yet</h3>
          <p style={{ color: "var(--dim)", fontSize: 14, marginBottom: 24 }}>
            Your AI legal chat history will appear here
          </p>
          <button className="btn btn-g" onClick={() => nav("/")}>⚖️ Start a Query</button>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <button className="btn" onClick={handleClear} style={{ padding: "8px 18px", fontSize: 13 }}>
              🗑️ Clear All
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[...messages].reverse().map((msg) => (
              <div key={msg.id} className="card" style={{ padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <span className="tag" style={{ background: "var(--gold)", color: "#000", fontSize: 11, padding: "3px 10px" }}>
                      {msg.category || "general"}
                    </span>
                    <span className="tag" style={{ marginLeft: 8, fontSize: 11, padding: "3px 10px", background: "rgba(255,215,0,0.1)", color: "var(--gold)" }}>
                      {msg.mode || "both"}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: "var(--dim)" }}>
                    {new Date(msg.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <strong style={{ fontSize: 13, color: "var(--gold)" }}>You:</strong>
                  <p style={{ fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>{msg.message}</p>
                </div>
                <div>
                  <strong style={{ fontSize: 13, color: "var(--accent)" }}>AI:</strong>
                  <p style={{ fontSize: 13, marginTop: 4, lineHeight: 1.5, color: "var(--dim)" }}>{msg.response_preview || "..."}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
