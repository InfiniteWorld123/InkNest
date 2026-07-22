import { Button, Spinner } from "@heroui/react";

interface LoadMoreButtonProps {
	onClick: () => void;
	isLoading: boolean;
	hasMore: boolean;
}

export function LoadMoreButton({
	onClick,
	isLoading,
	hasMore,
}: LoadMoreButtonProps) {
	if (!hasMore) return null;

	return (
		<div className="flex justify-center">
			<Button
				variant="secondary"
				onPress={onClick}
				isDisabled={isLoading}
				isPending={isLoading}
			>
				{isLoading ? (
					<>
						<Spinner size="sm" />
						Loading…
					</>
				) : (
					"Load more"
				)}
			</Button>
		</div>
	);
}
