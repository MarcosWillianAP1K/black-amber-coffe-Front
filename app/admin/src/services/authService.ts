import type { Worker } from "shared-utils/types/worker";
import { MOCK_WORKERS } from "shared-utils/MockBD.js";

// API endpoint and mock toggle
const URL_API = "http://localhost:8080/v1/api/auth";
const USE_MOCK = false; // Toggle to false when API is ready


export interface AuthResponse {
    token: string;
    user: Worker;
}


/**
 * Mock login — searches MOCK_WORKERS by email+password.
 * Simulates a real API delay.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function mockLogin(email: string, _password: string): Promise<AuthResponse> {
    await new Promise((r) => setTimeout(r, 400));

    const employee = MOCK_WORKERS.find(
        (e) => e.profile.email === email
    );

    if (!employee) {
        throw new Error("Email or password incorrect");
    }

    if (!employee.isActive) {
        throw new Error("Account is deactivated");
    }

    return {
        token: `mock-token-${employee.publicId}-${Date.now()}`,
        user: employee,
    };
}

/**
 * Mock sign-up — validates and adds employee to mock data.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function mockSignUp(name: string, email: string, _password: string): Promise<AuthResponse> {
    await new Promise((r) => setTimeout(r, 400));

    const exists = MOCK_WORKERS.find((e) => e.profile.email === email);
    if (exists) {
        throw new Error("Email already registered");
    }

    const now = new Date().toISOString();
    const newEmployee: Worker = {
        publicId: String(MOCK_WORKERS.length + 1),
        role: "WAITER",
        salary: 0,
        isActive: true,
        profile: {
            fullName: name,
            phone: null,
            avatarImage: null,
            email,
            createdAt: now,
            updatedAt: now,
        },
        createdAt: now,
        updatedAt: now,
    };

    MOCK_WORKERS.push(newEmployee);

    return {
        token: `mock-token-${newEmployee.publicId}-${Date.now()}`,
        user: newEmployee,
    };
}


/**
 * Real API login — calls POST /api/login.
 */
async function apiLogin(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${URL_API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error("Email or password incorrect");
    }

    return response.json();
}

/**
 * Real API sign-up — calls POST /api/signup.
 */
async function apiSignUp(name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${URL_API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
        throw new Error("Sign up failed");
    }

    return response.json();
}


// ── Public API ──────────────────────────────────

export async function loginService(email: string, password: string): Promise<AuthResponse> {
    const data = USE_MOCK
        ? await mockLogin(email, password)
        : await apiLogin(email, password);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
}

export async function signUpService(name: string, email: string, password: string): Promise<AuthResponse> {
    const data = USE_MOCK
        ? await mockSignUp(name, email, password)
        : await apiSignUp(name, email, password);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
}

export function logoutService(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}

export function getStoredUser(): Worker | null {
    const raw = localStorage.getItem("user");
    if (!raw || raw === "undefined") {
        return null;
    }

    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function getStoredToken(): string | null {
    return localStorage.getItem("token");
}