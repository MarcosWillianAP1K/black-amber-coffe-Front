import {
    LayoutDashboard,
    Menu,
    Activity,
    Archive,
    BarChart2,
    Users,
    HelpCircle,
    LogOut
} from "lucide-react";

import { APP_ROUTES } from "../utils/Path";
import { getStoredUser } from "../services/authService";

import { NavItem } from "ui-shared/components/ui/NavItem";
import { PerfilNav } from "ui-shared/components/ui/PerfilNav";


const mainLinks = [
    { label: "Dashboard", icon: LayoutDashboard, path: APP_ROUTES.DASHBOARD },
    { label: "Menu", icon: Menu, path: APP_ROUTES.MENU },
    { label: "Live Orders", icon: Activity, path: APP_ROUTES.LIVE_ORDERS },
    { label: "Inventory", icon: Archive, path: APP_ROUTES.INVENTORY },
    { label: "Analytics", icon: BarChart2, path: APP_ROUTES.ANALYTICS },
    { label: "Staff", icon: Users, path: APP_ROUTES.STAFF },
];

export function NavBarLeft() {
    const user = getStoredUser();

    return (
        <aside className="w-64 h-full bg-(--Widget-background) flex flex-col py-6 gap-6">

            {/* SEÇÃO 1: Perfil do Usuário */}
            <PerfilNav
                name={user?.name}
                job={user?.job}
                avatarUrl={user?.avatarUrl}
            />

            {/* SEÇÃO 2: Navegação Principal */}
            <nav className="flex-1">
                {mainLinks.map((link) => (
                    <NavItem
                        key={link.path} // Usar o path como key é mais seguro que o label!
                        icon={link.icon}
                        label={link.label}
                        to={link.path}
                    />
                ))}
            </nav>

            {/* SEÇÃO 3: Rodapé (Suporte e Logout) */}
            <div className="mt-auto">
                <NavItem
                    icon={HelpCircle}
                    label="Support"
                    to={APP_ROUTES.SUPPORT}
                />
                <NavItem
                    icon={LogOut}
                    label="Logout"
                    to={APP_ROUTES.LOGIN}
                />
            </div>

        </aside>
    );
}