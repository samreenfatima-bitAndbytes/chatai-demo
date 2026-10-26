import { useMemo, useState } from "react";
import { replyFromDocs } from "../data/seed";
import { useAuth } from "../hooks/useAuth";
import { useStore } from "../hooks/useStore";

export default function ChatPlayground() {
  const { user } = useAuth();
  const { chatbots, documents, appendChat } = useStore();
  const bot =
    chatbots.find((b) => b.businessProfileId === user.businessProfileId) ||
    chatbots[0];

  const docs = useMemo(
    () =>
      documents.filter(
        (d) => !bot || d.businessProfileId === bot.businessProfileId
      ),
    [documents, bot]
  );

  const [messages, setMessages] = useState(() =>
    bot
      ? [{ role: "bot", text: bot.welcome }]
      : [{ role: "bot", text: "Hello!" }]
  );
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const send = (text) => {
    const msg = String(text || "").trim();
    if (!msg || busy || !bot) return;
    setBusy(true);
    setMessages((m) => [...m, { role: "user", text: msg }]);
    setInput("");
    appendChat({ botId: bot.id, role: "user", text: msg, at: Date.now() });

    window.setTimeout(() => {
      const answer = replyFromDocs(msg, docs);
      setMessages((m) => [...m, { role: "bot", text: answer }]);
      appendChat({ botId: bot.id, role: "bot", text: answer, at: Date.now() });
      setBusy(false);
    }, 450);
  };

  return (
    <div>
      <div className="section-head">
        <div>
          <h2>Try chat</h2>
          <p className="muted" style={{ margin: "0.35rem 0 0" }}>
            {bot?.name || "Assistant"} · answers from local documents
          </p>
        </div>
      </div>

      <div className="chat-layout">
        <div className="panel">
          <div className="messages">
            {messages.map((m, i) => (
              <div key={i} className={`bubble ${m.role}`}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="suggestions">
            {(bot?.suggestions || []).map((s) => (
              <button key={s} type="button" onClick={() => send(s)} disabled={busy}>
                {s}
              </button>
            ))}
          </div>
          <form
            className="composer"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about hours, viewings, documents…"
              disabled={busy}
            />
            <button className="btn btn-primary" type="submit" disabled={busy}>
              Send
            </button>
          </form>
        </div>
        <div className="panel">
          <h3 style={{ marginTop: 0 }}>Context</h3>
          <p className="muted">
            Prompt preview — the static matcher uses docs first; the prompt is shown
            for demo fidelity.
          </p>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "#f8fafc",
              padding: "0.85rem",
              borderRadius: 12,
              fontSize: "0.85rem",
            }}
          >
            {bot?.prompt}
          </pre>
          <p className="muted">{docs.length} document(s) in knowledge base.</p>
        </div>
      </div>
    </div>
  );
}
