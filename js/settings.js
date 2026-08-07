/**
 * settings.js — Settings Handlers
 */
document.addEventListener('DOMContentLoaded', () => {
  const saveBtn = document.querySelector('.app-topbar .btn-accent-gradient');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      if (typeof window.showToast === 'function') {
        window.showToast('Workspace settings saved successfully.', 'success', 'Settings Saved');
      }
    });
  }

  // Clear Logs trigger
  const clearBtn = document.getElementById('btnDangerClearData');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      window.showConfirmationDialog({
        title: 'Clear Workspace Logs',
        message: 'Are you sure you want to clear all API transaction metrics, audit logs, and cache indexes from your production database? This operation is immediate and permanent.',
        type: 'danger',
        confirmText: 'Clear Logs',
        onConfirm: () => {
          localStorage.removeItem('prompt_logs_customer-support');
          localStorage.removeItem('prompt_logs_refund-agent');
          if (typeof window.showToast === 'function') {
            window.showToast('Workspace execution logs cleared.', 'success', 'Cleared');
          }
        }
      });
    });
  }

  // Delete Workspace trigger
  const deleteBtn = document.getElementById('btnDangerDeleteWorkspace');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      window.showConfirmationDialog({
        title: 'Delete Active Workspace',
        message: 'CAUTION: This will delete "Prod Workspace (v3.0)" along with all prompt templates, custom version tags, and environment routing endpoints. All client APIs will immediately fail.',
        type: 'danger',
        confirmText: 'Delete Permanent',
        onConfirm: () => {
          if (typeof window.showToast === 'function') {
            window.showToast('Workspace deletion queued. Redirecting...', 'warning', 'Deleted');
          }
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 1500);
        }
      });
    });
  }
});
