import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import type { RouterContextType } from "../config/RouterContextType";
import appCss from "../config/styles.css?url";

export const Route = createRootRouteWithContext<RouterContextType>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "InkNest – Demo-Blogplattform von Yaman Warda",
			},
			{
				name: "description",
				content:
					"InkNest ist ein Demo-Projekt von Yaman Warda: eine Blogplattform mit Editor, Kommentaren, Tags und Reaktionen. Alle Inhalte sind Beispieldaten.",
			},
			{
				property: "og:title",
				content: "InkNest – Demo-Blogplattform von Yaman Warda",
			},
			{
				property: "og:description",
				content:
					"Demo-Blogplattform mit Editor, Kommentaren, Tags und Reaktionen. Alle Inhalte sind Beispieldaten.",
			},
			{
				property: "og:type",
				content: "website",
			},
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com",
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous",
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Varela+Round&display=swap",
			},
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
