import type { User, UserUpdateInput } from "shared-utils/types/user";
import { MOCK_USERS } from "shared-utils/MockBD.js";

// In-memory store (will be replaced by API calls)
let users: User[] = [...MOCK_USERS];

// ──────────────────────────────────────────────
// Service functions
// ──────────────────────────────────────────────

/** Fetch all users */
export async function fetchUsers(): Promise<User[]> {
    // TODO: Replace with actual API call
    // Example: return await fetch("/api/users").then((res) => res.json());
    return [...users];
}

/** Update user (by publicId) */
export async function updateUser(publicId: string, updates: Partial<UserUpdateInput>): Promise<User> {
    // TODO: Replace with actual API call
    const now = new Date().toISOString();
    users = users.map((u) =>
        u.publicId === publicId
            ? {
                ...u,
                email: updates.email ?? u.email,
                profile: {
                    ...u.profile,
                    fullName: updates.fullName ?? u.profile.fullName,
                    phone: updates.phone ?? u.profile.phone,
                    updatedAt: now,
                },
                updatedAt: now,
            }
            : u
    );
    const updatedUser = users.find((u) => u.publicId === publicId);
    if (!updatedUser) throw new Error(`User ${publicId} not found`);
    return updatedUser;
}

/** Delete a user */
export async function deleteUser(publicId: string): Promise<void> {
    // TODO: Replace with actual API call
    users = users.filter((u) => u.publicId !== publicId);
}

/** Create a new user */
export async function createUser(userData: Omit<User, "publicId">): Promise<User> {
    // TODO: Replace with actual API call
    const now = new Date().toISOString();
    const newUser: User = {
        publicId: Math.random().toString(36).substr(2, 9),
        ...userData,
        createdAt: now,
        updatedAt: now,
    };
    users.push(newUser);
    return newUser;
}

/** Filter users by name or email query */
export async function filterUsers(
    filters: { query?: string }
): Promise<User[]> {
    // TODO: Replace with actual API call
    return users.filter((user) => {
        if (filters.query) {
            const q = filters.query.toLowerCase();
            return (
                user.profile.fullName.toLowerCase().includes(q) ||
                user.email.toLowerCase().includes(q)
            );
        }
        return true;
    });
}
