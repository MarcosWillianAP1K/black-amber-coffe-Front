/**
 * useUsers — Custom hook encapsulating user/staff state and operations.
 *
 * Provides users list and handlers ready to plug into SectionUsers.
 * Uses userService internally — when API is ready, only the service changes.
 */

import { useState, useCallback, useEffect } from "react";
import type { User } from "shared-utils/types/user";
import * as userService from "../services/userService";

interface UseUsersReturn {
    users: User[];
    isLoading: boolean;
    handleOptions: (publicId: string) => void;
    deleteUser: (publicId: string) => void;
}

export function useUsers(): UseUsersReturn {
    const [users, setUsers] = useState<User[]>(() => {
        const stored = localStorage.getItem("users");
        return stored ? JSON.parse(stored) : [];
    });
    const [isLoading, setIsLoading] = useState(() => !localStorage.getItem("users"));

    // Initial fetch
    useEffect(() => {
        let cancelled = false;

        if (!localStorage.getItem("users")) {
            userService.fetchUsers().then((data) => {
                if (!cancelled) {
                    setUsers(data);
                    localStorage.setItem("users", JSON.stringify(data));
                    setIsLoading(false);
                }
            });
        }

        return () => { cancelled = true; };
    }, []);

    const handleOptions = useCallback((publicId: string) => {
        // TODO: Open a dropdown/modal with options (edit, ban, delete, etc.)
        console.log("Options for user:", publicId);
    }, []);

    const deleteUser = useCallback(async (publicId: string) => {
        await userService.deleteUser(publicId);
        setUsers((prev) => {
            const next = prev.filter((u) => u.publicId !== publicId);
            localStorage.setItem("users", JSON.stringify(next));
            return next;
        });
    }, []);

    return {
        users,
        isLoading,
        handleOptions,
        deleteUser,
    };
}
