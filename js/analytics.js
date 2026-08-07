document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // Load backend KPI metrics dynamically
  try {
    const data = await window.apiRequest('/analytics/');
    
    // Select the counter metric-value containers
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
      if (costVal) costVal.setAttribute('data-target', '$' + Number(data.estimated_cost).toLocaleString());

      // 4. Avg Latency
      const latencyVal = cards[3].querySelector('.counter-val');
      if (latencyVal) latencyVal.setAttribute('data-target', data.avg_latency + 'ms');

      // 5. Success Rate
      const successVal = cards[4].querySelector('.counter-val');
      if (successVal) successVal.setAttribute('data-target', data.success_rate + '%');

      // 6. Active Users
      const usersVal = cards[5].querySelector('.counter-val');
      if (usersVal) usersVal.setAttribute('data-target', Number(data.active_users).toLocaleString());
    }
  } catch (error) {
    console.error('Failed to load live analytics:', error);
  }

  // Count-up animations for KPI cards
  initCounters();

  // Initialize all charts
  initUsageChart();
  initCostChart();
  initLatencyChart();
  initProviderChart();

  // Initialize Search & Filter for Tables
  initModelPerformanceTable();
  initTopPromptTable();

  // Reports download handlers
  initReportsDownloader();
});

/* Helper: Inject Skeleton Loader and Fade Out */
function showSkeleton(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const wrapper = canvas.parentElement;
  if (!wrapper) return;

  // Ensure relative positioning for layout layering
  wrapper.style.position = 'relative';

  const skeleton = document.createElement('div');
  skeleton.className = 'chart-skeleton';
  wrapper.appendChild(skeleton);

  // Fade out loader once the chart renders and animates
  setTimeout(() => {
    skeleton.classList.add('fade-out');
    setTimeout(() => skeleton.remove(), 500);
  }, 1000);
}

/* KPI Count-Up Logic */
function initCounters() {
  const counters = document.querySelectorAll('.counter-val');
  counters.forEach(counter => {
    const targetText = counter.getAttribute('data-target') || '0';
    
    // Check type of formatting based on original data-target format or text context
    const isCurrency = targetText.includes('$');
    const isTokens = targetText.toLowerCase().includes('m');
    const isPercent = targetText.includes('%');
    const isMs = targetText.includes('ms');

    // Clean formatting characters to extract the numeric value for calculations
    const cleanVal = targetText.replace(/[\$,%ms\s]/gi, '').replace('Tokens', '');
    const target = parseFloat(cleanVal.replace(/,/g, ''));
    if (isNaN(target)) return;

    let current = 0;
    const duration = 1200; // ms
    const stepTime = 16; // ~60fps
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        counter.textContent = targetText;
        clearInterval(timer);
      } else {
        if (isCurrency) {
          counter.textContent = '$' + Math.floor(current).toLocaleString();
        } else if (isTokens) {
          counter.textContent = current.toFixed(1) + 'M Tokens';
        } else if (isPercent) {
          counter.textContent = current.toFixed(2) + '%';
        } else if (isMs) {
          counter.textContent = Math.floor(current) + 'ms';
        } else {
          counter.textContent = Math.floor(current).toLocaleString();
        }
      }
    }, stepTime);
  });
}

/* 1. AI Usage Analytics Line Chart */
function initUsageChart() {
  const ctx = document.getElementById('usageChartCanvas');
  if (!ctx) return;

  showSkeleton('usageChartCanvas');

  const context = ctx.getContext('2d');
  
  // Custom linear gradients for line fills
  const gradRequests = context.createLinearGradient(0, 0, 0, 300);
  gradRequests.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
  gradRequests.addColorStop(1, 'rgba(6, 182, 212, 0)');

  const dataSets = {
    'today': {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      requests: [1200, 1500, 3200, 4100, 3800, 2400],
      executions: [1180, 1490, 3180, 4080, 3760, 2380],
      tokens: [4.2, 5.1, 10.8, 14.5, 12.9, 8.2]
    },
    '7d': {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      requests: [18400, 21200, 24100, 22800, 25400, 14200, 16800],
      executions: [18350, 21100, 24000, 22710, 25300, 14150, 16720],
      tokens: [58.2, 65.4, 76.1, 71.9, 82.4, 45.1, 52.8]
    },
    '30d': {
      labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
      requests: [82000, 94000, 105000, 98000],
      executions: [81800, 93700, 104600, 97600],
      tokens: [260.4, 298.1, 332.9, 310.5]
    },
    '12m': {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      requests: [120000, 140000, 160000, 180000, 210000, 230000, 250000, 260000, 280000, 310000, 340000, 380000],
      executions: [119500, 139200, 159100, 179000, 209200, 229100, 249000, 258800, 278600, 308500, 338100, 378000],
      tokens: [3.8, 4.4, 5.1, 5.7, 6.6, 7.2, 7.8, 8.2, 8.8, 9.7, 10.6, 12.0]
    }
  };

  let activeRange = '7d';

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dataSets[activeRange].labels,
      datasets: [
        {
          label: 'Prompt Requests',
          data: dataSets[activeRange].requests,
          borderColor: '#06B6D4',
          backgroundColor: gradRequests,
          tension: 0.4,
          borderWidth: 3,
          pointBackgroundColor: '#06B6D4',
          fill: true
        },
        {
          label: 'Prompt Executions',
          data: dataSets[activeRange].executions,
          borderColor: '#8B5CF6',
          backgroundColor: 'transparent',
          tension: 0.4,
          borderWidth: 2,
          pointBackgroundColor: '#8B5CF6',
          borderDash: [5, 5]
        },
        {
          label: 'Tokens Used (K or M)',
          data: dataSets[activeRange].tokens,
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
          animation: {
            duration: 200
          }
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

  // Range selector buttons
  const buttons = document.querySelectorAll('.usage-range-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeRange = btn.getAttribute('data-range');

      chart.data.labels = dataSets[activeRange].labels;
      chart.data.datasets[0].data = dataSets[activeRange].requests;
      chart.data.datasets[1].data = dataSets[activeRange].executions;
      chart.data.datasets[2].data = dataSets[activeRange].tokens;
      chart.update();
    });
  });
}

/* 2. Token Cost Analytics Area Chart */
function initCostChart() {
  const ctx = document.getElementById('costChartCanvas');
  if (!ctx) return;

  showSkeleton('costChartCanvas');

  const context = ctx.getContext('2d');
  
  // Custom gradients for input/output tokens
  const gradInput = context.createLinearGradient(0, 0, 0, 300);
  gradInput.addColorStop(0, 'rgba(59, 130, 246, 0.25)');
  gradInput.addColorStop(1, 'rgba(59, 130, 246, 0)');

  const gradOutput = context.createLinearGradient(0, 0, 0, 300);
  gradOutput.addColorStop(0, 'rgba(139, 92, 246, 0.2)');
  gradOutput.addColorStop(1, 'rgba(139, 92, 246, 0)');

  const costData = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
    inputTokens: [1.2, 1.3, 1.1, 1.4, 1.6, 1.5, 1.8, 2.0, 1.9, 2.2, 2.5, 2.1, 2.3, 2.4, 2.8, 3.0, 2.7, 2.9, 3.1, 3.3, 3.5, 3.2, 3.4, 3.6, 3.8, 3.9, 4.2, 4.5, 4.3, 4.6],
    outputTokens: [0.8, 0.9, 0.7, 1.0, 1.2, 1.1, 1.3, 1.5, 1.4, 1.6, 1.8, 1.5, 1.7, 1.8, 2.1, 2.2, 2.0, 2.1, 2.3, 2.4, 2.6, 2.3, 2.5, 2.7, 2.8, 2.9, 3.1, 3.3, 3.2, 3.4],
    cost: [220, 240, 205, 260, 310, 290, 340, 380, 360, 410, 470, 395, 430, 450, 520, 560, 510, 540, 580, 610, 650, 595, 630, 670, 710, 730, 790, 840, 810, 860]
  };

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

  // Daily/Monthly trend toggle
  const costTrendSelect = document.getElementById('costTrendSelect');
  if (costTrendSelect) {
    costTrendSelect.addEventListener('change', (e) => {
      const mode = e.target.value;
      if (mode === 'monthly') {
        // Mock monthly projection
        chart.data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        chart.data.datasets[0].data = [24, 28, 32, 36, 42, 48, 54, 58, 64, 70, 78, 89];
        chart.data.datasets[1].data = [16, 19, 21, 24, 28, 32, 36, 39, 43, 47, 52, 59];
        chart.data.datasets[2].data = [4200, 4800, 5400, 6100, 7200, 8100, 9100, 9800, 10800, 11800, 13100, 14800];
      } else {
        chart.data.labels = costData.labels;
        chart.data.datasets[0].data = costData.inputTokens;
        chart.data.datasets[1].data = costData.outputTokens;
        chart.data.datasets[2].data = costData.cost;
      }
      chart.update();
    });
  }
}

/* 3. Latency Analytics Bar Chart */
function initLatencyChart() {
  const ctx = document.getElementById('latencyChartCanvas');
  if (!ctx) return;

  showSkeleton('latencyChartCanvas');

  const latencyData = {
    labels: ['GPT-4o', 'Claude 4', 'Gemini', 'DeepSeek', 'Llama', 'Mistral'],
    avg: [120, 142, 95, 88, 110, 135],
    min: [70, 90, 55, 45, 60, 80],
    max: [280, 310, 220, 195, 240, 290]
  };

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
function initProviderChart() {
  const ctx = document.getElementById('providerChartCanvas');
  if (!ctx) return;

  showSkeleton('providerChartCanvas');

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['OpenAI', 'Anthropic', 'Google', 'DeepSeek', 'Mistral', 'Meta'],
      datasets: [{
        data: [42, 28, 12, 10, 5, 3],
        backgroundColor: [
          '#06B6D4', // Cyan
          '#8B5CF6', // Purple
          '#3B82F6', // Blue
          '#22C55E', // Emerald
          '#F59E0B', // Warning
          '#6B7280'  // Grey
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

/* 5. Model Performance Table Handling */
function initModelPerformanceTable() {
  const searchInput = document.getElementById('tableSearchInput');
  const tableRows = document.querySelectorAll('#modelPerformanceTableBody tr');
  const paginationLinks = document.querySelectorAll('.table-pagination-link');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      tableRows.forEach(row => {
        const text = row.innerText.toLowerCase();
        if (text.includes(query)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }

  // Handle Mock Pagination clicks
  paginationLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      paginationLinks.forEach(l => l.parentElement.classList.remove('active'));
      link.parentElement.classList.add('active');
      if (typeof window.showToast === 'function') {
        window.showToast('Navigating performance metric rows...', 'info', 'Table Paged');
      }
    });
  });
}

/* 6. Top Prompt Table search hook */
function initTopPromptTable() {
  const searchInput = document.getElementById('promptSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const rows = document.querySelectorAll('#topPromptsTableBody tr');
      rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        if (text.includes(query)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }
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
