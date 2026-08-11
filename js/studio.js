/**
 * studio.js — Studio Playground Execution & Premium AI Input Component
 * Auto-resizing textarea, Slash commands, Variable detection, Real-time Counters, Keyboard Shortcuts
 */

document.addEventListener('DOMContentLoaded', () => {
  const btnRunBenchmark = document.getElementById('btnRunBenchmark');
  const btnSaveCommit = document.getElementById('btnSaveCommit');
  const textarea = document.getElementById('studioPromptInput');
  const tokenCountEl = document.getElementById('studioTokenCount');
  const charCountEl = document.getElementById('studioCharCount');
  const varsContainer = document.getElementById('detectedVariablesContainer');
  const slashPopover = document.getElementById('slashCommandPopover');
  const btnCopy = document.getElementById('btnCopyStudioPrompt');
  const btnPaste = document.getElementById('btnPasteStudioPrompt');
  const btnClear = document.getElementById('btnClearStudioPrompt');

  // 1. Auto-resizing Textarea & Real-time Counters & Variable Detector
  if (textarea) {
    const updateTextareaState = () => {
      // Auto resize height
      textarea.style.height = 'auto';
      textarea.style.height = Math.max(200, textarea.scrollHeight) + 'px';

      // Character & Token counter
      const val = textarea.value;
      const charCount = val.length;
      const wordCount = val.trim().split(/\s+/).filter(Boolean).length;
      const tokenCount = Math.round(wordCount * 1.35);

      if (charCountEl) charCountEl.textContent = charCount.toLocaleString();
      if (tokenCountEl) tokenCountEl.textContent = tokenCount.toLocaleString();

      // Dynamic Variable Highlighting Detector
      const matches = val.match(/\{\{([a-zA-Z0-9_]+)\}\}/g) || [];
      const uniqueVars = [...new Set(matches)];

      if (varsContainer) {
        varsContainer.innerHTML = uniqueVars.map(v => 
          `<span class="var-badge" data-bs-toggle="tooltip" title="Variable: ${v.replace(/[{}]/g, '')}"><i class="bi bi-braces me-1 text-cyan"></i>${v}</span>`
        ).join('');
      }

      // Slash Command Popover Detection
      const cursorPosition = textarea.selectionStart;
      const textBeforeCursor = val.substring(0, cursorPosition);

      if (textBeforeCursor.endsWith('/')) {
        showSlashMenu();
      } else if (!textBeforeCursor.includes('/') || textBeforeCursor.endsWith(' ')) {
        hideSlashMenu();
      }
    };

    textarea.addEventListener('input', updateTextareaState);
    updateTextareaState();

    // 2. Keyboard Shortcuts (Ctrl + Enter -> Run Benchmark, Esc -> Close Slash)
    textarea.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (btnRunBenchmark) btnRunBenchmark.click();
      }

      if (e.key === 'Escape') {
        hideSlashMenu();
      }
    });

    // 3. Rotating Animated Placeholders
    const placeholders = [
      'Type / for commands or {{ for variables...',
      'Enter system instructions for LLM grounding...',
      'Define output constraints and Zod JSON schemas...'
    ];
    let placeholderIdx = 0;
    setInterval(() => {
      if (document.activeElement !== textarea && !textarea.value) {
        placeholderIdx = (placeholderIdx + 1) % placeholders.length;
        textarea.setAttribute('placeholder', placeholders[placeholderIdx]);
      }
    }, 4000);
  }

  // 4. Slash Commands Menu Handler
  function showSlashMenu() {
    if (slashPopover) slashPopover.classList.remove('d-none');
  }

  function hideSlashMenu() {
    if (slashPopover) slashPopover.classList.add('d-none');
  }

  if (slashPopover) {
    slashPopover.querySelectorAll('.slash-item').forEach(item => {
      item.addEventListener('click', () => {
        const cmd = item.getAttribute('data-cmd');
        if (textarea && cmd) {
          const val = textarea.value;
          if (val.endsWith('/')) {
            textarea.value = val.slice(0, -1) + cmd + ' ';
          } else {
            textarea.value += ' ' + cmd + ' ';
          }
          textarea.focus();
          textarea.dispatchEvent(new Event('input'));
          hideSlashMenu();
          if (typeof window.showToast === 'function') {
            window.showToast(`Inserted command ${cmd}`, 'info', 'Command Inserted');
          }
        }
      });
    });
  }

  // 5. Toolbar Action Buttons (Copy, Paste, Clear)
  if (btnCopy && textarea) {
    btnCopy.addEventListener('click', () => {
      navigator.clipboard.writeText(textarea.value).then(() => {
        if (typeof window.showToast === 'function') {
          window.showToast('Copied system prompt text to clipboard!', 'info', 'Copied');
        }
      });
    });
  }

  if (btnPaste && textarea) {
    btnPaste.addEventListener('click', () => {
      navigator.clipboard.readText().then(text => {
        if (text) {
          textarea.value += text;
          textarea.dispatchEvent(new Event('input'));
          if (typeof window.showToast === 'function') {
            window.showToast('Pasted text into prompt editor.', 'info', 'Pasted');
          }
        }
      }).catch(() => {
        if (typeof window.showToast === 'function') {
          window.showToast('Clipboard access denied.', 'warning', 'Permission Denied');
        }
      });
    });
  }

  if (btnClear && textarea) {
    btnClear.addEventListener('click', () => {
      textarea.value = '';
      textarea.dispatchEvent(new Event('input'));
      textarea.focus();
      if (typeof window.showToast === 'function') {
        window.showToast('Prompt editor cleared.', 'warning', 'Cleared');
      }
    });
  }

  // Helper to escape HTML tags
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  // 6. Benchmark Execution with Shimmering Processing Text
  if (btnRunBenchmark) {
    btnRunBenchmark.addEventListener('click', async () => {
      const promptValue = textarea ? textarea.value.trim() : "";
      if (!promptValue) {
        if (typeof window.showToast === 'function') {
          window.showToast('Please type a prompt template before running.', 'warning', 'Empty Input');
        }
        return;
      }

      const origText = btnRunBenchmark.innerHTML;
      btnRunBenchmark.disabled = true;

      const messages = [
        'Analyzing Prompt Structure...',
        'Checking Provider Connections...',
        'Routing API Payloads...',
        'Executing Concurrent Tasks...',
        'Decoding Response Stream...'
      ];

      let step = 0;
      btnRunBenchmark.innerHTML = `<span class="shimmering-processing-text">${messages[0]}</span>`;

      const msgInterval = setInterval(() => {
        step++;
        if (step < messages.length) {
          btnRunBenchmark.innerHTML = `<span class="shimmering-processing-text">${messages[step]}</span>`;
        }
      }, 500);

      const terminal = document.querySelector('.simulated-terminal-box');
      if (terminal) {
        terminal.innerHTML = `<div class="terminal-line text-cyan font-mono fs-8"><span class="spinner-border spinner-border-sm me-2"></span>Connecting to remote model nodes...</div>`;
      }

      const provider = document.getElementById("studioProviderSelect")?.value || "all";
      const temperature = parseFloat(document.getElementById("studioTemperature")?.value || "0.3");
      const max_tokens = parseInt(document.getElementById("studioMaxTokens")?.value || "2048");

      try {
        const response = await window.apiRequest("/prompts/run/", {
          method: "POST",
          body: JSON.stringify({
            prompt: promptValue,
            provider: provider,
            temperature: temperature,
            max_tokens: max_tokens
          })
        });

        clearInterval(msgInterval);

        if (terminal && response.results) {
          if (response.results.length === 0) {
            terminal.innerHTML = `<div class="terminal-line text-warning fw-bold">[Gateway] Notice</div><div class="terminal-line text-secondary-body">No connections executed. Please enable provider status on connections panel.</div>`;
          } else {
            terminal.innerHTML = response.results.map(res => {
              if (res.status === "success") {
                let colorClass = "text-purple"; // OpenAI
                if (res.provider === "Claude") colorClass = "text-cyan";
                else if (res.provider === "Gemini") colorClass = "text-emerald";
                
                return `
                  <div class="terminal-line ${colorClass} fw-bold mt-2">[${res.provider}] Latency: ${res.latency}ms • Cost: $${res.cost.toFixed(6)} • Tokens: ${res.tokens}</div>
                  <div class="terminal-line text-secondary-body mb-2" style="white-space: pre-wrap;">${escapeHtml(res.response)}</div>
                `;
              } else {
                return `
                  <div class="terminal-line text-danger fw-bold mt-2">[${res.provider}] Failed • Latency: ${res.latency}ms</div>
                  <div class="terminal-line text-danger mb-2">Error: ${escapeHtml(res.detail)}</div>
                `;
              }
            }).join('');
          }
        }

        if (typeof window.showToast === 'function') {
          window.showToast('Execution stream completed successfully.', 'success', 'Run Complete');
        }

      } catch (error) {
        clearInterval(msgInterval);
        console.error('Run Error:', error);
        if (terminal) {
          terminal.innerHTML = `<div class="terminal-line text-danger fw-bold mt-2">[Gateway Error] System Fault</div><div class="terminal-line text-danger mb-2">${escapeHtml(error.message)}</div>`;
        }
        if (typeof window.showToast === 'function') {
          window.showToast(error.message || 'Run request failed.', 'error', 'Error');
        }
      } finally {
        btnRunBenchmark.disabled = false;
        btnRunBenchmark.innerHTML = origText;
      }
    });
  }

  function generateAutoTitle(promptContent) {
    const content = promptContent.trim();
    if (!content) return "Untitled Prompt";
    
    const contentLower = content.toLowerCase();
    
    // Rule-based classification matching user examples
    if (contentLower.includes("email") || contentLower.includes("mail")) {
      return "Professional Email Template";
    }
    if (contentLower.includes("sql") || contentLower.includes("database") || contentLower.includes("query")) {
      return "SQL Query Generator";
    }
    if (contentLower.includes("translate") || contentLower.includes("translation") || (contentLower.includes("english") && contentLower.includes("spanish"))) {
      return "English → Spanish Translator";
    }
    if (contentLower.includes("python") || contentLower.includes("code") || contentLower.includes("javascript")) {
      return "Code Generation Script";
    }
    if (contentLower.includes("summarize") || contentLower.includes("summary")) {
      return "Text Summarization Template";
    }
    
    // Fallback: first 6 words
    const words = content.split(/\s+/).slice(0, 6).join(' ');
    return words + (content.split(/\s+/).length > 6 ? "..." : "");
  }

  if (btnSaveCommit) {
    btnSaveCommit.addEventListener("click", async () => {
        const content = textarea.value.trim();

        if (!content) {
            if (typeof window.showToast === "function") {
                window.showToast("Prompt cannot be empty", "warning", "Validation");
            } else {
                alert("Prompt cannot be empty");
            }
            return;
        }

        const titleInput = document.getElementById('studioPromptTitle');
        let title = titleInput ? titleInput.value.trim() : "";
        if (!title) {
            title = generateAutoTitle(content);
        }

        btnSaveCommit.disabled = true;

        try {

            const response = await apiRequest("/prompts/", {
                method: "POST",
                body: JSON.stringify({
                    title: title,
                    description: "",
                    category: "other",
                    content: content
                })
            });

            if (typeof window.showToast === "function") {
                window.showToast("Prompt saved successfully!", "success", "Success");
            } else {
                alert("Prompt saved successfully!");
            }

            setTimeout(() => {
                window.location.href = "library.html";
            }, 1000);

        } catch (error) {

            if (typeof window.showToast === "function") {
                window.showToast(error.message || "Failed to save prompt", "error", "Error");
            } else {
                alert(error.message || "Failed to save prompt");
            }

        } finally {
            btnSaveCommit.disabled = false;
        }

    });
  }
});
