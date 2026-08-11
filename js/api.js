const API_BASE_URL = "https://elxo-promptpilot-backend.onrender.com/api";
let cachedProfilePromise = null;

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
    const isProfileGet = endpoint === '/accounts/me/' && (!options.method || options.method.toUpperCase() === 'GET');
    
    if (isProfileGet) {
        if (window.cachedUserProfile) {
            return window.cachedUserProfile;
        }
        if (cachedProfilePromise) {
            return cachedProfilePromise;
        }
        
        cachedProfilePromise = (async () => {
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
                cachedProfilePromise = null;
                throw new Error(data.detail || "Request Failed");
            }
            window.cachedUserProfile = data;
            cachedProfilePromise = null;
            return data;
        })();
        return cachedProfilePromise;
    }
    
    // Invalidate profile cache on updates
    if (endpoint === '/accounts/me/' && options.method && ['PUT', 'POST', 'PATCH'].includes(options.method.toUpperCase())) {
        window.cachedUserProfile = null;
    }

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