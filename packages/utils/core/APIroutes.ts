// Centralized API route registry.
// Fill in missing routes as backend expands.

const API_BASE = "http://localhost:8080/v1/api";

export const API = {
    Base: API_BASE,
    Auth: {
        Base: `${API_BASE}/auth`,
        Login: `${API_BASE}/auth/login`,
        Register: `${API_BASE}/auth/register`,
        RefreshToken: `${API_BASE}/auth/jwt/refresh-token`,
        Logout: `${API_BASE}/auth/logout`,
    },
    Worker: {
        Base: `${API_BASE}/worker`,
        GetMe: `${API_BASE}/worker/get/me`,
    },
} as const;
