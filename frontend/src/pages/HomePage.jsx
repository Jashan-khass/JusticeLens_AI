import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { chatAPI, getChatsAPI, clearChatsAPI } from "../services/api";

const QUICK = [
  "Landlord not returning security deposit",
  "Online UPI fraud happened to me",
  "Workplace sexual harassment",
  "Road accident driver fled",
  "Defective product company refusing refund",
  "Wrongful termination from job",
  "Builder not delivering flat - RERA",
  "Divorce and child custody issue"
];

const LANG = {
  en: {
    t1: "Justice Is Now",
    t2: "Accessible to All",
    sub: "⚖️ Your trusted AI companion for exploring Indian law with confidence.",
    ph: "Ask any legal question..."
  },

  hi: {
    t1: "न्याय अब",
    t2: "सबके लिए सुलभ",
    sub: "⚖️ भारतीय कानून को आत्मविश्वास के साथ समझने और जानने के लिए आपका विश्वसनीय AI साथी।",
    ph: "कानूनी सवाल पूछें..."
  },

  pa: {
    t1: "ਨਿਆਂ ਹੁਣ",
    t2: "ਸਭ ਲਈ ਉਪਲਬਧ",
    sub: "⚖️ ਭਾਰਤੀ ਕਾਨੂੰਨ ਨੂੰ ਭਰੋਸੇ ਨਾਲ ਸਮਝਣ ਅਤੇ ਖੋਜਣ ਲਈ ਤੁਹਾਡਾ ਵਿਸ਼ਵਾਸਯੋਗ AI ਸਾਥੀ।",
    ph: "ਕਾਨੂੰਨੀ ਸਵਾਲ ਪੁੱਛੋ..."
  },

  ur: {
    t1: "انصاف اب",
    t2: "سب کے لیے ممکن",
    sub: "⚖️ بھارتی قانون کو اعتماد کے ساتھ سمجھنے اور جاننے کے لیے آپ کا قابلِ اعتماد AI معاون۔",
    ph: "قانونی سوال پوچھیں..."
  },
  hx: {
    t1: "Justice Hai",
    t2: "Sab Ke Liye",
    sub: "⚖️ Aapka bharosa AI legal companion Indian law ko samajhne aur explore karne ke liye.",
    ph: "Apna kanooni sawaal poochhein..."
  }
};

const UI = {
  en: {
    ragSec: "📚 From SC Judgment Database (RAG)",
    webSec: "🌐 Live Web Search Results",
    lawSec: "⚖ Applicable Laws",
    rgtSec: "🛡 Your Legal Rights",
    stpSec: "🧭 Step-by-Step Action Plan",
    prdSec: "🔮 AI Case Prediction",
    simSec: "📚 Similar SC Judgments",
    hlpSec: "📞 Important Helplines",
    actSec: "📥 Actions",
    aiLabel: "AI Legal Analysis",
    ragTag: "RAG Active",
    webTag: "+ Web",
    noRag: "No specific matching text found in PDF database.",
    hide: "▾ Hide",
    show: "▸ Show",
    results: "results",
    srcChunks: "source chunks from PDFs",
    webResults: "web results",
    cases: "cases",
    successRate: "Success Rate",
    duration: "Duration",
    riskLevel: "Risk Level",
    scCases: "SC Cases",
    readAloud: "Read Aloud",
    deepRag: "Deep RAG",
    firDraft: "FIR Draft",
    legalNotice: "Legal Notice",
    complaint: "Complaint",
    analysisComplete: "Analysis complete for:",
    ragFooter: "RAG",
    chunks: "chunks",
    scCasesFull: "SC cases",
    showLbl: "Show",
    hideLbl: "Hide",
    from: "From",
    to: "to",
    by: "by"
  },
  hi: {
    ragSec: "📚 सर्वोच्च न्यायालय निर्णय डेटाबेस (RAG)",
    webSec: "🌐 लाइव वेब सर्च परिणाम",
    lawSec: "⚖ लागू कानून",
    rgtSec: "🛡 आपके कानूनी अधिकार",
    stpSec: "🧭 चरण-दर-चरण कार्य योजना",
    prdSec: "🔮 AI केस भविष्यवाणी",
    simSec: "📚 समान सर्वोच्च न्यायालय निर्णय",
    hlpSec: "📞 महत्वपूर्ण हेल्पलाइन",
    actSec: "📥 कार्रवाई",
    aiLabel: "AI कानूनी विश्लेषण",
    ragTag: "RAG सक्रिय",
    webTag: "+ वेब",
    noRag: "PDF डेटाबेस में कोई विशिष्ट मिलान पाठ नहीं मिला।",
    hide: "▾ छुपाएं",
    show: "▸ दिखाएं",
    results: "परिणाम",
    srcChunks: "PDF से स्रोत खंड",
    webResults: "वेब परिणाम",
    cases: "मामले",
    successRate: "सफलता दर",
    duration: "अवधि",
    riskLevel: "जोखिम स्तर",
    scCases: "उच्चतम न्यायालय मामले",
    readAloud: "ज़ोर से पढ़ें",
    deepRag: "गहन RAG",
    firDraft: "FIR ड्राफ्ट",
    legalNotice: "कानूनी नोटिस",
    complaint: "शिकायत",
    analysisComplete: "के लिए विश्लेषण पूर्ण:",
    ragFooter: "RAG",
    chunks: "खंड",
    scCasesFull: "SC मामले"
  },
  pa: {
    ragSec: "📚 ਸੁਪਰੀਮ ਕੋਰਟ ਫ਼ੈਸਲਾ ਡੇਟਾਬੇਸ (RAG)",
    webSec: "🌐 ਲਾਈਵ ਵੈੱਬ ਖੋਜ ਨਤੀਜੇ",
    lawSec: "⚖ ਲਾਗੂ ਕਾਨੂੰਨ",
    rgtSec: "🛡 ਤੁਹਾਡੇ ਕਾਨੂੰਨੀ ਅਧਿਕਾਰ",
    stpSec: "🧭 ਕਦਮ-ਦਰ-ਕਦਮ ਕਾਰਜ ਯੋਜਨਾ",
    prdSec: "🔮 AI ਕੇਸ ਭਵਿੱਖਬਾਣੀ",
    simSec: "📚 ਸਮਾਨ ਸੁਪਰੀਮ ਕੋਰਟ ਫ਼ੈਸਲੇ",
    hlpSec: "📞 ਮਹੱਤਵਪੂਰਨ ਹੈਲਪਲਾਈਨਾਂ",
    actSec: "📥 ਕਾਰਵਾਈ",
    aiLabel: "AI ਕਾਨੂੰਨੀ ਵਿਸ਼ਲੇਸ਼ਣ",
    ragTag: "RAG ਸਰਗਰਮ",
    webTag: "+ ਵੈੱਬ",
    noRag: "PDF ਡੇਟਾਬੇਸ ਵਿੱਚ ਕੋਈ ਖ਼ਾਸ ਮੇਲ ਖਾਂਦਾ ਟੈਕਸਟ ਨਹੀਂ ਮਿਲਿਆ।",
    hide: "▾ ਲੁਕਾਓ",
    show: "▸ ਦਿਖਾਓ",
    results: "ਨਤੀਜੇ",
    srcChunks: "PDF ਤੋਂ ਸਰੋਤ ਖੰਡ",
    webResults: "ਵੈੱਬ ਨਤੀਜੇ",
    cases: "ਕੇਸ",
    successRate: "ਸਫਲਤਾ ਦਰ",
    duration: "ਮਿਆਦ",
    riskLevel: "ਜੋਖਮ ਪੱਧਰ",
    scCases: "SC ਕੇਸ",
    readAloud: "ਉੱਚੀ ਪੜ੍ਹੋ",
    deepRag: "ਡੂੰਘਾ RAG",
    firDraft: "FIR ਡਰਾਫਟ",
    legalNotice: "ਕਾਨੂੰਨੀ ਨੋਟਿਸ",
    complaint: "ਸ਼ਿਕਾਇਤ",
    analysisComplete: "ਲਈ ਵਿਸ਼ਲੇਸ਼ਣ ਪੂਰਾ:",
    ragFooter: "RAG",
    chunks: "ਖੰਡ",
    scCasesFull: "SC ਕੇਸ"
  },
  ur: {
    ragSec: "📚 سپریم کورٹ کے فیصلوں کا ڈیٹابیس (RAG)",
    webSec: "🌐 لائیو ویب تلاش کے نتائج",
    lawSec: "⚖ قابل اطلاق قوانین",
    rgtSec: "🛡 آپ کے قانونی حقوق",
    stpSec: "🧭 مرحلہ وار عمل کی منصوبہ بندی",
    prdSec: "🔮 AI کیس کی پیش گوئی",
    simSec: "📚 اسی طرح کے سپریم کورٹ کے فیصلے",
    hlpSec: "📞 اہم ہیلپ لائنز",
    actSec: "📥 اقدامات",
    aiLabel: "AI قانونی تجزیہ",
    ragTag: "RAG فعال",
    webTag: "+ ویب",
    noRag: "PDF ڈیٹابیس میں کوئی مخصوص متن نہیں ملا۔",
    hide: "▾ چھپائیں",
    show: "▸ دکھائیں",
    results: "نتائج",
    srcChunks: "PDF سے ماخذ حصے",
    webResults: "ویب نتائج",
    cases: "مقدمات",
    successRate: "کامیابی کی شرح",
    duration: "مدت",
    riskLevel: "خطرے کی سطح",
    scCases: "SC مقدمات",
    readAloud: "بلند آواز سے پڑھیں",
    deepRag: "گہرا RAG",
    firDraft: "FIR مسودہ",
    legalNotice: "قانونی نوٹس",
    complaint: "شکایت",
    analysisComplete: "کا تجزیہ مکمل:",
    ragFooter: "RAG",
    chunks: "حصے",
    scCasesFull: "SC مقدمات"
  },
  hx: {
    ragSec: "📚 Supreme Court Judgment Database (RAG)",
    webSec: "🌐 Live Web Search Results",
    lawSec: "⚖ Lagoo Qanoon",
    rgtSec: "🛡 Aapke Qanooni Haq",
    stpSec: "🧭 Kadam-ba-kadam Action Plan",
    prdSec: "🔮 AI Case Prediction",
    simSec: "📚 Similar Supreme Court Ke Decisions",
    hlpSec: "📞 Important Helpline Numbers",
    actSec: "📥 Actions",
    aiLabel: "AI Qanooni Vishleshan",
    ragTag: "RAG Active",
    webTag: "+ Web",
    noRag: "PDF database mein koi specific matching text nahi mila.",
    hide: "▾ Chhupayein",
    show: "▸ Dikhayein",
    results: "results",
    srcChunks: "source chunks PDF se",
    webResults: "web results",
    cases: "case",
    successRate: "Safalta ki Dar",
    duration: "Avadhi",
    riskLevel: "Jokhim ka Star",
    scCases: "SC Cases",
    readAloud: "Zor se Padhein",
    deepRag: "Gehra RAG",
    firDraft: "FIR Draft",
    legalNotice: "Qanooni Notice",
    complaint: "Shikayat",
    analysisComplete: "Ke liye vishleshan poora:",
    ragFooter: "RAG",
    chunks: "chunks",
    scCasesFull: "SC cases"
  }
};

function SourceChip({ chunk }) {
  return (
    <div style={{ background: "rgba(46,204,154,.05)", border: "1px solid rgba(46,204,154,.2)", borderRadius: 8, padding: "8px 12px", marginBottom: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: "var(--dim)" }}>{chunk.year || "N/A"} · {chunk.case_type} · {chunk.outcome}</span>
        <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 3, background: "rgba(46,204,154,.15)", color: "var(--ok)" }}>Score: {(chunk.score || 0).toFixed(3)}</span>
      </div>
      <p style={{ fontSize: 11.5, color: "var(--dim)", lineHeight: 1.55 }}>{chunk.text.substring(0, 180)}...</p>
    </div>
  );
}

function WebResult({ r }) {
  return (
    <div style={{ background: "rgba(91,140,245,.05)", border: "1px solid rgba(91,140,245,.2)", borderRadius: 8, padding: "8px 12px", marginBottom: 6 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        <span style={{ color: "var(--info)", fontSize: 14, flexShrink: 0 }}>🌐</span>
        <div style={{ minWidth: 0 }}>
          {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "var(--info)", textDecoration: "none", display: "block", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.url.substring(0, 70)}...</a>}
          <p style={{ fontSize: 12, color: "var(--dim)", lineHeight: 1.5 }}>{r.snippet}</p>
        </div>
      </div>
    </div>
  );
}

function AnalysisCard({ data, lang="en" }) {
  const nav = useNavigate();
  const u = UI[lang] || UI.en;
  const { analysis, prediction, rag_results, web_results, similar_cases, meta } = data;
  const pc = prediction.success_rate >= 70 ? "var(--ok)" : prediction.success_rate >= 50 ? "var(--gold)" : "var(--err)";
  const [showRag, setShowRag] = useState(false);
  const [showWeb, setShowWeb] = useState(false);
  const [showSim, setShowSim] = useState(false);

  const Section = ({ color, title, children }) => (
    <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color, marginBottom: 8, fontWeight: 600 }}>{title}</div>
      {children}
    </div>
  );

  const BulletList = ({ items }) => (
    <ul style={{ listStyle: "none" }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: 12, color: "var(--text)", padding: "3px 0 3px 14px", position: "relative" }}>
          <span style={{ position: "absolute", left: 0, color: "var(--gold)" }}>›</span>{item}
        </li>
      ))}
    </ul>
  );

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", marginTop: 10, fontSize: 13 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "rgba(201,168,76,.07)", borderBottom: "1px solid var(--border)" }}>
        <span style={{ fontSize: 24 }}>{analysis.icon}</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{analysis.title}</div>
          <div style={{ fontSize: 11, color: "var(--dim)", textTransform: "uppercase", letterSpacing: 1 }}>{u.aiLabel}</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span className="tag tok">{u.ragTag}</span>
          {web_results?.length > 0 && <span className="tag" style={{ background: "rgba(91,140,245,.15)", color: "var(--info)", border: "1px solid rgba(91,140,245,.3)" }}>{u.webTag}</span>}
        </div>
      </div>

      {/* RAG Answer */}
      <Section color="#2ECC9A" title={u.ragSec}>
        <div style={{ background: "rgba(46,204,154,.06)", border: "1px solid rgba(46,204,154,.2)", borderRadius: 8, padding: "10px 14px", fontSize: 12.5, lineHeight: 1.75, color: "var(--text)", marginBottom: 8 }}>
          {rag_results.answer || u.noRag}
        </div>
        <button style={{ fontSize: 11, background: "none", border: "1px solid rgba(46,204,154,.3)", color: "var(--ok)", borderRadius: 20, padding: "3px 12px", cursor: "pointer" }} onClick={() => setShowRag(!showRag)}>
          {showRag ? u.hide : u.show} {rag_results.total_retrieved} {u.srcChunks}
        </button>
        {showRag && <div style={{ marginTop: 8 }}>{rag_results.source_chunks.map((c, i) => <SourceChip key={i} chunk={c} />)}</div>}
      </Section>

      {/* Web results */}
      {web_results?.length > 0 && (
        <Section color="var(--info)" title={u.webSec}>
          <button style={{ fontSize: 11, background: "none", border: "1px solid rgba(91,140,245,.3)", color: "var(--info)", borderRadius: 20, padding: "3px 12px", cursor: "pointer", marginBottom: 8 }} onClick={() => setShowWeb(!showWeb)}>
            {showWeb ? u.hide : u.show} {web_results.length} {u.webResults}
          </button>
          {showWeb && web_results.map((r, i) => <WebResult key={i} r={r} />)}
        </Section>
      )}

      {/* Laws */}
      <Section color="var(--gold)" title={u.lawSec}><BulletList items={analysis.laws} /></Section>

      {/* Rights */}
      <Section color="var(--gold)" title={u.rgtSec}><BulletList items={analysis.rights} /></Section>

      {/* Steps */}
      <Section color="var(--gold)" title={u.stpSec}>
        {analysis.steps.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "5px 0" }}>
            <span style={{ minWidth: 22, height: 22, background: "rgba(201,168,76,.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "var(--gold)", flexShrink: 0 }}>{i + 1}</span>
            <span style={{ fontSize: 12, color: "var(--text)", lineHeight: 1.65 }}>{s}</span>
          </div>
        ))}
      </Section>

      {/* Prediction */}
      <Section color="var(--gold)" title={u.prdSec}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[[u.successRate, `${prediction.success_rate}%`, pc, prediction.success_rate], [u.duration, prediction.duration, "var(--text)", null], [u.riskLevel, prediction.risk_level, "var(--text)", null], [u.scCases, meta.total_cases, "var(--gold)", null]].map(([l, v, c, bar]) => (
            <div key={l} style={{ background: "rgba(201,168,76,.04)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, color: "var(--dim)" }}>{l}</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: c, fontFamily: "var(--serif)" }}>{v}</div>
              {bar != null && <div className="pbar"><div className="pfill" style={{ width: `${bar}%`, background: c }} /></div>}
            </div>
          ))}
        </div>
      </Section>

      {/* Similar cases */}
      <Section color="var(--gold)" title={u.simSec}>
        <button style={{ fontSize: 11, background: "none", border: "1px solid rgba(201,168,76,.3)", color: "var(--gold)", borderRadius: 20, padding: "3px 12px", cursor: "pointer", marginBottom: 8 }} onClick={() => setShowSim(!showSim)}>
          {showSim ? u.hide : u.show} {similar_cases.length} {u.cases}
        </button>
        {showSim && similar_cases.map((c, i) => (
          <div key={i} style={{ background: "rgba(0,0,0,.2)", borderRadius: 8, padding: "8px 12px", marginBottom: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: "var(--dim)" }}>{c.year} · {c.type}</span>
              <span className={`tag ${c.outcome === "Allowed" ? "tok" : c.outcome === "Dismissed" ? "terr" : "twarn"}`} style={{ fontSize: 10 }}>{c.outcome}</span>
            </div>
            <p style={{ fontSize: 11.5, color: "var(--dim)", lineHeight: 1.55 }}>{c.summary}</p>
          </div>
        ))}
      </Section>

      {/* Helplines */}
      <Section color="var(--gold)" title={u.hlpSec}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {analysis.helplines.map((h, i) => <span key={i} style={{ fontSize: 11, background: "rgba(46,204,154,.1)", border: "1px solid rgba(46,204,154,.2)", color: "var(--ok)", padding: "3px 10px", borderRadius: 20 }}>{h}</span>)}
        </div>
      </Section>

      {/* Actions */}
      <div style={{ padding: "12px 16px" }}>
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--gold)", marginBottom: 10, fontWeight: 600 }}>{u.actSec}</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn btn-o btn-sm" onClick={() => nav("/documents?tab=fir")}><i className="fas fa-file-alt" /> {u.firDraft}</button>
          <button className="btn btn-o btn-sm" onClick={() => nav("/documents?tab=notice")}><i className="fas fa-envelope" /> {u.legalNotice}</button>
          <button className="btn btn-o btn-sm" onClick={() => nav("/documents?tab=complaint")}><i className="fas fa-gavel" /> {u.complaint}</button>
          <button className="btn btn-info btn-sm" onClick={() => {
            if ("speechSynthesis" in window) {
              const u2 = new SpeechSynthesisUtterance(`${analysis.title}. Success rate ${prediction.success_rate} percent. ${analysis.steps[0]}`);
              u2.rate = 0.9; window.speechSynthesis.speak(u2);
            }
          }}><i className="fas fa-volume-up" /> {u.readAloud}</button>
          <button className="btn btn-info btn-sm" onClick={() => nav(`/rag?q=${encodeURIComponent(analysis.title)}`)}><i className="fas fa-database" /> {u.deepRag}</button>
        </div>
        <p style={{ fontSize: 10.5, color: "var(--dim)", marginTop: 10, opacity: .7 }}>
          {u.ragFooter}: {meta.rag_chunks} {u.chunks} · {meta.total_cases} {u.scCasesFull} · {new Date(meta.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}

export default function HomePage({ lang = "en" }) {
  const lc = LANG[lang] || LANG.en;
  const [msgs, setMsgs] = useState([{
    id: 0, type: "ai",
    text: "Welcome to JusticeLens AI🏛️\n\nI use RAG (Retrieval-Augmented Generation) with TF-IDF vector search over 149 real Supreme Court judgments + live web search to answer your legal questions.\n\n🔹 Ask anything about Indian law\n🔹 Answers extracted from SC judgment database\n🔹 Web-augmented live results\n🔹 Voice input supported\n🔹 Download legal documents instantly\n\nDescribe your legal problem:"
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQ, setShowQ] = useState(true);
  const [listening, setListening] = useState(false);
  const [mode, setMode] = useState("both");
  const msgsRef = useRef(null);
  const recRef = useRef(null);

  useEffect(() => { if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight; }, [msgs]);

  const send = async (txt) => {
    const msg = txt || input.trim();
    if (!msg || loading) return;
    setInput(""); setShowQ(false);
    setMsgs(m => [...m, { id: Date.now(), type: "user", text: msg }]);
    setLoading(true);
    try {
      const data = await chatAPI(msg, mode, lang);
      setMsgs(m => [...m, { id: Date.now() + 1, type: "ai", text: `Analysis complete for: "${msg}"`, data }]);
    } catch {
      setMsgs(m => [...m, { id: Date.now() + 1, type: "ai", text: "⚠️ Backend not connected. Please start Flask:\n\ncd backend\npython app.py" }]);
    }
    setLoading(false);
  };

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Voice not supported"); return; }
    const r = new SR();
    r.lang = { en: "en-IN", hi: "hi-IN", pa: "pa-IN", ur: "ur-PK" }[lang] || "en-IN";
    r.onstart = () => setListening(true);
    r.onresult = e => { const t = Array.from(e.results).map(x => x[0].transcript).join(""); setInput(t); };
    r.onend = () => { setListening(false); if (input.trim()) send(input.trim()); };
    r.start(); recRef.current = r;
  };

  return (
    <div style={{ padding: "0 40px 60px", maxWidth: 900, margin: "0 auto" }}>
      {/* Hero */}
      <div style={{ textAlign: "center", padding: "80px 0 36px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(201,168,76,.12)", border: "1px solid rgba(201,168,76,.3)", padding: "6px 18px", borderRadius: 100, fontSize: 12, color: "var(--gold)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 28 }}>
          <span style={{ width: 7, height: 7, background: "var(--gold)", borderRadius: "50%", display: "inline-block", animation: "bnc 2s infinite" }} />
        </div>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(40px,6vw,78px)", fontWeight: 300, lineHeight: 1.1, letterSpacing: -1, marginBottom: 16 }}>
          {lc.t1}<br /><span style={{ color: "var(--gold)", fontStyle: "italic" }}>{lc.t2}</span>
        </h1>
        <p style={{ fontSize: 15, color: "var(--dim)", maxWidth: 620, margin: "0 auto 28px", lineHeight: 1.75 }}>{lc.sub}</p>
      </div>

      {/* Mode selector */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 }}>
        {[["rag", "📚 PDF Database Only"], ["web", "🌐 Web Search Only"], ["both", "🔀 RAG + Web (Best)"]].map(([m, l]) => (
          <button key={m} className={`tab${mode === m ? " act" : ""}`} onClick={() => setMode(m)} style={{ fontSize: 12 }}>{l}</button>
        ))}
      </div>

      {/* Chatbox */}
      <div style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,.5)" }}>
        <div style={{ background: "linear-gradient(135deg,rgba(201,168,76,.15),rgba(201,168,76,.05))", borderBottom: "1px solid var(--border)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, background: "linear-gradient(135deg,var(--gold),var(--gold-l))", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#060910" }}>⚖</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>JusticeLens AI – RAG Assistant</div>
            <div style={{ fontSize: 11, color: "var(--ok)" }}>● RAG Active · {mode === "both" ? "PDF + Web" : mode === "web" ? "Web Search" : "PDF Database"} · {msgs.length - 1} messages</div>
          </div>
        </div>

        <div ref={msgsRef} style={{ height: 480, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          {msgs.map(msg => (
            <div key={msg.id} style={{ display: "flex", gap: 10, flexDirection: msg.type === "user" ? "row-reverse" : "row", animation: "slid .3s ease" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, background: msg.type === "user" ? "linear-gradient(135deg,#5B8CF5,#2040A0)" : "linear-gradient(135deg,var(--gold),#8B6914)", alignSelf: "flex-start" }}>
                {msg.type === "user" ? "👤" : "⚖"}
              </div>
              <div style={{ maxWidth: msg.data ? "100%" : "88%", padding: "12px 16px", borderRadius: 16, fontSize: 13.5, lineHeight: 1.65, background: msg.type === "user" ? "linear-gradient(135deg,rgba(91,140,245,.2),rgba(91,140,245,.1))" : "var(--panel2)", border: msg.type === "user" ? "1px solid rgba(91,140,245,.3)" : "1px solid var(--border)", borderBottomRightRadius: msg.type === "user" ? 4 : 16, borderBottomLeftRadius: msg.type === "user" ? 16 : 4 }}>
                <p style={{ whiteSpace: "pre-line" }}>{msg.text}</p>
                {msg.data && <AnalysisCard data={msg.data} lang={lang} />}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,var(--gold),#8B6914)", display: "flex", alignItems: "center", justifyContent: "center" }}>⚖</div>
              <div style={{ padding: "12px 20px", background: "var(--panel2)", border: "1px solid var(--border)", borderRadius: 16, display: "flex", alignItems: "center", gap: 10 }}>
                <div className="ldr"><span /><span /><span /></div>
                <span style={{ fontSize: 12, color: "var(--dim)" }}>Searching {mode !== "rag" ? "RAG database + web" : "RAG database"}...</span>
              </div>
            </div>
          )}
        </div>

        {showQ && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", padding: "0 16px 12px" }}>
            {QUICK.map(p => (
              <button key={p} onClick={() => send(p)} style={{ fontSize: 11, background: "rgba(201,168,76,.07)", border: "1px solid rgba(201,168,76,.2)", color: "var(--dim)", padding: "5px 12px", borderRadius: 20, cursor: "pointer", fontFamily: "var(--sans)" }}>
                {p}
              </button>
            ))}
          </div>
        )}

        <div style={{ borderTop: "1px solid var(--border)", padding: "14px 16px", display: "flex", gap: 10, alignItems: "flex-end" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <textarea value={input} onChange={e => setInput(e.target.value)} placeholder={lc.ph} rows={1}
              style={{ width: "100%", background: "var(--panel2)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 46px 12px 16px", color: "var(--text)", fontSize: 14, fontFamily: "var(--sans)", resize: "none", outline: "none", minHeight: 46, maxHeight: 120 }}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              onInput={e => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
            />
            <button onClick={listening ? () => recRef.current?.stop() : startVoice}
              style={{ position: "absolute", right: 10, bottom: 10, width: 28, height: 28, background: "transparent", border: "none", cursor: "pointer", borderRadius: "50%", fontSize: 14, color: listening ? "var(--err)" : "var(--dim)" }}>
              <i className={`fas fa-microphone${listening ? "-slash" : ""}`} />
            </button>
          </div>
          <button className="btn btn-g" onClick={() => send()} disabled={loading}
            style={{ width: 46, height: 46, padding: 0, borderRadius: 12, fontSize: 16, flexShrink: 0, justifyContent: "center", opacity: loading ? .5 : 1 }}>
            <i className="fas fa-paper-plane" />
          </button>
        </div>
      </div>

      {listening && (
        <div style={{ position: "fixed", bottom: 100, left: "50%", transform: "translateX(-50%)", background: "var(--panel)", border: "1px solid var(--gold)", borderRadius: 16, padding: "20px 32px", textAlign: "center", zIndex: 300, boxShadow: "0 20px 60px rgba(0,0,0,.5)" }}>
          <p style={{ fontSize: 13, color: "var(--dim)" }}>Listening... Speak now</p>
          <div style={{ display: "flex", alignItems: "center", gap: 3, height: 40, justifyContent: "center", margin: "10px 0" }}>
            {[.0,.1,.2,.3,.4].map(d => <div key={d} style={{ width: 4, background: "var(--gold)", borderRadius: 2, animation: `wv 1s ease-in-out ${d}s infinite` }} />)}
          </div>
          <p style={{ fontSize: 12, color: "var(--gold)" }}>{input || "Speak your legal query"}</p>
          <button className="btn btn-sm" style={{ marginTop: 10, background: "var(--err)", color: "#fff", border: "none" }} onClick={() => recRef.current?.stop()}>Stop</button>
        </div>
      )}

      <style>{`@keyframes wv{0%,100%{height:8px}50%{height:36px}}`}</style>
    </div>
  );
}
