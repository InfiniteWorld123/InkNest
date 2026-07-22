import { Select as HeroSelect, Label, ListBox } from "@heroui/react";
import { useId } from "react";

interface SelectOption {
	label: string;
	value: string;
}

interface SelectProps {
	label?: string;
	options: SelectOption[];
	placeholder?: string;
	name?: string;
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	isDisabled?: boolean;
	isRequired?: boolean;
	className?: string;
	triggerClassName?: string;
	id?: string;
	"aria-label"?: string;
}

export function Select({
	label,
	options,
	placeholder,
	name,
	value,
	defaultValue,
	onValueChange,
	isDisabled,
	isRequired,
	className,
	triggerClassName,
	id,
	"aria-label": ariaLabel,
}: SelectProps) {
	const generatedId = useId();
	const fieldId = id ?? generatedId;

	return (
		<HeroSelect
			id={fieldId}
			name={name}
			placeholder={placeholder}
			defaultSelectedKey={defaultValue || undefined}
			onSelectionChange={(key) =>
				onValueChange?.(key === null ? "" : String(key))
			}
			isDisabled={isDisabled}
			isRequired={isRequired}
			aria-label={ariaLabel ?? label}
			className={className}
			fullWidth
			{...(value !== undefined ? { selectedKey: value || null } : {})}
		>
			{label ? <Label>{label}</Label> : null}
			<HeroSelect.Trigger className={triggerClassName}>
				<HeroSelect.Value />
				<HeroSelect.Indicator />
			</HeroSelect.Trigger>
			<HeroSelect.Popover>
				<ListBox>
					{options.map((option) => (
						<ListBox.Item
							id={option.value}
							key={option.value}
							textValue={option.label}
						>
							{option.label}
							<ListBox.ItemIndicator />
						</ListBox.Item>
					))}
				</ListBox>
			</HeroSelect.Popover>
		</HeroSelect>
	);
}
