
import { Outlet } from "react-router-dom"; // Importe o Outlet aqui!
import { NavBarTop } from "../layout/NavBarTop";
import { NavBarDown } from "../layout/NavBarDown";
import { useAuth } from "../hooks/useAuth";

export function Template() {
    const { user, notifications, logout } = useAuth();

    return (
        <div className="overflow-hidden w-full h-screen flex flex-col">
            <NavBarTop user={user} notifications={notifications} onLogout={logout} />

            <div className="flex-1 overflow-hidden bg-(--Page-background) p-6">
                <Outlet />
            </div>


            <NavBarDown />
        </div>
    );
}

