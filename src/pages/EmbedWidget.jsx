import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { replyFromDocs } from "../data/seed";
import { useStore } from "../hooks/useStore";

function preferOpenChat() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(min-width: 768px)").matches;
}

export default function EmbedWidget() {
  const { botId } = useParams();
  const { chatbots, documents } = useStore();
  const bot = chatbots.find((b) => b.id === botId) || chatbots[0];
  const docs = useMemo(
    () => documents.filter((d) => d.businessProfileId === bot?.businessProfileId),
    [documents, bot]
  );

  const [open, setOpen] = useState(preferOpenChat);
  const [messages, setMessages] = useState(() => [
    { role: "bot", text: bot?.welcome || "Hello!" },
  ]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => {
      if (!mq.matches) setOpen(false);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (!bot) {
    return (
      <div className="login-panel" style={{ minHeight: "100vh" }}>
        <div>
          <p>Bot not found.</p>
          <Link to="/">Home</Link>
        </div>
      </div>
    );
  }

  const color = bot.style?.primaryColor || "#004AAD";

  const scrollToId = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const send = (text) => {
    const msg = String(text || "").trim();
    if (!msg) return;
    setMessages((m) => [...m, { role: "user", text: msg }]);
    setInput("");
    window.setTimeout(() => {
      setMessages((m) => [
        ...m,
        { role: "bot", text: replyFromDocs(msg, docs) },
      ]);
    }, 400);
  };

  return (
    <div className="acme-site">
      <div className="acme-demo-bar">
        <span>ChatAI embed preview · sample customer site</span>
        <Link to="/">Back to ChatAI</Link>
      </div>

      <header className="acme-nav">
        <div className="acme-brand">
          <span className="acme-mark" style={{ background: color }} />
          Acme Support
        </div>
        <nav>
          <button type="button" onClick={() => scrollToId("guides")}>
            Guides
          </button>
          <button type="button" onClick={() => scrollToId("status")}>
            Status
          </button>
          <button type="button" onClick={() => scrollToId("contact")}>
            Contact
          </button>
        </nav>
      </header>

      <section className="acme-hero">
        <img src="/img/admin-ops.jpg" alt="" className="acme-hero-img" />
        <div className="acme-hero-scrim" />
        <div className="acme-hero-copy">
          <p className="acme-kicker">Help center</p>
          <h1>Answers for your Acme account</h1>
          <p>
            Browse guides or ask the assistant about hours, password resets, and billing —
            this page shows how ChatAI embeds on a customer site.
          </p>
          <div className="acme-hero-actions">
            <button
              type="button"
              className="btn btn-primary"
              style={{ background: color }}
              onClick={() => setOpen(true)}
            >
              Ask the assistant
            </button>
            <button
              type="button"
              className="btn btn-ghost acme-ghost"
              onClick={() => {
                document.getElementById("guides")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              Browse guides
            </button>
          </div>
        </div>
      </section>

      <section className="acme-section" id="guides">
        <h2>Popular guides</h2>
        <div className="acme-cards">
          <article>
            <strong>Reset your password</strong>
            <p>Account → Security → Reset password</p>
          </article>
          <article>
            <strong>Find an invoice</strong>
            <p>Account → Billing → Invoices</p>
          </article>
          <article>
            <strong>Change your plan</strong>
            <p>Account → Plan → Upgrade or cancel</p>
          </article>
        </div>
      </section>

      <section className="acme-section acme-section-muted" id="status">
        <h2>Support hours</h2>
        <p>
          Mon–Fri 9:00–18:00 (UTC). Most tickets get a reply within one business day.
        </p>
      </section>

      <section className="acme-section" id="contact">
        <h2>Contact</h2>
        <p>support@acme.example · billing@acme.example</p>
      </section>

      {open ? (
        <div className="embed-widget" style={{ ["--embed"]: color }}>
          <div className="embed-widget-head">
            <div>
              <strong>{bot.name}</strong>
              <span>{bot.style?.bubbleText}</span>
            </div>
            <button
              type="button"
              className="embed-widget-close"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>
          <div className="messages embed-messages">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`bubble ${m.role}`}
                style={m.role === "user" ? { background: color } : undefined}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div className="suggestions embed-suggestions">
            {bot.suggestions.map((s) => (
              <button key={s} type="button" onClick={() => send(s)}>
                {s}
              </button>
            ))}
          </div>
          <form
            className="composer embed-composer"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
            />
            <button
              className="btn btn-primary"
              type="submit"
              style={{ background: color }}
            >
              Send
            </button>
          </form>
        </div>
      ) : (
        <button
          type="button"
          className="embed-fab"
          style={{ background: color }}
          onClick={() => setOpen(true)}
        >
          {bot.style?.bubbleText || "Chat"}
        </button>
      )}
    </div>
  );
}
