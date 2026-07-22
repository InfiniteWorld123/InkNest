import {
	Button,
	Description,
	FieldError,
	TextField as HeroTextField,
	Input,
	type InputProps,
	Label,
} from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";

interface TextFieldProps extends InputProps {
	label: string;
	hint?: string;
	errors?: Array<string | undefined>;
}

export function TextField({
	label,
	hint,
	errors = [],
	type = "text",
	className,
	id,
	...props
}: TextFieldProps) {
	const generatedId = useId();
	const fieldId = id ?? generatedId;
	const isPassword = type === "password";
	const [show, setShow] = useState(false);
	const resolvedType = isPassword && show ? "text" : type;
	const messages = errors.filter((message): message is string =>
		Boolean(message),
	);
	const hasError = messages.length > 0;

	return (
		<HeroTextField
			className="flex flex-col gap-1.5"
			isInvalid={hasError}
			fullWidth
		>
			<Label>{label}</Label>
			<div className="relative">
				<Input
					id={fieldId}
					type={resolvedType}
					aria-invalid={hasError}
					className={`${isPassword ? "pr-11" : ""} ${className ?? ""}`}
					{...props}
				/>
				{isPassword ? (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						isIconOnly
						onPress={() => setShow((value) => !value)}
						aria-label={show ? "Hide password" : "Show password"}
						className="absolute inset-y-1 right-1 text-slate-400"
					>
						{show ? <EyeOff size={18} /> : <Eye size={18} />}
					</Button>
				) : null}
			</div>
			{hasError ? (
				<FieldError>{messages[0]}</FieldError>
			) : hint ? (
				<Description>{hint}</Description>
			) : null}
		</HeroTextField>
	);
}
