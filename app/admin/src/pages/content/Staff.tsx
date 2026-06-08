import { DestakTitle } from "ui-shared/components/ui/DestakTitle";
import { useNavigate } from "react-router-dom";
import { SectionCustomers } from "../../components/SectionCustomers";
import { SectionEmployee } from "../../components/SectionEmployee";
import { ErrorState } from "../../components/ui/ErrorState";
import { useCustomers } from "../../hooks/useCustomers";
import { useEmployee } from "../../hooks/useEmployee";
import { APP_ROUTES } from "../../utils/Path";

function Skeleton({ className }: { className?: string }) {
    return <div className={`animate-pulse rounded-md bg-(--Border) ${className ?? ""}`} />;
}

export function Staff() {
    const navigate = useNavigate();
    const { customers, deleteCustomer, isLoading: customersLoading } = useCustomers();
    const { employees, deleteEmployee, toggleEmployeeStatus, isLoading: employeesLoading, error: employeesError, refresh: refreshEmployees } = useEmployee();
    const activeEmployees = employees.filter((employee) => employee.isActive);

    const buildProfilePath = (kind: "customer" | "employee", id: string) =>
        APP_ROUTES.PERFIL_DETAIL.replace(":kind", kind).replace(":id", id);

    const isLoading = employeesLoading || customersLoading;

    if (isLoading) {
        return (
            <div className="w-full h-fit gap-6 flex flex-col">
                <DestakTitle title="Staff" subtitle="Manage your team and staff members" />

                <div className="w-full bg-(--Widget-background) rounded-md border border-(--Border) p-5 flex flex-col gap-4">
                    <Skeleton className="h-5 w-28" />
                    <div className="flex flex-wrap gap-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="w-56 h-32 bg-(--Page-background) rounded-md border border-(--Border2) p-4 flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="w-10 h-10 rounded-full" />
                                    <div className="flex flex-col gap-1.5 flex-1">
                                        <Skeleton className="h-4 w-28" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>
                                <div className="flex-1" />
                                <Skeleton className="h-8 w-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (employeesError) {
        return (
            <div className="w-full h-fit gap-6 flex flex-col">
                <DestakTitle title="Staff" subtitle="Manage your team and staff members" />
                <div className="w-full bg-(--Widget-background) rounded-md border border-(--Border) p-5">
                    <ErrorState message={employeesError} onRetry={refreshEmployees} />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-fit gap-6 flex flex-col">
            <DestakTitle title="Staff" subtitle="Manage your team and staff members" />

            <SectionEmployee
                employees={activeEmployees}
                title="Working Now"
                onDeleteEmployee={deleteEmployee}
                onBlockEmployee={toggleEmployeeStatus}
                onViewEmployee={(publicId) => navigate(buildProfilePath("employee", publicId), { state: { from: "staff" } })}
            />

            <SectionEmployee
                employees={employees}
                title="Staff"
                onDeleteEmployee={deleteEmployee}
                onBlockEmployee={toggleEmployeeStatus}
                onViewEmployee={(publicId) => navigate(buildProfilePath("employee", publicId), { state: { from: "staff" } })}
            />


            <SectionCustomers
                customers={customers}
                title="Customers"
                onDeleteCustomer={deleteCustomer}
                onBlockCustomer={(publicId) => console.log("Block customer:", publicId)}
                onViewCustomer={(publicId) => navigate(buildProfilePath("customer", publicId), { state: { from: "staff" } })}
            />
        </div>
    );
}