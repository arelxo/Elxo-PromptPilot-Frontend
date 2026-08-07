/**
 * forgot-password.js — Password Reset Form Handler
 */

document.addEventListener('DOMContentLoaded', () => {
  const forgotForm = document.getElementById('forgotForm');
  const resetEmail = document.getElementById('resetEmail');
  const resetSuccessAlert = document.getElementById('resetSuccessAlert');
  const btnSubmit = document.getElementById('btnResetSubmit');

  if (forgotForm) {
    forgotForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailVal = resetEmail.value.trim();

      if (!emailVal || !emailVal.includes('@')) {
        resetEmail.classList.add('is-invalid');
        if (typeof window.showToast === 'function') {
          window.showToast('Please enter a valid work email address.', 'error', 'Invalid Email');
        }
      } else {
        resetEmail.classList.remove('is-invalid');
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = `<i class="bi bi-arrow-repeat spin-icon me-2"></i> Sending...`;

        setTimeout(() => {
          btnSubmit.innerHTML = `<i class="bi bi-check2 me-2"></i> Link Sent`;
          if (resetSuccessAlert) resetSuccessAlert.classList.remove('d-none');
          if (typeof window.showToast === 'function') {
            window.showToast('Password reset link sent to ' + emailVal, 'info', 'Email Dispatched');
          }
        }, 1000);
      }
    });
  }
});
