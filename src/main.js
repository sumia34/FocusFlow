
renderApp();

import "./styles.css";
import { renderApp } from "./app.js";
import { apiRequest } from "./lib/api.js";
import { renderAuth } from "./auth.js";

async function startApp() {
  try {
    await apiRequest("/auth/me");
    renderApp();
  } catch {
    renderAuth(async () => {
      renderApp();
    });
  }
}

startApp();
