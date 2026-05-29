import { createContext, useEffect, useState, type ReactNode } from "react";
import {
    loginService,
    signUpService,
    logoutService,
    refreshTokenService,
    logoutApiService,
    getStoredUser,
    getStoredToken,
    getStoredRefreshToken,
} from "../services/authService";
import type { Worker } from "shared-utils/types/worker";

type AuthContextValue = {
    user: Worker | null;
    token: string | null;
    refreshToken: string | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    signUp: (name: string, email: string, password: string) => Promise<boolean>;
    refreshSession: () => Promise<void>;
    logout: (logoutAllDevices?: boolean) => Promise<void>;
    clearError: () => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<Worker | null>(getStoredUser);
    const [token, setToken] = useState<string | null>(getStoredToken);
    const [refreshToken, setRefreshToken] = useState<string | null>(getStoredRefreshToken);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isAuthenticated = !!token;

    useEffect(() => {
        if (!user) {
            const storedUser = getStoredUser();
            if (storedUser) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setUser(storedUser);
            }
        }

        if (!token) {
            const storedToken = getStoredToken();
            if (storedToken) {
                setToken(storedToken);
            }
        }

        if (!refreshToken) {
            const storedRefreshToken = getStoredRefreshToken();
            if (storedRefreshToken) {
                setRefreshToken(storedRefreshToken);
            }
        }
    }, [user, token, refreshToken]);

    async function login(email: string, password: string) {
        setLoading(true);
        setError(null);
        try {
            const data = await loginService(email, password);
            setUser(data.user);
            setToken(data.token);
            if (data.refreshToken) {
                setRefreshToken(data.refreshToken);
            }
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
            return false;
        } finally {
            setLoading(false);
        }
    }

    async function signUp(name: string, email: string, password: string) {
        setLoading(true);
        setError(null);
        try {
            const data = await signUpService(name, email, password);
            setUser(data.user);
            setToken(data.token);
            if (data.refreshToken) {
                setRefreshToken(data.refreshToken);
            }
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Sign up failed");
            return false;
        } finally {
            setLoading(false);
        }
    }

    async function logout(logoutAllDevices = false) {
        if (refreshToken) {
            try {
                await logoutApiService(refreshToken, logoutAllDevices);
            } catch {
                // Ignore logout API errors; we still clear local session.
            }
        }

        logoutService();
        setUser(null);
        setToken(null);
        setRefreshToken(null);
    }

    async function refreshSession() {
        if (!refreshToken) {
            throw new Error("Refresh token missing");
        }

        const data = await refreshTokenService(refreshToken);
        setToken(data.data.accessToken);
        setRefreshToken(data.data.refreshToken);
    }

    function clearError() {
        setError(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                refreshToken,
                loading,
                error,
                isAuthenticated,
                login,
                signUp,
                refreshSession,
                logout,
                clearError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
