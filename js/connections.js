document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const loader = document.getElementById("connectionsLoadingState");
    const mainContent = document.getElementById("connectionsMainContent");
    const emptyState = document.getElementById("connectionsEmptyState");

    try {
        // Attempt to request production connections endpoint
        const response = await fetch("https://elxo-promptpilot-backend.onrender.com/api/connections/", {
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
            throw new Error("Connections API not available on backend");
        }

        // If the endpoint exists and returns data, render it dynamically
        const data = await response.json();
        renderConnections(data);

    } catch (err) {
        console.warn("Connections endpoint is not registered on backend. Showing empty state setup.", err);
        // Show empty state / setup unavailable UI state cleanly
        if (loader) loader.classList.add("d-none");
        if (mainContent) mainContent.classList.add("d-none");
        if (emptyState) emptyState.classList.remove("d-none");
    }
});

function renderConnections(data) {
    const loader = document.getElementById("connectionsLoadingState");
    const mainContent = document.getElementById("connectionsMainContent");
    if (loader) loader.classList.add("d-none");
    if (mainContent) mainContent.classList.remove("d-none");
    
    // We can expand dynamic connection render bindings here if backend provides them in the future
}
