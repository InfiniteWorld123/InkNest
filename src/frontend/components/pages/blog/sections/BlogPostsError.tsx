import { Alert, Button } from "@heroui/react";

type BlogPostsErrorProps = {
	error: Error;
	onRetry: () => void;
};

export function BlogPostsError({ error, onRetry }: BlogPostsErrorProps) {
	return (
		<Alert status="danger" className="mt-12">
			<Alert.Indicator />
			<Alert.Content>
				<Alert.Title>Could not load stories</Alert.Title>
				<Alert.Description>{error.message}</Alert.Description>
				<Button
					type="button"
					variant="danger"
					size="sm"
					onPress={onRetry}
					className="mt-4"
				>
					Try again
				</Button>
			</Alert.Content>
		</Alert>
	);
}
