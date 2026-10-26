import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { DEMO_PASSWORD } from "../data/seed";
import { useAuth } from "../hooks/useAuth";

const ACCOUNTS = [
  {
    id: "business",
    label: "Business",
    email: "ana@acme.example",
    password: DEMO_PASSWORD,
  },
  {
    id: "admin",
    label: "Admin",
    email: "admin@chatai.example",
    password: DEMO_PASSWORD,
  },
];

export default function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [account, setAccount] = useState("business");
  const [email, setEmail] = useState(ACCOUNTS[0].email);
  const [password, setPassword] = useState(ACCOUNTS[0].password);
  const [error, setError] = useState("");

  if (user) {
    const dest = loc.state?.from?.pathname || "/app";
    return <Navigate to={dest} replace />;
  }

  const pickAccount = (id) => {
    const next = ACCOUNTS.find((a) => a.id === id);
    if (!next) return;
    setAccount(id);
    setEmail(next.email);
    setPassword(next.password);
    setError("");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const res = login(email, password);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    nav(loc.state?.from?.pathname || "/app");
  };

  return (
    <div className="login-screen">
      <div className="login-screen-bg" aria-hidden="true" />

      <div className="login-stage">
        <form className="login-form" onSubmit={onSubmit}>
          <Link to="/" className="login-logo">
            <img src="/brand-mark.png" alt="" />
            <span>ChatAI</span>
          </Link>
          <p className="login-lead">
            Sign in to configure your assistant and try FAQ chat in the browser.
          </p>

          <div className="login-tabs" role="tablist" aria-label="Demo accounts">
            {ACCOUNTS.map((a) => (
              <button
                key={a.id}
                type="button"
                role="tab"
                aria-selected={account === a.id}
                className={account === a.id ? "is-active" : undefined}
                onClick={() => pickAccount(a.id)}
              >
                {a.label}
              </button>
            ))}
          </div>

          {error ? <p className="error">{error}</p> : null}

          <label>
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>

          <button className="btn btn-primary" type="submit">
            Continue
          </button>
        </form>

        <aside className="login-preview" aria-hidden="true">
          <div className="login-preview-window">
            <div className="login-preview-bar">
              <span />
              <span />
              <span />
            </div>
            <div className="login-preview-thread">
              <div className="login-preview-msg bot">
                Hi! How can Acme Support help you today?
              </div>
              <div className="login-preview-msg user">How do I reset my password?</div>
              <div className="login-preview-msg bot">
                Use Account → Security → Reset password, or Forgot password on sign-in.
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
