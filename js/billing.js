document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const loader = document.getElementById("billingLoadingState");
    const mainContent = document.getElementById("billingMainContent");
    const emptyState = document.getElementById("billingEmptyState");

    try {
        // Attempt to request production billing endpoint
        const response = await fetch("https://elxo-promptpilot-backend.onrender.com/api/billing/", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.status === 401) {
            alert("Session expired. Please login again.");
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "login.html";
            return;
        }

        if (!response.ok) {
            throw new Error("Billing API not available on backend");
        }

        // If the endpoint exists and returns data, render it dynamically
        const data = await response.json();
        renderBillingData(data);

    } catch (err) {
        console.warn("Billing endpoint is not registered on backend. Showing empty state setup.", err);
        // Show empty state / setup unavailable UI state cleanly
        if (loader) loader.classList.add("d-none");
        if (mainContent) mainContent.classList.add("d-none");
        if (emptyState) emptyState.classList.remove("d-none");
    }
});

function renderBillingData(data) {
    const loader = document.getElementById("billingLoadingState");
    const mainContent = document.getElementById("billingMainContent");
    if (loader) loader.classList.add("d-none");
    if (mainContent) mainContent.classList.remove("d-none");
    
    // Bind plan details
    const planName = document.getElementById("planName");
    if (planName) planName.textContent = (data.plan && data.plan.name) || data.plan_name || "Free";
    
    const planStatus = document.getElementById("planStatus");
    if (planStatus) {
        const statusVal = (data.plan && data.plan.status) || data.plan_status || "active";
        const cycleVal = (data.plan && data.plan.billing_cycle) || "monthly";
        planStatus.textContent = `${cycleVal.toUpperCase()} Billing Cycle (${statusVal})`;
    }
    
    // Bind usage metrics
    const usage = data.usage || {};
    const requests = usage.requests !== undefined ? usage.requests : (data.total_requests || 0);
    const requests_limit = usage.requests_limit !== undefined ? usage.requests_limit : (data.requests_limit || 1000);
    
    const requestsUsageText = document.getElementById("requestsUsageText");
    if (requestsUsageText) {
        requestsUsageText.textContent = `${requests.toLocaleString()} / ${requests_limit.toLocaleString()} (${(requests / requests_limit * 100).toFixed(2)}%)`;
    }
    
    const requestsProgressBar = document.getElementById("requestsProgressBar");
    if (requestsProgressBar) {
        requestsProgressBar.style.width = `${Math.min(100, (requests / requests_limit * 100))}%`;
    }
    
    const tokens = usage.tokens !== undefined ? usage.tokens : (data.tokens_used || 0);
    const tokens_limit = usage.tokens_limit !== undefined ? usage.tokens_limit : (data.tokens_limit || 100000);
    
    const tokensUsageText = document.getElementById("tokensUsageText");
    if (tokensUsageText) {
        tokensUsageText.textContent = `${(tokens / 1000000).toFixed(3)}M / ${(tokens_limit / 1000000).toFixed(1)}M (${(tokens / tokens_limit * 100).toFixed(2)}%)`;
    }
    
    const tokensProgressBar = document.getElementById("tokensProgressBar");
    if (tokensProgressBar) {
        tokensProgressBar.style.width = `${Math.min(100, (tokens / tokens_limit * 100))}%`;
    }
    
    const cost = usage.estimated_cost !== undefined ? usage.estimated_cost : (data.accumulated_cost || 0);
    const billingCost = document.getElementById("billingCost");
    if (billingCost) {
        billingCost.textContent = `$${cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    }

    // Next billing date
    const nextInvoiceDate = document.getElementById("nextInvoiceDate");
    if (nextInvoiceDate) {
        nextInvoiceDate.textContent = data.next_billing_date || "N/A";
    }

    // Render Billing History (Invoices) if available
    const invoiceTableBody = document.getElementById("invoiceTableBody");
    if (invoiceTableBody && data.billing_history) {
        if (data.billing_history.length === 0) {
            invoiceTableBody.innerHTML = `
                <tr>
                  <td colspan="4" class="text-center text-secondary-body py-3">No invoice history found.</td>
                </tr>
            `;
        } else {
            invoiceTableBody.innerHTML = data.billing_history.map(inv => `
                <tr>
                  <td class="text-secondary-body">${inv.date}</td>
                  <td class="text-light fw-bold">${inv.description || 'PromptPilot Subscription'}</td>
                  <td class="text-cyan">$${inv.amount.toFixed(2)}</td>
                  <td><span class="badge bg-success-subtle text-success">${inv.status}</span></td>
                </tr>
            `).join('');
        }
    }
}
