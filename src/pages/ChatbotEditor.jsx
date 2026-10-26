import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useStore } from "../hooks/useStore";

function formFromBot(bot) {
  if (!bot) return null;
  return {
    name: bot.name,
    prompt: bot.prompt,
    welcome: bot.welcome,
    suggestions: (bot.suggestions || []).join("\n"),
    primaryColor: bot.style?.primaryColor || "#004AAD",
    bubbleText: bot.style?.bubbleText || "Chat",
  };
}

export default function ChatbotEditor() {
  const { user } = useAuth();
  const { chatbots, updateChatbot } = useStore();

  const bot = useMemo(() => {
    if (user.isAdmin) return chatbots[0];
    return (
      chatbots.find((b) => b.businessProfileId === user.businessProfileId) ||
      chatbots[0]
    );
  }, [chatbots, user]);

  const [form, setForm] = useState(() => formFromBot(bot));

  useEffect(() => {
    setForm(formFromBot(bot));
  }, [bot]);

  if (!bot || !form) {
    return <p className="empty">No chatbot found for this account.</p>;
  }

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = (e) => {
    e.preventDefault();
    updateChatbot(bot.id, {
      name: form.name.trim(),
      prompt: form.prompt.trim(),
      welcome: form.welcome.trim(),
      suggestions: form.suggestions
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      style: {
        ...bot.style,
        primaryColor: form.primaryColor,
        bubbleText: form.bubbleText.trim() || "Chat",
      },
    });
  };

  return (
    <div>
      <div className="section-head">
        <div>
          <h2>Chatbot</h2>
          <p className="muted" style={{ margin: "0.35rem 0 0" }}>
            Prompt, welcome message, suggestions, and widget style
          </p>
        </div>
      </div>
      <form className="panel" onSubmit={save}>
        <div className="grid-2">
          <label>
            Name
            <input value={form.name} onChange={set("name")} required />
          </label>
          <label>
            Welcome message
            <input value={form.welcome} onChange={set("welcome")} required />
          </label>
        </div>
        <label>
          System prompt
          <textarea value={form.prompt} onChange={set("prompt")} required />
        </label>
        <label>
          Suggestion chips (one per line)
          <textarea value={form.suggestions} onChange={set("suggestions")} />
        </label>
        <div className="grid-2">
          <label>
            Primary color
            <input type="color" value={form.primaryColor} onChange={set("primaryColor")} />
          </label>
          <label>
            Widget bubble text
            <input value={form.bubbleText} onChange={set("bubbleText")} />
          </label>
        </div>
        <button className="btn btn-primary" type="submit">
          Save chatbot
        </button>
      </form>
    </div>
  );
}
