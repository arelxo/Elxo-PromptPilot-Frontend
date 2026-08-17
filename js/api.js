const API_BASE_URL = "https://elxo-promptpilot-backend.onrender.com/api";
let cachedProfilePromise = null;
const inFlightPromises = new Map();

function getToken() {
    return localStorage.getItem("access_token");
}

function getHeaders() {
    const headers = {
        "Content-Type": "application/json"
    };
    const token = getToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
}

// Cold Start UI Controls
let coldStartTimer = null;
let activeRequestCount = 0;

function showColdStartOverlay() {
    if (document.getElementById('coldStartOverlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'coldStartOverlay';
    overlay.style = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(6, 7, 10, 0.9);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        z-index: 99999;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #FFFFFF;
        font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
        transition: opacity 0.3s ease;
    `;
    overlay.innerHTML = `
        <div id="coldStartContent" style="text-align: center; max-width: 400px; padding: 24px;">
            <div class="spinner-border mb-4" role="status" style="width: 3rem; height: 3rem; color: #06B6D4; border-width: 3px; border-right-color: transparent;">
                <span class="visually-hidden">Loading...</span>
            </div>
            <h4 class="fw-bold mb-2" id="coldStartTitle" style="letter-spacing: 0.5px; color: #FFFFFF;">Starting PromptPilot...</h4>
            <p class="text-secondary-body mb-0 fs-7" id="coldStartSubtitle">Your workspace is loading...</p>
        </div>
    `;
    document.body.appendChild(overlay);
}

function showColdStartFailure() {
    const content = document.getElementById('coldStartContent');
    if (content) {
        content.innerHTML = `
            <i class="bi bi-exclamation-triangle-fill text-warning mb-3 d-block" style="font-size: 3rem;"></i>
            <h4 class="fw-bold mb-2 text-light">Unable to connect to the server.</h4>
            <p class="text-secondary-body mb-4 fs-7">The application container is taking longer than usual to boot up.</p>
            <button class="btn btn-accent-gradient rounded-pill px-4 py-2 font-mono fs-7 fw-bold" onclick="window.location.reload();">
                <i class="bi bi-arrow-clockwise me-1"></i> Retry
            </button>
        `;
    }
}

function hideColdStartOverlay() {
    const overlay = document.getElementById('coldStartOverlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            if (overlay) overlay.remove();
        }, 300);
    }
}

function registerRequestStart() {
    activeRequestCount++;
    if (!coldStartTimer) {
        coldStartTimer = setTimeout(() => {
            if (activeRequestCount > 0) {
                showColdStartOverlay();
            }
        }, 1500);
    }
}

function registerRequestEnd() {
    activeRequestCount = Math.max(0, activeRequestCount - 1);
    if (activeRequestCount === 0) {
        if (coldStartTimer) {
            clearTimeout(coldStartTimer);
            coldStartTimer = null;
        }
        hideColdStartOverlay();
    }
}

async function apiRequest(endpoint, options = {}) {
    const method = (options.method || 'GET').toUpperCase();
    const isGet = method === 'GET';
    const isProfileGet = endpoint === '/accounts/me/' && isGet;

    // 1. Profile Cache check
    if (isProfileGet) {
        if (window.cachedUserProfile) {
            return window.cachedUserProfile;
        }
        if (cachedProfilePromise) {
            return cachedProfilePromise;
        }
    }

    // 2. Promise De-duplication key for GET requests
    const cacheKey = `${endpoint}:${JSON.stringify(options)}`;
    if (isGet && inFlightPromises.has(cacheKey)) {
        return inFlightPromises.get(cacheKey);
    }

    const requestPromise = (async () => {
        registerRequestStart();
        
        let attempts = 0;
        const maxAttempts = isGet ? 3 : 1; // Retry GET requests up to 3 times
        let lastError = null;

        while (attempts < maxAttempts) {
            attempts++;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second request timeout

            try {
                const response = await fetch(API_BASE_URL + endpoint, {
                    headers: {
                        ...getHeaders(),
                        ...(options.headers || {})
                    },
                    ...options,
                    signal: controller.signal
                });

                clearTimeout(timeoutId);
                registerRequestEnd();

                let data = {};
                try {
                    data = await response.json();
                } catch {}

                if (!response.ok) {
                    // Do not retry auth errors or typical client errors
                    if (response.status === 401 || response.status === 403 || response.status === 400 || response.status === 404) {
                        throw new Error(data.detail || "Request Failed");
                    }
                    throw new Error(data.detail || `Server responded with ${response.status}`);
                }

                if (isProfileGet) {
                    window.cachedUserProfile = data;
                }
                return data;

            } catch (error) {
                clearTimeout(timeoutId);
                lastError = error;

                // If abort or timeout, do not wait
                const isTimeout = error.name === 'AbortError';
                if (isTimeout) {
                    console.warn(`Request to ${endpoint} timed out.`);
                }

                if (attempts < maxAttempts && !isTimeout) {
                    const delay = Math.pow(2, attempts) * 300; // Exponential backoff: 600ms, 1200ms
                    await new Promise(r => setTimeout(r, delay));
                    continue;
                }

                registerRequestEnd();
                break;
            }
        }

        // Check if there is an active loading overlay, switch it to failure view
        if (document.getElementById('coldStartOverlay')) {
            showColdStartFailure();
        }

        if (isProfileGet) {
            cachedProfilePromise = null;
        }
        
        const friendlyMessage = (lastError.name === 'AbortError') 
            ? "Request timed out. Please try again." 
            : "Unable to connect to the server.";
        throw new Error(friendlyMessage);
    })();

    if (isProfileGet) {
        cachedProfilePromise = requestPromise;
    }
    if (isGet) {
        inFlightPromises.set(cacheKey, requestPromise);
        // Remove from in-flight cache once done
        requestPromise.finally(() => inFlightPromises.delete(cacheKey));
    }

    // Invalidate user profile cache on mutations
    if (endpoint === '/accounts/me/' && ['PUT', 'POST', 'PATCH'].includes(method)) {
        window.cachedUserProfile = null;
    }

    return requestPromise;
}

window.apiRequest = apiRequest;