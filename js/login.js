/**
 * login.js — Authentication Form Handler & Validation
 */

document.addEventListener("DOMContentLoaded", () => {

  // Reveal animation
  document.querySelectorAll(".reveal-item").forEach(item => {
    item.classList.add("revealed");
  });

  const loginForm = document.getElementById("loginForm");
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");
  const btnTogglePassword = document.getElementById("btnTogglePassword");
  const eyeIcon = document.getElementById("eyeIcon");
  const btnSubmit = document.getElementById("btnLoginSubmit");

  // OAuth Buttons
  const btnGitHub = document.getElementById("btnGitHubLogin");
  const btnGoogle = document.getElementById("btnGoogleLogin");

  const handleOAuthClick = (provider) => {
    if (typeof window.showToast === "function") {
      window.showToast(
        `${provider} OAuth Single Sign-On is currently in preview. Use email authentication to proceed.`,
        "info",
        "OAuth Not Configured"
      );
    }
  };

  if (btnGitHub) {
    btnGitHub.addEventListener("click", () => handleOAuthClick("GitHub"));
  }

  if (btnGoogle) {
    btnGoogle.addEventListener("click", () => handleOAuthClick("Google"));
  }

  // Toggle Password
  if (btnTogglePassword && loginPassword && eyeIcon) {
    btnTogglePassword.addEventListener("click", () => {
      const isPassword = loginPassword.type === "password";

      loginPassword.type = isPassword ? "text" : "password";

      eyeIcon.className = isPassword
        ? "bi bi-eye-slash text-cyan"
        : "bi bi-eye";
    });
  }

  // Login Form
  if (loginForm) {

    loginForm.addEventListener("submit", (e) => {

      e.preventDefault();

      let isValid = true;

      const emailVal = loginEmail.value.trim();
      const passVal = loginPassword.value.trim();

      // Email Validation
      if (!emailVal || !emailVal.includes("@")) {
        loginEmail.classList.add("is-invalid");
        isValid = false;
      } else {
        loginEmail.classList.remove("is-invalid");
      }

      // Password Validation
      if (!passVal) {
        loginPassword.classList.add("is-invalid");
        isValid = false;
      } else {
        loginPassword.classList.remove("is-invalid");
      }

      if (!isValid) {

        if (typeof window.showToast === "function") {
          window.showToast(
            "Please check your email and password.",
            "error",
            "Authentication Error"
          );
        }

        return;
      }

      // Loading
      btnSubmit.disabled = true;
      btnSubmit.innerHTML =
        `<i class="bi bi-arrow-repeat spin-icon me-2"></i> Authenticating...`;

      fetch("https://elxo-promptpilot-backend.onrender.com/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: emailVal,
          password: passVal
        })
      })
      .then(async (response) => {

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Login Failed");
        }

        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        if (typeof window.showToast === "function") {
          window.showToast(
            "Login Successful",
            "success",
            "Signed In"
          );
        }

        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 500);

      })
      .catch((err) => {

        if (typeof window.showToast === "function") {
          window.showToast(err.message, "error", "Login Failed");
        }

      })
      .finally(() => {

        btnSubmit.disabled = false;
        btnSubmit.innerHTML = "Sign In";

      });

    });
  }
});