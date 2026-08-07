/**
 * optimizer.js — Prompt Optimizer Script with Live API Integration
 */
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  const btnRunOptimizer = document.getElementById('btnRunOptimizer');
  const rawPromptInput = document.getElementById('rawPrompt');
  const ruleBoilerplate = document.getElementById('ruleBoilerplate');
  const ruleGuardrails = document.getElementById('ruleGuardrails');
  const ruleVariables = document.getElementById('ruleVariables');
  const optResultText = document.getElementById('optResultText');
  const reductionBadge = document.getElementById('reductionBadge');

  if (btnRunOptimizer && rawPromptInput && optResultText) {
    btnRunOptimizer.addEventListener('click', async () => {
      const promptValue = rawPromptInput.value.trim();
      if (!promptValue) {
        if (typeof window.showToast === 'function') {
          window.showToast('Please enter a source prompt to optimize.', 'warning', 'Empty Prompt');
        } else {
          alert('Please enter a source prompt to optimize.');
        }
        return;
      }

      const origText = btnRunOptimizer.innerHTML;
      btnRunOptimizer.disabled = true;
      btnRunOptimizer.innerHTML = `<i class="bi bi-arrow-repeat spin-icon me-1"></i> Optimizing AST...`;

      try {
        const response = await fetch('http://127.0.0.1:8000/api/optimizer/optimize/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            prompt: promptValue,
            remove_boilerplate: ruleBoilerplate ? ruleBoilerplate.checked : true,
            inject_guardrails: ruleGuardrails ? ruleGuardrails.checked : true,
            detect_variables: ruleVariables ? ruleVariables.checked : true
          })
        });

        if (response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "login.html";
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to optimize prompt');
        }

        const data = await response.json();

        // Update optimized text output with HTML escaping
        const escapedPrompt = data.optimized_prompt
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;")
          .replace(/\n/g, "<br>");
          
        optResultText.innerHTML = `
          <span class="text-success fw-bold">[OPTIMIZED PROMPT - ${data.optimized_tokens} TOKENS]</span><br><br>
          <span>${escapedPrompt}</span>
        `;

        // Update reduction badge
        if (reductionBadge) {
          reductionBadge.textContent = `-${data.reduction_percentage}% Token Reduction`;
        }

        if (typeof window.showToast === 'function') {
          window.showToast(`Prompt optimized! Saved ${data.reduction_percentage}% token overhead.`, 'success', 'AST Optimized');
        }

        btnRunOptimizer.innerHTML = `<i class="bi bi-check2 me-1"></i> Optimization Complete`;
        setTimeout(() => { btnRunOptimizer.innerHTML = origText; }, 2000);

      } catch (error) {
        console.error('Optimizer Error:', error);
        if (typeof window.showToast === 'function') {
          window.showToast('Failed to connect to prompt optimizer API.', 'error', 'API Error');
        } else {
          alert('Failed to connect to prompt optimizer API.');
        }
      } finally {
        btnRunOptimizer.disabled = false;
      }
    });
  }
});
