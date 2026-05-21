import { ButtonPrimary } from "./ButtonPrimary";

interface PerfilNavProps {
    name?: string;
    job?: string;
    avatarUrl?: string;
}

export function PerfilNav({ name, job, avatarUrl }: PerfilNavProps) {
    const displayName = name ?? "The Obsidian";
    const displayJob = job ?? "MANAGEMENT PORTAL";
    const displayAvatar = avatarUrl || "https://github.com/MarcosWillian.png";

    return (
        <div className="px-6 items-start justify-center flex flex-col">
            <div className="flex items-center gap-3 mb-6">
                <img
                    src={displayAvatar}
                    alt={displayName}
                    className="w-10 h-10 rounded-sm bg-zinc-800"
                />

                <div className="flex flex-col max-w-40">
                    <h2 className="text-(--Primary) font-primary font-bold text-lg leading-tight truncate">{displayName}</h2>
                    <span className="text-[12px] text-(--Text-gray) font-secondary tracking-wider truncate">{displayJob}</span>
                </div>
            </div>


            <ButtonPrimary onClick={() => console.log("Criar nova entrada")}>
                <span>+</span> New Entry
            </ButtonPrimary>
        </div>
    );

}