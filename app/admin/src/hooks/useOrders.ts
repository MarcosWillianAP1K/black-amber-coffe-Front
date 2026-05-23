/**
 * useOrders — Custom hook encapsulating order state and operations.
 *
 * Provides the orders list and action handler ready to plug into CardOrder components.
 * Uses orderService internally — when the backend is ready, only the service changes.
 */

import { useState, useCallback, useEffect } from "react";
import type { Order, OrderStatus } from "shared-utils/types/order";
import * as orderService from "../services/orderService";

/** Maps UI button actions to their resulting OrderStatus */
const ACTION_STATUS_MAP: Record<string, OrderStatus> = {
    start: "In Progress",
    hold: "Created",
    ready: "Ready",
};

const COMPLETED_STORAGE_KEY = "completedOrders";

interface UseOrdersReturn {
    orders: Order[];
    isLoading: boolean;
    handleAction: (orderId: string, action: string) => void;
    addOrder: (data: Omit<Order, "id" | "status"> & { status?: OrderStatus }) => void;
}

export function useOrders(): UseOrdersReturn {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initial fetch
    useEffect(() => {
        let cancelled = false;

        localStorage.removeItem("orders");
        localStorage.removeItem(COMPLETED_STORAGE_KEY);

        orderService.fetchOrders().then((data) => {
            if (!cancelled) {
                setOrders(data);
                localStorage.setItem("orders", JSON.stringify(data));
                setIsLoading(false);
            }
        });

        return () => { cancelled = true; };
    }, []);

    const handleAction = useCallback(async (orderId: string, action: string) => {
        if (action === "complete") {
            const completed = await orderService.completeOrder(orderId);
            setOrders((prev) => {
                const next = prev.filter((o) => o.id !== orderId);
                localStorage.setItem("orders", JSON.stringify(next));
                return next;
            });

            const storedCompleted = localStorage.getItem(COMPLETED_STORAGE_KEY);
            const completedList: Order[] = storedCompleted ? JSON.parse(storedCompleted) : [];
            localStorage.setItem(COMPLETED_STORAGE_KEY, JSON.stringify([completed, ...completedList]));
            return;
        }

        if (action === "delete") {
            await orderService.deleteOrder(orderId);
            setOrders((prev) => {
                const next = prev.filter((o) => o.id !== orderId);
                localStorage.setItem("orders", JSON.stringify(next));
                return next;
            });
            return;
        }

        const newStatus = ACTION_STATUS_MAP[action];
        if (!newStatus) return;

        const updated = await orderService.updateOrderStatus(orderId, newStatus);
        setOrders((prev) => {
            const next = prev.map((o) => (o.id === orderId ? updated : o));
            localStorage.setItem("orders", JSON.stringify(next));
            return next;
        });
    }, []);

    const addOrder = useCallback(async (data: Omit<Order, "id" | "status"> & { status?: OrderStatus }) => {
        const id = typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        const newOrder: Order = {
            id,
            status: data.status ?? "Created",
            customer: data.customer,
            code: data.code,
            items: data.items,
            observations: data.observations,
            total: data.total,
        };

        const created = await orderService.createOrder(newOrder);
        setOrders((prev) => {
            const next = [created, ...prev];
            localStorage.setItem("orders", JSON.stringify(next));
            return next;
        });
    }, []);

    return {
        orders,
        isLoading,
        handleAction,
        addOrder,
    };
}
