/**
 * OrderContext — Centralized order state with auto-polling.
 *
 * Fetches orders once on mount, then polls every 30s.
 * Exposes refresh, addOrder, and handleAction for mutations.
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
import type { Order, OrderStatus } from "shared-utils/types/order";
import * as orderService from "../services/orderService";

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────

const POLL_INTERVAL_MS = 30_000; // 30 seconds — starts immediately (no stagger)

const ACTION_STATUS_MAP: Record<string, OrderStatus> = {
    start: "IN PROGRESS",
    hold: "PENDING",
    ready: "COMPLETED",
};

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export interface NewOrderData {
    observation?: string | null;
    totalPrice: number;
    itens?: Array<{ productId: number; quantity: number; unitPrice: number; name?: string }>;
}

interface OrderContextValue {
    orders: Order[];
    isLoading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    handleAction: (orderId: number, action: string) => Promise<void>;
    addOrder: (data: NewOrderData) => Promise<void>;
}

// ──────────────────────────────────────────────
// Context
// ──────────────────────────────────────────────

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

// ──────────────────────────────────────────────
// Provider
// ──────────────────────────────────────────────

export function OrderProvider({ children }: { children: ReactNode }) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const mountedRef = useRef(false);

    // ── Fetch orders ───────────────────────────

    const refresh = useCallback(async () => {
        setError(null);
        try {
            const data = await orderService.fetchOrders();
            setOrders(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to load orders";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ── Initial fetch + polling ────────────────

    useEffect(() => {
        if (mountedRef.current) return;
        mountedRef.current = true;

        // Initial fetch immediately (no stagger — first to load)
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

    // ── Actions ────────────────────────────────

    const handleAction = useCallback(
        async (orderId: number, action: string) => {
            const order = orders.find((o) => o.id === orderId);
            if (!order) return;
            const publicId = order.publicId;

            try {
                if (action === "complete") {
                    await orderService.completeOrder(publicId);
                    // Remove card from local list
                    setOrders((prev) => {
                        const next = prev.filter((o) => o.id !== orderId);
                        return next;
                    });
                    // Refresh from server to stay in sync
                    refresh();
                    return;
                }

                if (action === "delete") {
                    await orderService.cancelOrder(publicId);
                    setOrders((prev) => {
                        const next = prev.filter((o) => o.id !== orderId);
                        return next;
                    });
                    refresh();
                    return;
                }

                const newStatus = ACTION_STATUS_MAP[action];
                if (!newStatus) return;

                await orderService.updateOrderStatus(publicId, newStatus);
                // Optimistic update
                setOrders((prev) => {
                    const now = new Date().toISOString();
                    const next = prev.map((o) =>
                        o.id === orderId ? { ...o, status: newStatus, updatedAt: now } : o,
                    );
                    return next;
                });
                // Refresh from server to confirm
                refresh();
            } catch (error) {
                console.error("Order action failed:", error);
                // Revert optimistic update by refreshing from server
                refresh();
            }
        },
        [orders, refresh],
    );

    const addOrder = useCallback(
        async (data: NewOrderData) => {
            const created = await orderService.createOrder({
                items:
                    data.itens?.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        name: item.name,
                        observation: null,
                    })) ?? [],
                totalPrice: data.totalPrice,
                paymentMethod: "CASH",
                observation: data.observation ?? null,
            });

            setOrders((prev) => {
                const next = [created, ...prev];
                return next;
            });

            // Refresh from server — pedido mock some, lista real sincroniza
            refresh();
        },
        [refresh],
    );

    // ── Render ─────────────────────────────────

    return (
        <OrderContext.Provider
            value={{
                orders,
                isLoading,
                error,
                refresh,
                handleAction,
                addOrder,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
}

// ──────────────────────────────────────────────
// Hook
// ──────────────────────────────────────────────

// eslint-disable-next-line react-refresh/only-export-components
export function useOrderContext(): OrderContextValue {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error("useOrderContext must be used within an OrderProvider");
    }
    return context;
}
