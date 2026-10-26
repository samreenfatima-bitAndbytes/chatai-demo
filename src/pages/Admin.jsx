import { useStore } from "../hooks/useStore";

export default function Admin() {
  const { users, profiles, chatbots, documents, chats } = useStore();

  return (
    <div>
      <div className="section-head">
        <div>
          <h2>Admin</h2>
          <p className="muted" style={{ margin: "0.35rem 0 0" }}>
            Platform overview for the static demo
          </p>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: "1.75rem" }}>
        <div className="stat">
          <strong>{users.length}</strong>
          <span>Users</span>
        </div>
        <div className="stat">
          <strong>{profiles.length}</strong>
          <span>Business profiles</span>
        </div>
        <div className="stat">
          <strong>{chats.length}</strong>
          <span>Chat events</span>
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <h3 style={{ marginTop: 0 }}>Users</h3>
          <ul className="stack-list">
            {users.map((u) => (
              <li key={u.id} className="stack-item">
                <div className="stack-item-body">
                  <strong>{u.fullName}</strong>
                  <p className="muted">{u.email}</p>
                </div>
                <span className="role-tag">{u.isAdmin ? "Admin" : "Business"}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="panel">
          <h3 style={{ marginTop: 0 }}>Tenants & bots</h3>
          <ul className="stack-list">
            {profiles.map((p) => (
              <li key={p.id} className="stack-item">
                <div className="stack-item-body">
                  <strong>{p.name}</strong>
                  <p className="muted">
                    {chatbots.filter((b) => b.businessProfileId === p.id).length} bots ·{" "}
                    {documents.filter((d) => d.businessProfileId === p.id).length} docs
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
