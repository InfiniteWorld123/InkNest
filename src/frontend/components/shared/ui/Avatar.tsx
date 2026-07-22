import { Avatar as HeroAvatar } from "@heroui/react";

type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps {
	src?: string | null;
	name: string;
	size?: AvatarSize;
}

const sizes: Record<AvatarSize, string> = {
	sm: "h-8 w-8 text-xs",
	md: "h-11 w-11 text-sm",
	lg: "h-16 w-16 text-lg",
};

function initials(name: string): string {
	const parts = name.trim().split(/\s+/);
	const first = parts[0]?.[0] ?? "";
	const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
	return `${first}${last}`.toUpperCase();
}

export function Avatar({ src, name, size = "md" }: AvatarProps) {
	return (
		<HeroAvatar
			size={size}
			variant="soft"
			color="accent"
			className={`${sizes[size]} shrink-0`}
		>
			{src ? <HeroAvatar.Image src={src} alt={name} /> : null}
			<HeroAvatar.Fallback>{initials(name)}</HeroAvatar.Fallback>
		</HeroAvatar>
	);
}
