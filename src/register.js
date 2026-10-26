
import { apiRequest } from "./lib/api.js";

export function renderRegister(onRegistered = () => {}) {
  const app = document.querySelector("#app");

  if (!app) {
    console.error('FocusFlow: missing element with id="app".');
    return;
  }

  app.innerHTML = `
    <main class="auth-screen">
      <section class="auth-card">
        <p class="auth-brand">FFocusFlow</p>
        <p class="auth-eyebrow">YOUR SPACE TO FOCUS</p>

        <h1>Create your account</h1>
        <p class="auth-description">
          Start building meaningful daily habits.
        </p>

        <form id="register-form" novalidate>
          <label for="register-name">Your name</label>
          <input
            id="register-name"
            name="name"
            type="text"
            placeholder="Enter your name"
            autocomplete="name"
            required
            minlength="2"
          />

          <label for="register-email">Email address</label>
          <input
            id="register-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autocomplete="email"
            required
          />

          <label for="register-password">Password</label>
          <input
            id="register-password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            autocomplete="new-password"
            minlength="8"
            required
          />

          <p id="register-message" role="status"
             aria-live="polite"></p>

          <button id="register-submit" type="submit">
            Create account
          </button>
        </form>

        <p class="auth-switch">
          Already have an account?
          <button id="register-signin" type="button">
            Sign in
          </button>
        </p>

        <p class="auth-footer">Small steps. Real progress.</p>
      </section>
    </main>
  `;

  const form = app.querySelector("#register-form");
  const nameInput = app.querySelector("#register-name");
  const emailInput = app.querySelector("#register-email");
  const passwordInput = app.querySelector("#register-password");
  const message = app.querySelector("#register-message");
  const submitButton = app.querySelector("#register-submit");

  let isSubmitting = false;

  function showMessage(text, success = false) {
    message.textContent = text;
    message.style.color = success ? "#18794e" : "#b42318";
  }

  console.info("FocusFlow: register.js loaded successfully.");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Diagnostic information without logging the password.
    console.info("FocusFlow registration form submitted.", {
      namePresent: Boolean(name),
      emailPresent: Boolean(email),
      passwordPresent: Boolean(password),
    });

    showMessage("");

    if (!name) {
      showMessage("Please enter your name.");
      nameInput.focus();
      return;
    }

    if (name.length < 2) {
      showMessage("Your name must contain at least 2 characters.");
      nameInput.focus();
      return;
    }

    if (!email) {
      showMessage("Please enter your email address.");
      emailInput.focus();
      return;
    }

    if (!emailInput.validity.valid) {
      showMessage("Please enter a valid email address.");
      emailInput.focus();
      return;
    }

    if (!password) {
      showMessage("Please enter your password.");
      passwordInput.focus();
      return;
    }

    if (password.length < 8) {
      showMessage("Your password must contain at least 8 characters.");
      passwordInput.focus();
      return;
    }

    isSubmitting = true;
    submitButton.disabled = true;
    submitButton.textContent = "Creating account...";

    try {
      const result = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });

      if (!result || result.success === false) {
        throw new Error(
          result?.message || "The server could not create your account."
        );
      }

      showMessage(
        result.message ||
          "Account created successfully! You can now sign in.",
        true
      );

      form.reset();

      submitButton.textContent = "Account created";

      // Allow the success message to remain visible.
      onRegistered(email);
    } catch (error) {
      console.error("FocusFlow registration failed:", error);

      showMessage(
        error?.message || "Registration failed. Please try again."
      );
    } finally {
      isSubmitting = false;
      submitButton.disabled = false;
      submitButton.textContent = "Create account";
    }
  });

  app.querySelector("#register-signin").addEventListener("click", () => {
    onRegistered("");
  });
}
