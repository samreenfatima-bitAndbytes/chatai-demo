import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useStore } from "../hooks/useStore";

export default function Dashboard() {
  const { user } = useAuth();
  const { chatbots, documents, chats, profiles } = useStore();

  const profile = profiles.find((p) => p.id === user.businessProfileId);
  const myBots = user.isAdmin
    ? chatbots
    : chatbots.filter((b) => b.businessProfileId === user.businessProfileId);
  const myDocs = user.isAdmin
    ? documents
    : documents.filter((d) => d.businessProfileId === user.businessProfileId);
  const myChats = chats.filter((c) =>
    myBots.some((b) => b.id === c.botId)
  );

  return (
    <div>
      <div className="section-head">
        <div>
          <h2>Dashboard</h2>
          <p className="muted" style={{ margin: "0.35rem 0 0" }}>
            {profile?.name || "Workspace"} · signed in as {user.fullName}
          </p>
        </div>
        <Link className="btn btn-primary" to="/app/chat">
          Open chat
        </Link>
      </div>

      <div className="grid-3" style={{ marginBottom: "1.75rem" }}>
        <div className="stat">
          <strong>{myBots.length}</strong>
          <span>Chatbots</span>
        </div>
        <div className="stat">
          <strong>{myDocs.length}</strong>
          <span>Knowledge docs</span>
        </div>
        <div className="stat">
          <strong>{myChats.length}</strong>
          <span>Demo messages logged</span>
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <h3 style={{ marginTop: 0 }}>Your assistants</h3>
          {myBots.length === 0 ? (
            <p className="empty">No chatbots yet.</p>
          ) : (
            <ul className="stack-list">
              {myBots.map((b) => (
                <li key={b.id} className="stack-item">
                  <div className="stack-item-body">
                    <strong>{b.name}</strong>
                    <p className="muted">{b.welcome}</p>
                  </div>
                  <Link className="btn btn-ghost" to="/app/chatbot">
                    Edit
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="panel">
          <h3 style={{ marginTop: 0 }}>Quick links</h3>
          <p className="muted">Same flows as the FastAPI app, stored in localStorage.</p>
          <div className="quick-links">
            <Link className="btn btn-ghost" to="/app/documents">
              Manage FAQ documents
            </Link>
            <Link className="btn btn-ghost" to="/app/chatbot">
              Edit prompt & style
            </Link>
            <Link className="btn btn-ghost" to="/embed/bot-acme">
              Preview embed widget
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
