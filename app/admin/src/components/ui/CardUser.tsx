/**
 * CardUser — Admin-specific client card.
 * Combines PerfilCard (avatar + name + email).
 * Uses OptionsEllipsis for the dropdown menu with dynamic actions.
 */

import { PerfilCard } from "ui-shared/components/ui/PerfilCard";
import { OptionsEllipsis } from "ui-shared/components/OptionElipisses";
import type { User } from "shared-utils/types/user";

/** CardUser props = User data + action callbacks */
export interface CardUserProps extends User {
    onDeleteUser: (publicId: string) => void;
    onBlockUser: (publicId: string) => void;
    onViewUser: (publicId: string) => void;
}

export function CardUser({ publicId, email, profile, onDeleteUser, onBlockUser, onViewUser }: CardUserProps) {
    return (
        <div className="w-90 h-fit p-4 bg-(--Widget-background) rounded-md border border-(--Border) flex flex-col gap-6">

            {/* Top: Profile + Options dropdown */}
            <div className="flex items-start justify-between">
                <PerfilCard
                    name={profile.fullName}
                    email={email}
                    avatarUrl={profile.avatarImage ?? undefined}
                />

                <OptionsEllipsis
                    options={[
                        { label: "View Profile", action: () => onViewUser(publicId) },
                        { label: "Block User", action: () => onBlockUser(publicId) },
                        { label: "Delete", action: () => onDeleteUser(publicId), danger: true },
                    ]}
                />
            </div>

            <div className="w-full h-fit">
                <p className="text-(--Text-primary-off) text-xs font-secondary">
                    Member since {new Date(profile.createdAt).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
}