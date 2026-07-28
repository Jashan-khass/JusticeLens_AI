import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginAPI } from "../services/api";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill all fields"); return; }
    setLoading(true);
    try {
      const data = await loginAPI(email, password);
      localStorage.setItem("jl_token", data.token);
      localStorage.setItem("jl_user", JSON.stringify(data.user));
      toast.success("Login successful!");
      nav("/");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="page" style={{ maxWidth: 440, margin: "0 auto", display: "flex", alignItems: "center", minHeight: "80vh" }}>
      <div style={{ width: "100%" }}>
        <div className="shdr" style={{ marginBottom: 36 }}>
          <div className="stag">🔐 Access Your Account</div>
          <h1 className="stit">Welcome Back</h1>
          <p style={{ color: "var(--dim)", marginTop: 12, fontSize: 14 }}>Login to continue your legal research</p>
        </div>

        <form onSubmit={handleSubmit} className="card" style={{ padding: 32 }}>
          <div className="fg" style={{ marginBottom: 18 }}>
            <label>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
          </div>
          <div className="fg" style={{ marginBottom: 24 }}>
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
          </div>
          <button className="btn btn-g" style={{ width: "100%", justifyContent: "center", padding: 14, fontSize: 15 }} disabled={loading}>
            {loading ? <span className="ldr"><span/><span/><span/></span> : "🔓 Sign In"}
          </button>
          <p style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "var(--dim)" }}>
            Don't have an account? <Link to="/register" style={{ color: "var(--gold)" }}>Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

