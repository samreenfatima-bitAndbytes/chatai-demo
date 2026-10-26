import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useStore } from "./hooks/useStore";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import ChatbotEditor from "./pages/ChatbotEditor";
import Documents from "./pages/Documents";
import ChatPlayground from "./pages/ChatPlayground";
import Admin from "./pages/Admin";
import EmbedWidget from "./pages/EmbedWidget";

function RequireAuth({ children, adminOnly = false }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: loc }} />;
  if (adminOnly && !user.isAdmin) return <Navigate to="/app" replace />;
  return children;
}

export default function App() {
  const { toast } = useStore();

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/embed/:botId" element={<EmbedWidget />} />
        <Route
          path="/app"
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="chatbot" element={<ChatbotEditor />} />
          <Route path="documents" element={<Documents />} />
          <Route path="chat" element={<ChatPlayground />} />
          <Route
            path="admin"
            element={
              <RequireAuth adminOnly>
                <Admin />
              </RequireAuth>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {toast ? <div className="toast">{toast}</div> : null}
    </>
  );
}
