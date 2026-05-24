import { useMemo, useState } from "react";
import { CardUser } from "./ui/CardUser";
import { SearchBar } from "ui-shared/components/ui/SearchBar";
import { FilterButton, type FilterOption } from "ui-shared/components/FilterButton";
import type { User } from "shared-utils/types/user";


export interface SectionUsersProps {
    users: User[];
    title: string;
    onDeleteUser: (publicId: string) => void;
    onBlockUser: (publicId: string) => void;
    onViewUser: (publicId: string) => void;
}

export function SectionUsers({ users, title, onDeleteUser, onBlockUser, onViewUser }: SectionUsersProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortType, setSortType] = useState<"default" | "name-asc" | "name-desc" | "newest" | "oldest">("default");

    const filteredUsers = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        let next = [...users];

        if (query) {
            next = next.filter((user) => {
                const values = [user.profile.fullName, user.email];
                return values.some((value) => value.toLowerCase().includes(query));
            });
        }

        const nameCompare = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: "base" });

        switch (sortType) {
            case "name-asc":
                next.sort((a, b) => nameCompare(a.profile.fullName, b.profile.fullName));
                break;
            case "name-desc":
                next.sort((a, b) => nameCompare(b.profile.fullName, a.profile.fullName));
                break;
            case "newest":
                next.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case "oldest":
                next.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                break;
            default:
                break;
        }

        return next;
    }, [users, searchTerm, sortType]);

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
            label: "Newest first",
            action: () => setSortType("newest"),
            active: sortType === "newest",
        },
        {
            label: "Oldest first",
            action: () => setSortType("oldest"),
            active: sortType === "oldest",
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
                        key={user.publicId}
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