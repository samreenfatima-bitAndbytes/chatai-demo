import { useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useStore } from "../hooks/useStore";

export default function Documents() {
  const { user } = useAuth();
  const { documents, addDocument, removeDocument } = useStore();
  const fileRef = useRef(null);
  const [paste, setPaste] = useState("");
  const [filename, setFilename] = useState("notes.txt");

  const list = user.isAdmin
    ? documents
    : documents.filter((d) => d.businessProfileId === user.businessProfileId);

  const ingestText = (name, content) => {
    addDocument({
      filename: name,
      content,
      businessProfileId: user.businessProfileId || "bp-acme",
    });
  };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    ingestText(file.name, text);
    e.target.value = "";
  };

  const onPaste = (e) => {
    e.preventDefault();
    if (!paste.trim()) return;
    ingestText(filename.trim() || "paste.txt", paste.trim());
    setPaste("");
  };

  return (
    <div>
      <div className="section-head">
        <div>
          <h2>Documents</h2>
          <p className="muted" style={{ margin: "0.35rem 0 0" }}>
            Knowledge base used by the simulated FAQ assistant
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => fileRef.current?.click()}
        >
          Upload .txt
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".txt,text/plain"
          hidden
          onChange={onFile}
        />
      </div>

      <div className="grid-2" style={{ marginBottom: "1rem" }}>
        <form className="panel" onSubmit={onPaste}>
          <h3 style={{ marginTop: 0 }}>Paste content</h3>
          <label>
            Filename
            <input value={filename} onChange={(e) => setFilename(e.target.value)} />
          </label>
          <label>
            Text
            <textarea
              value={paste}
              onChange={(e) => setPaste(e.target.value)}
              placeholder="Q: ...&#10;A: ..."
            />
          </label>
          <button className="btn btn-primary" type="submit">
            Add document
          </button>
        </form>
        <div className="panel">
          <h3 style={{ marginTop: 0 }}>How matching works</h3>
          <p className="muted">
            This static build parses Q/A pairs from uploaded text and answers without
            calling OpenAI. Prefer lines like <code>Q:</code> / <code>A:</code>.
          </p>
        </div>
      </div>

      <div className="panel">
        {list.length === 0 ? (
          <p className="empty">No documents yet.</p>
        ) : (
          <ul className="stack-list">
            {list.map((d) => (
              <li key={d.id} className="stack-item">
                <div className="stack-item-body">
                  <strong>{d.filename}</strong>
                  <p className="muted">
                    {String(d.content).slice(0, 100)}
                    {d.content.length > 100 ? "…" : ""}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => removeDocument(d.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
