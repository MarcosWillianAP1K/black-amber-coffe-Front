/**
 * Menu Service — Data access layer for menu items (products).
 *
 * Integrated with backend /api/products and /api/admin/products endpoints.
 */

import type { Product, ProductInput } from "shared-utils/types/product";
import { MOCK_PRODUCTS } from "shared-utils/MockBD.js";
import { authFetch } from "./httpClient.ts";
import { API } from "shared-utils/core/APIroutes";

// Mock toggle — set to false to use real API
const USE_MOCK = false;

let nextId = 4;

// In-memory store (simulates server state)
let items = [...MOCK_PRODUCTS];

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

interface PaginatedProductsResponse {
    products: Product[];
    total: number;
    page: number;
    limit: number;
}

interface SingleProductResponse {
    data: Product;
}

interface ProductWithMessageResponse {
    data: Product;
    message?: string;
}

// ──────────────────────────────────────────────
// Service functions
// ──────────────────────────────────────────────

/** Fetch all menu items */
export async function fetchMenuItems(): Promise<Product[]> {
    if (USE_MOCK) {
        return [...items];
    }

    const response = await authFetch(API.Products.List, {
        method: "GET",
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch menu items: ${response.status}`);
    }

    const payload = (await response.json()) as PaginatedProductsResponse;
    return payload.products;
}

/** Create a new menu item */
export async function createMenuItem(data: ProductInput): Promise<Product> {
    if (USE_MOCK) {
        const id = nextId++;
        const now = new Date().toISOString();
        const newItem: Product = {
            id,
            publicId: `product-${id}`,
            name: data.name,
            description: data.description ?? null,
            size: data.size ?? null,
            category: data.category,
            price: data.price,
            isActive: data.isActive ?? true,
            imageUrl: data.imageUrl ?? null,
            createdAt: now,
            updatedAt: now,
        };
        items = [...items, newItem];
        return newItem;
    }

    const response = await authFetch(API.AdminProducts.Create, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: data.name,
            description: data.description ?? null,
            size: data.size ?? null,
            price: data.price,
            category: data.category,
        }),
    });

    if (!response.ok) {
        throw new Error(`Failed to create menu item: ${response.status}`);
    }

    const payload = (await response.json()) as SingleProductResponse;
    return payload.data;
}

/** Update an existing menu item */
export async function updateMenuItem(publicId: string, data: ProductInput): Promise<Product> {
    if (USE_MOCK) {
        const now = new Date().toISOString();
        const existing = items.find((item) => item.publicId === publicId);
        if (!existing) throw new Error(`Product ${publicId} not found`);
        const updated: Product = {
            id: existing.id,
            publicId,
            name: data.name,
            description: data.description ?? null,
            size: data.size ?? null,
            category: data.category,
            price: data.price,
            isActive: data.isActive ?? true,
            imageUrl: data.imageUrl ?? null,
            createdAt: existing.createdAt,
            updatedAt: now,
        };
        items = items.map((item) => (item.publicId === publicId ? updated : item));
        return updated;
    }

    const response = await authFetch(API.AdminProducts.UpdateById(publicId), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: data.name,
            description: data.description ?? null,
            size: data.size ?? null,
            price: data.price,
            category: data.category,
            isActive: data.isActive,
        }),
    });

    if (!response.ok) {
        throw new Error(`Failed to update menu item: ${response.status}`);
    }

    const payload = (await response.json()) as ProductWithMessageResponse;
    return payload.data;
}

/** Delete a menu item by publicId */
export async function deleteMenuItem(publicId: string): Promise<void> {
    if (USE_MOCK) {
        items = items.filter((item) => item.publicId !== publicId);
        return;
    }

    const response = await authFetch(API.AdminProducts.DeleteById(publicId), {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error(`Failed to delete menu item: ${response.status}`);
    }
}
