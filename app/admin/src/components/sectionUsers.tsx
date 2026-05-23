import { useMemo, useState } from "react";
import { CardUser } from "./ui/CardUser";
import { SearchBar } from "ui-shared/components/ui/SearchBar";
import { FilterButton, type FilterOption } from "ui-shared/components/FilterButton";
import type { User } from "shared-utils/types/user";


export interface SectionUsersProps {
    users: User[];
    title: string;
    onDeleteUser: (id: string) => void;
    onBlockUser: (id: string) => void;
    onViewUser: (id: string) => void;
}

export function SectionUsers({ users, title, onDeleteUser, onBlockUser, onViewUser }: SectionUsersProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortType, setSortType] = useState<"default" | "name-asc" | "name-desc" | "orders-desc" | "saved-desc" | "score-desc">("default");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

    const filteredUsers = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        let next = [...users];

        if (query) {
            next = next.filter((user) => {
                const values = [user.name, user.email];
                return values.some((value) => value.toLowerCase().includes(query));
            });
        }

        if (statusFilter === "active") {
            next = next.filter((user) => user.active);
        }

        if (statusFilter === "inactive") {
            next = next.filter((user) => !user.active);
        }

        const nameCompare = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: "base" });

        switch (sortType) {
            case "name-asc":
                next.sort((a, b) => nameCompare(a.name, b.name));
                break;
            case "name-desc":
                next.sort((a, b) => nameCompare(b.name, a.name));
                break;
            case "orders-desc":
                next.sort((a, b) => b.orders - a.orders || nameCompare(a.name, b.name));
                break;
            case "saved-desc":
                next.sort((a, b) => b.saved - a.saved || nameCompare(a.name, b.name));
                break;
            case "score-desc":
                next.sort((a, b) => b.score - a.score || nameCompare(a.name, b.name));
                break;
            default:
                break;
        }

        return next;
    }, [users, searchTerm, sortType, statusFilter]);

    const filterOptions: FilterOption[] = [
        {
            label: "Default order",
            action: () => setSortType("default"),
            active: sortType === "default",
        },
        {
            label: "Name (A-Z)",
            action: () => setSortType("name-asc"),
            active: sortType === "name-asc",
        },
        {
            label: "Name (Z-A)",
            action: () => setSortType("name-desc"),
            active: sortType === "name-desc",
        },
        {
            label: "Most orders",
            action: () => setSortType("orders-desc"),
            active: sortType === "orders-desc",
        },
        {
            label: "Most saved",
            action: () => setSortType("saved-desc"),
            active: sortType === "saved-desc",
        },
        {
            label: "Highest score",
            action: () => setSortType("score-desc"),
            active: sortType === "score-desc",
        },
        {
            label: "All statuses",
            action: () => setStatusFilter("all"),
            active: statusFilter === "all",
        },
        {
            label: "Active only",
            action: () => setStatusFilter("active"),
            active: statusFilter === "active",
        },
        {
            label: "Inactive only",
            action: () => setStatusFilter("inactive"),
            active: statusFilter === "inactive",
        },
    ];

    return (
        <div className="w-full h-140 flex flex-col px-4 py-2 gap-4 bg-(--Widget-background) rounded-md">

            {/* header */}
            <div className="flex flex-wrap justify-between items-center gap-3 pb-2 border-b border-(--Border)">

                {/* Title */}
                <h1 className="flex-1 min-w-0 h-fit text-(--Primary-off) text-[24px] font-primary font-bold">
                    {title}
                </h1>

                <div className="flex items-center gap-3">
                    <SearchBar placeholder="Search" onChange={setSearchTerm} />
                    <FilterButton
                        title="User filters"
                        buttonLabel="Filter"
                        options={filterOptions}
                        align="right"
                    />
                </div>

            </div>

            {/* content */}
            <div className="w-full h-full flex flex-wrap justify-center gap-6 overflow-y-auto">
                {filteredUsers.map((user) => (
                    <CardUser
                        key={user.id}
                        {...user}
                        onDeleteUser={onDeleteUser}
                        onBlockUser={onBlockUser}
                        onViewUser={onViewUser}
                    />
                ))}
            </div>

        </div>
    );
}