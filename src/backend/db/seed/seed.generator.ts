import { germanTopics } from "./content.de";
import { englishTopics } from "./content.en";
import type { CoverKey, TopicSeed } from "./content.types";
import { markdownToTiptap } from "./markdown";

export const SEED_EMAIL_DOMAIN = "seed.inknest.test";
export const DEFAULT_COVER_BASE_URL = "https://inknest.yamanwarda.de";
const SEED_RANDOM_STATE = 20_260_928;
const DAY_MS = 86_400_000;

type Random = () => number;
type Language = "de" | "en";

type AuthorProfile = {
	name: string;
	username: string;
	languages: Language[];
	categories: string[];
	bio: string;
};

const authors: AuthorProfile[] = [
	{
		name: "Lena Hartmann",
		username: "lena.hartmann",
		languages: ["de"],
		categories: ["technology", "productivity"],
		bio: "Frontend-Entwicklerin in Leipzig. Schreibt über TypeScript, Barrierefreiheit und gute Arbeitsgewohnheiten.",
	},
	{
		name: "Jonas Becker",
		username: "jonas.becker",
		languages: ["de"],
		categories: ["technology", "business"],
		bio: "Backend-Entwickler und Freelancer. Interessiert an Datenbanken, Sicherheit und fairen Angeboten.",
	},
	{
		name: "Miriam Vogel",
		username: "miriam.vogel",
		languages: ["de"],
		categories: ["writing", "culture"],
		bio: "Autorin und Lektorin aus Weimar. Liebt Kurzgeschichten, Stadtbibliotheken und klare Sätze.",
	},
	{
		name: "Tobias Keller",
		username: "tobias.keller",
		languages: ["de"],
		categories: ["travel", "photography"],
		bio: "Fotograf und Wanderer. Unterwegs mit Festbrennweite und Deutschlandticket.",
	},
	{
		name: "Sophie Lindner",
		username: "sophie.lindner",
		languages: ["de"],
		categories: ["food", "personal-growth"],
		bio: "Kocht saisonal, gärtnert auf dem Balkon und schreibt über kleine Gewohnheiten.",
	},
	{
		name: "Aylin Demir",
		username: "aylin.demir",
		languages: ["de", "en"],
		categories: ["design", "business"],
		bio: "Product Designerin in Berlin. Nutzertests, Designsysteme und Microcopy.",
	},
	{
		name: "Felix Brandt",
		username: "felix.brandt",
		languages: ["de", "en"],
		categories: ["technology", "productivity"],
		bio: "Tech Lead und Remote-Work-Fan. Schreibt auf Deutsch und Englisch über Teams und Code.",
	},
	{
		name: "Clara Weiss",
		username: "clara.weiss",
		languages: ["de", "en"],
		categories: ["personal-growth", "culture"],
		bio: "Coach und Leserin. Notizen über Lernen, Pausen und Gemeinschaft.",
	},
	{
		name: "Daniel Okoro",
		username: "daniel.okoro",
		languages: ["en"],
		categories: ["technology", "business"],
		bio: "Staff engineer writing about edge runtimes, security, and leading small teams.",
	},
	{
		name: "Hannah Fischer",
		username: "hannah.fischer",
		languages: ["en"],
		categories: ["writing", "productivity"],
		bio: "Technical writer. Documentation, newsletters, and sustainable writing habits.",
	},
	{
		name: "Marco Rossi",
		username: "marco.rossi",
		languages: ["en"],
		categories: ["food", "travel"],
		bio: "Home cook and slow traveller. Night trains, sourdough, and five-ingredient dinners.",
	},
	{
		name: "Priya Nair",
		username: "priya.nair",
		languages: ["en"],
		categories: ["design", "technology"],
		bio: "Design engineer focused on calm interfaces, accessibility, and loading states.",
	},
	{
		name: "Elliot Park",
		username: "elliot.park",
		languages: ["en"],
		categories: ["technology", "culture"],
		bio: "Open-source maintainer. Notes on libraries, community, and repairing things.",
	},
	{
		name: "Noor Haddad",
		username: "noor.haddad",
		languages: ["en"],
		categories: ["photography", "personal-growth"],
		bio: "Street photographer learning in public. Light, prints, and decision journals.",
	},
	{
		name: "Sam Whitfield",
		username: "sam.whitfield",
		languages: ["en"],
		categories: ["business", "personal-growth"],
		bio: "Indie software founder writing about pricing, careers, and money without shame.",
	},
];

const readerNames = [
	"Anna Schulz",
	"Ben Wagner",
	"Carla Meyer",
	"David Klein",
	"Emma Richter",
	"Finn Wolf",
	"Greta Neumann",
	"Hugo Schwarz",
	"Ida Braun",
	"Jan Krüger",
	"Kim Lorenz",
	"Lara Busch",
	"Max Frank",
	"Nina Berger",
	"Oskar Fuchs",
	"Paula Kaiser",
	"Ravi Mehta",
	"Sara Lopez",
	"Tom Baker",
	"Uma Singh",
	"Victor Chen",
	"Wendy Clarke",
	"Yusuf Aydin",
	"Zoe Martin",
	"Leo Novak",
];

export const tagDefinitions = [
	{ name: "Creativity", slug: "creativity" },
	{ name: "Writing", slug: "writing" },
	{ name: "Habits", slug: "habits" },
	{ name: "Deep Work", slug: "deep-work" },
	{ name: "Remote Work", slug: "remote-work" },
	{ name: "Open Source", slug: "open-source" },
	{ name: "Leadership", slug: "leadership" },
	{ name: "Research", slug: "research" },
	{ name: "Accessibility", slug: "accessibility" },
	{ name: "Typography", slug: "typography" },
	{ name: "Photography", slug: "photography" },
	{ name: "Cooking", slug: "cooking" },
	{ name: "Gardening", slug: "gardening" },
	{ name: "Personal Finance", slug: "personal-finance" },
	{ name: "Indie Business", slug: "indie-business" },
	{ name: "Community", slug: "community" },
	{ name: "Travel Notes", slug: "travel-notes" },
	{ name: "Books", slug: "books" },
	{ name: "Learning", slug: "learning" },
	{ name: "Mental Clarity", slug: "mental-clarity" },
	{ name: "Sustainability", slug: "sustainability" },
	{ name: "Product Design", slug: "product-design" },
	{ name: "Engineering", slug: "engineering" },
	{ name: "Storytelling", slug: "storytelling" },
	{ name: "Craft", slug: "craft" },
	{ name: "TypeScript", slug: "typescript" },
	{ name: "Web Development", slug: "web-development" },
	{ name: "AI", slug: "ai" },
	{ name: "Security", slug: "security" },
	{ name: "Career", slug: "career" },
];

export const categoryDefinitions = [
	{ name: "Writing", slug: "writing" },
	{ name: "Technology", slug: "technology" },
	{ name: "Productivity", slug: "productivity" },
	{ name: "Design", slug: "design" },
	{ name: "Culture", slug: "culture" },
	{ name: "Travel", slug: "travel" },
	{ name: "Personal Growth", slug: "personal-growth" },
	{ name: "Business", slug: "business" },
	{ name: "Food", slug: "food" },
	{ name: "Photography", slug: "photography" },
];

const commentBank: Record<Language, string[]> = {
	en: [
		"This is exactly the nudge I needed this week. Trying it tomorrow.",
		"Saving this. The list in the middle is going straight into our team wiki.",
		"I tried something similar last year and can confirm it works, especially the part about starting small.",
		"Great piece. Do you have an example of how this looks in a real project?",
		"Clear and practical, thank you. More of this, please.",
		"The quote at the end made me rethink how I approach this.",
		"Shared this with my team. We argued about point two for twenty minutes, which was probably the point.",
		"I'd love a follow-up on what didn't work for you.",
	],
	de: [
		"Genau das habe ich diese Woche gebraucht. Probiere ich morgen aus.",
		"Sehr praktisch, danke! Die Liste speichere ich mir.",
		"Habe etwas Ähnliches ausprobiert und kann das nur bestätigen.",
		"Toller Beitrag. Gibt es dazu ein Beispiel aus einem echten Projekt?",
		"Klar und verständlich geschrieben, gerne mehr davon.",
		"Den letzten Absatz habe ich direkt an mein Team weitergeleitet.",
		"Interessant, bei uns hat Punkt zwei allerdings nicht so gut funktioniert.",
		"Würde mich über einen zweiten Teil sehr freuen.",
	],
};

const replyBank: Record<Language, string[]> = {
	en: [
		"Thanks for reading! A follow-up is already in drafts.",
		"Good question, I'll add an example to the post.",
		"Same experience here, especially in the first two weeks.",
		"Glad it helped!",
	],
	de: [
		"Danke fürs Lesen! Ein zweiter Teil ist schon in Arbeit.",
		"Gute Frage, ich ergänze ein Beispiel.",
		"Ging mir genauso, vor allem am Anfang.",
		"Freut mich, dass es hilft!",
	],
};

export type SeedUser = {
	id: string;
	name: string;
	username: string;
	email: string;
	emailVerified: boolean;
	image: null;
	bio: string | null;
	createdAt: Date;
	updatedAt: Date;
};

export type SeedPost = {
	key: string;
	authorId: string;
	title: string;
	slug: string;
	image: string;
	content: string;
	status: "published";
	publishedAt: Date;
	createdAt: Date;
	updatedAt: Date;
	language: Language;
	categorySlug: string;
	tagSlugs: string[];
};

export type SeedComment = {
	key: string;
	postKey: string;
	userId: string;
	parentKey: string | null;
	content: string;
	createdAt: Date;
};

export type SeedData = {
	users: SeedUser[];
	posts: SeedPost[];
	comments: SeedComment[];
	likes: { userId: string; postKey: string; createdAt: Date }[];
	bookmarks: { userId: string; postKey: string; createdAt: Date }[];
	views: { userId: string | null; postKey: string; viewedAt: Date }[];
	follows: { followerId: string; followingId: string; createdAt: Date }[];
};

const createRandom = (state: number): Random => {
	let current = state >>> 0;
	return () => {
		current = (current + 0x6d2b79f5) >>> 0;
		let value = current;
		value = Math.imul(value ^ (value >>> 15), value | 1);
		value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
		return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
	};
};

const between = (random: Random, minimum: number, maximum: number) =>
	minimum + (maximum - minimum) * random();
const integerBetween = (random: Random, minimum: number, maximum: number) =>
	Math.floor(between(random, minimum, maximum + 1));
const pick = <T>(random: Random, values: readonly T[]): T =>
	values[Math.floor(random() * values.length)] as T;
const sample = <T>(random: Random, values: readonly T[], count: number) =>
	[...values]
		.map((value) => ({ value, order: random() }))
		.sort((a, b) => a.order - b.order)
		.slice(0, count)
		.map((item) => item.value);
const dateBetween = (random: Random, start: Date, end: Date) =>
	new Date(
		between(random, start.getTime(), Math.max(start.getTime(), end.getTime())),
	);

export const slugify = (value: string) =>
	value
		.toLowerCase()
		.replace(/ä/g, "ae")
		.replace(/ö/g, "oe")
		.replace(/ü/g, "ue")
		.replace(/ß/g, "ss")
		.normalize("NFKD")
		.replace(/[̀-ͯ]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

const coverUrl = (baseUrl: string, cover: CoverKey) =>
	`${baseUrl}/images/covers/${cover}.webp`;

const authorFor = (topic: TopicSeed, usage: Map<string, number>) => {
	const eligible = authors.filter(
		(author) =>
			author.languages.includes(topic.lang) &&
			author.categories.includes(topic.category),
	);
	const pool = eligible.length
		? eligible
		: authors.filter((author) => author.languages.includes(topic.lang));
	const author = [...pool].sort(
		(a, b) => (usage.get(a.username) ?? 0) - (usage.get(b.username) ?? 0),
	)[0];
	if (!author) throw new Error(`No author for ${topic.category}`);
	usage.set(author.username, (usage.get(author.username) ?? 0) + 1);
	return author;
};

export const buildSeedData = (
	now = new Date(),
	baseUrl = DEFAULT_COVER_BASE_URL,
): SeedData => {
	const random = createRandom(SEED_RANDOM_STATE);
	const userId = (username: string) => `seed_${username.replace(/\./g, "_")}`;

	const users: SeedUser[] = [
		...authors.map((author) => ({
			username: author.username,
			name: author.name,
			bio: author.bio,
		})),
		...readerNames.map((name) => ({
			username: slugify(name).replace(/-/g, "."),
			name,
			bio: null,
		})),
	].map((profile) => {
		const createdAt = new Date(
			now.getTime() - between(random, 330, 700) * DAY_MS,
		);
		return {
			id: userId(profile.username),
			name: profile.name,
			username: profile.username,
			email: `${profile.username}@${SEED_EMAIL_DOMAIN}`,
			emailVerified: true,
			image: null,
			bio: profile.bio,
			createdAt,
			updatedAt: createdAt,
		};
	});
	const authorIds = authors.map((author) => userId(author.username));
	const allUserIds = users.map((user) => user.id);

	const usage = new Map<string, number>();
	const topics = [...englishTopics, ...germanTopics];
	const usedSlugs = new Set<string>();
	const posts: SeedPost[] = topics.flatMap((topic, topicIndex) => {
		const author = authorFor(topic, usage);
		const firstPublished = new Date(
			now.getTime() - between(random, 30, 320) * DAY_MS,
		);
		return topic.posts.map((post, postIndex) => {
			const publishedAt =
				postIndex === 0
					? firstPublished
					: new Date(
							firstPublished.getTime() + between(random, 7, 28) * DAY_MS,
						);
			let slug = slugify(post.title);
			if (usedSlugs.has(slug)) slug = `${slug}-${topicIndex + 1}`;
			usedSlugs.add(slug);
			const createdAt = new Date(
				publishedAt.getTime() - between(random, 1, 5) * DAY_MS,
			);
			return {
				key: `${topicIndex}-${postIndex}`,
				authorId: userId(author.username),
				title: post.title,
				slug,
				image: coverUrl(baseUrl, topic.cover),
				content: JSON.stringify(markdownToTiptap(post.markdown)),
				status: "published" as const,
				publishedAt,
				createdAt,
				updatedAt: publishedAt,
				language: topic.lang,
				categorySlug: topic.category,
				tagSlugs: topic.tags,
			};
		});
	});

	const likes: SeedData["likes"] = [];
	const bookmarks: SeedData["bookmarks"] = [];
	const views: SeedData["views"] = [];
	const comments: SeedComment[] = [];

	for (const post of posts) {
		const readers = allUserIds.filter((id) => id !== post.authorId);
		for (const reader of sample(
			random,
			readers,
			integerBetween(random, 3, 24),
		)) {
			likes.push({
				userId: reader,
				postKey: post.key,
				createdAt: dateBetween(random, post.publishedAt, now),
			});
		}
		for (const reader of sample(
			random,
			readers,
			integerBetween(random, 1, 8),
		)) {
			bookmarks.push({
				userId: reader,
				postKey: post.key,
				createdAt: dateBetween(random, post.publishedAt, now),
			});
		}
		for (let view = 0; view < integerBetween(random, 12, 60); view += 1) {
			views.push({
				userId: random() < 0.7 ? pick(random, readers) : null,
				postKey: post.key,
				viewedAt: dateBetween(random, post.publishedAt, now),
			});
		}
		for (const [commentIndex, commenter] of sample(
			random,
			readers,
			integerBetween(random, 1, 5),
		).entries()) {
			const key = `${post.key}-c${commentIndex}`;
			const createdAt = dateBetween(random, post.publishedAt, now);
			comments.push({
				key,
				postKey: post.key,
				userId: commenter,
				parentKey: null,
				content: pick(random, commentBank[post.language]),
				createdAt,
			});
			if (random() < 0.4) {
				comments.push({
					key: `${key}-r`,
					postKey: post.key,
					userId: post.authorId,
					parentKey: key,
					content: pick(random, replyBank[post.language]),
					createdAt: dateBetween(random, createdAt, now),
				});
			}
		}
	}

	const follows: SeedData["follows"] = [];
	for (const follower of allUserIds) {
		const candidates = authorIds.filter((id) => id !== follower);
		for (const following of sample(
			random,
			candidates,
			integerBetween(random, 3, 8),
		)) {
			follows.push({
				followerId: follower,
				followingId: following,
				createdAt: new Date(now.getTime() - between(random, 1, 300) * DAY_MS),
			});
		}
	}

	return { users, posts, comments, likes, bookmarks, views, follows };
};

export const seedSummary = (data: SeedData) => ({
	users: data.users.length,
	authors: new Set(data.posts.map((post) => post.authorId)).size,
	posts: data.posts.length,
	germanPosts: data.posts.filter((post) => post.language === "de").length,
	englishPosts: data.posts.filter((post) => post.language === "en").length,
	comments: data.comments.length,
	replies: data.comments.filter((comment) => comment.parentKey).length,
	likes: data.likes.length,
	bookmarks: data.bookmarks.length,
	views: data.views.length,
	follows: data.follows.length,
});
