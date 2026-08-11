document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // Load backend KPI metrics dynamically
  let data = null;
  try {
    data = await window.apiRequest('/analytics/');
    bindKpiCards(data);
  } catch (error) {
    console.error('Failed to load live analytics:', error);
    // Show fallback for KPIs
    bindKpiCards({
      total_requests: 0,
      token_usage: "0.000M Tokens",
      estimated_cost: 0.0,
      avg_latency: 0,
      success_rate: 100.0,
      active_connections: 0
    });
  }

  // Count-up animations for KPI cards
  initCounters();

  const totalRequests = data ? data.total_requests : 0;

  if (totalRequests === 0) {
    // Show "No activity yet" empty states
    showEmptyState('usageChartCanvas', 'No activity yet');
    showEmptyState('costChartCanvas', 'No activity yet');
    showEmptyState('latencyChartCanvas', 'No activity yet');
    showEmptyState('providerChartCanvas', 'No activity yet');
    
    const modelBody = document.getElementById('modelPerformanceTableBody');
    if (modelBody) {
      modelBody.innerHTML = `<tr><td colspan="8" class="text-center text-secondary-body py-4">No activity yet</td></tr>`;
    }
    const promptsBody = document.getElementById('topPromptsTableBody');
    if (promptsBody) {
      promptsBody.innerHTML = `<tr><td colspan="5" class="text-center text-secondary-body py-4">No activity yet</td></tr>`;
    }
    const timeline = document.querySelector('.timeline-activity');
    if (timeline) {
      timeline.innerHTML = `<div class="text-center text-secondary-body font-mono fs-8 py-4">No activity yet</div>`;
    }
  } else {
    // Initialize all charts with live data
    initUsageChart(data.usage_by_day);
    initCostChart(data.cost_data);
    initLatencyChart(data.usage_by_model.latency);
    initProviderChart(data.usage_by_model.distribution);

    // Populate Tables and Timeline
    populateModelPerformanceTable(data.model_performance);
    populateTopPromptTable(data.prompt_performance);
    populateTimeline(data.recent_activity);
  }

  // Reports download handlers
  initReportsDownloader();
});

/* Bind KPIs */
function bindKpiCards(data) {
  const cards = document.querySelectorAll('.metric-card');
  if (cards.length >= 6) {
    // 1. Total Requests
    const reqVal = cards[0].querySelector('.counter-val');
    if (reqVal) reqVal.setAttribute('data-target', Number(data.total_requests).toLocaleString());

    // 2. Token Usage
    const tokVal = cards[1].querySelector('.counter-val');
    if (tokVal) tokVal.setAttribute('data-target', data.token_usage);

    // 3. Estimated Cost
    const costVal = cards[2].querySelector('.counter-val');
    if (costVal) costVal.setAttribute('data-target', '$' + Number(data.estimated_cost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

    // 4. Avg Latency
    const latencyVal = cards[3].querySelector('.counter-val');
    if (latencyVal) latencyVal.setAttribute('data-target', data.avg_latency + 'ms');

    // 5. Success Rate
    const successVal = cards[4].querySelector('.counter-val');
    if (successVal) successVal.setAttribute('data-target', data.success_rate + '%');

    // 6. Active Connections
    const connVal = cards[5].querySelector('.counter-val');
    if (connVal) connVal.setAttribute('data-target', Number(data.active_connections).toLocaleString());
  }
}

/* Helper: Inject Skeleton Loader and Fade Out */
function showSkeleton(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const wrapper = canvas.parentElement;
  if (!wrapper) return;

  wrapper.style.position = 'relative';

  const skeleton = document.createElement('div');
  skeleton.className = 'chart-skeleton';
  wrapper.appendChild(skeleton);

  setTimeout(() => {
    skeleton.classList.add('fade-out');
    setTimeout(() => skeleton.remove(), 500);
  }, 1000);
}

/* Helper: Show empty state placeholder instead of chart */
function showEmptyState(canvasId, message) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const wrapper = canvas.parentElement;
  if (!wrapper) return;
  
  canvas.style.display = 'none';
  
  const placeholder = document.createElement('div');
  placeholder.className = 'd-flex align-items-center justify-content-center text-secondary-body font-mono fs-7 w-100 py-5';
  placeholder.style.height = '100%';
  placeholder.textContent = message;
  wrapper.appendChild(placeholder);
}

/* KPI Count-Up Logic */
function initCounters() {
  const counters = document.querySelectorAll('.counter-val');
  counters.forEach(counter => {
    const targetText = counter.getAttribute('data-target') || '0';
    
    const isCurrency = targetText.includes('$');
    const isTokens = targetText.toLowerCase().includes('m') || targetText.toLowerCase().includes('k');
    const isPercent = targetText.includes('%');
    const isMs = targetText.includes('ms');

    const cleanVal = targetText.replace(/[\$,%ms\s]/gi, '').replace('Tokens', '');
    const target = parseFloat(cleanVal.replace(/,/g, ''));
    if (isNaN(target)) return;

    let current = 0;
    const duration = 1200; // ms
    const stepTime = 16; // ~60fps
    const steps = duration / stepTime;
    const increment = target / steps;
    let step = 0;

    const timer = setInterval(() => {
      current += increment;
      step++;

      let formatted = '';
      if (isPercent) {
        formatted = current.toFixed(2) + '%';
      } else if (isCurrency) {
        formatted = '$' + current.toFixed(2);
      } else if (isMs) {
        formatted = Math.round(current) + 'ms';
      } else if (isTokens) {
        formatted = targetText; // Keep formatted string for tokens
        clearInterval(timer);
        counter.textContent = formatted;
        return;
      } else {
        formatted = Math.round(current).toLocaleString();
      }

      counter.textContent = formatted;

      if (step >= steps) {
        clearInterval(timer);
        counter.textContent = targetText;
      }
    }, stepTime);
  });
}

/* 1. AI Usage Analytics Line Chart */
function initUsageChart(usageData) {
  const ctx = document.getElementById('usageChartCanvas');
  if (!ctx) return;

  showSkeleton('usageChartCanvas');

  const context = ctx.getContext('2d');
  
  const gradRequests = context.createLinearGradient(0, 0, 0, 300);
  gradRequests.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
  gradRequests.addColorStop(1, 'rgba(6, 182, 212, 0)');

  let activeRange = '7d';

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: usageData[activeRange].labels,
      datasets: [
        {
          label: 'Prompt Requests',
          data: usageData[activeRange].requests,
          borderColor: '#06B6D4',
          backgroundColor: gradRequests,
          tension: 0.4,
          borderWidth: 3,
          pointBackgroundColor: '#06B6D4',
          fill: true
        },
        {
          label: 'Prompt Executions',
          data: usageData[activeRange].executions,
          borderColor: '#8B5CF6',
          backgroundColor: 'transparent',
          tension: 0.4,
          borderWidth: 2,
          pointBackgroundColor: '#8B5CF6',
          borderDash: [5, 5]
        },
        {
          label: 'Tokens Used (K)',
          data: usageData[activeRange].tokens,
          borderColor: '#22C55E',
          backgroundColor: 'transparent',
          tension: 0.4,
          borderWidth: 2,
          pointBackgroundColor: '#22C55E',
          yAxisID: 'yTokens'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1800,
        easing: 'easeInOutQuart'
      },
      hover: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        legend: {
          labels: { color: 'rgba(255, 255, 255, 0.7)', font: { family: 'JetBrains Mono', size: 11 } }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          animation: { duration: 200 }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: 'rgba(255, 255, 255, 0.6)', font: { family: 'JetBrains Mono', size: 10 } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: 'rgba(255, 255, 255, 0.6)', font: { family: 'JetBrains Mono', size: 10 } }
        },
        yTokens: {
          position: 'right',
          grid: { drawOnChartArea: false },
          ticks: { color: 'rgba(255, 255, 255, 0.6)', font: { family: 'JetBrains Mono', size: 10 } }
        }
      }
    }
  });

  const buttons = document.querySelectorAll('.usage-range-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeRange = btn.getAttribute('data-range');

      chart.data.labels = usageData[activeRange].labels;
      chart.data.datasets[0].data = usageData[activeRange].requests;
      chart.data.datasets[1].data = usageData[activeRange].executions;
      chart.data.datasets[2].data = usageData[activeRange].tokens;
      chart.update();
    });
  });
}

/* 2. Token Cost Analytics Area Chart */
function initCostChart(costData) {
  const ctx = document.getElementById('costChartCanvas');
  if (!ctx) return;

  showSkeleton('costChartCanvas');

  const context = ctx.getContext('2d');
  
  const gradInput = context.createLinearGradient(0, 0, 0, 300);
  gradInput.addColorStop(0, 'rgba(59, 130, 246, 0.25)');
  gradInput.addColorStop(1, 'rgba(59, 130, 246, 0)');

  const gradOutput = context.createLinearGradient(0, 0, 0, 300);
  gradOutput.addColorStop(0, 'rgba(139, 92, 246, 0.2)');
  gradOutput.addColorStop(1, 'rgba(139, 92, 246, 0)');

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: costData.labels,
      datasets: [
        {
          label: 'Input Tokens (M)',
          data: costData.inputTokens,
          borderColor: 'rgba(59, 130, 246, 0.8)',
          backgroundColor: gradInput,
          fill: true,
          tension: 0.4,
          borderWidth: 2
        },
        {
          label: 'Output Tokens (M)',
          data: costData.outputTokens,
          borderColor: 'rgba(139, 92, 246, 0.8)',
          backgroundColor: gradOutput,
          fill: true,
          tension: 0.4,
          borderWidth: 2
        },
        {
          label: 'Estimated Cost ($)',
          data: costData.cost,
          borderColor: '#22C55E',
          backgroundColor: 'rgba(34, 197, 94, 0.05)',
          fill: false,
          tension: 0.4,
          borderWidth: 3,
          yAxisID: 'yCost'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1800,
        easing: 'easeInOutQuart'
      },
      plugins: {
        legend: {
          labels: { color: 'rgba(255, 255, 255, 0.7)', font: { family: 'JetBrains Mono', size: 10 } }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          ticks: { color: 'rgba(255, 255, 255, 0.5)', font: { family: 'JetBrains Mono', size: 9 } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          ticks: { color: 'rgba(255, 255, 255, 0.5)', font: { family: 'JetBrains Mono', size: 9 } }
        },
        yCost: {
          position: 'right',
          grid: { drawOnChartArea: false },
          ticks: { color: 'rgba(255, 255, 255, 0.5)', font: { family: 'JetBrains Mono', size: 9 } }
        }
      }
    }
  });
}

/* 3. Latency Analytics Bar Chart */
function initLatencyChart(latencyData) {
  const ctx = document.getElementById('latencyChartCanvas');
  if (!ctx) return;

  showSkeleton('latencyChartCanvas');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: latencyData.labels,
      datasets: [
        {
          label: 'Min Latency (ms)',
          data: latencyData.min,
          backgroundColor: 'rgba(6, 182, 212, 0.4)',
          borderColor: '#06B6D4',
          borderWidth: 1,
          borderRadius: 6
        },
        {
          label: 'Avg Latency (ms)',
          data: latencyData.avg,
          backgroundColor: 'rgba(139, 92, 246, 0.7)',
          borderColor: '#8B5CF6',
          borderWidth: 1,
          borderRadius: 6
        },
        {
          label: 'Max Latency (ms)',
          data: latencyData.max,
          backgroundColor: 'rgba(244, 63, 94, 0.3)',
          borderColor: '#F43F5E',
          borderWidth: 1,
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1500,
        easing: 'easeOutExpo'
      },
      hover: {
        animationDuration: 300
      },
      plugins: {
        legend: {
          labels: { color: 'rgba(255, 255, 255, 0.7)', font: { family: 'JetBrains Mono', size: 10 } }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          ticks: { color: 'rgba(255, 255, 255, 0.6)', font: { family: 'Plus Jakarta Sans', size: 10 } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          ticks: { color: 'rgba(255, 255, 255, 0.6)', font: { family: 'JetBrains Mono', size: 10 } }
        }
      }
    }
  });
}

/* 4. Provider Distribution Donut Chart */
function initProviderChart(distData) {
  const ctx = document.getElementById('providerChartCanvas');
  if (!ctx) return;

  showSkeleton('providerChartCanvas');

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: distData.labels,
      datasets: [{
        data: distData.data,
        backgroundColor: [
          '#06B6D4', // OpenAI
          '#8B5CF6', // Claude / Anthropic
          '#3B82F6', // Google Gemini
          '#22C55E', // DeepSeek
          '#F59E0B', // Mistral
          '#6B7280'  // Meta / Other
        ],
        borderWidth: 2,
        borderColor: 'rgba(13, 15, 22, 0.95)',
        hoverOffset: 15
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1800,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: {
          position: 'right',
          labels: { color: 'rgba(255, 255, 255, 0.7)', font: { family: 'JetBrains Mono', size: 11 } }
        }
      },
      cutout: '65%'
    }
  });
}

/* Populate Model Performance Table */
function populateModelPerformanceTable(modelsList) {
  const tbody = document.getElementById('modelPerformanceTableBody');
  if (!tbody) return;

  if (!modelsList || modelsList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center text-secondary-body py-4">No model metrics available yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = modelsList.map(item => {
    let badgeClass = 'bg-secondary bg-opacity-25 text-white';
    if (item.provider === 'OpenAI') badgeClass = 'bg-emerald-subtle text-emerald';
    else if (item.provider === 'Claude' || item.provider === 'Anthropic') badgeClass = 'bg-purple-subtle text-purple';
    else if (item.provider === 'Google' || item.provider === 'Gemini') badgeClass = 'bg-blue-subtle text-blue';
    else if (item.provider === 'DeepSeek') badgeClass = 'bg-cyan-subtle text-cyan';
    else if (item.provider === 'Mistral') badgeClass = 'bg-warning-subtle text-warning';

    return `
      <tr>
        <td><span class="badge ${badgeClass}">${item.provider}</span></td>
        <td class="text-light fw-bold">${item.model}</td>
        <td>${item.requests.toLocaleString()}</td>
        <td>${item.avg_tokens.toLocaleString()}</td>
        <td>${item.avg_latency}ms</td>
        <td class="text-success fw-bold">${item.success_rate}%</td>
        <td class="text-emerald">$${item.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</td>
        <td><span class="badge bg-success-subtle text-success">${item.status}</span></td>
      </tr>
    `;
  }).join('');

  // Re-init search filter on table rows
  initModelPerformanceTableSearch();
}

function initModelPerformanceTableSearch() {
  const searchInput = document.getElementById('tableSearchInput');
  const tbody = document.getElementById('modelPerformanceTableBody');
  if (searchInput && tbody) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const rows = tbody.querySelectorAll('tr');
      rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }
}

/* Populate Top Prompt Table */
function populateTopPromptTable(promptsList) {
  const tbody = document.getElementById('topPromptsTableBody');
  if (!tbody) return;

  if (!promptsList || promptsList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center text-secondary-body py-4">No prompt stats available yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = promptsList.map(item => `
    <tr>
      <td class="text-light fw-bold">${item.name}</td>
      <td>${item.executions.toLocaleString()}</td>
      <td class="text-success fw-bold">${item.success_rate}%</td>
      <td class="text-cyan">${item.avg_latency}ms</td>
      <td class="text-emerald">$${item.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</td>
    </tr>
  `).join('');

  initTopPromptTableSearch();
}

function initTopPromptTableSearch() {
  const searchInput = document.getElementById('promptSearchInput');
  const tbody = document.getElementById('topPromptsTableBody');
  if (searchInput && tbody) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const rows = tbody.querySelectorAll('tr');
      rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }
}

/* Populate Timeline */
function populateTimeline(activityList) {
  const timeline = document.querySelector('.timeline-activity');
  if (!timeline) return;

  if (!activityList || activityList.length === 0) {
    timeline.innerHTML = `<div class="text-center text-secondary-body font-mono fs-8 py-4">No activity logged.</div>`;
    return;
  }

  timeline.innerHTML = activityList.map(event => {
    let colorClass = 'item-blue';
    if (event.status !== 'success') colorClass = 'item-warning';
    else if (event.provider === 'openai') colorClass = 'item-blue';
    else if (event.provider === 'claude' || event.provider === 'anthropic') colorClass = 'item-purple';
    else if (event.provider === 'google' || event.provider === 'gemini') colorClass = 'item-emerald';

    return `
      <div class="timeline-item ${colorClass}">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <span class="fw-bold fs-7 text-light">Prompt Executed</span>
          <span class="fs-9 text-secondary-body font-mono">${event.timestamp}</span>
        </div>
        <p class="fs-8 text-secondary-body mb-0">Template <span class="text-cyan">${event.prompt_title}</span> executed via ${event.provider} in ${event.latency_ms}ms.</p>
      </div>
    `;
  }).join('');
}

/* 7. Reports Download Event triggers */
function initReportsDownloader() {
  const downloadBtns = document.querySelectorAll('.report-download-btn');
  downloadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const reportType = btn.getAttribute('data-report-type') || 'Custom';
      btn.innerHTML = `<i class="bi bi-arrow-repeat spin-icon me-2"></i> Generating PDF...`;
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = `<i class="bi bi-check2 me-2"></i> Downloaded`;
        btn.disabled = false;
        if (typeof window.showToast === 'function') {
          window.showToast(`PromptPilot report (${reportType}) compiled successfully.`, 'success', 'Report Exported');
        }
        btn.classList.add('btn-success');
        btn.classList.remove('btn-dark-pill');
        setTimeout(() => {
          btn.innerHTML = `<i class="bi bi-download me-2"></i> Download Report`;
          btn.classList.add('btn-dark-pill');
          btn.classList.remove('btn-success');
        }, 3000);
      }, 1500);
    });
  });
}
