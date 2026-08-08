const API_BASE_URL = "https://elxo-promptpilot-backend.onrender.com/api";

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

async function apiRequest(endpoint, options = {}) {

    const response = await fetch(API_BASE_URL + endpoint, {
        headers: {
            ...getHeaders(),
            ...(options.headers || {})
        },
        ...options
    });

    let data = {};

    try {
        data = await response.json();
    } catch {}

    if (!response.ok) {
        throw new Error(data.detail || "Request Failed");
    }

    return data;
}

window.apiRequest = apiRequest;