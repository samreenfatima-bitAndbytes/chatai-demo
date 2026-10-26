import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="site">
      <header className="site-nav">
        <Link to="/" className="brand">
          <img src="/brand-mark.png" alt="" />
          <span>ChatAI</span>
        </Link>
        <div className="topbar-actions">
          {user ? (
            <Link className="btn btn-primary" to="/app">
              Open workspace
            </Link>
          ) : (
            <Link className="btn btn-ghost" to="/login">
              Sign in
            </Link>
          )}
        </div>
      </header>

      <section className="bnb-hero">
        <div className="bnb-hero-media" aria-hidden="true">
          <img src="/img/hero-support.jpg" alt="" />
          <div className="bnb-hero-scrim" />
        </div>
        <div className="bnb-wrap">
          <div className="bnb-hero-content">
            <div className="bnb-hero-brand">
              <img src="/brand-mark.png" alt="" />
              ChatAI
            </div>
            <h1>
              Customer answers that live on <em>your</em> website
            </h1>
            <p className="bnb-hero-lead">
              Build a branded assistant, connect your documents, and embed it with one
              script.
            </p>
            <div className="bnb-hero-cta">
              {user ? (
                <Link className="btn btn-primary" to="/app">
                  Open workspace
                </Link>
              ) : (
                <>
                  <Link className="btn btn-primary" to="/login">
                    Try the demo
                  </Link>
                  <Link className="btn btn-outline-light" to="/embed/bot-acme">
                    Preview embed
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bnb-section">
        <div className="bnb-wrap bnb-split">
          <div>
            <div className="bnb-section-head">
              <h2>Built for support teams, not demos</h2>
              <p>
                Keep each company isolated, publish clear prompts, and hand visitors
                answers grounded in your own files.
              </p>
            </div>
            <ul className="bnb-feature-list">
              <li>
                <div>
                  <h3>Separate workspaces</h3>
                  <p>Each business profile keeps its own assistants, styles, and documents.</p>
                </div>
              </li>
              <li>
                <div>
                  <h3>Document library</h3>
                  <p>Upload FAQs, product sheets, and policies your assistant can reference.</p>
                </div>
              </li>
              <li>
                <div>
                  <h3>Embed on any site</h3>
                  <p>Drop in a small script and show a floating chat that matches your brand.</p>
                </div>
              </li>
            </ul>
          </div>
          <figure className="bnb-photo">
            <img
              src="/img/team-desk.jpg"
              alt="Team collaborating at a desk"
              width="1400"
              height="1050"
            />
          </figure>
        </div>
      </section>

      <section className="bnb-section bnb-band">
        <div className="bnb-wrap">
          <div className="bnb-section-head">
            <h2>Three steps to go live</h2>
            <p>From signup to an assistant on your site in a single afternoon.</p>
          </div>
          <div className="bnb-steps">
            <article className="bnb-step">
              <span className="bnb-step-num">01</span>
              <h3>Set up the business</h3>
              <p>Create a profile, invite your team, and define how the assistant should sound.</p>
            </article>
            <article className="bnb-step">
              <span className="bnb-step-num">02</span>
              <h3>Add knowledge</h3>
              <p>Attach FAQs and product docs so replies stay specific to your operation.</p>
            </article>
            <article className="bnb-step">
              <span className="bnb-step-num">03</span>
              <h3>Embed &amp; monitor</h3>
              <p>Paste the widget snippet, then manage assistants from the workspace.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="bnb-section">
        <div className="bnb-wrap bnb-split">
          <figure className="bnb-photo">
            <img
              src="/img/admin-ops.jpg"
              alt="Laptop showing operations dashboard"
              width="1400"
              height="997"
            />
          </figure>
          <div>
            <div className="bnb-section-head">
              <h2>Admin control when you need it</h2>
              <p>
                Platform admins can review users, tenants, and assistants from one panel —
                useful for agencies and internal ops.
              </p>
            </div>
            <Link className="btn btn-primary" to={user?.isAdmin ? "/app/admin" : "/login"}>
              {user?.isAdmin ? "Open admin" : "Sign in"}
            </Link>
          </div>
        </div>
      </section>

      <section className="bnb-section bnb-band">
        <div className="bnb-wrap bnb-cta-panel">
          <div>
            <h2>Ready to put ChatAI on your site?</h2>
            <p>Open the static demo workspace and embed your first assistant in minutes.</p>
          </div>
          <Link className="btn btn-primary" to={user ? "/app" : "/login"}>
            {user ? "Open workspace" : "Get started"}
          </Link>
        </div>
      </section>
    </div>
  );
}
