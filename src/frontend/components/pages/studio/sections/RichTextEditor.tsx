import { Button, Skeleton, Surface } from "@heroui/react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
	Bold,
	Heading2,
	Italic,
	List,
	ListOrdered,
	Pilcrow,
	Quote,
	Redo2,
	Undo2,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { EMPTY_POST_DOCUMENT, parseTiptapContent } from "#/shared/post-content";

type RichTextEditorProps = {
	value: string;
	onChange: (value: string) => void;
	onBlur?: () => void;
	isDisabled?: boolean;
	isInvalid?: boolean;
};

type EditorAction = {
	label: string;
	icon: ReactNode;
	run: () => void;
	isActive?: boolean;
	isDisabled?: boolean;
};

export function RichTextEditor({
	value,
	onChange,
	onBlur,
	isDisabled = false,
	isInvalid = false,
}: RichTextEditorProps) {
	const onChangeRef = useRef(onChange);
	const onBlurRef = useRef(onBlur);

	useEffect(() => {
		onChangeRef.current = onChange;
		onBlurRef.current = onBlur;
	}, [onBlur, onChange]);

	const editor = useEditor({
		extensions: [StarterKit],
		content: parseTiptapContent(value) ?? EMPTY_POST_DOCUMENT,
		immediatelyRender: false,
		onUpdate: ({ editor: currentEditor }) => {
			onChangeRef.current(JSON.stringify(currentEditor.getJSON()));
		},
		onBlur: () => onBlurRef.current?.(),
		editorProps: {
			attributes: {
				"aria-label": "Post content",
				class:
					"prose prose-slate min-h-72 max-w-none px-4 py-4 text-slate-800 outline-none dark:prose-invert dark:text-slate-100",
				spellcheck: "true",
			},
		},
	});

	useEffect(() => {
		if (!editor) {
			return;
		}

		editor.setEditable(!isDisabled);
	}, [editor, isDisabled]);

	useEffect(() => {
		if (!editor) {
			return;
		}

		const nextDocument = parseTiptapContent(value) ?? EMPTY_POST_DOCUMENT;
		const currentValue = JSON.stringify(editor.getJSON());
		const nextValue = JSON.stringify(nextDocument);

		if (currentValue !== nextValue) {
			editor.commands.setContent(nextDocument, { emitUpdate: false });
		}
	}, [editor, value]);

	if (!editor) {
		return (
			<output className="block space-y-2" aria-label="Loading rich text editor">
				<Skeleton className="h-10 w-full rounded-lg" />
				<Skeleton className="h-72 w-full rounded-lg" />
			</output>
		);
	}

	const actions: EditorAction[] = [
		{
			label: "Paragraph",
			icon: <Pilcrow size={17} aria-hidden="true" />,
			run: () => editor.chain().focus().setParagraph().run(),
			isActive: editor.isActive("paragraph"),
		},
		{
			label: "Heading",
			icon: <Heading2 size={17} aria-hidden="true" />,
			run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
			isActive: editor.isActive("heading", { level: 2 }),
		},
		{
			label: "Bold",
			icon: <Bold size={17} aria-hidden="true" />,
			run: () => editor.chain().focus().toggleBold().run(),
			isActive: editor.isActive("bold"),
		},
		{
			label: "Italic",
			icon: <Italic size={17} aria-hidden="true" />,
			run: () => editor.chain().focus().toggleItalic().run(),
			isActive: editor.isActive("italic"),
		},
		{
			label: "Bullet list",
			icon: <List size={17} aria-hidden="true" />,
			run: () => editor.chain().focus().toggleBulletList().run(),
			isActive: editor.isActive("bulletList"),
		},
		{
			label: "Numbered list",
			icon: <ListOrdered size={17} aria-hidden="true" />,
			run: () => editor.chain().focus().toggleOrderedList().run(),
			isActive: editor.isActive("orderedList"),
		},
		{
			label: "Quote",
			icon: <Quote size={17} aria-hidden="true" />,
			run: () => editor.chain().focus().toggleBlockquote().run(),
			isActive: editor.isActive("blockquote"),
		},
		{
			label: "Undo",
			icon: <Undo2 size={17} aria-hidden="true" />,
			run: () => editor.chain().focus().undo().run(),
			isDisabled: !editor.can().chain().focus().undo().run(),
		},
		{
			label: "Redo",
			icon: <Redo2 size={17} aria-hidden="true" />,
			run: () => editor.chain().focus().redo().run(),
			isDisabled: !editor.can().chain().focus().redo().run(),
		},
	];

	return (
		<Surface
			className={`overflow-hidden rounded-xl border bg-white dark:bg-slate-950 ${
				isInvalid
					? "border-red-500 dark:border-red-500"
					: "border-slate-200 dark:border-slate-700"
			}`}
		>
			<div
				className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-900"
				aria-label="Rich text tools"
				role="toolbar"
			>
				{actions.map((action) => (
					<Button
						key={action.label}
						type="button"
						variant={action.isActive ? "secondary" : "ghost"}
						size="sm"
						isIconOnly
						isDisabled={isDisabled || action.isDisabled}
						onPress={action.run}
						aria-label={action.label}
					>
						{action.icon}
					</Button>
				))}
			</div>
			<div className="relative">
				{editor.isEmpty ? (
					<span
						className="pointer-events-none absolute left-4 top-4 text-slate-400"
						aria-hidden="true"
					>
						Start writing your story here…
					</span>
				) : null}
				<EditorContent editor={editor} />
			</div>
		</Surface>
	);
}
