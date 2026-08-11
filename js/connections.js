document.addEventListener("DOMContentLoaded", async () => {
    await loadConnections();
});

async function loadConnections() {
    const token = localStorage.getItem("access_token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const loader = document.getElementById("connectionsLoadingState");
    const mainContent = document.getElementById("connectionsMainContent");
    const emptyState = document.getElementById("connectionsEmptyState");

    try {
        if (loader) loader.classList.remove("d-none");
        if (mainContent) mainContent.classList.add("d-none");

        const data = await window.apiRequest("/connections/");
        
        if (loader) loader.classList.add("d-none");
        if (mainContent) mainContent.classList.remove("d-none");
        if (emptyState) emptyState.classList.add("d-none");

        renderConnections(data.connections);

    } catch (err) {
        console.warn("Connections API failed. Showing empty state.", err);
        if (loader) loader.classList.add("d-none");
        if (mainContent) mainContent.classList.add("d-none");
        if (emptyState) emptyState.classList.remove("d-none");
    }
}

function renderConnections(connections) {
    const mainContent = document.getElementById("connectionsMainContent");
    if (!mainContent) return;

    // Map provider names to config options
    const configMap = {
        "OpenAI": {
            logoColor: "text-cyan",
            models: "gpt-3.5-turbo",
            shortName: "openai"
        },
        "Claude": {
            logoColor: "text-purple",
            models: "claude-3-haiku",
            shortName: "claude"
        },
        "Gemini": {
            logoColor: "text-blue",
            models: "gemini-1.5-flash",
            shortName: "gemini"
        }
    };

    const cardsHtml = connections.map(conn => {
        const config = configMap[conn.provider] || { logoColor: "text-cyan", models: "gpt-3.5-turbo", shortName: conn.provider.toLowerCase() };
        
        let badgeHtml = "";
        let statusTextHtml = "";
        let actionButtonsHtml = "";

        if (conn.status === "connected") {
            badgeHtml = `<span class="badge bg-success-subtle text-success font-mono fs-9"><span class="status-indicator-dot me-1"></span>Connected</span>`;
            statusTextHtml = `Status: <span class="text-cyan">Connected</span>`;
            actionButtonsHtml = `
                <div class="mt-4 d-flex gap-2">
                    <button class="btn btn-outline-cyan btn-sm rounded-pill font-mono fs-8 fw-semibold flex-1 btn-test-conn" data-provider="${config.shortName}">Test Connection</button>
                    <button class="btn btn-outline-danger btn-sm rounded-pill font-mono fs-8 fw-semibold flex-1 btn-disconnect-conn" data-provider="${config.shortName}">Disconnect</button>
                </div>
            `;
        } else if (conn.status === "not_connected") {
            badgeHtml = `<span class="badge bg-dark-pill text-secondary-body font-mono fs-9"><span class="status-dot-inactive me-1"></span>Not Connected</span>`;
            statusTextHtml = `Status: <span class="text-secondary-body">Not Connected</span>`;
            actionButtonsHtml = `
                <div class="mt-4 d-flex gap-2">
                    <button class="btn btn-outline-cyan btn-sm rounded-pill font-mono fs-8 fw-semibold flex-1 btn-test-conn" data-provider="${config.shortName}">Test Key</button>
                    <button class="btn btn-glow-primary btn-sm rounded-pill font-mono fs-8 fw-semibold flex-1 btn-connect-conn" data-provider="${config.shortName}">Connect</button>
                </div>
            `;
        } else {
            // credentials_missing
            badgeHtml = `<span class="badge bg-danger-subtle text-danger font-mono fs-9"><span class="status-dot-inactive me-1"></span>Missing Keys</span>`;
            statusTextHtml = `Status: <span class="text-danger fw-bold">Credentials Missing</span>`;
            actionButtonsHtml = `
                <div class="mt-4">
                    <button class="btn btn-dark-pill btn-sm rounded-pill font-mono fs-8 fw-semibold w-100" disabled data-bs-toggle="tooltip" title="Add ${config.shortName.toUpperCase()}_API_KEY to your Render environments.">Connect Provider (Missing Keys)</button>
                </div>
            `;
        }

        const dateStr = conn.connected_at ? new Date(conn.connected_at).toLocaleDateString() : "Never";

        return `
            <div class="col-md-6 col-lg-4">
              <div class="provider-card p-4 rounded-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <div class="provider-logo text-light"><i class="bi bi-cpu ${config.logoColor}"></i></div>
                    ${badgeHtml}
                  </div>
                  <h3 class="fw-bold text-light fs-6 mb-1">${conn.provider} API</h3>
                  <p class="fs-8 text-secondary-body mb-3">Active model endpoint: ${config.models}</p>
                  <hr class="border-subtle my-2">
                  <div class="fs-8 font-mono text-secondary-body">
                    <div>${statusTextHtml}</div>
                    <div>Last sync: <span class="text-light">${dateStr}</span></div>
                  </div>
                </div>
                ${actionButtonsHtml}
              </div>
            </div>
        `;
    }).join("");

    mainContent.innerHTML = `<div class="row g-4">${cardsHtml}</div>`;

    // Attach Event Listeners
    mainContent.querySelectorAll(".btn-connect-conn").forEach(btn => {
        btn.addEventListener("click", () => handleConnect(btn.getAttribute("data-provider"), btn));
    });

    mainContent.querySelectorAll(".btn-disconnect-conn").forEach(btn => {
        btn.addEventListener("click", () => handleDisconnect(btn.getAttribute("data-provider"), btn));
    });

    mainContent.querySelectorAll(".btn-test-conn").forEach(btn => {
        btn.addEventListener("click", () => handleTest(btn.getAttribute("data-provider"), btn));
    });
}

async function handleConnect(provider, button) {
    const origHtml = button.innerHTML;
    button.disabled = true;
    button.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span>`;

    try {
        await window.apiRequest(`/connections/${provider}/connect/`, {
            method: "POST"
        });
        if (typeof window.showToast === "function") {
            window.showToast(`${provider.toUpperCase()} connection activated!`, "success", "Connected");
        }
        await loadConnections();
    } catch (err) {
        console.error("Connect error:", err);
        if (typeof window.showToast === "function") {
            window.showToast(err.message || "Connection activation failed.", "error", "Error");
        }
    } finally {
        button.disabled = false;
        button.innerHTML = origHtml;
    }
}

async function handleDisconnect(provider, button) {
    const origHtml = button.innerHTML;
    button.disabled = true;
    button.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span>`;

    try {
        await window.apiRequest(`/connections/${provider}/disconnect/`, {
            method: "POST"
        });
        if (typeof window.showToast === "function") {
            window.showToast(`${provider.toUpperCase()} connection deactivated.`, "warning", "Disconnected");
        }
        await loadConnections();
    } catch (err) {
        console.error("Disconnect error:", err);
        if (typeof window.showToast === "function") {
            window.showToast(err.message || "Connection deactivation failed.", "error", "Error");
        }
    } finally {
        button.disabled = false;
        button.innerHTML = origHtml;
    }
}

async function handleTest(provider, button) {
    const origHtml = button.innerHTML;
    button.disabled = true;
    button.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span> Testing...`;

    try {
        const response = await window.apiRequest(`/connections/${provider}/test/`, {
            method: "POST"
        });
        if (typeof window.showToast === "function") {
            window.showToast(`${provider.toUpperCase()} validated: API online!`, "success", "Test Succeeded");
        }
    } catch (err) {
        console.error("Test error:", err);
        if (typeof window.showToast === "function") {
            window.showToast(err.message || "API key validation failed.", "error", "Test Failed");
        }
    } finally {
        button.disabled = false;
        button.innerHTML = origHtml;
    }
}
