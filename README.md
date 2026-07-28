# ⚖ JusticeLens AI v3 – RAG-Powered Legal Intelligence

## 🤖 Tech Stack (Open Source, No API Keys)

| Component | Technology |
|-----------|-----------|
| **RAG Engine** | TF-IDF Vectorizer (scikit-learn) + Cosine Similarity |
| **Vector Index** | Scipy Sparse Matrix (2,290 chunks, 15,000 features) |
| **PDF Processing** | pdfplumber + pypdf |
| **Web Search** | DuckDuckGo HTML scraping (no API key!) |
| **Backend** | Flask (Python) |
| **Frontend** | React 18 + Chart.js |
| **Knowledge Base** | 149 Supreme Court Judgments (2000–2024) |

---

## 🚀 Setup & Run

### Step 1: Backend
```bash
cd backend
pip install flask pdfplumber pypdf numpy scikit-learn scipy
python app.py
# Runs at: http://localhost:5000
```

### Step 2: Frontend
```bash
cd frontend
npm install
npm start
# Opens: http://localhost:3000
```

---

## 📁 Structure
```
JusticeLens_AI_v3/
├── backend/
│   ├── app.py                ← Flask API + RAG engine
│   └── requirements.txt
│
├── data/
│   └── index/
│       ├── cases.json        ← 148 SC cases (structured)
│       ├── cases_full.pkl    ← Full text for RAG
│       ├── chunks.pkl        ← 2,290 text chunks
│       ├── vectorizer.pkl    ← TF-IDF vectorizer (trained)
│       └── tfidf_matrix.npz  ← Sparse vector matrix
│
├── frontend/
│   └── src/
│       ├── App.jsx           ← Main router
│       ├── pages/
│       │   ├── HomePage.jsx      ← AI Chatbot (RAG + Web)
│       │   ├── RAGSearchPage.jsx ← Direct RAG Query
│       │   ├── DashboardPage.jsx ← Analytics Charts
│       │   ├── SearchPage.jsx    ← Case Database Search
│       │   ├── LawsPage.jsx      ← Laws Explorer
│       │   └── DocumentsPage.jsx ← Document Generators
│       └── services/api.js   ← API layer
└── README.md
```

---

## 🧠 How RAG Works in This Project

```
User Query
    ↓
TF-IDF Vectorization (transform to 15,000-dim vector)
    ↓
Cosine Similarity against 2,290 chunk vectors
    ↓
Top-K most relevant chunks retrieved (from SC PDFs)
    ↓
Extractive QA: most relevant sentences extracted
    ↓
Combined with Legal Knowledge Base → Final Answer
    +
(Optional) DuckDuckGo Web Search → Real-time results
```

---

## 🔌 API Endpoints

| Route | Method | Description |
|-------|--------|-------------|
| `/api/chat` | POST | Main AI chatbot (RAG + Web) |
| `/api/rag?q=...` | GET | Direct RAG vector search |
| `/api/websearch?q=...` | GET | DuckDuckGo web search |
| `/api/stats` | GET | Dashboard statistics |
| `/api/search` | GET | Search SC judgments |
| `/api/laws` | GET | Indian laws database |
| `/api/download/fir` | POST | Generate FIR draft |
| `/api/download/notice` | POST | Generate legal notice |
| `/api/download/affidavit` | POST | Generate affidavit |
| `/api/download/complaint` | POST | Generate consumer complaint |

---

## ✅ Features
- 🤖 **RAG Chatbot** – Answers from 149 SC PDFs using vector search
- 🌐 **Web Augmentation** – DuckDuckGo search (no API key)
- 🔢 **TF-IDF Vector DB** – 2,290 chunks, 15,000 features
- 📊 **Analytics** – Bar, Doughnut, Line charts
- 🔍 **Case Search** – Filter by category/outcome/year
- ⚖ **12 Laws** – Explained with key sections
- 📥 **4 Documents** – FIR, Notice, Affidavit, Complaint
- 🎙️ **Voice Input** – Web Speech API
- 🔊 **Text-to-Speech** – Read responses aloud
- 🌍 **4 Languages** – English, हिंदी, ਪੰਜਾਬੀ, اردو

---

*⚠️ For educational purposes only. Consult a lawyer for actual legal advice.*
