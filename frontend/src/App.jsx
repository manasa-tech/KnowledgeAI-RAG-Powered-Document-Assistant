import { useState, useRef } from "react";
import {
  Brain, MessageSquare, FileText, Upload, Search, Settings,
  Plus, Sparkles, Send, Paperclip, BookOpen, Menu, X,
  Zap, Library, CircleHelp, MoreHorizontal, Clock, ArrowUpRight,
  Check, Trash2, ChevronDown
} from "lucide-react";
import "./App.css";

const suggestions = [
  { icon: FileText, title: "Summarize a document", text: "Summarize my study material into clear notes." },
  { icon: BookOpen, title: "Help me understand", text: "Explain a difficult topic in simple words." },
  { icon: Brain, title: "Create a quiz", text: "Create 5 multiple-choice questions with answers." },
  { icon: Sparkles, title: "Generate study notes", text: "Create structured revision notes for my exam." },
];

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("Chat");
  const [error, setError] = useState("");
  const fileRef = useRef(null);
  const inputRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  function newChat() {
    setMessages([]);
    setInput("");
    setError("");
    setActivePage("Chat");
    setMenuOpen(false);
  }

  function handleFiles(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const accepted = files.filter(file =>
      file.type === "application/pdf" ||
      file.type.startsWith("text/") ||
      /\.(pdf|txt|md|csv)$/i.test(file.name)
    );

    if (!accepted.length) {
      setError("Please select a PDF, TXT, MD, or CSV document.");
      return;
    }

    setDocuments(previous => [
      ...previous,
      ...accepted.map(file => ({
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        file
      }))
    ]);
    setError("");
    event.target.value = "";
  }

  async function sendMessage(text = input) {
    const question = text.trim();
    if (!question || loading) return;

    setMessages(previous => [...previous, { role: "user", content: question }]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          message: question,
          documents: documents.map(item => item.file.name)
        })
      });

      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? "Your backend does not have /api/chat yet. Connect the FastAPI backend to enable AI answers."
            : `Backend error (${response.status}). Please check your API server.`
        );
      }

      const data = await response.json();
      const answer = data.answer || data.response || data.message;

      if (!answer) throw new Error("The backend returned no answer.");

      setMessages(previous => [
        ...previous,
        { role: "assistant", content: answer }
      ]);
    } catch (err) {
      const message = err.message.includes("Failed to fetch")
        ? "Cannot connect to the AI backend. Start your FastAPI server and try again."
        : err.message;

      setMessages(previous => [
        ...previous,
        {
          role: "assistant",
          content: `I couldn't process that request. ${message}`
        }
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  async function uploadDocument(item) {
    const form = new FormData();
    form.append("file", item.file);

    try {
      const response = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        body: form
      });

      if (!response.ok) {
        throw new Error("The backend upload endpoint is not ready yet.");
      }

      const data = await response.json();
      setDocuments(previous => previous.map(doc =>
        doc.id === item.id ? { ...doc, uploaded: true } : doc
      ));
      setError(data.message || `${item.file.name} uploaded successfully.`);
    } catch (err) {
      setError(
        `${item.file.name}: ${err.message}. Your file is listed locally, but has not been uploaded to the AI backend.`
      );
    }
  }

  function selectPage(page) {
    setActivePage(page);
    setMenuOpen(false);
    if (page === "Chat") return;
    if (page === "Documents") fileRef.current?.click();
  }

  return (
    <div className="app-shell">
      {menuOpen && (
        <button
          className="mobile-overlay"
          aria-label="Close sidebar"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand-row">
          <div className="brand-icon"><Brain size={23} /></div>
          <span className="brand-name">Knowledge<span>AI</span></span>
          <button className="icon-button mobile-close" onClick={() => setMenuOpen(false)}>
            <X size={19} />
          </button>
        </div>

        <button className="new-chat-button" onClick={newChat}>
          <Plus size={18} /> New conversation
          <span className="shortcut">⌘ K</span>
        </button>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="navigation">
          <button className={activePage === "Chat" ? "nav-item active" : "nav-item"} onClick={() => selectPage("Chat")}>
            <MessageSquare size={18} /> AI Chat
          </button>
          <button className={activePage === "Documents" ? "nav-item active" : "nav-item"} onClick={() => selectPage("Documents")}>
            <Library size={18} /> My Documents
            {documents.length > 0 && <span className="nav-count">{documents.length}</span>}
          </button>
          <button className={activePage === "Study Tools" ? "nav-item active" : "nav-item"} onClick={() => selectPage("Study Tools")}>
            <BookOpen size={18} /> Study Tools
          </button>
        </nav>

        <div className="sidebar-label recent-label">RECENT CHATS</div>
        <div className="recent-list">
          {messages.length > 0 ? (
            <button className="recent-chat" onClick={() => setActivePage("Chat")}>
              <Clock size={15} /> Current conversation
            </button>
          ) : (
            <p className="empty-recent">Your conversations will appear here.</p>
          )}
        </div>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon"><Zap size={17} /></div>
            <div>
              <strong>Your AI workspace</strong>
              <p>Learn something new today.</p>
            </div>
          </div>
          <button className="nav-item settings-button" onClick={() => setActivePage("Settings")}>
            <Settings size={18} /> Settings
          </button>
          <div className="profile-row">
            <div className="profile-avatar">M</div>
            <div className="profile-info">
              <strong>My Workspace</strong>
              <span>Personal account</span>
            </div>
            <MoreHorizontal size={19} className="muted-icon" />
          </div>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-menu" onClick={() => setMenuOpen(true)}>
              <Menu size={21} />
            </button>
            <span className="breadcrumb">Workspace</span>
            <span className="breadcrumb-divider">/</span>
            <span className="breadcrumb-current">{activePage}</span>
            <ChevronDown size={15} className="muted-icon" />
          </div>
          <div className="topbar-right">
            <div className="status-pill"><span className="status-dot" /> AI Workspace</div>
            <button className="icon-button help-button" title="Help"><CircleHelp size={19} /></button>
          </div>
        </header>

        {activePage === "Settings" ? (
          <section className="simple-page">
            <div className="section-icon"><Settings size={23} /></div>
            <h1>Settings</h1>
            <p>KnowledgeAI workspace preferences.</p>
            <div className="settings-card">
              <span>AI backend URL</span>
              <code>{API_URL}</code>
              <span className="settings-note">Configure VITE_API_URL in your frontend .env file.</span>
            </div>
          </section>
        ) : activePage === "Documents" ? (
          <section className="simple-page">
            <div className="section-icon"><Library size={23} /></div>
            <h1>My Documents</h1>
            <p>Manage your study materials and knowledge sources.</p>
            <button className="primary-button" onClick={() => fileRef.current?.click()}>
              <Upload size={17} /> Add documents
            </button>
            <div className="document-list">
              {documents.length === 0 ? (
                <div className="document-empty">
                  <FileText size={30} />
                  <strong>No documents yet</strong>
                  <span>Upload a PDF or text file to get started.</span>
                </div>
              ) : documents.map(item => (
                <div className="document-row" key={item.id}>
                  <div className="document-file-icon"><FileText size={20} /></div>
                  <div className="document-details">
                    <strong>{item.file.name}</strong>
                    <span>{(item.file.size / 1024).toFixed(1)} KB · {item.uploaded ? "Uploaded" : "Selected locally"}</span>
                  </div>
                  {item.uploaded ? (
                    <Check size={18} className="success-icon" />
                  ) : (
                    <button className="small-action" onClick={() => uploadDocument(item)}>Upload</button>
                  )}
                  <button className="icon-button" title="Remove document" onClick={() => setDocuments(previous => previous.filter(doc => doc.id !== item.id))}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        ) : activePage === "Study Tools" ? (
          <section className="simple-page">
            <div className="section-icon"><BookOpen size={23} /></div>
            <h1>Study Tools</h1>
            <p>Turn your study materials into useful revision resources.</p>
            <div className="tools-grid">
              {suggestions.map(({ icon: Icon, title, text }) => (
                <button className="tool-card" key={title} onClick={() => { setActivePage("Chat"); sendMessage(text); }}>
                  <Icon size={22} />
                  <strong>{title}</strong>
                  <span>{text}</span>
                  <ArrowUpRight size={17} className="tool-arrow" />
                </button>
              ))}
            </div>
          </section>
        ) : (
          <>
            <section className={`chat-area ${messages.length ? "has-messages" : ""}`}>
              {messages.length === 0 ? (
                <div className="welcome-content">
                  <div className="welcome-symbol"><Brain size={30} /></div>
                  <div className="eyebrow"><Sparkles size={14} /> YOUR PERSONAL KNOWLEDGE ASSISTANT</div>
                  <h1>Knowledge starts<br />with a <span>question.</span></h1>
                  <p className="welcome-description">
                    Your documents, ideas, and learning — all in one place.
                    Ask questions, discover insights, and learn faster with AI.
                  </p>

                  <div className="suggestion-grid">
                    {suggestions.map(({ icon: Icon, title, text }) => (
                      <button className="suggestion-card" key={title} onClick={() => sendMessage(text)}>
                        <div className="suggestion-icon"><Icon size={19} /></div>
                        <div className="suggestion-copy">
                          <strong>{title}</strong>
                          <span>{text}</span>
                        </div>
                        <ArrowUpRight size={16} className="suggestion-arrow" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="message-list">
                  {messages.map((message, index) => (
                    <article className={`message ${message.role}`} key={`${index}-${message.role}`}>
                      <div className={`message-avatar ${message.role === "assistant" ? "assistant-avatar" : ""}`}>
                        {message.role === "assistant" ? <Brain size={18} /> : "M"}
                      </div>
                      <div className="message-body">
                        <div className="message-author">{message.role === "assistant" ? "KnowledgeAI" : "You"}</div>
                        <div className="message-content">{message.content}</div>
                      </div>
                    </article>
                  ))}
                  {loading && (
                    <article className="message assistant">
                      <div className="message-avatar assistant-avatar"><Brain size={18} /></div>
                      <div className="message-body">
                        <div className="message-author">KnowledgeAI</div>
                        <div className="typing-indicator"><span /><span /><span /></div>
                      </div>
                    </article>
                  )}
                </div>
              )}
            </section>

            <section className="composer-section">
              {documents.length > 0 && (
                <div className="attached-documents">
                  {documents.map(item => (
                    <div className="attached-document" key={item.id}>
                      <FileText size={14} /> {item.file.name}
                      <button onClick={() => setDocuments(previous => previous.filter(doc => doc.id !== item.id))} aria-label="Remove attachment"><X size={13} /></button>
                    </div>
                  ))}
                </div>
              )}

              <form className="composer" onSubmit={event => { event.preventDefault(); sendMessage(); }}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={event => setInput(event.target.value)}
                  onKeyDown={event => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Ask anything about your documents..."
                  rows={2}
                  aria-label="Message KnowledgeAI"
                />
                <div className="composer-toolbar">
                  <div className="composer-tools">
                    <button type="button" className="composer-tool" onClick={() => fileRef.current?.click()}>
                      <Paperclip size={17} /> <span>Attach files</span>
                    </button>
                    <span className="composer-divider" />
                    <span className="composer-hint"><Sparkles size={14} /> AI-powered learning</span>
                  </div>
                  <button type="submit" className="send-button" disabled={!input.trim() || loading} aria-label="Send message">
                    {loading ? <span className="send-spinner" /> : <Send size={17} />}
                  </button>
                </div>
              </form>

              {error && <div className="notice">{error}<button onClick={() => setError("")}><X size={14} /></button></div>}

              <p className="disclaimer">KnowledgeAI can make mistakes. Verify important information from your original sources.</p>
            </section>
          </>
        )}

        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.txt,.md,.csv,text/*,application/pdf"
          multiple
          hidden
          onChange={handleFiles}
        />
      </main>
    </div>
  );
}

export default App;
