import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../App";
import { registerAPI } from "../services/api";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill all fields"); return; }
    if (password.length < 6) { toast.error("Password must be 6+ characters"); return; }
    setLoading(true);
    try {
      const data = await registerAPI(email, password, name);
      login(data.user, data.token);
      toast.success("Account created successfully!");
      nav("/");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="page" style={{ maxWidth: 440, margin: "0 auto", display: "flex", alignItems: "center", minHeight: "80vh" }}>
      <div style={{ width: "100%" }}>
        <div className="shdr" style={{ marginBottom: 36 }}>
          <div className="stag">🛡️ Join JusticeLens AI</div>
          <h1 className="stit">Create Account</h1>
          <p style={{ color: "var(--dim)", marginTop: 12, fontSize: 14 }}>Secure access to legal AI research</p>
        </div>

        <form onSubmit={handleSubmit} className="card" style={{ padding: 32 }}>
          <div className="fg" style={{ marginBottom: 18 }}>
            <label>Full Name (optional)</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" />
          </div>
          <div className="fg" style={{ marginBottom: 18 }}>
            <label>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
          </div>
          <div className="fg" style={{ marginBottom: 24 }}>
            <label>Password (min 6 characters)</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
          </div>
          <button className="btn btn-g" style={{ width: "100%", justifyContent: "center", padding: 14, fontSize: 15 }} disabled={loading}>
            {loading ? <span className="ldr"><span/><span/><span/></span> : "✅ Create Account"}
          </button>
          <p style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "var(--dim)" }}>
            Already have an account? <Link to="/login" style={{ color: "var(--gold)" }}>Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
