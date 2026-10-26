import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEMO_USERS,
  SEED_CHATBOTS,
  SEED_DOCUMENTS,
  SEED_PROFILES,
} from "../data/seed";

const KEY = "chatai_static_data_v3";
const Ctx = createContext(null);

function seed() {
  return {
    users: DEMO_USERS.map(({ password, ...u }) => ({ ...u, active: true })),
    profiles: SEED_PROFILES.map((p) => ({ ...p })),
    chatbots: SEED_CHATBOTS.map((b) => ({
      ...b,
      suggestions: [...b.suggestions],
      style: { ...b.style },
    })),
    documents: SEED_DOCUMENTS.map((d) => ({ ...d })),
    chats: [],
  };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    return { ...seed(), ...JSON.parse(raw) };
  } catch {
    return seed();
  }
}

export function StoreProvider({ children }) {
  const [data, setData] = useState(() => load());
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(data));
  }, [data]);

  const notify = useCallback((msg) => {
    setToast(msg);
    window.clearTimeout(notify._t);
    notify._t = window.setTimeout(() => setToast(null), 2400);
  }, []);

  const patch = useCallback((key, updater) => {
    setData((prev) => {
      const cur = prev[key];
      const next = typeof updater === "function" ? updater(cur) : updater;
      return { ...prev, [key]: next };
    });
  }, []);

  const resetDemo = useCallback(() => {
    const fresh = seed();
    setData(fresh);
    localStorage.setItem(KEY, JSON.stringify(fresh));
    notify("Demo data reset");
  }, [notify]);

  const updateChatbot = useCallback(
    (id, changes) => {
      patch("chatbots", (list) =>
        list.map((b) => (b.id === id ? { ...b, ...changes } : b))
      );
      notify("Chatbot saved");
    },
    [notify, patch]
  );

  const addDocument = useCallback(
    (doc) => {
      const row = {
        id: `doc-${Date.now()}`,
        title: doc.filename,
        ...doc,
      };
      patch("documents", (list) => [row, ...list]);
      notify(`Uploaded ${row.filename}`);
      return row;
    },
    [notify, patch]
  );

  const removeDocument = useCallback(
    (id) => {
      patch("documents", (list) => list.filter((d) => d.id !== id));
      notify("Document removed");
    },
    [notify, patch]
  );

  const appendChat = useCallback(
    (entry) => {
      patch("chats", (list) => [...list, { id: `c-${Date.now()}`, ...entry }]);
    },
    [patch]
  );

  const value = useMemo(
    () => ({
      ...data,
      toast,
      notify,
      patch,
      resetDemo,
      updateChatbot,
      addDocument,
      removeDocument,
      appendChat,
    }),
    [
      data,
      toast,
      notify,
      patch,
      resetDemo,
      updateChatbot,
      addDocument,
      removeDocument,
      appendChat,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore requires StoreProvider");
  return ctx;
}
