export type CoverKey =
	| "books"
	| "business"
	| "city"
	| "code"
	| "design"
	| "food"
	| "growth"
	| "network"
	| "photography"
	| "productivity"
	| "travel"
	| "writing";

export type TopicSeed = {
	lang: "de" | "en";
	category: string;
	tags: string[];
	cover: CoverKey;
	posts: [PostSeed, PostSeed];
};

export type PostSeed = {
	title: string;
	markdown: string;
};
