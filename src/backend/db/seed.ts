import { hashPassword } from "better-auth/crypto";
import { inArray, like, sql } from "drizzle-orm";
import { db } from "./index";
import {
	account,
	bookmarks,
	categories,
	comments,
	follows,
	likes,
	notifications,
	postCategories,
	posts,
	postTags,
	postViews,
	tags,
	user,
} from "./schema/tables";

const SEED_EMAIL_DOMAIN = "seed.inknest.test";
const SEED_PASSWORD = "InkNestSeed!2026";
const SEED_ANCHOR = new Date("2026-07-20T12:00:00.000Z");

const profiles = [
	{
		name: "Amara Okafor",
		username: "amara.okafor",
		bio: "Essayist and community builder writing about cities, belonging, and the rituals that keep us grounded.",
	},
	{
		name: "Leo Martins",
		username: "leo.martins",
		bio: "Product engineer, weekend cyclist, and collector of small ideas that make teams work better.",
	},
	{
		name: "Priya Shah",
		username: "priya.shah",
		bio: "Independent designer exploring calm software, thoughtful research, and sustainable creative practice.",
	},
	{
		name: "Jonah Klein",
		username: "jonah.klein",
		bio: "I write field notes on attention, books, and building a life with fewer unnecessary defaults.",
	},
	{
		name: "Sofía Reyes",
		username: "sofia.reyes",
		bio: "Travel writer based in Madrid. Usually walking, cooking, or asking strangers about their neighborhood.",
	},
	{
		name: "Elliot Park",
		username: "elliot.park",
		bio: "Open-source maintainer and technical writer interested in reliable systems and generous documentation.",
	},
	{
		name: "Maya Bennett",
		username: "maya.bennett",
		bio: "Editor, amateur gardener, and believer in sentences that sound like an actual person wrote them.",
	},
	{
		name: "Luca Moretti",
		username: "luca.moretti",
		bio: "Home cook and photographer documenting seasonal food, family recipes, and tables worth lingering around.",
	},
	{
		name: "Noor Haddad",
		username: "noor.haddad",
		bio: "Researcher writing about humane technology, digital rights, and the communities behind the tools.",
	},
	{
		name: "Theo Nakamura",
		username: "theo.nakamura",
		bio: "Design systems lead by day, letterpress beginner by night. Notes on craft, constraints, and collaboration.",
	},
	{
		name: "Clara Jensen",
		username: "clara.jensen",
		bio: "Remote team coach helping distributed companies replace busywork with clear decisions and trust.",
	},
	{
		name: "Mateo Silva",
		username: "mateo.silva",
		bio: "Founder, runner, and candid chronicler of the messy middle between an idea and a useful business.",
	},
	{
		name: "Zuri Thompson",
		username: "zuri.thompson",
		bio: "Culture journalist covering independent publishing, neighborhood spaces, and people making things together.",
	},
	{
		name: "Finn O'Connor",
		username: "finn.oconnor",
		bio: "Data analyst learning to explain numbers without draining the life out of the story.",
	},
	{
		name: "Hana Kim",
		username: "hana.kim",
		bio: "Ceramicist and studio owner. Writing about patient work, tiny businesses, and making room for mistakes.",
	},
	{
		name: "Elias Mensah",
		username: "elias.mensah",
		bio: "Engineering manager focused on mentorship, healthy teams, and software that survives its first success.",
	},
	{
		name: "Nina Petrov",
		username: "nina.petrov",
		bio: "Behavioral scientist translating research on habits, motivation, and rest into experiments for daily life.",
	},
	{
		name: "Gabriel Costa",
		username: "gabriel.costa",
		bio: "Street photographer and visual storyteller. I pay attention to light, public space, and ordinary gestures.",
	},
	{
		name: "Aisha Rahman",
		username: "aisha.rahman",
		bio: "Personal finance educator writing practical guides for people who dislike being lectured about money.",
	},
	{
		name: "Oliver Chen",
		username: "oliver.chen",
		bio: "Developer advocate, tinkerer, and occasional teacher. Interested in APIs, learning, and useful examples.",
	},
	{
		name: "Camille Dubois",
		username: "camille.dubois",
		bio: "Architect exploring adaptive reuse, walkable neighborhoods, and the social life of shared spaces.",
	},
	{
		name: "Samuel Brooks",
		username: "samuel.brooks",
		bio: "Historian and long-form writer following old technologies, forgotten labor, and how places remember.",
	},
	{
		name: "Elena Rossi",
		username: "elena.rossi",
		bio: "Brand strategist working with small companies that want a clear voice without sounding like everyone else.",
	},
	{
		name: "Idris Walker",
		username: "idris.walker",
		bio: "Teacher, reader, and notebook enthusiast sharing experiments from classrooms and community workshops.",
	},
	{
		name: "Freya Lindholm",
		username: "freya.lindholm",
		bio: "Climate communicator interested in repair, resilient homes, and environmental stories with room for hope.",
	},
	{
		name: "Marcus Reed",
		username: "marcus.reed",
		bio: "Freelance writer documenting the economics, routines, and quiet negotiations behind independent work.",
	},
	{
		name: "Layla Hassan",
		username: "layla.hassan",
		bio: "Librarian and oral-history volunteer writing about archives, memory, and who gets included in the record.",
	},
	{
		name: "Daniel Cho",
		username: "daniel.cho",
		bio: "UX researcher curious about better interviews, stronger evidence, and decisions that respect real people.",
	},
	{
		name: "Irene Papadopoulos",
		username: "irene.papadopoulos",
		bio: "Food historian tracing migration and memory through recipes, markets, and everyday kitchen tools.",
	},
	{
		name: "Tomás Alvarez",
		username: "tomas.alvarez",
		bio: "Urban gardener turning a small balcony into a long-running experiment in soil, patience, and lunch.",
	},
	{
		name: "Mei Lin",
		username: "mei.lin",
		bio: "Type designer and multilingual lettering nerd. Notes from the space between language and form.",
	},
	{
		name: "Rami Khoury",
		username: "rami.khoury",
		bio: "Security engineer writing approachable explanations of privacy, risk, and safer defaults.",
	},
	{
		name: "Ada Mensima",
		username: "ada.mensima",
		bio: "Podcast producer learning in public about interviews, sound, narrative structure, and independent media.",
	},
	{
		name: "Hugo Laurent",
		username: "hugo.laurent",
		bio: "Bookbinder and repairer. I write about materials, old tools, and the pleasure of making something last.",
	},
	{
		name: "Sienna Patel",
		username: "sienna.patel",
		bio: "Healthcare researcher focused on plain language, accessible services, and the hidden work of care.",
	},
	{
		name: "Owen Murphy",
		username: "owen.murphy",
		bio: "Indie developer sharing honest notes on small products, customer support, and sustainable growth.",
	},
	{
		name: "Yara Nasser",
		username: "yara.nasser",
		bio: "Museum educator designing slower, more curious ways to encounter art and talk with strangers.",
	},
	{
		name: "Benji Torres",
		username: "benji.torres",
		bio: "Community organizer and facilitation geek writing about meetings people do not secretly dread.",
	},
	{
		name: "Anika Vogel",
		username: "anika.vogel",
		bio: "Science editor translating complex work into precise, readable stories without sanding off the nuance.",
	},
	{
		name: "Kwame Boateng",
		username: "kwame.boateng",
		bio: "Operations leader interested in durable processes, calm workplaces, and fixing the system before blaming people.",
	},
] as const;

const categorySeeds = [
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
] as const;

const tagSeeds = [
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
] as const;

const topics = [
	{
		subject: "building a sustainable writing habit",
		headline: "Building a Sustainable Writing Habit",
		category: "writing",
		tags: ["creativity", "habits", "deep-work"],
		tension: "ambition kept turning every blank page into a test",
		practice:
			"setting a small daily floor and stopping before the work felt depleted",
		payoff: "consistency became ordinary enough to survive busy weeks",
	},
	{
		subject: "designing calm interfaces",
		headline: "Designing Calm Interfaces",
		category: "design",
		tags: ["product-design", "accessibility", "research"],
		tension:
			"each helpful feature was competing to become the loudest thing on screen",
		practice:
			"mapping the user's next decision before choosing components or color",
		payoff: "the product began to feel obvious without becoming empty",
	},
	{
		subject: "running better remote retrospectives",
		headline: "Running Better Remote Retrospectives",
		category: "business",
		tags: ["remote-work", "leadership", "community"],
		tension: "the same confident voices were filling every minute of the call",
		practice:
			"collecting written observations first and discussing patterns second",
		payoff:
			"quieter teammates shaped decisions instead of merely approving them",
	},
	{
		subject: "getting started with urban gardening",
		headline: "Getting Started With Urban Gardening",
		category: "personal-growth",
		tags: ["gardening", "sustainability", "habits"],
		tension:
			"the beautiful plans assumed more sun, space, and time than the balcony offered",
		practice:
			"growing three forgiving herbs and recording what the light actually did",
		payoff: "the tiny garden became useful before it became impressive",
	},
	{
		subject: "cooking well on busy weeknights",
		headline: "Cooking Well on Busy Weeknights",
		category: "food",
		tags: ["cooking", "habits", "mental-clarity"],
		tension: "meal plans collapsed the moment an ordinary day ran late",
		practice:
			"preparing flexible building blocks instead of assigning a recipe to every night",
		payoff: "dinner required fewer decisions without becoming repetitive",
	},
	{
		subject: "making open-source contributions that last",
		headline: "Making Open-Source Contributions That Last",
		category: "technology",
		tags: ["open-source", "engineering", "community"],
		tension:
			"a technically correct patch still left maintainers with hidden work",
		practice:
			"starting with context, tests, and a narrow change that was easy to review",
		payoff:
			"the contribution improved both the code and the next contributor's path",
	},
	{
		subject: "doing research before choosing a solution",
		headline: "Research Before Solutions",
		category: "design",
		tags: ["research", "product-design", "accessibility"],
		tension:
			"the team had already fallen in love with an answer before agreeing on the problem",
		practice:
			"writing assumptions down and looking for evidence that could disprove them",
		payoff: "fewer ideas survived, but the surviving work mattered more",
	},
	{
		subject: "building an emergency fund without shame",
		headline: "Building an Emergency Fund Without Shame",
		category: "personal-growth",
		tags: ["personal-finance", "habits", "mental-clarity"],
		tension: "most advice treated inconsistent income like a character flaw",
		practice:
			"saving a percentage of each payment and naming the buffer for what it protected",
		payoff: "progress became visible even when the monthly numbers changed",
	},
	{
		subject: "photographing ordinary streets",
		headline: "Photographing Ordinary Streets",
		category: "photography",
		tags: ["photography", "storytelling", "creativity"],
		tension: "searching for dramatic moments made familiar places disappear",
		practice:
			"returning to one short route at different hours and following the light",
		payoff: "small gestures began to carry more of the story",
	},
	{
		subject: "creating a design system people use",
		headline: "A Design System People Actually Use",
		category: "design",
		tags: ["typography", "product-design", "engineering"],
		tension:
			"the library was polished but disconnected from the pressure of product work",
		practice:
			"treating contribution, support, and migration as part of the component API",
		payoff:
			"adoption grew because the system reduced coordination, not just CSS",
	},
	{
		subject: "leading through clear expectations",
		headline: "Leading Through Clear Expectations",
		category: "business",
		tags: ["leadership", "remote-work", "mental-clarity"],
		tension:
			"kindness had become a reason to leave difficult expectations unspoken",
		practice:
			"describing outcomes, constraints, and check-in points before work began",
		payoff: "feedback became less personal because the agreement was visible",
	},
	{
		subject: "reading more without chasing a number",
		headline: "Reading More Without Chasing a Number",
		category: "personal-growth",
		tags: ["books", "habits", "learning"],
		tension:
			"the yearly goal rewarded finishing even when a book deserved more time",
		practice:
			"keeping several kinds of books nearby and abandoning the wrong one sooner",
		payoff: "reading returned to curiosity instead of performance",
	},
	{
		subject: "traveling slowly through a familiar city",
		headline: "Traveling Slowly Through a Familiar City",
		category: "travel",
		tags: ["travel-notes", "photography", "storytelling"],
		tension:
			"a checklist of landmarks kept flattening the city into proof of attendance",
		practice:
			"choosing one neighborhood, one market, and enough time to get lost",
		payoff: "the trip produced fewer highlights and many more memories",
	},
	{
		subject: "pricing independent creative work",
		headline: "Pricing Independent Creative Work",
		category: "business",
		tags: ["indie-business", "personal-finance", "creativity"],
		tension:
			"hourly estimates ignored the invisible experience that made the work efficient",
		practice:
			"pricing the scope, risk, and value while making assumptions explicit",
		payoff:
			"client conversations moved from defending time to shaping outcomes",
	},
	{
		subject: "learning in public without becoming a brand",
		headline: "Learning in Public Without Becoming a Brand",
		category: "writing",
		tags: ["learning", "writing", "community"],
		tension:
			"sharing every step started changing which questions felt safe to ask",
		practice:
			"publishing useful artifacts after reflection instead of narrating every moment",
		payoff: "the work stayed honest while still helping other people",
	},
	{
		subject: "repairing household objects",
		headline: "The Quiet Value of Repair",
		category: "culture",
		tags: ["craft", "sustainability", "learning"],
		tension: "replacement was easier to buy but harder to feel good about",
		practice:
			"learning one repair at a time and keeping a small box of proven materials",
		payoff:
			"maintenance became a relationship with objects rather than a weekend chore",
	},
	{
		subject: "protecting time for deep work",
		headline: "Protecting Time for Deep Work",
		category: "productivity",
		tags: ["deep-work", "mental-clarity", "remote-work"],
		tension:
			"the calendar looked open while constant small requests consumed the day",
		practice:
			"grouping communication windows and giving focused blocks a concrete purpose",
		payoff:
			"important work stopped depending on finding a miraculous quiet afternoon",
	},
	{
		subject: "writing documentation for the next person",
		headline: "Documentation for the Next Person",
		category: "technology",
		tags: ["engineering", "open-source", "writing"],
		tension:
			"the notes explained what the system did but not why it had become that way",
		practice:
			"recording decisions, tradeoffs, examples, and the safest first change",
		payoff:
			"new contributors could act without reconstructing months of context",
	},
	{
		subject: "hosting community conversations",
		headline: "Hosting Community Conversations",
		category: "culture",
		tags: ["community", "leadership", "storytelling"],
		tension:
			"a well-intended agenda left no room for what people actually needed to say",
		practice:
			"setting a clear question, sharing airtime, and ending with named next steps",
		payoff:
			"participants left with ownership instead of a summary they had not shaped",
	},
	{
		subject: "building a tiny software business",
		headline: "Building a Tiny Software Business",
		category: "technology",
		tags: ["indie-business", "engineering", "product-design"],
		tension:
			"feature ideas were multiplying faster than conversations with customers",
		practice:
			"solving one recurring problem for a narrow group and charging early",
		payoff:
			"the roadmap became evidence of demand rather than a collection of guesses",
	},
	{
		subject: "making typography easier to read",
		headline: "Typography People Can Read",
		category: "design",
		tags: ["typography", "accessibility", "product-design"],
		tension:
			"the page looked refined in a mockup but became tiring after several paragraphs",
		practice:
			"testing size, measure, spacing, and contrast with real content on real screens",
		payoff: "the visual voice grew quieter while the words became stronger",
	},
	{
		subject: "interviewing people with better questions",
		headline: "Interviews Built on Better Questions",
		category: "writing",
		tags: ["research", "storytelling", "community"],
		tension:
			"polished questions were producing polished but predictable answers",
		practice:
			"asking for specific moments, following emotional changes, and allowing silence",
		payoff: "the conversation revealed experience instead of rehearsed opinion",
	},
	{
		subject: "building a personal knowledge practice",
		headline: "A Personal Knowledge Practice That Stays Small",
		category: "productivity",
		tags: ["learning", "writing", "mental-clarity"],
		tension:
			"the note-taking system demanded more care than the ideas inside it",
		practice:
			"capturing less, linking only when useful, and revisiting notes through active projects",
		payoff: "the archive became a place to think rather than another inbox",
	},
	{
		subject: "choosing sustainable materials",
		headline: "Choosing Materials That Can Age Well",
		category: "design",
		tags: ["sustainability", "craft", "research"],
		tension:
			"good intentions were hiding tradeoffs across sourcing, repair, and disposal",
		practice:
			"asking how a material was made, maintained, reused, and eventually separated",
		payoff: "decisions became more honest even when no option was perfect",
	},
] as const;

const commentBank = [
	"This put words to something I have been noticing but could not quite explain. The distinction between activity and progress is especially useful.",
	"I tried a smaller version of this last month and was surprised by how quickly the friction dropped. Starting with a floor instead of a target helped.",
	"The practical example makes this much easier to apply. I would love to hear how you decide when the system needs to change again.",
	"There is a lot of generosity in acknowledging the tradeoffs instead of presenting one perfect answer. Thank you for writing it that way.",
	"This is timely for our team. We have been treating a communication problem like a tooling problem, and the difference matters.",
	"The point about returning to the same place is excellent. Familiarity can reveal more than novelty when you stay attentive long enough.",
	"I appreciate that this does not turn rest into another optimization project. That framing is rare and genuinely helpful.",
	"We use a similar approach, but the written reflection happens after the meeting. Moving it before the discussion is an experiment worth trying.",
	"The sentence about hidden work stopped me. So many supposedly simple choices only look simple because someone else is carrying the complexity.",
	"I have bookmarked this for the next time I am tempted to rebuild the whole process. The smallest useful version is usually the honest one.",
	"This connects with what I have seen in classrooms: people contribute more when they have a moment to form the thought before defending it.",
	"A concrete, calm explanation of a topic that is often made unnecessarily intimidating. The example gives me somewhere to begin this weekend.",
	"I disagree slightly about the order, but the underlying principle feels right. Context determines whether the constraint creates focus or just pressure.",
	"The part about abandoning the wrong option sooner is underrated. Persistence is useful, but only after we ask whether the direction still makes sense.",
	"This made me look at my own notes differently. I have been collecting proof that I read rather than leaving material I can think with later.",
	"Beautifully observed. The ordinary details are what made the argument believable rather than just persuasive.",
	"We learned this the expensive way on a recent project. A short conversation at the beginning would have saved weeks of polished, irrelevant work.",
	"I am sending this to a friend who is at exactly this stage. It is specific without pretending that everyone's circumstances are identical.",
	"The maintenance point deserves its own essay. Launches get attention, but the long relationship with the work determines whether it remains useful.",
	"This is the kind of field note I come here for: tested enough to be useful, unfinished enough to invite a real conversation.",
] as const;

const replyBank = [
	"That is a helpful way to put it. The cost of coordination is easy to miss until the team grows.",
	"I had the same question. My guess is that the signal is when the routine stops reducing decisions and starts creating new ones.",
	"Thank you for adding this example. It makes the tradeoff much clearer than the abstract version.",
	"Yes, especially the point about context. A useful constraint for one person can be an unnecessary barrier for someone else.",
	"I tried it this morning and the written step changed the conversation immediately. We heard from two people who usually stay quiet.",
	"This resonates. Maintenance is where the values behind a project become visible.",
	"I appreciate the gentle disagreement. It is making me reconsider which part of the process is actually doing the work.",
	"Exactly. The goal is not a perfect system; it is enough support to keep attention on the meaningful part.",
] as const;

function createRng(seed: number) {
	let state = seed;

	return () => {
		state += 0x6d2b79f5;
		let value = Math.imul(state ^ (state >>> 15), 1 | state);
		value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
		return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
	};
}

const rng = createRng(20260720);

function randomInt(min: number, max: number) {
	return min + Math.floor(rng() * (max - min + 1));
}

function pick<T>(items: readonly T[]): T {
	return items[randomInt(0, items.length - 1)];
}

function pickUnique<T>(items: readonly T[], count: number): T[] {
	const pool = [...items];
	const selected: T[] = [];

	while (selected.length < count && pool.length > 0) {
		selected.push(pool.splice(randomInt(0, pool.length - 1), 1)[0]);
	}

	return selected;
}

function daysBefore(anchor: Date, days: number) {
	return new Date(anchor.getTime() - days * 86_400_000);
}

function between(start: Date, end: Date) {
	return new Date(start.getTime() + rng() * (end.getTime() - start.getTime()));
}

function slugify(value: string) {
	return value
		.toLowerCase()
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

function capitalize(value: string) {
	return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function chunks<T>(items: readonly T[], size: number): T[][] {
	const result: T[][] = [];

	for (let index = 0; index < items.length; index += size) {
		result.push(items.slice(index, index + size));
	}

	return result;
}

function mustGet<K, V>(map: Map<K, V>, key: K, label: string): V {
	const value = map.get(key);
	if (value === undefined) throw new Error(`Missing ${label}: ${String(key)}`);
	return value;
}

function buildTitle(topic: (typeof topics)[number], variant: number) {
	switch (variant) {
		case 0:
			return topic.headline;
		case 1:
			return `What I Learned About ${capitalize(topic.subject)}`;
		case 2:
			return `A Field Guide to ${capitalize(topic.subject)}`;
		case 3:
			return `${topic.headline}: The Small Changes That Matter`;
		default:
			return `Notes on ${capitalize(topic.subject)}`;
	}
}

function buildContent(
	authorName: string,
	topic: (typeof topics)[number],
	variant: number,
) {
	const contentVariant = variant % 4;
	const openings = [
		`I did not set out to develop a method for ${topic.subject}. I was trying to solve a smaller frustration: ${topic.tension}. After several false starts, the pattern became clear enough to write down.`,
		`For a long time, my approach to ${topic.subject} looked sensible from a distance and felt exhausting up close. The real issue was simple: ${topic.tension}.`,
		`A recent conversation made me reconsider how I approach ${topic.subject}. We kept circling the same difficulty—${topic.tension}—without naming it directly.`,
		`This began as a thirty-day experiment in ${topic.subject}. I wanted evidence from ordinary days, not just the kind of week when motivation and time happen to cooperate.`,
	];
	const observations = [
		`The first useful change was ${topic.practice}. It was intentionally modest. Big systems are attractive because they make commitment feel visible, but they also introduce more parts that can fail.`,
		`What helped most was ${topic.practice}. That choice removed a surprising number of negotiations from the day and made the next action easier to see.`,
		`Instead of adding another tool, I tried ${topic.practice}. The constraint exposed which parts of the process were essential and which parts were mostly performance.`,
		`The experiment centered on ${topic.practice}. It felt almost too small at first, which turned out to be a sign that I might keep doing it after the excitement passed.`,
	];
	const evidence = [
		`The result was not a dramatic transformation. More usefully, ${topic.payoff}. I noticed fewer heroic recoveries and more quiet follow-through, which is a trade I would make again.`,
		`Within a few weeks, ${topic.payoff}. The improvement showed up less in peak performance than in how quickly I could return after an interruption.`,
		`The strongest evidence was that ${topic.payoff}. That changed my definition of success from intensity to reliability.`,
		`Eventually, ${topic.payoff}. The change was visible to other people before I trusted it myself, because the work required fewer apologies and last-minute rescues.`,
	];

	return [
		openings[contentVariant],
		observations[contentVariant],
		`There are limits to this approach. Different seasons create different constraints, and a practice that reduces friction today can become an obligation later. I now review the arrangement when the work starts serving the system instead of the other way around.`,
		evidence[contentVariant],
		`If you want to try this, begin with the smallest version that produces real information. Keep it long enough to observe an ordinary week, note where it breaks, and change one variable at a time. The point is not to copy my routine; it is to notice what your own circumstances are asking for.`,
		`— ${authorName}`,
	].join("\n\n");
}

async function insertChunks<T>(
	values: readonly T[],
	insert: (chunk: T[]) => Promise<unknown>,
	size = 300,
) {
	for (const chunk of chunks(values, size)) await insert(chunk);
}

async function seed() {
	console.log("Preparing realistic InkNest seed data…");

	const existingSeedUsers = await db
		.select({ id: user.id })
		.from(user)
		.where(like(user.email, `%@${SEED_EMAIL_DOMAIN}`));

	if (existingSeedUsers.length > 0) {
		await db.delete(user).where(
			inArray(
				user.id,
				existingSeedUsers.map((item) => item.id),
			),
		);
		console.log(`Replaced ${existingSeedUsers.length} previous seed users.`);
	}

	const password = await hashPassword(SEED_PASSWORD);
	const userRows: (typeof user.$inferInsert)[] = profiles.map(
		(profile, index) => {
			const createdAt = daysBefore(SEED_ANCHOR, 120 + randomInt(0, 900));

			return {
				id: `seed_user_${String(index + 1).padStart(2, "0")}`,
				name: profile.name,
				username: profile.username,
				email: `${profile.username}@${SEED_EMAIL_DOMAIN}`,
				emailVerified: index % 9 !== 0,
				image:
					index % 7 === 0
						? null
						: `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(profile.username)}`,
				bio: profile.bio,
				createdAt,
				updatedAt: between(createdAt, SEED_ANCHOR),
			};
		},
	);

	await db.insert(user).values(userRows);
	await db.insert(account).values(
		userRows.map((seedUser, index) => ({
			id: `seed_account_${String(index + 1).padStart(2, "0")}`,
			accountId: seedUser.id,
			providerId: "credential",
			userId: seedUser.id,
			password,
			createdAt: seedUser.createdAt,
			updatedAt: seedUser.updatedAt,
		})),
	);

	await db
		.insert(categories)
		.values([...categorySeeds])
		.onConflictDoNothing();
	await db
		.insert(tags)
		.values([...tagSeeds])
		.onConflictDoNothing();

	const categoryRecords = await db
		.select({ id: categories.id, slug: categories.slug })
		.from(categories)
		.where(
			inArray(
				categories.slug,
				categorySeeds.map((item) => item.slug),
			),
		);
	const tagRecords = await db
		.select({ id: tags.id, slug: tags.slug })
		.from(tags)
		.where(
			inArray(
				tags.slug,
				tagSeeds.map((item) => item.slug),
			),
		);
	const categoryIdBySlug = new Map(
		categoryRecords.map((item) => [item.slug, item.id]),
	);
	const tagIdBySlug = new Map(tagRecords.map((item) => [item.slug, item.id]));

	type PostSeed = typeof posts.$inferInsert & {
		categorySlug: string;
		tagSlugs: string[];
	};
	const postSeeds: PostSeed[] = Array.from({ length: 120 }, (_, index) => {
		const topic = topics[index % topics.length];
		const variant = Math.floor(index / topics.length);
		const author = userRows[(index * 7 + variant * 3) % userRows.length];
		const title = buildTitle(topic, variant);
		const status =
			index % 17 === 0
				? ("archived" as const)
				: index % 13 === 0
					? ("draft" as const)
					: ("published" as const);
		const createdAt = daysBefore(SEED_ANCHOR, 8 + randomInt(0, 700));
		const publishedAt =
			status === "draft"
				? null
				: between(
						new Date(createdAt.getTime() + 86_400_000),
						new Date(
							Math.max(
								createdAt.getTime() + 172_800_000,
								SEED_ANCHOR.getTime() - 86_400_000,
							),
						),
					);

		return {
			authorId: author.id,
			title,
			slug: `${slugify(title)}-${String(index + 1).padStart(3, "0")}`,
			image: `https://picsum.photos/seed/${slugify(topic.subject)}-${index + 1}/1200/630`,
			content: buildContent(author.name, topic, variant),
			status,
			publishedAt,
			createdAt,
			updatedAt: between(publishedAt ?? createdAt, SEED_ANCHOR),
			categorySlug: topic.category,
			tagSlugs: [...topic.tags],
		};
	});

	const insertedPosts: Array<{
		id: number;
		slug: string;
		authorId: string;
		status: "draft" | "published" | "archived";
		publishedAt: Date | null;
	}> = [];

	for (const chunk of chunks(postSeeds, 24)) {
		const rows = chunk.map(
			({ categorySlug: _categorySlug, tagSlugs: _tagSlugs, ...post }) => post,
		);
		insertedPosts.push(
			...(await db.insert(posts).values(rows).returning({
				id: posts.id,
				slug: posts.slug,
				authorId: posts.authorId,
				status: posts.status,
				publishedAt: posts.publishedAt,
			})),
		);
	}

	const postSeedBySlug = new Map(postSeeds.map((post) => [post.slug, post]));
	const postCategoryRows: (typeof postCategories.$inferInsert)[] = [];
	const postTagRows: (typeof postTags.$inferInsert)[] = [];

	for (const post of insertedPosts) {
		const metadata = mustGet(postSeedBySlug, post.slug, "post metadata");
		postCategoryRows.push({
			postId: post.id,
			categoryId: mustGet(categoryIdBySlug, metadata.categorySlug, "category"),
		});
		for (const tagSlug of metadata.tagSlugs) {
			postTagRows.push({
				postId: post.id,
				tagId: mustGet(tagIdBySlug, tagSlug, "tag"),
			});
		}
	}

	await insertChunks(postCategoryRows, (rows) =>
		db.insert(postCategories).values(rows),
	);
	await insertChunks(postTagRows, (rows) => db.insert(postTags).values(rows));

	const seedUserIds = userRows.map((item) => item.id);
	const followKeys = new Set<string>();
	const followRows: (typeof follows.$inferInsert)[] = [];

	for (const followerId of seedUserIds) {
		const candidates = seedUserIds.filter((id) => id !== followerId);
		for (const followingId of pickUnique(candidates, randomInt(5, 11))) {
			const key = `${followerId}:${followingId}`;
			if (followKeys.has(key)) continue;
			followKeys.add(key);
			followRows.push({
				followerId,
				followingId,
				createdAt: daysBefore(SEED_ANCHOR, randomInt(1, 600)),
			});
		}
	}

	await insertChunks(followRows, (rows) => db.insert(follows).values(rows));

	const publishedPosts = insertedPosts.filter(
		(post) => post.status === "published" && post.publishedAt,
	);
	const likeRows: (typeof likes.$inferInsert)[] = [];
	const bookmarkRows: (typeof bookmarks.$inferInsert)[] = [];
	const viewRows: (typeof postViews.$inferInsert)[] = [];

	for (const post of publishedPosts) {
		const publishedAt = post.publishedAt ?? SEED_ANCHOR;
		const readers = seedUserIds.filter((id) => id !== post.authorId);

		for (const userId of pickUnique(readers, randomInt(6, 18))) {
			likeRows.push({
				userId,
				postId: post.id,
				createdAt: between(publishedAt, SEED_ANCHOR),
			});
		}
		for (const userId of pickUnique(readers, randomInt(2, 9))) {
			bookmarkRows.push({
				userId,
				postId: post.id,
				createdAt: between(publishedAt, SEED_ANCHOR),
			});
		}
		for (let viewIndex = 0; viewIndex < randomInt(35, 95); viewIndex += 1) {
			viewRows.push({
				postId: post.id,
				userId: rng() < 0.8 ? pick(seedUserIds) : null,
				viewedAt: between(publishedAt, SEED_ANCHOR),
			});
		}
	}

	await insertChunks(likeRows, (rows) => db.insert(likes).values(rows));
	await insertChunks(bookmarkRows, (rows) => db.insert(bookmarks).values(rows));
	await insertChunks(
		viewRows,
		(rows) => db.insert(postViews).values(rows),
		500,
	);

	type RootCommentSeed = typeof comments.$inferInsert;
	const rootCommentSeeds: RootCommentSeed[] = [];

	for (const post of publishedPosts) {
		const publishedAt = post.publishedAt ?? SEED_ANCHOR;
		const commenters = seedUserIds.filter((id) => id !== post.authorId);
		for (const commenterId of pickUnique(commenters, randomInt(1, 5))) {
			rootCommentSeeds.push({
				postId: post.id,
				userId: commenterId,
				content: pick(commentBank),
				createdAt: between(publishedAt, SEED_ANCHOR),
			});
		}
	}

	const insertedRootComments: Array<{
		id: number;
		postId: number;
		userId: string;
		createdAt: Date;
	}> = [];

	for (const chunk of chunks(rootCommentSeeds, 250)) {
		insertedRootComments.push(
			...(await db.insert(comments).values(chunk).returning({
				id: comments.id,
				postId: comments.postId,
				userId: comments.userId,
				createdAt: comments.createdAt,
			})),
		);
	}

	const replySeeds: (typeof comments.$inferInsert)[] = [];
	for (const rootComment of insertedRootComments) {
		if (rng() > 0.58) continue;
		const replyAuthors = seedUserIds.filter((id) => id !== rootComment.userId);
		for (const replyAuthor of pickUnique(replyAuthors, randomInt(1, 2))) {
			replySeeds.push({
				postId: rootComment.postId,
				userId: replyAuthor,
				parentId: rootComment.id,
				content: pick(replyBank),
				createdAt: between(rootComment.createdAt, SEED_ANCHOR),
			});
		}
	}

	const insertedReplies: Array<{
		id: number;
		postId: number;
		userId: string;
		parentId: number | null;
		createdAt: Date;
	}> = [];

	for (const chunk of chunks(replySeeds, 250)) {
		insertedReplies.push(
			...(await db.insert(comments).values(chunk).returning({
				id: comments.id,
				postId: comments.postId,
				userId: comments.userId,
				parentId: comments.parentId,
				createdAt: comments.createdAt,
			})),
		);
	}

	const postById = new Map(insertedPosts.map((post) => [post.id, post]));
	const rootCommentById = new Map(
		insertedRootComments.map((comment) => [comment.id, comment]),
	);
	const notificationRows: (typeof notifications.$inferInsert)[] = [];
	const isRead = (createdAt: Date) =>
		createdAt < daysBefore(SEED_ANCHOR, 14) ? rng() < 0.88 : rng() < 0.42;

	for (const follow of followRows) {
		notificationRows.push({
			userId: follow.followingId,
			actorId: follow.followerId,
			type: "follow",
			isRead: isRead(follow.createdAt ?? SEED_ANCHOR),
			createdAt: follow.createdAt,
		});
	}
	for (const item of likeRows) {
		if (rng() > 0.72) continue;
		const post = mustGet(postById, item.postId, "liked post");
		notificationRows.push({
			userId: post.authorId,
			actorId: item.userId,
			postId: item.postId,
			type: "like",
			isRead: isRead(item.createdAt ?? SEED_ANCHOR),
			createdAt: item.createdAt,
		});
	}
	for (const item of bookmarkRows) {
		if (rng() > 0.45) continue;
		const post = mustGet(postById, item.postId, "bookmarked post");
		notificationRows.push({
			userId: post.authorId,
			actorId: item.userId,
			postId: item.postId,
			type: "bookmark",
			isRead: isRead(item.createdAt ?? SEED_ANCHOR),
			createdAt: item.createdAt,
		});
	}
	for (const item of insertedRootComments) {
		const post = mustGet(postById, item.postId, "commented post");
		notificationRows.push({
			userId: post.authorId,
			actorId: item.userId,
			postId: item.postId,
			commentId: item.id,
			type: "comment",
			isRead: isRead(item.createdAt),
			createdAt: item.createdAt,
		});
	}
	for (const item of insertedReplies) {
		if (!item.parentId) continue;
		const parent = mustGet(rootCommentById, item.parentId, "parent comment");
		notificationRows.push({
			userId: parent.userId,
			actorId: item.userId,
			postId: item.postId,
			commentId: item.id,
			type: "comment",
			isRead: isRead(item.createdAt),
			createdAt: item.createdAt,
		});
	}

	await insertChunks(
		notificationRows,
		(rows) => db.insert(notifications).values(rows),
		400,
	);

	const summary = {
		users: userRows.length,
		credentialAccounts: userRows.length,
		posts: insertedPosts.length,
		postImages: postSeeds.filter((post) => post.image).length,
		publishedPosts: publishedPosts.length,
		draftPosts: insertedPosts.filter((post) => post.status === "draft").length,
		archivedPosts: insertedPosts.filter((post) => post.status === "archived")
			.length,
		categories: categoryRecords.length,
		tags: tagRecords.length,
		comments: insertedRootComments.length + insertedReplies.length,
		commentReplies: insertedReplies.length,
		follows: followRows.length,
		likes: likeRows.length,
		bookmarks: bookmarkRows.length,
		postViews: viewRows.length,
		notifications: notificationRows.length,
	};

	const verification = await db.execute(sql<{
		seedUsers: number;
		seedPosts: number;
		seedPostsWithImages: number;
		seedComments: number;
	}>`
		SELECT
			COUNT(DISTINCT u.id)::integer AS "seedUsers",
			COUNT(DISTINCT p.id)::integer AS "seedPosts",
			COUNT(DISTINCT p.id) FILTER (WHERE p.image IS NOT NULL)::integer AS "seedPostsWithImages",
			COUNT(DISTINCT c.id)::integer AS "seedComments"
		FROM "user" AS u
		LEFT JOIN posts AS p ON p.author_id = u.id
		LEFT JOIN comments AS c ON c.post_id = p.id
		WHERE u.email LIKE ${`%@${SEED_EMAIL_DOMAIN}`}
	`);

	console.log("\nSeed completed successfully:");
	console.table(summary);
	console.log("Database verification:", verification.rows[0]);
	console.log(`\nLogin email example: ${userRows[0].email}`);
	console.log(`Development password: ${SEED_PASSWORD}`);
	console.log(
		`Rerun "bun run db:seed" to replace only @${SEED_EMAIL_DOMAIN} data.`,
	);
}

seed().catch((error) => {
	console.error("Unable to seed InkNest:", error);
	process.exitCode = 1;
});
