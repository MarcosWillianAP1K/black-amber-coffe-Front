/**
 * useMenuItems — Consumes the shared MenuContext.
 */

import { useMenuContext } from "../context/MenuContext";
import type { ProductInput } from "shared-utils/types/product";

interface UseMenuItemsReturn {
    items: ReturnType<typeof useMenuContext>["items"];
    isLoading: ReturnType<typeof useMenuContext>["isLoading"];
    handlers: ReturnType<typeof useMenuContext>["handlers"];
}

export function useMenuItems(): UseMenuItemsReturn {
    const { items, isLoading, handlers } = useMenuContext();

    return {
        items,
        isLoading,
        handlers,
    };
}

export type { ProductInput };

