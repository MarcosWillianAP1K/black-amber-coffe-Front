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
    start: "IN PROGRESS",
    hold: "PENDING",
    ready: "COMPLETED",
};

const COMPLETED_STORAGE_KEY = "completedOrders";

/** Minimal data needed from the form to create a new order */
export interface NewOrderData {
    observation?: string | null;
    totalPrice: number;
    itens?: Array<{ productId: number; quantity: number; unitPrice: number; name?: string }>;
}

interface UseOrdersReturn {
    orders: Order[];
    isLoading: boolean;
    handleAction: (orderId: number, action: string) => void;
    addOrder: (data: NewOrderData) => void;
}

export function useOrders(): UseOrdersReturn {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initial fetch
    useEffect(() => {
        let cancelled = false;

        orderService.fetchOrders().then((data) => {
            if (!cancelled) {
                setOrders(data);
                localStorage.setItem("orders", JSON.stringify(data));
                setIsLoading(false);
            }
        });

        return () => { cancelled = true; };
    }, []);

    const handleAction = useCallback(async (orderId: number, action: string) => {
        // Find the order to get its publicId
        const order = orders.find((o) => o.id === orderId);
        if (!order) return;
        const publicId = order.publicId;

        if (action === "complete") {
            const completed = await orderService.completeOrder(publicId);
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
            await orderService.cancelOrder(publicId);
            setOrders((prev) => {
                const next = prev.filter((o) => o.id !== orderId);
                localStorage.setItem("orders", JSON.stringify(next));
                return next;
            });
            return;
        }

        const newStatus = ACTION_STATUS_MAP[action];
        if (!newStatus) return;

        const updated = await orderService.updateOrderStatus(publicId, newStatus);
        setOrders((prev) => {
            const next = prev.map((o) => (o.id === orderId ? updated : o));
            localStorage.setItem("orders", JSON.stringify(next));
            return next;
        });
    }, [orders]);

    const addOrder = useCallback(async (data: NewOrderData) => {
        const created = await orderService.createOrder({
            items: data.itens?.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                observation: null,
            })) ?? [],
            paymentMethod: "CASH",
            observation: data.observation ?? null,
        });

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
