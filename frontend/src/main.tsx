import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
const authId = import.meta.env.VITE_OAUTH_ID;
createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={authId}>
    <App />
    <Toaster position="top-center" richColors />
  </GoogleOAuthProvider>
);
