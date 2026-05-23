import { useMemo, useState } from "react";
import { CardEmployee } from "./ui/CardEmployee";
import { SearchBar } from "ui-shared/components/ui/SearchBar";
import { FilterButton, type FilterOption } from "ui-shared/components/FilterButton";
import type { Employee } from "shared-utils/types/employee";


export interface SectionEmployeeProps {
    employees: Employee[];
    title: string;
    onDeleteEmployee: (id: string) => void;
    onBlockEmployee: (id: string) => void;
    onViewEmployee: (id: string) => void;
}

export function SectionEmployee({ employees, title, onDeleteEmployee, onBlockEmployee, onViewEmployee }: SectionEmployeeProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortType, setSortType] = useState<"default" | "name-asc" | "name-desc" | "role-asc" | "bankhours-asc" | "bankhours-desc">("default");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

    const filteredEmployees = useMemo(() => {
        const getBankHoursValue = (bankHours?: string) => {
            if (!bankHours) return 0;
            const trimmed = bankHours.trim();
            const timeMatch = trimmed.match(/^(\d+)(?::(\d+))?/);
            if (timeMatch) {
                const hours = Number(timeMatch[1]);
                const minutes = timeMatch[2] ? Number(timeMatch[2]) : 0;
                return hours + minutes / 60;
            }
            const numberMatch = trimmed.match(/[\d.]+/);
            return numberMatch ? Number(numberMatch[0]) : 0;
        };

        const query = searchTerm.trim().toLowerCase();
        let next = [...employees];

        if (query) {
            next = next.filter((employee) => {
                const values = [employee.name, employee.email, employee.job ?? ""];
                return values.some((value) => value.toLowerCase().includes(query));
            });
        }

        if (statusFilter === "active") {
            next = next.filter((employee) => employee.active);
        }

        if (statusFilter === "inactive") {
            next = next.filter((employee) => !employee.active);
        }

        const nameCompare = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: "base" });

        switch (sortType) {
            case "name-asc":
                next.sort((a, b) => nameCompare(a.name, b.name));
                break;
            case "name-desc":
                next.sort((a, b) => nameCompare(b.name, a.name));
                break;
            case "role-asc":
                next.sort((a, b) => nameCompare(a.job ?? "", b.job ?? ""));
                break;
            case "bankhours-asc":
                next.sort((a, b) => getBankHoursValue(a.timeSlot?.bankHours) - getBankHoursValue(b.timeSlot?.bankHours) || nameCompare(a.name, b.name));
                break;
            case "bankhours-desc":
                next.sort((a, b) => getBankHoursValue(b.timeSlot?.bankHours) - getBankHoursValue(a.timeSlot?.bankHours) || nameCompare(a.name, b.name));
                break;
            default:
                break;
        }

        return next;
    }, [employees, searchTerm, sortType, statusFilter]);

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
            label: "Role (A-Z)",
            action: () => setSortType("role-asc"),
            active: sortType === "role-asc",
        },
        {
            label: "Comp time (Low to High)",
            action: () => setSortType("bankhours-asc"),
            active: sortType === "bankhours-asc",
        },
        {
            label: "Comp time (High to Low)",
            action: () => setSortType("bankhours-desc"),
            active: sortType === "bankhours-desc",
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
            <div className="w-full flex flex-wrap justify-between items-center gap-3 pb-2 border-b border-(--Border)">

                {/* Title */}
                <h1 className="flex-1 min-w-0 h-fit text-(--Primary-off) text-[24px] font-primary font-bold">
                    {title}
                </h1>

                <div className="flex items-center gap-3">
                    <SearchBar placeholder="Search" onChange={setSearchTerm} />
                    <FilterButton
                        title="Employee filters"
                        buttonLabel="Filter"
                        options={filterOptions}
                        align="right"
                    />
                </div>

            </div>

            {/* content */}
            <div className="w-full h-full flex flex-wrap justify-center gap-6 overflow-y-auto">
                {filteredEmployees.map((employee) => (
                    <CardEmployee
                        key={employee.id}
                        {...employee}
                        onDeleteEmployee={onDeleteEmployee}
                        onBlockEmployee={onBlockEmployee}
                        onViewEmployee={onViewEmployee}
                    />
                ))}
            </div>

        </div>
    );
}