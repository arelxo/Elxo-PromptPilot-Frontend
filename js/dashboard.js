async function loadDashboard() {
    const token = localStorage.getItem("access_token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const data = await window.apiRequest('/dashboard/');

        console.log("Dashboard API:", JSON.stringify(data));

        // Update KPI Cards (IDs must exist in dashboard.html)
        const totalRequests = document.getElementById("totalRequests");
        if (totalRequests) totalRequests.textContent = Number(data.total_requests).toLocaleString();

        const tokenUsage = document.getElementById("tokenUsage");
        if (tokenUsage) tokenUsage.textContent = data.token_usage;

        const aiCost = document.getElementById("aiCost");
        if (aiCost) aiCost.textContent = "$" + Number(data.ai_cost).toLocaleString();

        const latency = document.getElementById("latency");
        if (latency) latency.textContent = data.avg_latency + " ms";

        const successRate = document.getElementById("successRate");
        if (successRate) successRate.textContent = data.success_rate + "%";

        const activeUsers = document.getElementById("activeUsers");
        if (activeUsers) activeUsers.textContent = Number(data.active_users).toLocaleString();

        // Update Live Execution Log Table
        const logBody = document.getElementById("dashboardExecutionLogBody");
        if (logBody && data.recent_events) {
            if (data.recent_events.length === 0) {
                logBody.innerHTML = `
                    <tr>
                      <td colspan="5" class="text-center text-secondary-body py-4">No recent executions found. Create prompts in Studio to log requests.</td>
                    </tr>
                `;
            } else {
                logBody.innerHTML = data.recent_events.map(event => `
                    <tr>
                      <td class="text-secondary-body">${event.timestamp}</td>
                      <td class="text-light fw-bold">${event.prompt_title}</td>
                      <td><span class="badge bg-purple-subtle text-purple">${event.provider}</span></td>
                      <td class="text-cyan">${event.latency}</td>
                      <td><span class="badge bg-success-subtle text-success">${event.status}</span></td>
                    </tr>
                `).join('');
            }
        }

    } catch (error) {
        console.error("Dashboard Error:", error);
        if (error.message && error.message.includes("401")) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "login.html";
        }
    }
}
document.addEventListener("DOMContentLoaded", loadDashboard);