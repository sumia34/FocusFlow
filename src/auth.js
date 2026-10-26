
import { apiRequest } from "./lib/api.js";

export function renderAuth(onAuthenticated = () => {}) {
  const app = document.querySelector("#app");

  if (!app) {
    console.error('FocusFlow: missing element with id="app".');
    return;
  }

  app.innerHTML = `
    <section class="auth-page">
      <div class="auth-card">
        <div class="auth-brand">
          <span class="auth-logo">F</span>
          <span>FocusFlow</span>
        </div>

        <p class="auth-eyebrow">YOUR SPACE TO FOCUS</p>
        <h1 id="auth-title">Welcome back</h1>
        <p class="auth-subtitle" id="auth-subtitle">
          Sign in to continue your journey.
        </p>

        <div class="auth-tabs">
          <button type="button" id="login-tab" class="active">
            Sign in
          </button>
          <button type="button" id="register-tab">
            Create account
          </button>
        </div>

        <form id="auth-form">
          <div id="name-field" hidden>
            <label for="auth-name">Full name</label>
            <input
              id="auth-name"
              name="name"
              type="text"
              autocomplete="name"
              placeholder="Enter your full name"
              minlength="2"
            />
          </div>

          <label for="auth-email">Email address</label>
          <input
            id="auth-email"
            name="email"
            type="email"
            autocomplete="email"
            placeholder="you@example.com"
            required
          />

          <label for="auth-password">Password</label>
          <input
            id="auth-password"
            name="password"
            type="password"
            autocomplete="current-password"
            placeholder="Enter your password"
            minlength="8"
            required
          />

          <p id="auth-message" role="status" aria-live="polite"></p>

          <button type="submit" id="auth-submit">
            Sign in
          </button>
        </form>

        <p class="auth-footer">Small steps. Real progress.</p>
      </div>
    </section>
  `;

  if (!document.querySelector("#focusflow-auth-styles")) {
    const style = document.createElement("style");
    style.id = "focusflow-auth-styles";

    style.textContent = `
      .auth-page {
        box-sizing: border-box;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 28px 16px;
        background: #f5f6fb;
        font-family: inherit;
      }

      .auth-card {
        box-sizing: border-box;
        width: 100%;
        max-width: 440px;
        padding: 36px;
        background: #fff;
        border: 1px solid #e7e8f0;
        border-radius: 22px;
        box-shadow: 0 18px 55px rgba(35, 40, 80, .08);
      }

      .auth-brand {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 32px;
        font-size: 21px;
        font-weight: 750;
        color: #25264b;
      }

      .auth-logo {
        display: grid;
        place-items: center;
        width: 38px;
        height: 38px;
        border-radius: 12px;
        background: #6258df;
        color: white;
      }

      .auth-eyebrow {
        color: #6258df;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 2px;
      }

      .auth-card h1 {
        margin: 10px 0;
        color: #25264b;
        font-size: 30px;
      }

      .auth-subtitle {
        margin-bottom: 25px;
        color: #74768b;
        line-height: 1.6;
      }

      .auth-tabs {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px;
        padding: 5px;
        margin-bottom: 25px;
        border-radius: 12px;
        background: #f2f2f9;
      }

      .auth-tabs button {
        padding: 11px 6px;
        border: 0;
        border-radius: 9px;
        background: transparent;
        color: #696b80;
        cursor: pointer;
        font: inherit;
      }

      .auth-tabs button.active {
        background: white;
        color: #5147ca;
        font-weight: 700;
        box-shadow: 0 2px 8px #20204012;
      }

      #auth-form label {
        display: block;
        margin: 16px 0 7px;
        color: #35364f;
        font-size: 13px;
        font-weight: 650;
      }

      #auth-form input {
        box-sizing: border-box;
        width: 100%;
        padding: 13px 14px;
        border: 1px solid #dfe0eb;
        border-radius: 10px;
        background: white;
        color: #25264b;
        font: inherit;
      }

      #auth-form input:focus {
        outline: 2px solid #6258df55;
        border-color: #6258df;
      }

      #auth-submit {
        width: 100%;
        margin-top: 18px;
        padding: 14px;
        border: 0;
        border-radius: 10px;
        background: #6258df;
        color: white;
        font: inherit;
        font-weight: 750;
        cursor: pointer;
      }

      #auth-submit:disabled {
        opacity: .65;
        cursor: wait;
      }

      #auth-message {
        min-height: 20px;
        margin: 12px 0 0;
        color: #b42318;
        font-size: 13px;
        line-height: 1.5;
        overflow-wrap: anywhere;
      }

      #auth-message.success {
        color: #16803d;
      }

      .auth-footer {
        margin: 22px 0 0;
        text-align: center;
        color: #85869a;
        font-size: 12px;
      }

      @media (max-width: 480px) {
        .auth-card {
          padding: 25px 20px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  let mode = "login";
  let isSubmitting = false;

  const form = app.querySelector("#auth-form");
  const nameField = app.querySelector("#name-field");
  const nameInput = app.querySelector("#auth-name");
  const emailInput = app.querySelector("#auth-email");
  const passwordInput = app.querySelector("#auth-password");
  const submitButton = app.querySelector("#auth-submit");
  const message = app.querySelector("#auth-message");
  const loginTab = app.querySelector("#login-tab");
  const registerTab = app.querySelector("#register-tab");
  const title = app.querySelector("#auth-title");
  const subtitle = app.querySelector("#auth-subtitle");

  function showMessage(text, success = false) {
    message.textContent = text;
    message.classList.toggle("success", success);
  }

  function setMode(nextMode) {
    if (isSubmitting) return;

    mode = nextMode;
    const isLogin = mode === "login";

    title.textContent = isLogin
      ? "Welcome back"
      : "Create your account";

    subtitle.textContent = isLogin
      ? "Sign in to continue your journey."
      : "Start building meaningful daily habits.";

    submitButton.textContent = isLogin
      ? "Sign in"
      : "Create account";

    nameField.hidden = isLogin;
    nameInput.required = !isLogin;

    passwordInput.autocomplete = isLogin
      ? "current-password"
      : "new-password";

    passwordInput.placeholder = isLogin
      ? "Enter your password"
      : "Create a password (8+ characters)";

    loginTab.classList.toggle("active", isLogin);
    registerTab.classList.toggle("active", !isLogin);

    showMessage("");
  }

  loginTab.addEventListener("click", () => setMode("login"));
  registerTab.addEventListener("click", () => setMode("register"));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    const submittedMode = mode;
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    showMessage("");

    if (submittedMode === "register" && name.length < 2) {
      showMessage("Please enter your name (at least 2 characters).");
      nameInput.focus();
      return;
    }

    if (!email || !password) {
      showMessage("Please enter your email and password.");
      return;
    }

    if (submittedMode === "register" && password.length < 8) {
      showMessage("Your password must be at least 8 characters.");
      passwordInput.focus();
      return;
    }

    isSubmitting = true;
    submitButton.disabled = true;
    submitButton.textContent =
      submittedMode === "login"
        ? "Signing in..."
        : "Creating account...";

    try {
      const endpoint =
        submittedMode === "login"
          ? "/auth/login"
          : "/auth/register";

      const body =
        submittedMode === "login"
          ? { email, password }
          : { name, email, password };

      const result = await apiRequest(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!result || result.success === false) {
        throw new Error(
          result?.message || "The server rejected the request."
        );
      }

      if (submittedMode === "register") {
        // Switch modes first because setMode clears the message.
        mode = "register";
        setMode("login");

        emailInput.value = email;
        passwordInput.value = "";

        showMessage(
          result.message || "Account created successfully! Please sign in.",
          true
        );

        emailInput.focus();
        return;
      }

      showMessage("Signed in successfully! Opening FocusFlow...", true);

      await onAuthenticated();
    } catch (error) {
      console.error("FocusFlow authentication error:", error);

      showMessage(
        error?.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      isSubmitting = false;
      submitButton.disabled = false;
      submitButton.textContent =
        mode === "login" ? "Sign in" : "Create account";
    }
  });
}
