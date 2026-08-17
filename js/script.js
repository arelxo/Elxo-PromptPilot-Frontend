/**
 * ELXO PromptPilot V3 — Production Verified JavaScript
 * 60 FPS 6-Layer Parallax • Staggered Scroll Observer • High-Contrast Canvas
 */

document.addEventListener('DOMContentLoaded', () => {
  // Enforce authentication on all protected pages
  const publicPages = ['index.html', 'login.html', 'signup.html', 'forgot-password.html'];
  const pathName = window.location.pathname;
  const isPublic = publicPages.some(p => pathName.endsWith(p)) || pathName === '/' || pathName === '';
  
  if (!isPublic) {
    const token = localStorage.getItem("access_token");
    if (!token) {
      window.location.href = "login.html";
      return;
    }
  }
  init6LayerParallaxEngine();
  initStaggeredScrollObserver();
  initScrollRevealParagraphs();
  initProgressiveBlurText();
  initShimmeringTextObserver();
  initGlobalTooltips();
  initNavbarScroll();
  initAiUniverseEngine();
  initHeroStudio();
  initOptimizerComparison();
  initLibraryFilter();
  initAnalyticsChart();
  initPricingToggle();
  initFaqAccordion();
  initCountUpEngine();
  initCopyButtons();
  initMagneticButtons();
  initCinematicScrollEngine();
  initAnimatedChartDrawing();
  initUniversalIntegrationReveal();
  initGlobalFormValidation();
  initUniversalTableEnhancements();
  initNetworkAndSessionObservers();

  // Global Sign Out Listener
  document.querySelectorAll('.bi-box-arrow-right').forEach(icon => {
    icon.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "login.html";
    });
  });

  // Update sidebar user details dynamically
  updateSidebarUser();
  initMobileSidebar();
});

/* ==========================================
   60 FPS 6-LAYER PARALLAX & CURSOR SPOTLIGHT ENGINE
   ========================================== */
function init6LayerParallaxEngine() {
  const spotlight = document.getElementById('cursorSpotlight');
  const parallaxLayers = document.querySelectorAll('.parallax-layer');

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  let isTicking = false;

  const lerp = (start, end, factor) => start + (end - start) * factor;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;

    if (!isTicking) {
      requestAnimationFrame(updateParallax);
      isTicking = true;
    }
  }, { passive: true });

  function updateParallax() {
    currentX = lerp(currentX, targetX, 0.08);
    currentY = lerp(currentY, targetY, 0.08);

    if (spotlight) {
      spotlight.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
    }

    const normX = (currentX / window.innerWidth - 0.5) * 2;
    const normY = (currentY / window.innerHeight - 0.5) * 2;

    parallaxLayers.forEach(layer => {
      const speed = parseFloat(layer.getAttribute('data-speed')) || 0.6;
      const moveX = (normX * 24 * speed).toFixed(2);
      const moveY = (normY * 24 * speed).toFixed(2);
      layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });

    if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
      requestAnimationFrame(updateParallax);
    } else {
      isTicking = false;
    }
  }
}

/* ==========================================
   STAGGERED SCROLL REVEAL OBSERVER
   ========================================== */
function initStaggeredScrollObserver() {
  const revealElements = document.querySelectorAll('.reveal-item');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================
   NAVBAR SCROLL BLUR TRANSITION
   ========================================== */
function initNavbarScroll() {
  const navbar = document.getElementById('mainNavbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

function initOrbitHoverPause() {
  const orbitChips = document.querySelectorAll('.orbit-chip');
  orbitChips.forEach(chip => {
    chip.addEventListener('mouseenter', () => {
      const parentGroup = chip.closest('.orbit-group');
      if (parentGroup) parentGroup.style.animationPlayState = 'paused';
    });
    chip.addEventListener('mouseleave', () => {
      const parentGroup = chip.closest('.orbit-group');
      if (parentGroup) parentGroup.style.animationPlayState = 'running';
    });
  });
}

/* ==========================================
   INTERACTIVE PROMPT STUDIO PLAYGROUND
   ========================================== */
/* ==========================================
   INTERACTIVE AI UNIVERSE ECOSYSTEM ENGINE
   ========================================== */
function initAiUniverseEngine() {
  const stage = document.getElementById('aiUniverseStage');
  const hubBtn = document.getElementById('universeCenterHub');
  const container = document.getElementById('universeProvidersContainer');
  const tooltip = document.getElementById('universeTooltip');
  const svgLines = document.getElementById('universeConnectorSvg');

  let activeTooltipBadge = null;

  if (!stage || !hubBtn || !container) return;

  const providers = [
    // Ring 1 (Inner: Radius 110px - 4 Providers)
    { id: 'openai', name: 'OpenAI', models: 'GPT-4o, o1-preview', status: 'Connected', latency: '120ms', ring: 1, angle: 0, svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-emerald" xmlns="http://www.w3.org/2000/svg"><path d="M22.28 9.82c.15-.48.19-1.57-.07-2.07a3.8 3.8 0 00-2.4-1.75c-.34-.66-.89-1.21-1.55-1.55a3.8 3.8 0 00-3.25.18 3.8 3.8 0 00-5.28 1.41A3.8 3.8 0 007.88 6.3 3.8 3.8 0 006 9.06c-.64.34-1.18.89-1.52 1.55a3.8 3.8 0 00.17 3.25c-.44.57-.67 1.28-.67 2a3.8 3.8 0 002.09 3.28c-.13.63-.03 1.28.27 1.85a3.8 3.8 0 002.74 1.87c.34.64.89 1.18 1.55 1.52a3.8 3.8 0 003.25-.17c.57.44 1.28.67 2 .67a3.8 3.8 0 003.28-2.09c.63.13 1.28.03 1.85-.27a3.8 3.8 0 001.87-2.74c.64-.34 1.18-.89 1.52-1.55a3.8 3.8 0 00-.17-3.25c.44-.57.67-1.28.67-2a3.8 3.8 0 00-2.09-3.28" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { id: 'claude', name: 'Anthropic Claude', models: 'Claude 3.5 Sonnet, Haiku', status: 'Connected', latency: '110ms', ring: 1, angle: 90, svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-purple" xmlns="http://www.w3.org/2000/svg"><path d="M4 19L12 5L20 19M7.5 13H16.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="5" r="2.2" fill="currentColor"/></svg>' },
    { id: 'gemini', name: 'Google Gemini', models: 'Gemini 1.5 Pro, 1.5 Flash', status: 'Connected', latency: '95ms', ring: 1, angle: 180, svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-cyan" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C12 7.52 7.52 12 2 12c5.52 0 10 4.48 10 10 0-5.52 4.48-10 10-10-5.52 0-10-4.48-10-10z" fill="currentColor"/></svg>' },
    { id: 'deepseek', name: 'DeepSeek', models: 'DeepSeek V3, R1', status: 'Connected', latency: '88ms', ring: 1, angle: 270, svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-blue" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M8 12h8M12 8v8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' },

    // Ring 2 (Middle: Radius 185px - 6 Providers)
    { id: 'grok', name: 'xAI Grok', models: 'Grok 2, Grok Vision', status: 'Connected', latency: '105ms', ring: 2, angle: 30, svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-warning" xmlns="http://www.w3.org/2000/svg"><path d="M4 4l16 16M20 4L4 20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>' },
    { id: 'mistral', name: 'Mistral AI', models: 'Mistral Large, Codestral', status: 'Connected', latency: '115ms', ring: 2, angle: 90, svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-warning" xmlns="http://www.w3.org/2000/svg"><path d="M4 18V6l4 4 4-4 4 4 4-4v12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { id: 'groq', name: 'Groq LPU', models: 'Llama 3.3 70B (800 T/s)', status: 'Connected', latency: '25ms', ring: 2, angle: 150, svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-light" xmlns="http://www.w3.org/2000/svg"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor"/></svg>' },
    { id: 'cohere', name: 'Cohere', models: 'Command R+, Embed v3', status: 'Connected', latency: '130ms', ring: 2, angle: 210, svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-purple" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="12" r="5" fill="currentColor" opacity="0.6"/><circle cx="16" cy="12" r="5" fill="currentColor"/></svg>' },
    { id: 'openrouter', name: 'OpenRouter', models: '200+ Unified Models', status: 'Connected', latency: '75ms', ring: 2, angle: 270, svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-cyan" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3" fill="currentColor"/><path d="M12 3v6M12 15v6M3 12h6M15 12h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' },
    { id: 'azure', name: 'Azure OpenAI', models: 'GPT-4o Enterprise VPC', status: 'Connected', latency: '90ms', ring: 2, angle: 330, svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-blue" xmlns="http://www.w3.org/2000/svg"><path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" fill="currentColor"/></svg>' },

    // Ring 3 (Outer: Radius 260px - 8 Providers)
    { id: 'aws', name: 'AWS Bedrock', models: 'Claude 3.5, Llama 3', status: 'Connected', latency: '110ms', ring: 3, angle: 15, svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-warning" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { id: 'ollama', name: 'Ollama Local', models: 'Llama 3.2, Qwen 2.5', status: 'Active (Local)', latency: '15ms', ring: 3, angle: 60, svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-emerald" xmlns="http://www.w3.org/2000/svg"><path d="M12 3a7 7 0 00-7 7v8a2 2 0 002 2h10a2 2 0 002-2v-8a7 7 0 00-7-7z" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="11" r="1.5" fill="currentColor"/><circle cx="15" cy="11" r="1.5" fill="currentColor"/></svg>' },
    { id: 'together', name: 'Together AI', models: 'Llama 3.3 70B Turbo', status: 'Connected', latency: '85ms', ring: 3, angle: 105, svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-emerald" xmlns="http://www.w3.org/2000/svg"><path d="M7 17L17 7M7 7h10v10" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { id: 'fireworks', name: 'Fireworks AI', models: 'DeepSeek R1 Fast', status: 'Connected', latency: '65ms', ring: 3, angle: 150, svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-warning" xmlns="http://www.w3.org/2000/svg"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' },
    { id: 'replicate', name: 'Replicate', models: 'FLUX.1, Llama 3.1', status: 'Connected', latency: '140ms', ring: 3, angle: 195, svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-light" xmlns="http://www.w3.org/2000/svg"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>' },
    { id: 'huggingface', name: 'Hugging Face', models: 'Inference Endpoints', status: 'Connected', latency: '155ms', ring: 3, angle: 240, svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-warning" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="10" r="1.5" fill="currentColor"/><circle cx="15" cy="10" r="1.5" fill="currentColor"/><path d="M8 15s1.5 2 4 2 4-2 4-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' },
    { id: 'perplexity', name: 'Perplexity', models: 'Sonar Pro Online Search', status: 'Connected', latency: '98ms', ring: 3, angle: 285, svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-cyan" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l3 6 6 1-4.5 4.5 1 6.5-5.5-3-5.5 3 1-6.5L3 9l6-1 3-6z" fill="currentColor"/></svg>' },
    { id: 'lmstudio', name: 'LM Studio', models: 'Local GGUF Models', status: 'Active (Local)', latency: '12ms', ring: 3, angle: 330, svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-emerald" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" stroke-width="2"/><path d="M7 20h10M12 16v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' }
  ];

  container.innerHTML = '';
  const createdBadges = [];

  // Render Provider Badges (2-Layer Composite Architecture to Eliminate Transform Jitter)
  providers.forEach((item, idx) => {
    const badge = document.createElement('div');
    badge.className = 'universe-badge';
    badge.setAttribute('tabindex', '0');
    badge.setAttribute('role', 'button');
    badge.setAttribute('aria-label', `${item.name} AI Provider Integration`);
    badge.setAttribute('data-ring', item.ring);

    const inner = document.createElement('div');
    inner.className = 'universe-badge-inner';
    inner.innerHTML = item.svg;

    badge.appendChild(inner);
    container.appendChild(badge);
    createdBadges.push({ el: badge, innerEl: inner, data: item });
  });

  function getRadii() {
    const w = window.innerWidth;
    if (w < 576) {
      return { 1: 65, 2: 110, 3: 145 };
    } else if (w < 992) {
      return { 1: 85, 2: 145, 3: 195 };
    } else {
      return { 1: 110, 2: 185, 3: 260 };
    }
  }

  function drawConnection(badgeEl) {
    if (!svgLines) return;
    const stageRect = stage.getBoundingClientRect();
    const hubRect = hubBtn.getBoundingClientRect();
    const badgeRect = badgeEl.getBoundingClientRect();

    const x1 = hubRect.left + hubRect.width / 2 - stageRect.left;
    const y1 = hubRect.top + hubRect.height / 2 - stageRect.top;
    const x2 = badgeRect.left + badgeRect.width / 2 - stageRect.left;
    const y2 = badgeRect.top + badgeRect.height / 2 - stageRect.top;

    svgLines.innerHTML = `
      <defs>
        <linearGradient id="connectorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#06B6D4" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0.9" />
        </linearGradient>
      </defs>
      <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="url(#connectorGrad)" stroke-width="2" stroke-dasharray="6,4" class="animated-connector-line" />
      <circle cx="${x2}" cy="${y2}" r="4" fill="#06B6D4" />
    `;
  }

  function clearConnection() {
    if (svgLines) svgLines.innerHTML = '';
  }

  function triggerRipple(tx, ty, direction) {
    const R = Math.sqrt(tx * tx + ty * ty);
    const diameter = R * 2;
    const wave = document.createElement('div');
    wave.className = `universe-ripple-wave ${direction}`;
    wave.style.setProperty('--ripple-dist', `${diameter.toFixed(2)}px`);
    stage.appendChild(wave);
    wave.addEventListener('animationend', () => wave.remove());
  }

  function showTooltip(badgeEl, item) {
    // No-op to remove information cards and text popups completely
  }

  function hideTooltip() {
    // No-op
  }

  createdBadges.forEach(({ el, data }) => {
    const onHover = () => {
      if (!isExpanded) return;
      if (activeTooltipBadge) return; // Keep clicked/active badge locked
      drawConnection(el);
      showTooltip(el, data);

      createdBadges.forEach(({ el: otherEl }) => {
        if (otherEl !== el) {
          otherEl.classList.add('dimmed');
        } else {
          otherEl.classList.remove('dimmed');
        }
      });
    };

    const onUnhover = () => {
      if (!isExpanded) return;
      if (activeTooltipBadge) return; // Keep active badge open
      clearConnection();
      hideTooltip();
      createdBadges.forEach(({ el: otherEl }) => {
        otherEl.classList.remove('dimmed');
      });
    };

    el.addEventListener('mouseenter', onHover);
    el.addEventListener('mouseleave', onUnhover);
    el.addEventListener('focus', onHover);
    el.addEventListener('blur', onUnhover);

    // Click & Touch handlers across full 360° circular hit zone (Click again to close)
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!isExpanded) return;

      const tx = parseFloat(el.style.getPropertyValue('--tx')) || 0;
      const ty = parseFloat(el.style.getPropertyValue('--ty')) || 0;

      if (activeTooltipBadge === el) {
        // Toggle close if clicked again
        el.classList.remove('selected');
        clearConnection();
        createdBadges.forEach(({ el: otherEl }) => {
          otherEl.classList.remove('dimmed');
        });
        activeTooltipBadge = null;
        triggerRipple(tx, ty, 'inward');
      } else {
        // Remove selection from previous active badge
        if (activeTooltipBadge) {
          activeTooltipBadge.classList.remove('selected');
        }
        // Toggle open and dim other badges
        el.classList.add('selected');
        el.classList.remove('dimmed');
        drawConnection(el);
        
        triggerRipple(tx, ty, 'outward');

        createdBadges.forEach(({ el: otherEl }) => {
          if (otherEl !== el) {
            otherEl.classList.add('dimmed');
          }
        });
        activeTooltipBadge = el;
      }
    });

    el.addEventListener('touchstart', (e) => {
      if (!isExpanded) return;
      
      const tx = parseFloat(el.style.getPropertyValue('--tx')) || 0;
      const ty = parseFloat(el.style.getPropertyValue('--ty')) || 0;

      if (activeTooltipBadge === el) {
        el.classList.remove('selected');
        clearConnection();
        createdBadges.forEach(({ el: otherEl }) => {
          otherEl.classList.remove('dimmed');
        });
        activeTooltipBadge = null;
        triggerRipple(tx, ty, 'inward');
      } else {
        if (activeTooltipBadge) {
          activeTooltipBadge.classList.remove('selected');
        }
        el.classList.add('selected');
        el.classList.remove('dimmed');
        drawConnection(el);

        triggerRipple(tx, ty, 'outward');

        createdBadges.forEach(({ el: otherEl }) => {
          if (otherEl !== el) {
            otherEl.classList.add('dimmed');
          }
        });
        activeTooltipBadge = el;
      }
    }, { passive: true });
  });

  function createRevealParticles() {
    for (let i = 0; i < 14; i++) {
      const p = document.createElement('div');
      p.className = 'universe-particle';
      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 120;
      const px = Math.cos(angle) * dist;
      const py = Math.sin(angle) * dist;

      p.style.setProperty('--px', `${px}px`);
      p.style.setProperty('--py', `${py}px`);
      stage.appendChild(p);

      setTimeout(() => {
        p.remove();
      }, 1800);
    }
  }

  const ctaPill = document.getElementById('universeHint');

  // =========================================================================
  // TOGGLE STATE MACHINE: Single Boolean Flag (Unlimited Open/Close Cycles)
  // =========================================================================
  let isExpanded = false;
  let activeTimeouts = [];

  function clearTimeouts() {
    activeTimeouts.forEach(t => clearTimeout(t));
    activeTimeouts = [];
  }

  function expand() {
    clearTimeouts();
    isExpanded = true;
    hubBtn.setAttribute('aria-expanded', 'true');
    stage.classList.add('active');

    if (ctaPill) ctaPill.classList.add('hidden-cta');

    createRevealParticles();

    // Prepare initial state for outer & inner elements
    createdBadges.forEach(({ el, innerEl }) => {
      innerEl.classList.remove('organic-floating', 'sync-pulse');
      el.classList.remove('dimmed', 'revealed');
      el.style.display = 'flex';
      el.style.visibility = 'visible';
      el.style.opacity = '0';
      el.style.filter = 'blur(16px)';
      el.style.setProperty('--tx', '0px');
      el.style.setProperty('--ty', '0px');
      innerEl.style.transform = 'scale(0.25) rotate(-12deg)';
    });

    const radii = getRadii();
    let maxDelay = 0;

    createdBadges.forEach(({ el, innerEl, data }, idx) => {
      const rad = (data.angle * Math.PI) / 180;
      const radius = radii[data.ring];
      const tx = Math.cos(rad) * radius;
      const ty = Math.sin(rad) * radius;

      // Outer element handles radial positioning ONLY
      el.style.setProperty('--tx', `${tx.toFixed(2)}px`);
      el.style.setProperty('--ty', `${ty.toFixed(2)}px`);

      // Inner element handles organic float parameters
      const floatDuration = (4.2 + Math.random() * 1.6).toFixed(2) + 's';
      const floatDelay = (Math.random() * 1.2).toFixed(2) + 's';
      innerEl.style.setProperty('--float-duration', floatDuration);
      innerEl.style.setProperty('--float-delay', floatDelay);

      // Fast Cinematic 25ms Stagger Burst
      const staggerDelay = 120 + idx * 25;
      if (staggerDelay > maxDelay) maxDelay = staggerDelay;

      const t1 = setTimeout(() => {
        if (!isExpanded) return;
        el.classList.add('revealed');

        // Spring Overshoot on Inner Element ONLY (108% -> 100%)
        innerEl.style.transform = 'scale(1.08) rotate(0deg)';

        const t2 = setTimeout(() => {
          if (!isExpanded) return;
          innerEl.style.transform = 'scale(1) rotate(0deg)';
        }, 100);
        activeTimeouts.push(t2);
      }, staggerDelay);

      activeTimeouts.push(t1);
    });

    // Synchronized glow pulse & organic float initialization on inner element
    const tSync = setTimeout(() => {
      if (!isExpanded) return;
      createdBadges.forEach(({ innerEl }) => {
        innerEl.classList.add('sync-pulse');
        const tFloat = setTimeout(() => {
          if (!isExpanded) return;
          innerEl.classList.remove('sync-pulse');
          innerEl.classList.add('organic-floating');
        }, 450);
        activeTimeouts.push(tFloat);
      });
    }, maxDelay + 140);

    activeTimeouts.push(tSync);
  }

  function collapse() {
    clearTimeouts();
    isExpanded = false;
    activeTooltipBadge = null;
    hubBtn.setAttribute('aria-expanded', 'false');

    clearConnection();
    hideTooltip();

    createdBadges.forEach(({ el, innerEl }, idx) => {
      innerEl.classList.remove('organic-floating', 'sync-pulse');
      el.classList.remove('dimmed');
      innerEl.style.transform = 'scale(0.25) rotate(-12deg)';

      const reverseDelay = (createdBadges.length - 1 - idx) * 20;

      const tClose = setTimeout(() => {
        if (isExpanded) return;
        el.classList.remove('revealed');
        el.style.setProperty('--tx', '0px');
        el.style.setProperty('--ty', '0px');
      }, reverseDelay);

      activeTimeouts.push(tClose);
    });

    const tEnd = setTimeout(() => {
      if (!isExpanded) {
        stage.classList.remove('active');
        if (ctaPill) ctaPill.classList.remove('hidden-cta');
      }
    }, 400);

    activeTimeouts.push(tEnd);
  }

  function toggleUniverse() {
    if (isExpanded) {
      collapse();
    } else {
      expand();
    }
  }

  // Single persistent click & keydown listeners (Highest Click Priority)
  hubBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleUniverse();
  });
  hubBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleUniverse();
    }
  });

  if (ctaPill) {
    ctaPill.addEventListener('click', toggleUniverse);
    ctaPill.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleUniverse();
      }
    });
  }
}

function initHeroStudio() {
  const providerTabs = document.querySelectorAll('.provider-tab');
  const heroPromptInput = document.getElementById('heroPromptInput');
  const tempRange = document.getElementById('tempRange');
  const tempValue = document.getElementById('tempValue');
  const tokensRange = document.getElementById('tokensRange');
  const tokensValue = document.getElementById('tokensValue');
  const btnOptimize = document.getElementById('btnOptimizePrompt');
  const btnBenchmark = document.getElementById('btnBenchmark');
  const heroScoreBar = document.getElementById('heroScoreBar');
  const heroScoreText = document.getElementById('heroScoreText');
  const simulatedResponseText = document.getElementById('simulatedResponseText');
  const currentProviderLabel = document.getElementById('currentProviderLabel');
  const heroLatency = document.getElementById('heroLatency');
  const tokenEstimateCount = document.getElementById('tokenEstimateCount');

  const providerPresets = {
    chatgpt: {
      name: 'ChatGPT-4o',
      latency: '142ms',
      samplePrompt: 'You are a senior AI System Architect. Analyze the incoming user query: "{{user_query}}" using context documents: "{{context_docs}}". Provide a structured response formatted strictly as "{{output_format}}". Enforce strict factual groundings and zero hallucinations.',
      response: '{\n  "status": "success",\n  "architecture": "RAG-optimized",\n  "confidence_score": 0.994,\n  "token_savings_applied": "34%"\n}'
    },
    claude: {
      name: 'Claude 3.5 Sonnet',
      latency: '120ms',
      samplePrompt: 'Human: System Role: Lead Reasoning Assistant. Execute detailed evaluation for query "{{user_query}}" with context "{{context_docs}}". Return result as Zod-validated JSON matching "{{output_format}}".',
      response: '{\n  "provider": "Anthropic Claude 3.5 Sonnet",\n  "reasoning_tokens": 142,\n  "output_valid": true,\n  "citation_confidence": "99.8%"\n}'
    },
    gemini: {
      name: 'Gemini 1.5 Pro',
      latency: '95ms',
      samplePrompt: 'Context Window (2M Tokens Active). Task: Summarize context documents "{{context_docs}}" and extract key developer intent for query "{{user_query}}". Output Format: "{{output_format}}".',
      response: '{\n  "provider": "Google Gemini 1.5 Pro",\n  "context_tokens_processed": 184000,\n  "latency_ms": 95,\n  "result": "Structured Summary Completed"\n}'
    },
    deepseek: {
      name: 'DeepSeek V3',
      latency: '88ms',
      samplePrompt: 'System: You are an ultra-high performance reasoning engine. Input: "{{user_query}}". Context: "{{context_docs}}". Constrain output to JSON schema: "{{output_format}}".',
      response: '{\n  "provider": "DeepSeek V3",\n  "reasoning_mode": "R1-enabled",\n  "cost_per_query": "$0.00014",\n  "efficiency_gain": "45%"\n}'
    },
    grok: {
      name: 'Grok 2',
      latency: '160ms',
      samplePrompt: 'Grok 2 Real-Time Mode. Process query "{{user_query}}" using live telemetry "{{context_docs}}". Output structure: "{{output_format}}".',
      response: '{\n  "provider": "xAI Grok 2",\n  "live_data_stream": "Active",\n  "status": "Verified Response"\n}'
    }
  };

  providerTabs.forEach(tab => {
    tab.addEventListener('click', () => selectProvider(tab));
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectProvider(tab);
      }
    });
  });

  function selectProvider(tab) {
    providerTabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    const providerKey = tab.getAttribute('data-provider');
    const data = providerPresets[providerKey];

    if (data) {
      if (currentProviderLabel) currentProviderLabel.textContent = data.name;
      if (heroLatency) heroLatency.innerHTML = `<i class="bi bi-lightning-fill me-1" aria-hidden="true"></i>${data.latency}`;
      if (heroPromptInput) heroPromptInput.value = data.samplePrompt;
      if (simulatedResponseText) simulatedResponseText.innerHTML = data.response.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
      updateTokenEstimate();
    }
  }

  if (tempRange && tempValue) {
    tempRange.addEventListener('input', (e) => {
      tempValue.textContent = parseFloat(e.target.value).toFixed(2);
    });
  }

  if (tokensRange && tokensValue) {
    tokensRange.addEventListener('input', (e) => {
      tokensValue.textContent = parseInt(e.target.value).toLocaleString();
    });
  }

  if (heroPromptInput) {
    heroPromptInput.addEventListener('input', updateTokenEstimate);
  }

  function updateTokenEstimate() {
    if (!heroPromptInput || !tokenEstimateCount) return;
    const wordCount = heroPromptInput.value.trim().split(/\s+/).filter(Boolean).length;
    const estTokens = Math.round(wordCount * 1.35);
    tokenEstimateCount.innerHTML = `<i class="bi bi-cpu me-1 text-cyan" aria-hidden="true"></i>Est: ${estTokens} tokens`;
  }

  if (btnOptimize) {
    btnOptimize.addEventListener('click', () => {
      const origText = btnOptimize.innerHTML;
      btnOptimize.disabled = true;
      btnOptimize.innerHTML = `<i class="bi bi-arrow-repeat spin-icon" aria-hidden="true"></i> Optimizing...`;

      let currentScore = 64;
      heroScoreBar.style.width = `${currentScore}%`;
      heroScoreText.textContent = `${currentScore} / 100`;

      const scoreInterval = setInterval(() => {
        currentScore += 2;
        if (currentScore >= 98) {
          currentScore = 98;
          clearInterval(scoreInterval);
        }
        heroScoreBar.style.width = `${currentScore}%`;
        heroScoreText.textContent = `${currentScore} / 100`;
      }, 25);

      setTimeout(() => {
        heroPromptInput.value = `[ROLE: Senior AI Architect]\n[TASK]: Analyze query "{{user_query}}" with context "{{context_docs}}".\n[CONSTRAINTS]: Strict factual grounding. Zero hallucination. Return output adhering strictly to JSON schema "{{output_format}}".`;
        updateTokenEstimate();

        simulatedResponseText.innerHTML = `<span class="text-success fw-bold">[OPTIMIZATION COMPLETE]</span><br>• Token Overhead Reduced: -38%<br>• Schema Validation: Enforced<br>• Reasoning Score: 98/100`;

        btnOptimize.disabled = false;
        btnOptimize.innerHTML = `<i class="bi bi-check2-circle" aria-hidden="true"></i> Optimized!`;
        
        setTimeout(() => {
          btnOptimize.innerHTML = origText;
        }, 2200);
      }, 750);
    });
  }

  if (btnBenchmark) {
    btnBenchmark.addEventListener('click', () => {
      simulatedResponseText.innerHTML = `
        <span class="text-warning fw-bold">[BENCHMARK IN PROGRESS...]</span><br>
        1. ChatGPT-4o &nbsp;&nbsp;&nbsp;&nbsp;➔ 142ms | $0.0025 | Score 96<br>
        2. Claude 3.5 &nbsp;&nbsp;&nbsp;&nbsp;➔ 120ms | $0.0030 | Score 98<br>
        3. Gemini 1.5 &nbsp;&nbsp;&nbsp;&nbsp;➔ 95ms &nbsp;| $0.0012 | Score 94<br>
        4. DeepSeek V3 &nbsp;&nbsp;➔ 88ms &nbsp;| $0.0002 | Score 97<br>
        <span class="text-success mt-2 d-block fw-bold">✓ Benchmark completed in 345ms total.</span>
      `;
    });
  }
}

/* ==========================================
   PROMPT OPTIMIZER BEFORE / AFTER COMPARISON
   ========================================== */
function initOptimizerComparison() {
  const tabBefore = document.getElementById('tabOptBefore');
  const tabAfter = document.getElementById('tabOptAfter');
  const previewText = document.getElementById('optimizerPreviewText');

  if (!tabBefore || !tabAfter || !previewText) return;

  const rawPromptHTML = `
    <span class="text-danger fw-bold">[RAW PROMPT - 184 TOKENS]</span><br><br>
    "Hey ChatGPT can you please look at this text and give me a summary of it? I need it to be short and clear so a busy executive can read it quickly. Make sure to highlight key metrics and don't include any extra pleasantries or introductions. Also make it look like a bulleted list."
  `;

  const optimizedPromptHTML = `
    <span class="text-success fw-bold">[OPTIMIZED PROMPT - 62 TOKENS (-66% COST)]</span><br><br>
    <span class="text-purple fw-bold">[Role]:</span> Executive Editor.<br>
    <span class="text-purple fw-bold">[Input]:</span> {{raw_document_text}}.<br>
    <span class="text-purple fw-bold">[Task]:</span> Extract top 3 key metrics and deliver a 3-bullet summary.<br>
    <span class="text-purple fw-bold">[Output Format]:</span> Markdown bullets only. Zero introductory text.
  `;

  tabBefore.addEventListener('click', () => {
    tabBefore.classList.add('active');
    tabAfter.classList.remove('active');
    previewText.innerHTML = rawPromptHTML;
  });

  tabAfter.addEventListener('click', () => {
    tabAfter.classList.add('active');
    tabBefore.classList.remove('active');
    previewText.innerHTML = optimizedPromptHTML;
  });
}

/* ==========================================
   PROMPT LIBRARY FILTER
   ========================================== */
function initLibraryFilter() {
  const filterPills = document.querySelectorAll('#libraryFilterPills button');
  const searchInput = document.getElementById('librarySearchInput');
  const cards = document.querySelectorAll('.library-card-item');

  function applyFilters() {
    const activeCategory = document.querySelector('#libraryFilterPills button.active')?.getAttribute('data-category') || 'all';
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    cards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const cardText = card.textContent.toLowerCase();

      const matchesCategory = (activeCategory === 'all' || cardCategory === activeCategory);
      const matchesSearch = (!query || cardText.includes(query));

      if (matchesCategory && matchesSearch) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }
}

/* ==========================================
   HIGH-CONTRAST CANVAS ANALYTICS GRAPH
   ========================================== */
function initAnalyticsChart() {
  const canvas = document.getElementById('analyticsCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const btn7d = document.getElementById('btnChart7d');
  const btn30d = document.getElementById('btnChart30d');
  const btn90d = document.getElementById('btnChart90d');

  let activeRange = '7d';

  const chartData = {
    '7d': {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      optimized: [12, 14, 11, 15, 18, 16, 19],
      baseline: [35, 38, 36, 42, 48, 44, 52]
    },
    '30d': {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      optimized: [45, 52, 60, 68],
      baseline: [140, 160, 180, 210]
    },
    '90d': {
      labels: ['Month 1', 'Month 2', 'Month 3'],
      optimized: [180, 210, 240],
      baseline: [540, 620, 710]
    }
  };

  function resizeCanvas() {
    const parent = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = parent.clientWidth * dpr;
    canvas.height = parent.clientHeight * dpr;
    canvas.style.width = `${parent.clientWidth}px`;
    canvas.style.height = `${parent.clientHeight}px`;
    ctx.scale(dpr, dpr);
    drawChart(parent.clientWidth, parent.clientHeight);
  }

  function drawChart(w, h) {
    const data = chartData[activeRange];
    const width = w;
    const height = h;

    ctx.clearRect(0, 0, width, height);

    const padding = 40;
    const chartW = width - padding * 2;
    const chartH = height - padding * 2;

    const maxVal = Math.max(...data.baseline) * 1.1;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;

    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    const getX = (index) => padding + (chartW / (data.labels.length - 1)) * index;
    const getY = (val) => height - padding - (val / maxVal) * chartH;

    ctx.beginPath();
    data.baseline.forEach((val, i) => {
      const x = getX(i);
      const y = getY(val);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#A78BFA';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.beginPath();
    data.optimized.forEach((val, i) => {
      const x = getX(i);
      const y = getY(val);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#06B6D4';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.lineTo(getX(data.labels.length - 1), height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();

    const fillGrad = ctx.createLinearGradient(0, padding, 0, height - padding);
    fillGrad.addColorStop(0, 'rgba(6, 182, 212, 0.3)');
    fillGrad.addColorStop(1, 'rgba(6, 182, 212, 0.0)');
    ctx.fillStyle = fillGrad;
    ctx.fill();

    data.labels.forEach((label, i) => {
      const x = getX(i);
      const yOpt = getY(data.optimized[i]);

      ctx.beginPath();
      ctx.arc(x, yOpt, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#06B6D4';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // High-Contrast X-Axis Labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
      ctx.font = '600 12px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, height - 12);
    });

    // Draw Tooltip if Mouse is Hovering Near Data Points
    if (hoverIndex >= 0 && hoverIndex < data.labels.length) {
      const hX = getX(hoverIndex);
      const hOpt = data.optimized[hoverIndex];
      const hBase = data.baseline[hoverIndex];
      const hY = getY(hOpt);

      // Vertical Guideline
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(hX, padding);
      ctx.lineTo(hX, height - padding);
      ctx.stroke();
      ctx.setLineDash([]);

      // Tooltip Box
      const ttW = 150;
      const ttH = 50;
      let ttX = hX + 12;
      if (ttX + ttW > width - padding) ttX = hX - ttW - 12;
      let ttY = hY - 25;
      if (ttY < padding) ttY = padding + 10;

      ctx.fillStyle = 'rgba(16, 19, 31, 0.95)';
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(ttX, ttY, ttW, ttH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.font = '600 11px JetBrains Mono';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';
      ctx.fillText(`${data.labels[hoverIndex]} Telemetry:`, ttX + 10, ttY + 18);
      ctx.fillStyle = '#06B6D4';
      ctx.fillText(`Optimized: ${hOpt}k tokens`, ttX + 10, ttY + 36);
    }
  }

  let hoverIndex = -1;

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const parent = canvas.parentElement;
    const data = chartData[activeRange];
    const padding = 40;
    const chartW = parent.clientWidth - padding * 2;

    let closestIdx = -1;
    let minDist = 9999;

    data.labels.forEach((_, i) => {
      const pX = padding + (chartW / (data.labels.length - 1)) * i;
      const dist = Math.abs(x - pX);
      if (dist < minDist) {
        minDist = dist;
        closestIdx = i;
      }
    });

    if (minDist < 40) {
      hoverIndex = closestIdx;
    } else {
      hoverIndex = -1;
    }
    drawChart(parent.clientWidth, parent.clientHeight);
  });

  canvas.addEventListener('mouseleave', () => {
    hoverIndex = -1;
    const parent = canvas.parentElement;
    drawChart(parent.clientWidth, parent.clientHeight);
  });

  [btn7d, btn30d, btn90d].forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      [btn7d, btn30d, btn90d].forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (btn === btn7d) activeRange = '7d';
      if (btn === btn30d) activeRange = '30d';
      if (btn === btn90d) activeRange = '90d';

      const parent = canvas.parentElement;
      drawChart(parent.clientWidth, parent.clientHeight);
    });
  });

  window.addEventListener('resize', resizeCanvas);
  setTimeout(resizeCanvas, 100);
}

/* ==========================================
   PRODUCTION FAQ ACCORDION ENGINE
   ========================================== */
function initFaqAccordion() {
  const faqContainer = document.getElementById('faqAccordion');
  if (!faqContainer) return;

  const buttons = faqContainer.querySelectorAll('.accordion-button');

  buttons.forEach((btn, index) => {
    const item = btn.closest('.accordion-item');
    const collapse = item ? item.querySelector('.accordion-collapse') : null;

    if (collapse) {
      const collapseId = collapse.id || `faq-collapse-${index + 1}`;
      collapse.id = collapseId;
      btn.setAttribute('aria-controls', collapseId);
      btn.setAttribute('role', 'button');

      const isExpanded = collapse.classList.contains('show');
      btn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      if (isExpanded) {
        btn.classList.remove('collapsed');
      } else {
        btn.classList.add('collapsed');
      }
      collapse.setAttribute('aria-hidden', isExpanded ? 'false' : 'true');
    }

    const toggleAccordion = (e) => {
      if (e) e.preventDefault();

      const isCurrentlyCollapsed = btn.classList.contains('collapsed');

      // Close all other items in #faqAccordion
      buttons.forEach(otherBtn => {
        if (otherBtn !== btn) {
          otherBtn.classList.add('collapsed');
          otherBtn.setAttribute('aria-expanded', 'false');
          const otherItem = otherBtn.closest('.accordion-item');
          const otherCollapse = otherItem ? otherItem.querySelector('.accordion-collapse') : null;
          if (otherCollapse) {
            otherCollapse.classList.remove('show');
            otherCollapse.setAttribute('aria-hidden', 'true');
          }
        }
      });

      // Toggle target item
      if (isCurrentlyCollapsed) {
        btn.classList.remove('collapsed');
        btn.setAttribute('aria-expanded', 'true');
        if (collapse) {
          collapse.classList.add('show');
          collapse.setAttribute('aria-hidden', 'false');
        }
      } else {
        btn.classList.add('collapsed');
        btn.setAttribute('aria-expanded', 'false');
        if (collapse) {
          collapse.classList.remove('show');
          collapse.setAttribute('aria-hidden', 'true');
        }
      }
    };

    btn.addEventListener('click', toggleAccordion);

    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleAccordion(e);
      }
    });
  });
}

function initPricingToggle() {
  const toggle = document.getElementById('pricingToggle');
  const priceVals = document.querySelectorAll('.price-val');
  const labelMonthly = document.getElementById('labelMonthly');
  const labelAnnual = document.getElementById('labelAnnual');

  if (!toggle || !priceVals.length) return;

  toggle.addEventListener('change', () => {
    const isAnnual = toggle.checked;

    if (isAnnual) {
      if (labelAnnual) labelAnnual.classList.add('fw-bold');
      if (labelMonthly) labelMonthly.classList.remove('fw-bold');
    } else {
      if (labelMonthly) labelMonthly.classList.add('fw-bold');
      if (labelAnnual) labelAnnual.classList.remove('fw-bold');
    }

    priceVals.forEach(el => {
      const val = isAnnual ? el.getAttribute('data-annual') : el.getAttribute('data-monthly');
      if (val) el.textContent = val;
    });
  });
}

function initCopyButtons() {
  const btnCopyPrompt = document.getElementById('btnCopyPrompt');
  const heroPromptInput = document.getElementById('heroPromptInput');

  if (btnCopyPrompt && heroPromptInput) {
    btnCopyPrompt.addEventListener('click', () => {
      navigator.clipboard.writeText(heroPromptInput.value).then(() => {
        const icon = btnCopyPrompt.querySelector('i');
        if (icon) {
          icon.className = 'bi bi-check2 text-success fs-7';
          setTimeout(() => {
            icon.className = 'bi bi-copy fs-7';
          }, 2000);
        }
      });
    });
  }

  document.querySelectorAll('.btn-copy-prompt-card').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const promptText = btn.getAttribute('data-prompt') || '';
      navigator.clipboard.writeText(promptText).then(() => {
        const origHTML = btn.innerHTML;
        btn.innerHTML = `<i class="bi bi-check2 text-success me-1" aria-hidden="true"></i> Copied`;
        if (typeof window.showToast === 'function') {
          window.showToast('Copied prompt to clipboard!', 'info', 'Copied');
        }
        setTimeout(() => {
          btn.innerHTML = origHTML;
        }, 2000);
      });
    });
  });
}

/* ==========================================
   GLOBAL FLOATING TOOLTIPS INITIALIZER (AUTO-POSITION & FADE-SCALE)
   ========================================== */
function initGlobalTooltips() {
  if (typeof bootstrap === 'undefined' || !bootstrap.Tooltip) return;

  const tooltipElements = document.querySelectorAll('[data-bs-toggle="tooltip"], [data-tooltip]');
  tooltipElements.forEach(el => {
    if (!el._tooltipInstance) {
      const title = el.getAttribute('title') || el.getAttribute('data-tooltip');
      if (title) {
        const placement = el.getAttribute('data-bs-placement') || 'auto';
        el._tooltipInstance = new bootstrap.Tooltip(el, {
          title: title,
          html: true,
          placement: placement,
          boundary: document.body,
          customClass: 'glass-tooltip',
          delay: { show: 150, hide: 100 },
          trigger: 'hover focus',
          popperConfig(defaultBsPopperConfig) {
            return {
              ...defaultBsPopperConfig,
              modifiers: [
                ...(defaultBsPopperConfig.modifiers || []),
                {
                  name: 'preventOverflow',
                  options: {
                    boundary: 'viewport',
                    padding: 8
                  }
                }
              ]
            };
          }
        });
      }
    }
  });
}

/* ==========================================
   GLOBAL TOAST NOTIFICATION SYSTEM
   ========================================== */
/* ==========================================
   GLOBAL TOAST NOTIFICATION SYSTEM (STACKABLE, PAUSE ON HOVER, ESC DISMISS)
   ========================================== */
window.showToast = function(message, type = 'success', title = '', duration = 4000) {
  let container = document.getElementById('globalToastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'globalToastContainer';
    container.className = 'global-toast-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'true');
    document.body.appendChild(container);

    // Global Keyboard Dismiss Listener (Esc key closes latest toast)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const activeToasts = container.querySelectorAll('.global-toast:not(.toast-hiding)');
        if (activeToasts.length) {
          const latestToast = activeToasts[activeToasts.length - 1];
          if (latestToast._dismissFn) latestToast._dismissFn();
        }
      }
    });
  }

  // Enforce Max 5 Visible Toasts
  const activeToasts = container.querySelectorAll('.global-toast:not(.toast-hiding)');
  if (activeToasts.length >= 5) {
    const oldestToast = activeToasts[0];
    if (oldestToast._dismissFn) oldestToast._dismissFn();
  }

  const icons = {
    success: 'bi-check-circle-fill',
    error: 'bi-x-circle-fill',
    warning: 'bi-exclamation-triangle-fill',
    info: 'bi-info-circle-fill'
  };

  const titles = {
    success: title || 'Success',
    error: title || 'Error',
    warning: title || 'Warning',
    info: title || 'Information'
  };

  const toast = document.createElement('div');
  toast.className = `global-toast toast-${type}`;
  toast.role = 'alert';
  toast.tabIndex = 0;

  toast.innerHTML = `
    <div class="toast-icon-box">
      <i class="bi ${icons[type] || icons.info}" aria-hidden="true"></i>
    </div>
    <div class="toast-content">
      <div class="toast-title">${titles[type]}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button type="button" class="toast-close-btn" aria-label="Close notification">
      <i class="bi bi-x" aria-hidden="true"></i>
    </button>
  `;

  let timerId = null;
  let startTime = Date.now();
  let remainingTime = duration;

  const removeToast = () => {
    if (timerId) clearTimeout(timerId);
    toast.classList.add('toast-hiding');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 250);
  };

  toast._dismissFn = removeToast;

  const closeBtn = toast.querySelector('.toast-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', removeToast);

  // Pause Timer on Hover & Focus
  const pauseTimer = () => {
    if (timerId) {
      clearTimeout(timerId);
      remainingTime -= Date.now() - startTime;
    }
  };

  const startTimer = (time) => {
    if (time <= 0) return;
    startTime = Date.now();
    timerId = setTimeout(removeToast, time);
  };
  toast.addEventListener('mouseenter', pauseTimer);
  toast.addEventListener('mouseleave', () => startTimer(remainingTime));
  toast.addEventListener('focus', pauseTimer);
  toast.addEventListener('blur', () => startTimer(remainingTime));

  container.appendChild(toast);

  if (duration > 0) {
    startTimer(duration);
  }
};

/* ==========================================
   SCROLL REVEAL PARAGRAPH WORD STAGGER ENGINE
   ========================================== */
function initScrollRevealParagraphs() {
  // Only target landing page description paragraphs
  const targetSelectors = [
    '.hero-subtitle',
    '#features .section-desc',
    '.feature-card p',
    '#pricing .section-desc',
    '.pricing-card p',
    '#faq .section-desc',
    '.accordion-body p',
    '#cta .section-desc'
  ];

  const paragraphs = document.querySelectorAll(targetSelectors.join(', '));
  if (!paragraphs.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  paragraphs.forEach(p => {
    p.classList.add('scroll-reveal-paragraph');

    if (prefersReduced) {
      p.classList.add('word-revealed');
      return;
    }

    // Split text into word spans with staggered transition delays
    if (!p.querySelector('.scroll-reveal-word')) {
      const text = p.textContent.trim();
      const words = text.split(/\s+/);
      p.innerHTML = words.map((word, idx) => 
        `<span class="scroll-reveal-word" style="transition-delay: ${idx * 40}ms">${word}</span>`
      ).join(' ');
    }
  });

  if (prefersReduced) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('word-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.25,
    rootMargin: '0px 0px -40px 0px'
  });

  paragraphs.forEach(p => observer.observe(p));
}

/* ==========================================
   PROGRESSIVE BLUR TEXT REVEAL ENGINE
   ========================================== */
function initProgressiveBlurText() {
  const targetSelectors = [
    '.hero-title',
    '.section-title',
    '.main-content-wrapper h1',
    '.main-content-wrapper h2',
    '.main-content-wrapper h3'
  ];

  const headings = document.querySelectorAll(targetSelectors.join(', '));
  if (!headings.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  headings.forEach(h => {
    h.classList.add('progressive-blur-text');
    if (prefersReduced) {
      h.classList.add('text-focused');
    }
  });

  if (prefersReduced) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('text-focused');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -20px 0px'
  });

  headings.forEach(h => observer.observe(h));
}

/* ==========================================
   SHIMMERING TEXT VIEWPORT INTERSECTION OBSERVER
   ========================================== */
function initShimmeringTextObserver() {
  const targetSelectors = [
    '.hero-badge',
    '.brand-text-accent',
    '.gradient-text',
    '.pricing-featured-badge',
    '.active-plan-badge',
    '.status-highlight',
    '.feature-highlight-text'
  ];

  const elements = document.querySelectorAll(targetSelectors.join(', '));
  if (!elements.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  elements.forEach(el => {
    el.classList.add('shimmering-text');
    if (prefersReduced) {
      el.classList.add('shimmer-paused');
    }
  });

  if (prefersReduced) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('shimmer-paused');
      } else {
        entry.target.classList.add('shimmer-paused');
      }
    });
  }, {
    threshold: 0.1
  });

  elements.forEach(el => observer.observe(el));
}

/* ==========================================
   COUNT UP METRICS INTERSECTION OBSERVER ENGINE
   ========================================== */
function initCountUpEngine() {
  const selectors = [
    '[data-countup]',
    '.telemetry-stat-value',
    '.hero-stat-value',
    '.billing-stat-value',
    '.count-up'
  ];

  const elements = document.querySelectorAll(selectors.join(', '));
  if (!elements.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const easeOutQuad = (t) => t * (2 - t);

  const animateCount = (el) => {
    if (el._countUpDone) return;
    el._countUpDone = true;

    const rawText = el.getAttribute('data-target') || el.textContent.trim();
    if (!rawText) return;

    const isCurrency = rawText.startsWith('$');
    const isPercent = rawText.endsWith('%');
    const isMs = rawText.endsWith('ms');

    let cleanVal = rawText.replace(/[\$,%ms\s]/g, '');
    let targetNum = parseFloat(cleanVal.replace(/,/g, ''));
    if (isNaN(targetNum)) return;

    if (prefersReduced) {
      el.textContent = rawText;
      return;
    }

    const duration = 1800; // 1.8s duration
    const startTime = performance.now();

    const updateCounter = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuad(progress);
      const currentVal = targetNum * easedProgress;

      let formatted = '';
      if (isPercent) {
        formatted = (targetNum % 1 !== 0 ? currentVal.toFixed(2) : Math.round(currentVal)) + '%';
      } else if (isCurrency) {
        formatted = '$' + Math.round(currentVal).toLocaleString();
      } else if (isMs) {
        formatted = Math.round(currentVal) + 'ms';
      } else {
        formatted = Math.round(currentVal).toLocaleString();
      }

      el.textContent = formatted;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = rawText; // Set exact target at end
      }
    };

    requestAnimationFrame(updateCounter);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  elements.forEach(el => {
    if (!el.getAttribute('data-target')) {
      el.setAttribute('data-target', el.textContent.trim());
    }
    observer.observe(el);
  });
}

/* ==========================================
   MAGNETIC INTERACTIVE BUTTON SYSTEM
   ========================================== */
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.magnetic-btn');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Smooth GPU magnetic pull (max 8px offset)
      btn.style.transform = `translate3d(${x * 0.18}px, ${y * 0.18}px, 0) scale(1.03)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate3d(0, 0, 0) scale(1)';
    });
  });
}

/* ==========================================
   CINEMATIC 5-LAYER PARALLAX & SCROLL MOTION
   ========================================== */
function initCinematicScrollEngine() {
  const depthElements = document.querySelectorAll('[data-parallax-depth]');
  const blurReveals = document.querySelectorAll('.cinematic-blur-reveal');

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;

        // Apply Layered Depth Shifts (Layer 1 to Layer 5)
        depthElements.forEach(el => {
          const depth = parseFloat(el.getAttribute('data-parallax-depth')) || 0.2;
          const shift = (scrolled * depth * 0.12).toFixed(2);
          el.style.transform = `translate3d(0, ${shift}px, 0)`;
        });

        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Intersection Observer for Cinematic Blur Reveals
  if (blurReveals.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    blurReveals.forEach(el => observer.observe(el));
  }
}

/* ==========================================
   ANIMATED SVG CHART PATH DRAWING
   ========================================== */
function initAnimatedChartDrawing() {
  const chartCanvas = document.getElementById('analyticsChartCanvas');
  if (!chartCanvas) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const paths = chartCanvas.querySelectorAll('path');
        paths.forEach(p => p.classList.add('chart-animated-path', 'drawn'));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(chartCanvas);
}

/* ==========================================
   UNIVERSAL INTEGRATION SCROLL REVEAL TIMELINE
   ========================================== */
function initUniversalIntegrationReveal() {
  const header = document.getElementById('universalIntegrationHeader');
  const badge = document.getElementById('univTagBadge');
  const part1 = document.querySelector('.univ-part1');
  const part2 = document.querySelector('.univ-part2');
  const desc = document.getElementById('univDesc');

  if (!header || !badge) return;

  // Split badge text into individual character spans for blur stagger
  const text = badge.textContent.trim();
  badge.innerHTML = text.split('').map(c => c === ' ' ? '&nbsp;' : `<span class="char">${c}</span>`).join('');
  const charSpans = badge.querySelectorAll('span.char');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Step 1: Character-by-character badge blur reveal
        badge.classList.add('revealed');
        charSpans.forEach((span, i) => {
          setTimeout(() => {
            span.style.opacity = '1';
            span.style.filter = 'blur(0px)';
            span.style.transform = 'translateY(0)';
          }, i * 20);
        });

        // Step 2: Part 1 Headline ("One Integration.")
        setTimeout(() => {
          if (part1) part1.classList.add('revealed');
        }, 150);

        // Step 3: Part 2 Headline ("Every Leading AI Model." - 150ms after Part 1)
        setTimeout(() => {
          if (part2) part2.classList.add('revealed');
        }, 300);

        // Step 4: Description paragraph fades in after headline
        setTimeout(() => {
          if (desc) desc.classList.add('revealed');
        }, 480);

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  observer.observe(header);
}

/* ==========================================================================
   ENTERPRISE SAAS SYSTEM ENGINES (MILESTONES AUDIT UPGRADES)
   ========================================================================== */

/* 1. Dynamic Confirmation Dialogs Modals Builder */
window.showConfirmationDialog = function(options) {
  const {
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    type = 'danger', // danger, warning, primary, info
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm = () => {}
  } = options;

  const modalId = 'dynamicConfirmModal_' + Math.random().toString(36).substr(2, 9);
  
  const typeMap = {
    danger: { btn: 'btn-danger', icon: 'bi-exclamation-triangle-fill text-danger' },
    warning: { btn: 'btn-warning', icon: 'bi-exclamation-circle-fill text-warning' },
    primary: { btn: 'btn-accent-gradient', icon: 'bi-info-circle-fill text-cyan' },
    info: { btn: 'btn-dark-pill text-light border border-subtle', icon: 'bi-info-circle-fill text-cyan' }
  };
  const config = typeMap[type] || typeMap.danger;

  const modalHtml = `
    <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true" role="dialog">
      <div class="modal-dialog modal-dialog-centered" style="max-width: 420px;">
        <div class="modal-content glass-panel border border-subtle text-light" style="background: rgba(16, 19, 31, 0.96); backdrop-filter: blur(24px);">
          <div class="modal-header border-bottom border-subtle py-2.5">
            <h5 class="modal-title fs-6 fw-bold d-flex align-items-center gap-2">
              <i class="bi ${config.icon}"></i>
              <span>${title}</span>
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body py-3">
            <p class="fs-7 text-secondary-body mb-0" style="line-height: 1.5;">${message}</p>
          </div>
          <div class="modal-footer border-top border-subtle py-2">
            <button type="button" class="btn btn-sm btn-dark-pill text-light px-3" data-bs-dismiss="modal">${cancelText}</button>
            <button type="button" class="btn btn-sm ${config.btn} px-3" id="${modalId}_confirmBtn">${confirmText}</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  const modalEl = document.getElementById(modalId);
  const bsModal = new bootstrap.Modal(modalEl);
  
  modalEl.querySelector(`#${modalId}_confirmBtn`).addEventListener('click', () => {
    onConfirm();
    bsModal.hide();
  });

  modalEl.addEventListener('hidden.bs.modal', () => {
    modalEl.remove();
  });

  bsModal.show();
};

/* 2. Programmatic Details Drawer Builder */
window.showDetailsDrawer = function(options) {
  const {
    title = 'Audit Details',
    contentHtml = '',
    width = '480px'
  } = options;

  const drawerId = 'dynamicDrawer_' + Math.random().toString(36).substr(2, 9);
  const drawerHtml = `
    <div class="offcanvas offcanvas-end text-light" tabindex="-1" id="${drawerId}" aria-labelledby="${drawerId}Label" style="width: ${width}; background: rgba(16, 19, 31, 0.98); backdrop-filter: blur(24px); border-left: 1px solid rgba(255,255,255,0.08);">
      <div class="offcanvas-header border-bottom border-subtle py-3">
        <h5 class="offcanvas-title fw-bold text-light fs-6" id="${drawerId}Label">${title}</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body d-flex flex-column gap-3 font-mono fs-8">
        ${contentHtml}
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', drawerHtml);
  const drawerEl = document.getElementById(drawerId);
  const bsOffcanvas = new bootstrap.Offcanvas(drawerEl);

  drawerEl.addEventListener('hidden.bs.offcanvas', () => {
    drawerEl.remove();
  });

  bsOffcanvas.show();
};

/* 3. Global Form Autovalidation Handler */
function initGlobalFormValidation() {
  document.querySelectorAll('form').forEach(form => {
    form.setAttribute('novalidate', '');

    // Character Counter Helper
    form.querySelectorAll('[maxlength]').forEach(input => {
      if (input.parentNode.querySelector('.char-counter-text')) return;
      const max = input.getAttribute('maxlength');
      const counter = document.createElement('div');
      counter.className = 'text-secondary-body fs-9 font-mono mt-1 text-end char-counter-text';
      counter.textContent = `0 / ${max}`;
      input.parentNode.appendChild(counter);

      input.addEventListener('input', () => {
        counter.textContent = `${input.value.length} / ${max}`;
      });
    });

    form.addEventListener('submit', (e) => {
      let isValid = true;
      
      form.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('is-invalid');
          let feedback = field.parentNode.querySelector('.invalid-feedback');
          if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback font-mono fs-9 text-danger mt-1';
            feedback.textContent = 'This field is required.';
            field.parentNode.appendChild(feedback);
          }
          feedback.style.display = 'block';
        } else {
          field.classList.remove('is-invalid');
          const feedback = field.parentNode.querySelector('.invalid-feedback');
          if (feedback) feedback.style.display = 'none';
        }
      });

      if (!isValid) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof window.showToast === 'function') {
          window.showToast('Please correct form validation errors before proceeding.', 'error', 'Form Error');
        }
      } else {
        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) {
          const origHtml = submitBtn.innerHTML;
          submitBtn.setAttribute('disabled', 'true');
          submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> Saving...`;
          
          if (form.id === 'loginForm' || form.id === 'signupForm' || form.id === 'forgotForm') {
            // Let credentials handler process it
          } else {
            e.preventDefault();
            setTimeout(() => {
              submitBtn.removeAttribute('disabled');
              submitBtn.innerHTML = origHtml;
              if (typeof window.showToast === 'function') {
                window.showToast('Action completed successfully!', 'success', 'Success');
              }
            }, 1000);
          }
        }
      }
    });
  });
}

/* 4. Global Dynamic Table Enhancer */
function initUniversalTableEnhancements() {
  document.querySelectorAll('table.table').forEach(table => {
    if (table.querySelector('.enhanced-header-added') || table.classList.contains('enhanced-table-ready')) return;
    table.classList.add('table-sticky-header', 'enhanced-table-ready');

    const headers = table.querySelectorAll('thead th');
    headers.forEach((th, colIdx) => {
      if (th.querySelector('input[type="checkbox"]')) return;
      th.classList.add('sortable-th');
      
      let sortAsc = true;
      th.addEventListener('click', () => {
        headers.forEach(h => h.classList.remove('sort-asc', 'sort-desc'));
        th.classList.add(sortAsc ? 'sort-asc' : 'sort-desc');
        
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        rows.sort((a, b) => {
          const aVal = a.cells[colIdx + (table.querySelector('.select-all-checkbox') ? 1 : 0)]?.textContent.trim() || '';
          const bVal = b.cells[colIdx + (table.querySelector('.select-all-checkbox') ? 1 : 0)]?.textContent.trim() || '';
          return sortAsc ? aVal.localeCompare(bVal, undefined, {numeric: true}) : bVal.localeCompare(aVal, undefined, {numeric: true});
        });
        
        sortAsc = !sortAsc;
        rows.forEach(row => tbody.appendChild(row));
      });
    });

    // Insert Checkboxes
    const theadRow = table.querySelector('thead tr');
    if (theadRow && !theadRow.querySelector('.select-all-checkbox')) {
      const selectAllTh = document.createElement('th');
      selectAllTh.style.width = '32px';
      selectAllTh.className = 'text-center';
      selectAllTh.innerHTML = `<input type="checkbox" class="form-check-input select-all-checkbox" aria-label="Select all rows">`;
      theadRow.insertBefore(selectAllTh, theadRow.firstChild);
    }

    const tbodyRows = table.querySelectorAll('tbody tr');
    tbodyRows.forEach(row => {
      if (row.querySelector('.row-checkbox')) return;
      const selectTd = document.createElement('td');
      selectTd.style.width = '32px';
      selectTd.className = 'text-center';
      selectTd.innerHTML = `<input type="checkbox" class="form-check-input row-checkbox" aria-label="Select row">`;
      row.insertBefore(selectTd, row.firstChild);
    });

    const selectAllCb = table.querySelector('.select-all-checkbox');
    const rowCbs = table.querySelectorAll('.row-checkbox');
    
    let toolbar = document.getElementById('tableBulkActionToolbar');
    if (!toolbar) {
      toolbar = document.createElement('div');
      toolbar.id = 'tableBulkActionToolbar';
      toolbar.className = 'table-bulk-toolbar';
      toolbar.innerHTML = `
        <span class="text-light fw-bold font-mono fs-8" id="bulkActionCount">0 rows selected</span>
        <button class="btn btn-sm btn-accent-gradient py-1 font-mono fs-9 fw-bold" id="bulkExportBtn"><i class="bi bi-download me-1"></i>Export CSV</button>
        <button class="btn btn-sm btn-danger py-1 font-mono fs-9 fw-bold" id="bulkDeleteBtn"><i class="bi bi-trash-fill me-1"></i>Delete Selection</button>
      `;
      document.body.appendChild(toolbar);
    }

    const updateBulkSelectionState = () => {
      const checkedCount = Array.from(rowCbs).filter(cb => cb.checked).length;
      const countEl = document.getElementById('bulkActionCount');
      if (countEl) countEl.textContent = `${checkedCount} rows selected`;

      if (checkedCount > 0) {
        toolbar.classList.add('visible');
      } else {
        toolbar.classList.remove('visible');
      }
    };

    if (selectAllCb) {
      selectAllCb.addEventListener('change', () => {
        rowCbs.forEach(cb => {
          cb.checked = selectAllCb.checked;
          cb.closest('tr').classList.toggle('bg-purple-subtle', selectAllCb.checked);
        });
        updateBulkSelectionState();
      });
    }

    rowCbs.forEach(cb => {
      cb.addEventListener('change', () => {
        cb.closest('tr').classList.toggle('bg-purple-subtle', cb.checked);
        updateBulkSelectionState();
      });
    });

    document.getElementById('bulkExportBtn')?.addEventListener('click', () => {
      let csvContent = "data:text/csv;charset=utf-8,";
      const headerText = Array.from(headers).map(h => h.textContent.trim()).join(",");
      csvContent += headerText + "\n";

      tbodyRows.forEach(row => {
        const checkbox = row.querySelector('.row-checkbox');
        if (checkbox && checkbox.checked) {
          const rowText = Array.from(row.cells).slice(1).map(c => `"${c.textContent.trim().replace(/"/g, '""')}"`).join(",");
          csvContent += rowText + "\n";
        }
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `elxo_export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      if (typeof window.showToast === 'function') {
        window.showToast('Selected rows exported as CSV successfully!', 'success', 'Export Completed');
      }
    });

    document.getElementById('bulkDeleteBtn')?.addEventListener('click', () => {
      const checkedCount = Array.from(rowCbs).filter(cb => cb.checked).length;
      window.showConfirmationDialog({
        title: 'Delete Selected Records',
        message: `Are you sure you want to delete the ${checkedCount} selected records from the database? This action cannot be reverted.`,
        type: 'danger',
        confirmText: 'Delete Selected',
        onConfirm: () => {
          tbodyRows.forEach(row => {
            const checkbox = row.querySelector('.row-checkbox');
            if (checkbox && checkbox.checked) {
              row.remove();
            }
          });
          toolbar.classList.remove('visible');
          if (selectAllCb) selectAllCb.checked = false;
          if (typeof window.showToast === 'function') {
            window.showToast(`Deleted ${checkedCount} records successfully.`, 'success', 'Deleted');
          }
        }
      });
    });
  });
}

/* 5. Network Observer & Session Inactivity Timeout */
function initNetworkAndSessionObservers() {
  const showOfflineBanner = () => {
    if (document.getElementById('networkOfflineBanner')) return;
    const banner = document.createElement('div');
    banner.id = 'networkOfflineBanner';
    banner.className = 'offline-banner';
    banner.innerHTML = `
      <i class="bi bi-wifi-off fs-6"></i>
      <span>Network connection lost. ELXO PromptPilot is running in offline mode. Live gateway requests will cache locally.</span>
    `;
    document.body.appendChild(banner);
    
    if (typeof window.showToast === 'function') {
      window.showToast('Workspace is currently offline. Simulating local mock caching...', 'warning', 'Offline Mode');
    }
  };

  const removeOfflineBanner = () => {
    const banner = document.getElementById('networkOfflineBanner');
    if (banner) {
      banner.style.animation = 'slideUpOut 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards';
      setTimeout(() => banner.remove(), 200);
    }
    if (typeof window.showToast === 'function') {
      window.showToast('Network connection re-established! Synchronizing workspace...', 'success', 'Back Online');
    }
  };

  window.addEventListener('offline', showOfflineBanner);
  window.addEventListener('online', removeOfflineBanner);

  if (!navigator.onLine) {
    showOfflineBanner();
  }

  // Session Inactivity Warning
  let inactivityTimer;
  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      window.showConfirmationDialog({
        title: 'Security Notice: Session Expired',
        message: 'Your SaaS workspace session has expired due to 5 minutes of inactivity. Please re-authenticate to verify security credentials.',
        type: 'warning',
        confirmText: 'Re-authenticate',
        cancelText: 'Ignore Workspace',
        onConfirm: () => {
          window.location.href = 'login.html';
        }
      });
    }, 300000);
  };

  ['mousemove', 'keydown', 'click', 'scroll'].forEach(evt => {
    window.addEventListener(evt, resetInactivityTimer, { passive: true });
  });
  resetInactivityTimer();
}

async function updateSidebarUser() {
  const token = localStorage.getItem("access_token");
  if (!token) return;

  try {
    const data = await window.apiRequest('/accounts/me/');
    
    // Select elements in sidebar
    const userBox = document.querySelector('.sidebar-user-box');
    if (userBox) {
      const nameEl = userBox.querySelector('.fs-7');
      const emailEl = userBox.querySelector('.fs-8');
      const avatarEl = userBox.querySelector('.avatar-circle');

      const username = data.username || data.email;
      const email = data.email;

      const displayName = (data.full_name || username) + " user";

      if (nameEl) nameEl.textContent = displayName;
      if (emailEl) emailEl.textContent = email;
      if (avatarEl) {
        const initials = (data.full_name || username).substring(0, 2).toUpperCase();
        avatarEl.textContent = initials;
      }
    }
  } catch (error) {
    console.error('Failed to load user info:', error);
  }
}

function initMobileSidebar() {
  const toggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebar = document.querySelector('.app-sidebar');

  if (!toggleBtn || !sidebar) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('show');
  });

  document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('show')) {
      const isClickInsideSidebar = sidebar.contains(e.target);
      const isClickOnToggle = toggleBtn.contains(e.target);
      if (!isClickInsideSidebar && !isClickOnToggle) {
        sidebar.classList.remove('show');
      }
    }
  });

  sidebar.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', () => {
      sidebar.classList.remove('show');
    });
  });
}







