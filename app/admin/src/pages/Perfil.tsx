

import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DestakTitle } from "ui-shared/components/ui/DestakTitle";
import { InfosUser } from "ui-shared/components/InfosUser";
import { CompTime } from "ui-shared/components/CompTIme";
import { useUsers } from "../hooks/useUsers";
import { useEmployee } from "../hooks/useEmployee";
import { useAuth } from "../hooks/useAuth";
import type { User } from "shared-utils/types/user";
import type { Employee } from "shared-utils/types/employee";

export const Perfil = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { kind, id } = useParams();
    const { users, isLoading: usersLoading } = useUsers();
    const { employees, isLoading: employeesLoading } = useEmployee();
    const { user: loggedUser } = useAuth();

    const resolvedKind = kind === "user" || kind === "employee" ? kind : null;

    const profile = useMemo(() => {
        if (resolvedKind === "user" && id) {
            return users.find((user) => user.id === id) ?? null;
        }

        if (resolvedKind === "employee" && id) {
            const match = employees.find((employee) => employee.id === id);
            if (match) return match;
            if (loggedUser && loggedUser.id === id) return loggedUser;
            return null;
        }

        return resolvedKind ? null : loggedUser ?? null;
    }, [resolvedKind, id, users, employees, loggedUser]);

    const isLoading =
        (resolvedKind === "user" && usersLoading) ||
        (resolvedKind === "employee" && employeesLoading);

    const isUserProfile = (value: User | Employee): value is User => "orders" in value;

    const profileSubtitle = resolvedKind === "user"
        ? "Customer profile"
        : resolvedKind === "employee"
            ? "Employee profile"
            : "Your profile";

    if (!profile && isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center text-(--Text-primary-off) text-sm font-secondary">
                Loading profile...
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="w-full h-full flex items-center justify-center text-(--Text-primary-off) text-sm font-secondary">
                Profile not found
            </div>
        );
    }

    const accountType = isUserProfile(profile) ? "Customer" : "Employee";
    const statusLabel = profile.active ? "Active" : "Inactive";
    const roleLabel = !isUserProfile(profile) ? (profile.job ?? "Staff") : "Loyalty member";
    const backLabel = (location.state as { from?: string } | null)?.from === "staff"
        ? "Back to Staff"
        : "Back";

    return (
        <div className="w-full h-fit gap-6 flex flex-col bg-(--Page-background) p-4">
            <div className="flex flex-wrap items-center gap-4">
                <div className="min-w-0 flex-1">
                    <DestakTitle title="Profile" subtitle={profileSubtitle} />
                </div>

                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md border-2 border-(--Border) text-(--Text-primary-off) text-xs font-secondary font-semibold uppercase tracking-wider hover:border-(--Primary) hover:text-(--Primary) transition-all duration-200"
                    aria-label={backLabel}
                >
                    {backLabel}
                </button>
            </div>

            <div className="grid w-full gap-8 xl:grid-cols-[360px_1fr]">
                <div className="relative overflow-hidden rounded-xl border-2 border-(--Border2) bg-(--Widget-background) p-7 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">

                    <div className="relative flex flex-col gap-6">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-(--Border2) bg-(--Button-background) flex items-center justify-center text-(--Primary) text-4xl font-primary font-extrabold shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                            {profile.avatarUrl ? (
                                <img
                                    src={profile.avatarUrl}
                                    alt={profile.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                profile.name.charAt(0).toUpperCase()
                            )}
                        </div>

                        <div className="flex flex-col gap-3">
                            <div>
                                <h2 className="text-(--Text-gray) text-3xl md:text-4xl font-primary font-extrabold tracking-wide">
                                    {profile.name}
                                </h2>
                                <p className="text-(--Text-primary-off) text-base font-secondary break-all">
                                    {profile.email}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <span className="px-4 py-1.5 rounded-full text-[11px] font-secondary font-semibold uppercase tracking-wider border border-(--Border2) bg-(--Select-background) text-(--Text-primary-off)">
                                    {accountType}
                                </span>
                                <span className={`px-4 py-1.5 rounded-full text-[11px] font-secondary font-semibold uppercase tracking-wider ${profile.active ? "bg-(--Afirmation)/15 text-(--Afirmation) border border-(--Afirmation)/40" : "bg-(--Negacion)/15 text-(--Negacion) border border-(--Negacion)/40"}`}>
                                    {statusLabel}
                                </span>
                            </div>

                            <div className="pt-3 text-sm font-secondary text-(--Text-gray)">
                                <span className="text-(--Primary-off) font-semibold">Function:</span> {roleLabel}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="rounded-xl border-2 border-(--Border) bg-(--Widget-background) p-6">
                        <h3 className="text-(--Primary) text-sm font-primary font-extrabold tracking-[0.3em] uppercase">
                            Account overview
                        </h3>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-1 rounded-lg border border-(--Border2) bg-(--Page-background) p-5">
                                <span className="text-[11px] font-secondary font-semibold uppercase tracking-wider text-(--Text-primary-off)">Account type</span>
                                <span className="text-(--Text-gray) text-lg font-primary font-extrabold">{accountType}</span>
                            </div>

                            <div className="flex flex-col gap-1 rounded-lg border border-(--Border2) bg-(--Page-background) p-5">
                                <span className="text-[11px] font-secondary font-semibold uppercase tracking-wider text-(--Text-primary-off)">Status</span>
                                <span className="text-(--Text-gray) text-lg font-primary font-extrabold">{statusLabel}</span>
                            </div>

                            <div className="flex flex-col gap-1 rounded-lg border border-(--Border2) bg-(--Page-background) p-5">
                                <span className="text-[11px] font-secondary font-semibold uppercase tracking-wider text-(--Text-primary-off)">Email</span>
                                <span className="text-(--Text-gray) text-base font-primary font-extrabold break-all">{profile.email}</span>
                            </div>

                            <div className="flex flex-col gap-1 rounded-lg border border-(--Border2) bg-(--Page-background) p-5">
                                <span className="text-[11px] font-secondary font-semibold uppercase tracking-wider text-(--Text-primary-off)">Member id</span>
                                <span className="text-(--Text-gray) text-base font-primary font-extrabold">{profile.id}</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border-2 border-(--Border) bg-(--Widget-background) p-6">
                        {isUserProfile(profile) ? (
                            <InfosUser orders={profile.orders} saved={profile.saved} score={profile.score} />
                        ) : (
                            <CompTime
                                bankHours={profile.timeSlot?.bankHours}
                                start={profile.timeSlot?.start}
                                lunch={profile.timeSlot?.lunch}
                                end={profile.timeSlot?.end}
                                active={profile.active}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};