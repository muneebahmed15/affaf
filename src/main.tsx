import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import Admin from "./app/Admin.tsx";
import "./styles/index.css";

// Simple path-based routing: /admin → Admin panel, everything else → Store
const isAdmin = window.location.pathname.startsWith("/admin");

createRoot(document.getElementById("root")!).render(
  isAdmin ? <Admin /> : <App />
);
