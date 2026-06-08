/**
 * EmployeeContext — Centralized employee/staff state with auto-polling.
 *
 * Fetches workers once on mount, then polls every 30s.
 */

import {
    createContext,
    useContext,
    useCallback,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";
import type { Worker, WorkerUpdateInput } from "shared-utils/types/worker";
import * as employeeService from "../services/employeeService";

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────

const POLL_INTERVAL_MS = 30_000; // 30 seconds

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

interface EmployeeContextValue {
    employees: Worker[];
    isLoading: boolean;
    refresh: () => Promise<void>;
    deleteEmployee: (publicId: string) => Promise<void>;
    toggleEmployeeStatus: (publicId: string) => Promise<void>;
    updateEmployee: (publicId: string, updates: Partial<WorkerUpdateInput>) => Promise<void>;
}

// ──────────────────────────────────────────────
// Context
// ──────────────────────────────────────────────

const EmployeeContext = createContext<EmployeeContextValue | undefined>(undefined);

// ──────────────────────────────────────────────
// Provider
// ──────────────────────────────────────────────

export function EmployeeProvider({ children }: { children: ReactNode }) {
    const [employees, setEmployees] = useState<Worker[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const mountedRef = useRef(false);

    // ── Fetch employees ──────────────────────

    const refresh = useCallback(async () => {
        try {
            const data = await employeeService.fetchEmployees();
            setEmployees(data);
            localStorage.setItem("employees", JSON.stringify(data));
        } catch {
            // Silently fail — next poll will retry
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ── Initial fetch + polling ──────────────

    useEffect(() => {
        if (mountedRef.current) return;
        mountedRef.current = true;

        refresh();

        pollingRef.current = setInterval(refresh, POLL_INTERVAL_MS);

        return () => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
            }
            mountedRef.current = false;
        };
    }, [refresh]);

    // ── Actions ──────────────────────────────

    const deleteEmployee = useCallback(
        async (publicId: string) => {
            await employeeService.deleteEmployee(publicId);
            setEmployees((prev) => {
                const next = prev.filter((e) => e.publicId !== publicId);
                localStorage.setItem("employees", JSON.stringify(next));
                return next;
            });
            refresh();
        },
        [refresh],
    );

    const toggleEmployeeStatus = useCallback(
        async (publicId: string) => {
            const updated = await employeeService.toggleEmployeeStatus(publicId);
            setEmployees((prev) => {
                const next = prev.map((e) => (e.publicId === publicId ? updated : e));
                localStorage.setItem("employees", JSON.stringify(next));
                return next;
            });
            refresh();
        },
        [refresh],
    );

    const updateEmployee = useCallback(
        async (publicId: string, updates: Partial<WorkerUpdateInput>) => {
            const updated = await employeeService.updateEmployee(publicId, updates);
            setEmployees((prev) => {
                const next = prev.map((e) => (e.publicId === publicId ? updated : e));
                localStorage.setItem("employees", JSON.stringify(next));
                return next;
            });
            refresh();
        },
        [refresh],
    );

    // ── Render ───────────────────────────────

    return (
        <EmployeeContext.Provider
            value={{
                employees,
                isLoading,
                refresh,
                deleteEmployee,
                toggleEmployeeStatus,
                updateEmployee,
            }}
        >
            {children}
        </EmployeeContext.Provider>
    );
}

// ──────────────────────────────────────────────
// Hook
// ──────────────────────────────────────────────

export function useEmployeeContext(): EmployeeContextValue {
    const context = useContext(EmployeeContext);
    if (!context) {
        throw new Error("useEmployeeContext must be used within an EmployeeProvider");
    }
    return context;
}
