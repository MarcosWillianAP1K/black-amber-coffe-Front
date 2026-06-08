/**
 * MenuContext — Centralized menu/products state with auto-polling.
 *
 * Fetches products once on mount, then polls every 30s.
 * Exposes refresh, create, update, delete, uploadImage, activate, deactivate.
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
import type { Product, ProductInput } from "shared-utils/types/product";
import * as menuService from "../services/menuService";

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────

const POLL_INTERVAL_MS = 35_000; // 35 seconds — staggered from OrderContext (30s)

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

interface MenuContextValue {
    items: Product[];
    isLoading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    handlers: {
        onCreate: (data: ProductInput) => Promise<void>;
        onEdit: (id: number, data: ProductInput) => Promise<void>;
        onDelete: (id: number) => Promise<void>;
    };
}

// ──────────────────────────────────────────────
// Context
// ──────────────────────────────────────────────

const MenuContext = createContext<MenuContextValue | undefined>(undefined);

// ──────────────────────────────────────────────
// Provider
// ──────────────────────────────────────────────

export function MenuProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const mountedRef = useRef(false);

    // ── Fetch items ──────────────────────────

    const refresh = useCallback(async () => {
        setError(null);
        try {
            const data = await menuService.fetchMenuItems();
            setItems(data);
            localStorage.setItem("menuItems", JSON.stringify(data));
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to load menu";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ── Initial fetch + polling ──────────────
    // Staggered 3s after mount to spread out requests

    useEffect(() => {
        if (mountedRef.current) return;
        mountedRef.current = true;

        const initialTimer = setTimeout(refresh, 3_000);

        pollingRef.current = setInterval(refresh, POLL_INTERVAL_MS);

        return () => {
            clearTimeout(initialTimer);
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
            }
            mountedRef.current = false;
        };
    }, [refresh]);

    // ── Actions ──────────────────────────────

    const onCreate = useCallback(
        async (data: ProductInput) => {
            const { imageFile, ...productData } = data;
            const created = await menuService.createMenuItem(productData);

            // Upload image in background after creation
            if (imageFile) {
                await menuService.uploadProductImage(created.publicId, imageFile);
            }

            setItems((prev) => {
                const next = [...prev, created];
                localStorage.setItem("menuItems", JSON.stringify(next));
                return next;
            });
            refresh();
        },
        [refresh],
    );

    const onEdit = useCallback(
        async (id: number, data: ProductInput) => {
            const product = items.find((item) => item.id === id);
            if (!product) throw new Error(`Product ${id} not found`);

            const { imageFile, ...productData } = data;
            const updated = await menuService.updateMenuItem(product.publicId, productData);

            // Upload image in background after update
            if (imageFile) {
                await menuService.uploadProductImage(product.publicId, imageFile);
            }

            setItems((prev) => {
                const next = prev.map((item) => (item.id === id ? updated : item));
                localStorage.setItem("menuItems", JSON.stringify(next));
                return next;
            });
            refresh();
        },
        [items, refresh],
    );

    const onDelete = useCallback(
        async (id: number) => {
            const product = items.find((item) => item.id === id);
            if (!product) return;

            await menuService.deleteMenuItem(product.publicId);
            setItems((prev) => {
                const next = prev.filter((item) => item.id !== id);
                localStorage.setItem("menuItems", JSON.stringify(next));
                return next;
            });
            refresh();
        },
        [items, refresh],
    );

    // ── Render ───────────────────────────────

    return (
        <MenuContext.Provider
            value={{
                items,
                isLoading,
                error,
                refresh,
                handlers: {
                    onCreate,
                    onEdit,
                    onDelete,
                },
            }}
        >
            {children}
        </MenuContext.Provider>
    );
}

// ──────────────────────────────────────────────
// Hook
// ──────────────────────────────────────────────

export function useMenuContext(): MenuContextValue {
    const context = useContext(MenuContext);
    if (!context) {
        throw new Error("useMenuContext must be used within a MenuProvider");
    }
    return context;
}
