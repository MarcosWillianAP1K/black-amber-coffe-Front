import { DestakTitle } from "ui-shared/components/ui/DestakTitle";
import { useNavigate } from "react-router-dom";
import { SectionUsers } from "../../components/SectionUsers";
import { SectionEmployee } from "../../components/SectionEmployee";
import { useUsers } from "../../hooks/useUsers";
import { useEmployee } from "../../hooks/useEmployee";
import { APP_ROUTES } from "../../utils/Path";

export function Staff() {
    const navigate = useNavigate();
    const { users, deleteUser, toggleUserStatus } = useUsers();
    const { employees, deleteEmployee, toggleEmployeeStatus } = useEmployee();
    const activeEmployees = employees.filter((employee) => employee.active);

    const buildProfilePath = (kind: "user" | "employee", id: string) =>
        APP_ROUTES.PERFIL_DETAIL.replace(":kind", kind).replace(":id", id);

    return (
        <div className="w-full h-fit gap-6 flex flex-col">
            <DestakTitle title="Staff" subtitle="Manage your team and staff members" />

            <SectionEmployee
                employees={activeEmployees}
                title="Working Now"
                onDeleteEmployee={deleteEmployee}
                onBlockEmployee={toggleEmployeeStatus}
                onViewEmployee={(id) => navigate(buildProfilePath("employee", id), { state: { from: "staff" } })}
            />

            <SectionEmployee
                employees={employees}
                title="Staff"
                onDeleteEmployee={deleteEmployee}
                onBlockEmployee={toggleEmployeeStatus}
                onViewEmployee={(id) => navigate(buildProfilePath("employee", id), { state: { from: "staff" } })}
            />


            <SectionUsers
                users={users}
                title="Users"
                onDeleteUser={deleteUser}
                onBlockUser={toggleUserStatus}
                onViewUser={(id) => navigate(buildProfilePath("user", id), { state: { from: "staff" } })}
            />





        </div>
    );
}