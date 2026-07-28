import React, { useEffect, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend, Filler } from "chart.js";
import { statsAPI } from "../services/api";
Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend, Filler);

const COLORS = ["#E07070","#5B8CF5","#C9A84C","#D080D0","#50DDA0","#9090E0","#FFB060","#60D0FF"];
const opt = { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: "#8890A8", font: { family: "DM Sans", size: 11 } } } }, scales: { x: { ticks: { color: "#8890A8" }, grid: { color: "rgba(255,255,255,.05)" } }, y: { ticks: { color: "#8890A8" }, grid: { color: "rgba(255,255,255,.05)" } } } };

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { statsAPI().then(d => { setStats(d); setLoading(false); }).catch(() => setLoading(false)); }, []);

  if (loading) return <div className="page" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}><div className="ldr"><span /><span /><span /></div></div>;
  if (!stats) return <div className="page" style={{ textAlign: "center", color: "var(--dim)", paddingTop: 80 }}>⚠️ Backend not running. Run: <code style={{ color: "var(--gold)" }}>cd backend && python app.py</code></div>;

  const typeLabels = Object.keys(stats.case_types);
  const typeVals = Object.values(stats.case_types);
  const yrLabels = Object.keys(stats.years_timeline).sort();
  const yrVals = yrLabels.map(y => stats.years_timeline[y]);

  return (
    <div className="page">
      <div className="shdr">
        <div className="stag">Analytics</div>
        <h2 className="stit">Case Intelligence <em>Dashboard</em></h2>
      </div>

      {/* RAG Info banner */}
      <div style={{ background: "linear-gradient(135deg,rgba(46,204,154,.08),rgba(46,204,154,.03))", border: "1px solid rgba(46,204,154,.2)", borderRadius: 14, padding: "16px 24px", marginBottom: 28, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontSize: 28 }}>🧠</span>
        <div>
          <div style={{ fontWeight: 600, color: "var(--ok)", fontSize: 15 }}>RAG Knowledge Base Active</div>
          <div style={{ fontSize: 12, color: "var(--dim)", marginTop: 2 }}>
            {stats.total_chunks} TF-IDF indexed chunks · {stats.total_cases} Supreme Court judgments · Open source vector search
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
          {[["2,290", "Chunks"], ["15,000", "Features"], ["1-2 gram", "N-grams"]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: 20, color: "var(--ok)" }}>{v}</div>
              <div style={{ fontSize: 10, color: "var(--dim)" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* KPIs + Bar */}
      <div className="g3" style={{ marginBottom: 20 }}>
        <div className="card">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[["Total Cases", stats.total_cases, "var(--gold)"], ["Success Rate", stats.success_rate + "%", "var(--ok)"], ["Allowed", stats.outcomes?.Allowed || 0, "var(--ok)"], ["Dismissed", stats.outcomes?.Dismissed || 0, "var(--err)"]].map(([l, v, c]) => (
              <div key={l} className="kbox"><div className="knum" style={{ color: c }}>{v}</div><div className="klbl">{l}</div></div>
            ))}
          </div>
        </div>
        <div className="card" style={{ gridColumn: "span 2" }}>
          <h3 style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--dim)", marginBottom: 14 }}>Cases by Category</h3>
          <div className="cwrap">
            <Bar data={{ labels: typeLabels, datasets: [{ label: "Cases", data: typeVals, backgroundColor: COLORS.map(c => c + "99"), borderRadius: 6, borderSkipped: false }] }} options={{ ...opt, plugins: { ...opt.plugins, legend: { display: false } } }} />
          </div>
        </div>
      </div>

      <div className="g2" style={{ marginBottom: 20 }}>
        <div className="card">
          <h3 style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--dim)", marginBottom: 14 }}>Outcome Distribution</h3>
          <div className="cwrap">
            <Doughnut data={{ labels: ["Allowed", "Dismissed", "Partially Allowed"], datasets: [{ data: [stats.outcomes?.Allowed || 0, stats.outcomes?.Dismissed || 0, stats.outcomes?.["Partially Allowed"] || 0], backgroundColor: ["#2ECC9A55", "#E0555555", "#C9A84C55"], borderColor: ["#2ECC9A", "#E05555", "#C9A84C"], borderWidth: 2 }] }} options={{ responsive: true, maintainAspectRatio: false, cutout: "65%", plugins: { legend: { position: "bottom", labels: { color: "#8890A8", padding: 12 } } } }} />
          </div>
        </div>
        <div className="card">
          <h3 style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--dim)", marginBottom: 14 }}>Cases Timeline (1996–2024)</h3>
          <div className="cwrap">
            <Line data={{ labels: yrLabels, datasets: [{ label: "Cases", data: yrVals, borderColor: "#C9A84C", backgroundColor: "rgba(201,168,76,.1)", borderWidth: 2, fill: true, tension: .4, pointBackgroundColor: "#C9A84C", pointRadius: 3 }] }} options={{ ...opt, plugins: { ...opt.plugins, legend: { display: false } } }} />
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="card">
        <h3 style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--dim)", marginBottom: 18 }}>Category Breakdown</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 }}>
          {typeLabels.map((cat, i) => {
            const cnt = typeVals[i], pct = Math.round(cnt / stats.total_cases * 100);
            return (
              <div key={cat} style={{ background: "var(--panel2)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span className={`tag t${cat}`}>{cat}</span>
                  <span style={{ fontFamily: "var(--serif)", fontSize: 20, color: COLORS[i] }}>{cnt}</span>
                </div>
                <div className="pbar"><div className="pfill" style={{ width: `${pct}%`, background: COLORS[i] }} /></div>
                <span style={{ fontSize: 11, color: "var(--dim)", marginTop: 4, display: "block" }}>{pct}% of total</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
