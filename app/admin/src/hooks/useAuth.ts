import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginService, signUpService, logoutService, getStoredUser, getStoredToken } from "../services/authService";
import { APP_ROUTES } from "../utils/Path";
import type { Worker } from "shared-utils/types/worker";


export function useAuth() {
    const navigate = useNavigate();

    const [user, setUser] = useState<Worker | null>(getStoredUser);
    const [token, setToken] = useState<string | null>(getStoredToken);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isAuthenticated = !!token;

    async function login(email: string, password: string) {
        setLoading(true);
        setError(null);
        try {
            const data = await loginService(email, password);
            setUser(data.user);
            setToken(data.token);
            navigate(APP_ROUTES.DASHBOARD);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
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
            navigate(APP_ROUTES.DASHBOARD);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Sign up failed");
        } finally {
            setLoading(false);
        }
    }

    function logout() {
        logoutService();
        setUser(null);
        setToken(null);
        navigate(APP_ROUTES.LOGIN);
    }

    function clearError() {
        setError(null);
    }

    return {
        user,
        token,
        loading,
        error,
        isAuthenticated,
        login,
        signUp,
        logout,
        clearError,
    };
}
