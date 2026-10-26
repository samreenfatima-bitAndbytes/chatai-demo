export const DEMO_PASSWORD = "DemoPass1!";

export const DEMO_USERS = [
  {
    id: "u-admin",
    email: "admin@chatai.example",
    password: DEMO_PASSWORD,
    fullName: "Admin",
    isAdmin: true,
    businessProfileId: "bp-platform",
  },
  {
    id: "u-ana",
    email: "ana@acme.example",
    password: DEMO_PASSWORD,
    fullName: "Ana Costa",
    isAdmin: false,
    businessProfileId: "bp-acme",
  },
];

export const SEED_PROFILES = [
  {
    id: "bp-platform",
    name: "ChatAI Platform",
    settings: { theme: "admin", tagline: "Platform administration" },
  },
  {
    id: "bp-acme",
    name: "Acme Support",
    settings: {
      industry: "customer_support",
      support_email: "support@acme.example",
    },
  },
];

export const SEED_CHATBOTS = [
  {
    id: "bot-acme",
    name: "Acme Help Assistant",
    prompt:
      "You are Acme Support's website assistant. Answer politely about support hours, billing, and how to reset a password. If unsure, ask the visitor to leave contact details.",
    welcome: "Hi! How can Acme Support help you today?",
    ownerId: "u-ana",
    businessProfileId: "bp-acme",
    suggestions: [
      "What are your support hours?",
      "How do I reset my password?",
      "How do I contact billing?",
    ],
    style: {
      primaryColor: "#004AAD",
      position: "bottom-right",
      bubbleText: "Chat with support",
    },
  },
];

export const SEED_DOCUMENTS = [
  {
    id: "doc-faq",
    businessProfileId: "bp-acme",
    filename: "acme-support-faq.txt",
    title: "Acme Support FAQ",
    content: `Acme Support FAQ
================
Q: Support hours?
A: Mon–Fri 9:00–18:00 (UTC). Weekend tickets get a reply next business day.

Q: Reset password?
A: Open Account → Security → Reset password, or use the Forgot password link on sign-in.

Q: Contact?
A: support@acme.example

Q: Billing?
A: Email billing@acme.example with your account ID. Invoices appear under Account → Billing.

Q: Cancel subscription?
A: Account → Plan → Cancel. Access continues until the end of the current billing period.

Q: Response time?
A: Most chat and email tickets are answered within one business day.`,
  },
];

/** Simple FAQ matcher for simulated AI replies (no OpenAI needed). */
export function replyFromDocs(message, documents) {
  const q = String(message || "").toLowerCase();
  const corpus = documents.map((d) => d.content).join("\n\n");

  const pairs = [];
  const blocks = corpus.split(/\n(?=Q:)/i);
  for (const block of blocks) {
    const qm = block.match(/Q:\s*(.+)/i);
    const am = block.match(/A:\s*([\s\S]+)/i);
    if (qm && am) {
      pairs.push({
        q: qm[1].trim().toLowerCase(),
        a: am[1].trim().split("\n")[0].trim(),
      });
    }
  }

  const hit = pairs.find(
    (p) =>
      q.includes(p.q.slice(0, 12)) ||
      p.q.split(/\W+/).filter((w) => w.length > 3).some((w) => q.includes(w))
  );
  if (hit) return hit.a;

  if (/hour|open|time|support hours/i.test(q)) {
    return "Support is available Mon–Fri 9:00–18:00 (UTC). Weekend tickets get a reply next business day.";
  }
  if (/password|reset|login|sign.?in/i.test(q)) {
    return "Use Account → Security → Reset password, or the Forgot password link on the sign-in page.";
  }
  if (/bill|invoice|payment|subscription|cancel/i.test(q)) {
    return "For billing questions email billing@acme.example with your account ID. Invoices are under Account → Billing.";
  }
  if (/contact|email|support/i.test(q)) {
    return "You can reach Acme Support at support@acme.example.";
  }

  return "Thanks for your message. A specialist can follow up — leave your email if you would like a callback. Meanwhile, try asking about support hours, password reset, or billing.";
}
