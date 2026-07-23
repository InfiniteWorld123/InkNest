import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestUrl } from "@tanstack/react-start/server";
import type { RouterContextType } from "../config/RouterContextType";
import appCss from "../config/styles.css?url";

const getSiteOrigin = createIsomorphicFn()
	.server(() => getRequestUrl({ xForwardedHost: true }).origin)
	.client(() => window.location.origin);

export const Route = createRootRouteWithContext<RouterContextType>()({
	loader: () => getSiteOrigin(),
	head: ({ loaderData: origin }) => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "InkNest — Write freely. Publish beautifully.",
			},
			{
				name: "description",
				content:
					"A calm writing platform for drafting, publishing, and sharing thoughtful stories.",
			},
			{
				property: "og:title",
				content: "InkNest — Write freely. Publish beautifully.",
			},
			{
				property: "og:description",
				content:
					"A calm writing platform for drafting, publishing, and sharing thoughtful stories.",
			},
			{
				property: "og:type",
				content: "website",
			},
			{
				property: "og:image",
				content: `${origin}/og.png`,
			},
			{
				name: "twitter:card",
				content: "summary_large_image",
			},
			{
				name: "twitter:title",
				content: "InkNest — Write freely. Publish beautifully.",
			},
			{
				name: "twitter:description",
				content:
					"A calm writing platform for drafting, publishing, and sharing thoughtful stories.",
			},
			{
				name: "twitter:image",
				content: `${origin}/og.png`,
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
