import { Alert } from "@heroui/react";

type AuthMessageProps = {
	status: "danger" | "success";
	title: string;
	message: string;
};

export function AuthMessage({ status, title, message }: AuthMessageProps) {
	return (
		<Alert status={status} className="mb-5">
			<Alert.Indicator />
			<Alert.Content>
				<Alert.Title>{title}</Alert.Title>
				<Alert.Description>{message}</Alert.Description>
			</Alert.Content>
		</Alert>
	);
}
