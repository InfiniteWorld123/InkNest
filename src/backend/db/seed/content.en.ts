import type { TopicSeed } from "./content.types";

export const englishTopics: TopicSeed[] = [
	{
		lang: "en",
		category: "technology",
		tags: ["typescript", "engineering"],
		cover: "code",
		posts: [
			{
				title: "TypeScript Strict Mode Without the Pain",
				markdown: `Turning on \`strict\` in an existing codebase feels like opening a drawer you have avoided for years. The trick is to stop treating it as one switch.

## Enable it per folder

Start with the code you touch most. A separate \`tsconfig\` for a single package lets you fix errors where you already have context, instead of in files nobody has opened since 2021.

## Fix the patterns, not the errors

Most errors come from three habits:

- functions that return \`undefined\` on some paths
- optional properties treated as required
- \`any\` flowing in from untyped libraries

Once you fix a pattern, the same fix clears dozens of errors at once.

> Strictness is not about punishing old code. It is about making the next change cheaper.`,
			},
			{
				title: "Narrowing Types Instead of Casting Them",
				markdown: `Every \`as\` in a codebase is a small promise that nobody checks. Narrowing replaces that promise with a proof.

## A guard is cheaper than a bug

\`\`\`ts
const isUser = (value: unknown): value is User =>
  typeof value === "object" && value !== null && "email" in value;
\`\`\`

The guard runs at runtime and teaches the compiler at the same time. When the API changes, the guard fails loudly instead of letting bad data travel three layers deep.

## Where casts are fine

Tests, generated code, and the rare case where you know more than the type system. Write a comment when you do it. Future you will want to know why.`,
			},
		],
	},
	{
		lang: "en",
		category: "technology",
		tags: ["web-development", "engineering"],
		cover: "network",
		posts: [
			{
				title: "What I Learned Moving an App to the Edge",
				markdown: `Moving a server-rendered app to an edge runtime looked like a deployment change. It turned into a lesson about assumptions.

## Things that quietly broke

- libraries that call \`eval\` or \`new Function\` for speed
- a database pool created once at startup
- file-system reads for templates and version numbers

None of these failed in local development, because Node allows all of them.

## What helped

Running the production bundle locally in the same runtime caught every one of these issues before users did. A five-minute check replaced two evenings of guessing from logs.`,
			},
			{
				title: "Why Your Database Connection Should Live Per Request",
				markdown: `Connection pools are one of the first optimisations we learn, and one of the first that edge platforms punish.

## Sockets belong to requests

On isolate-based runtimes a socket opened in one request cannot be reused by the next. A module-level pool works for the first request and then hangs or fails for the others, often intermittently.

## Two good options

1. Use an HTTP-based driver that has no long-lived connection.
2. Put a connection pooler in front of the database and create a light client per request.

Either way, measure again afterwards. The per-request client is usually faster than people expect.`,
			},
		],
	},
	{
		lang: "en",
		category: "technology",
		tags: ["ai", "research"],
		cover: "network",
		posts: [
			{
				title: "Using AI Assistants for Code Review, Honestly",
				markdown: `I spent three months letting an assistant review my pull requests before a human did. It did not replace reviewers, but it changed what they spent time on.

## Where it helped

- spotting missing error handling
- noticing inconsistent naming across files
- asking what a function does when the name was unclear

## Where it did not

It could not tell me whether a feature was worth building, and it sometimes suggested refactors that fought the existing style. Human review moved from typos to design, which is where it belongs.`,
			},
			{
				title: "Writing Prompts Like You Write Tickets",
				markdown: `The best prompts I have written look suspiciously like good tickets: context, goal, constraints, and a definition of done.

## A simple structure

1. **Context** – what exists today and why it matters
2. **Goal** – the outcome, not the implementation
3. **Constraints** – style, libraries, things to avoid
4. **Done when** – how you will check the result

Vague prompts produce confident, generic answers. Specific prompts produce work you can review in minutes.`,
			},
		],
	},
	{
		lang: "en",
		category: "technology",
		tags: ["security", "engineering"],
		cover: "code",
		posts: [
			{
				title: "Secrets Management for Small Teams",
				markdown: `Small teams rarely leak secrets through clever attacks. They leak them through screenshots, copied \`.env\` files, and error messages.

## Three rules that cover most cases

- secrets live in the platform's secret store, never in the repository
- error responses never include raw exception messages
- every secret has one owner who knows how to rotate it

## Rotate before you need to

Practise rotating a key when nothing is on fire. The first rotation always reveals a forgotten service that still uses the old value.`,
			},
			{
				title: "The Error Message That Leaked Our Database Host",
				markdown: `A customer sent us a screenshot of a failed checkout. The error message on it contained our database hostname and user name.

## How it happened

Our error handler returned \`error.message\` for any unexpected exception. That was convenient during development and dangerous in production.

## The fix

Unexpected errors are now logged on the server and answered with a generic message. Expected errors, like validation failures, still explain themselves. The screenshot made the difference between the two categories obvious.`,
			},
		],
	},
	{
		lang: "en",
		category: "technology",
		tags: ["accessibility", "web-development"],
		cover: "design",
		posts: [
			{
				title: "Accessibility Checks I Run on Every Pull Request",
				markdown: `Accessibility audits at the end of a project find too much to fix. Small checks on every change find almost nothing, which is the point.

## My five-minute routine

- tab through the new UI without a mouse
- zoom the page to 200 %
- check that every icon button has a label
- turn on reduced motion and reload
- read the page with a screen reader for thirty seconds

Nothing here needs special tooling. It needs a habit.`,
			},
			{
				title: "Focus States Are a Design Feature",
				markdown: `Removing focus outlines because they look untidy is still one of the most common accessibility regressions.

## Design them on purpose

A visible, on-brand focus ring tells keyboard users where they are. Use \`:focus-visible\` so mouse users do not see it on every click.

## Test with real flows

Sign in, add something to a cart, submit a form. If you lose track of focus once, so will your users.`,
			},
		],
	},
	{
		lang: "en",
		category: "writing",
		tags: ["writing", "habits"],
		cover: "writing",
		posts: [
			{
				title: "A Writing Habit That Survives Busy Weeks",
				markdown: `Most writing routines are designed for the week you wish you had. Mine is designed for the week I usually get.

## The minimum version

Twenty minutes, one paragraph, no editing. On good days it grows into an hour. On bad days it still counts.

## Why it works

- the bar is low enough to clear when tired
- the draft is always warm when I return
- progress is visible in a single document

Consistency beat intensity for me by a wide margin.`,
			},
			{
				title: "Editing Is Where the Writing Happens",
				markdown: `First drafts are for finding out what you think. Editing is for making sure a reader can follow.

## My three passes

1. **Structure** – does every section earn its place?
2. **Clarity** – can each sentence be read once?
3. **Voice** – does it sound like a person?

> Cut the paragraph you are proudest of and see if the piece misses it.

Usually it does not.`,
			},
		],
	},
	{
		lang: "en",
		category: "writing",
		tags: ["storytelling", "craft"],
		cover: "books",
		posts: [
			{
				title: "Starting a Story in the Middle",
				markdown: `Readers forgive a missing backstory much faster than a slow opening.

## Enter late, leave early

Begin where something is already at stake. Context can arrive later, one sentence at a time, when the reader has a reason to want it.

## A quick test

Delete your first two paragraphs. If the story still makes sense, they were throat-clearing. If it does not, move one detail into the new opening.`,
			},
			{
				title: "Dialogue That Does Two Jobs",
				markdown: `Good dialogue moves the plot and reveals character at the same time. If a line only does one, it is a candidate for cutting.

## Practical rules

- people rarely answer the question they were asked
- avoid names in every line; real people do not do that
- let silence and action carry some of the meaning

Read it aloud. Your ear catches stiffness faster than your eyes.`,
			},
		],
	},
	{
		lang: "en",
		category: "writing",
		tags: ["writing", "learning"],
		cover: "writing",
		posts: [
			{
				title: "Writing Documentation for the Next Person",
				markdown: `Documentation is a letter to someone who is tired, in a hurry, and missing the context you had.

## Answer these first

- What is this, in one sentence?
- How do I run it locally?
- What will break if I change it?

## Keep it next to the code

Docs in a wiki drift. Docs in the repository get reviewed in the same pull request as the change they describe.`,
			},
			{
				title: "READMEs That People Actually Read",
				markdown: `A README has about ten seconds to convince someone to keep reading.

## A structure that works

1. One sentence about what the project does
2. A screenshot or a short example
3. Quick start in five commands or fewer
4. Where to go next

Everything else — architecture, decisions, history — belongs in linked documents, not in the first screen.`,
			},
		],
	},
	{
		lang: "en",
		category: "productivity",
		tags: ["deep-work", "habits"],
		cover: "productivity",
		posts: [
			{
				title: "Protecting Two Hours of Deep Work",
				markdown: `I used to try to protect whole days for focused work. I never managed it. Two hours, four times a week, turned out to be realistic.

## The setup

- calendar block with a boring name so nobody asks about it
- notifications off, phone in another room
- one written goal for the session

## The result

Fewer heroic late nights and more finished work. Two protected hours beat eight fragmented ones.`,
			},
			{
				title: "The Shutdown Ritual That Ended My Evening Email",
				markdown: `For years my workday ended whenever I fell asleep. A five-minute shutdown ritual fixed that.

## The checklist

1. Capture every open loop in one list
2. Pick tomorrow's first task
3. Close all tabs
4. Say "done for today" out loud (it feels silly and works)

The ritual tells your brain the work is stored somewhere safe, so it can stop rehearsing it.`,
			},
		],
	},
	{
		lang: "en",
		category: "productivity",
		tags: ["remote-work", "leadership"],
		cover: "city",
		posts: [
			{
				title: "Remote Meetings With a Written Agenda",
				markdown: `The single change that improved our remote meetings the most was boring: a written agenda, shared a day before.

## What it changed

- people arrived with opinions instead of first reactions
- quiet colleagues contributed in the document
- half the meetings turned out to be unnecessary

## Our rule

No agenda, no meeting. It sounds strict and saved us hours every week.`,
			},
			{
				title: "Async Updates That Replace the Daily Stand-up",
				markdown: `Our team spans four time zones. The daily stand-up was always too early for someone and too late for someone else.

## The written format

- **Yesterday** – what shipped or moved forward
- **Today** – the one thing that matters most
- **Blocked** – what I need and from whom

Updates are posted by 10:00 local time. Blockers get a reply within two hours. We now meet live once a week, and that meeting is better.`,
			},
		],
	},
	{
		lang: "en",
		category: "productivity",
		tags: ["mental-clarity", "habits"],
		cover: "growth",
		posts: [
			{
				title: "A Weekly Review in Thirty Minutes",
				markdown: `The weekly review is the habit productivity books agree on and people skip first. Mine takes thirty minutes on Friday afternoon.

## Steps

1. Empty all inboxes into one list
2. Check next week's calendar for preparation
3. Choose three outcomes for the week
4. Delete at least one task that no longer matters

The last step is the most important. A list that only grows eventually stops being trusted.`,
			},
			{
				title: "Saying No Without Burning Bridges",
				markdown: `Every yes spends time you have already promised to something else.

## A gentle template

> "I can't take this on well right now. I could look at it in two weeks, or suggest someone who might have time."

It declines the task, not the person, and offers a real alternative. Most people respond better to a clear no than to a reluctant yes that arrives late.`,
			},
		],
	},
	{
		lang: "en",
		category: "design",
		tags: ["product-design", "typography"],
		cover: "design",
		posts: [
			{
				title: "A Design System People Actually Use",
				markdown: `Our first design system was beautiful and ignored. The second one was plainer and adopted within a month.

## What changed

- components were built from real screens, not a wishlist
- every component had a copy-paste example
- designers and developers reviewed changes together

## The metric we watch

Not the number of components, but how many new screens ship without custom CSS.`,
			},
			{
				title: "Typography Choices for Long-Form Reading",
				markdown: `Readers do not notice good typography. They notice when reading feels tiring.

## Settings that matter

- line length of 60–75 characters
- body size of at least 18 px on desktop
- line height around 1.6
- enough contrast in both light and dark mode

A plain, well-set page beats a clever typeface with poor spacing every time.`,
			},
		],
	},
	{
		lang: "en",
		category: "design",
		tags: ["product-design", "research"],
		cover: "design",
		posts: [
			{
				title: "Designing Calm Interfaces",
				markdown: `Calm software does not demand attention it has not earned.

## Principles we follow

- notifications are opt-in and grouped
- empty states explain the next step
- destructive actions are reversible when possible
- motion supports meaning and respects reduced-motion settings

Calm is not the same as minimal. It is about predictability.`,
			},
			{
				title: "Five User Interviews Beat Fifty Opinions",
				markdown: `Internal debates about a feature can go on for weeks. Five short conversations with real users usually end them.

## How we run them

1. Ask about the last time they did the task
2. Let them show, not tell
3. Never pitch the solution during the interview

Patterns show up by the third interview. By the fifth, the team usually agrees.`,
			},
		],
	},
	{
		lang: "en",
		category: "business",
		tags: ["indie-business", "personal-finance"],
		cover: "business",
		posts: [
			{
				title: "Pricing Independent Creative Work",
				markdown: `Freelancers often price by the hour because it feels fair. Clients often prefer a fixed price because it feels safe.

## A middle path

- estimate the hours honestly
- add a buffer for revisions and communication
- quote a fixed price for a clearly defined scope

## The scope sentence

Write one sentence describing what is *not* included. It prevents more arguments than any contract clause.`,
			},
			{
				title: "Building a Tiny Software Business on the Side",
				markdown: `My side project makes less than a salary and more than a hobby. That turned out to be a comfortable place.

## What kept it sustainable

- one product, one pricing page, one support inbox
- no features without a paying customer asking twice
- monthly revenue reviewed, daily revenue ignored

Growth is slow. So is burnout, and I prefer the first.`,
			},
		],
	},
	{
		lang: "en",
		category: "business",
		tags: ["leadership", "community"],
		cover: "business",
		posts: [
			{
				title: "Leading Through Clear Expectations",
				markdown: `Most performance problems I have seen as a manager started as expectation problems.

## Write expectations down

For every role on the team: what good looks like, what great looks like, and what is explicitly not their job.

## Review them together

Twice a year we read them aloud and change what no longer fits. It takes an hour and prevents months of quiet frustration.`,
			},
			{
				title: "Giving Feedback That Lands",
				markdown: `Feedback fails most often because it is vague, late, or delivered as a verdict.

## A simple format

- **Situation** – when and where
- **Behaviour** – what you observed
- **Impact** – what it caused

Then ask a question and listen. Feedback is a conversation, not a delivery.`,
			},
		],
	},
	{
		lang: "en",
		category: "culture",
		tags: ["books", "learning"],
		cover: "books",
		posts: [
			{
				title: "Reading More Without Chasing a Number",
				markdown: `Reading challenges made me read more books and remember fewer of them.

## What I do instead

- always carry the current book, paper or digital
- stop books I do not enjoy by page 50
- write three sentences after finishing each one

I read fewer titles this year and can talk about every one of them.`,
			},
			{
				title: "Keeping a Commonplace Book",
				markdown: `A commonplace book is a notebook for quotes, ideas, and fragments worth keeping. Writers have kept them for centuries.

## How I use mine

- one entry per idea, with the source
- a short note on why it mattered to me
- a monthly reread to connect entries

Over time it becomes a map of what you were thinking, which is more useful than any single note.`,
			},
		],
	},
	{
		lang: "en",
		category: "culture",
		tags: ["community", "sustainability"],
		cover: "city",
		posts: [
			{
				title: "Hosting Community Conversations",
				markdown: `Our neighbourhood started monthly evening conversations with twelve people and a pot of tea. Two years later, we still meet.

## What makes it work

- a question announced a week in advance
- a host who talks the least
- a hard stop after ninety minutes

People return because it is predictable and because they are heard.`,
			},
			{
				title: "Repairing Household Objects",
				markdown: `The local repair café fixed my toaster in twenty minutes. I left with the toaster and a new hobby.

## Lessons from a year of repairing

- most broken things have one broken part
- a multimeter and patience solve half of them
- documentation from the manufacturer is rare, forums are not

Repair is cheaper, but the bigger reward is understanding the things we own.`,
			},
		],
	},
	{
		lang: "en",
		category: "travel",
		tags: ["travel-notes", "photography"],
		cover: "travel",
		posts: [
			{
				title: "Travelling Slowly Through a Familiar City",
				markdown: `I spent a week as a tourist in the city I have lived in for eight years.

## The rules

- no car, only walking and trams
- one neighbourhood per day
- eat where the menu is handwritten

I found a bakery I had passed a hundred times and a park I did not know existed. Slow travel works at home, too.`,
			},
			{
				title: "Packing Light for a Two-Week Trip",
				markdown: `Two weeks, one backpack of 28 litres. It is easier than it sounds.

## The list

- three tops, two bottoms, one warm layer
- laundry soap sheets
- one pair of comfortable shoes you already own

## The benefit

No checked luggage, no waiting at belts, and much less deciding what to wear.`,
			},
		],
	},
	{
		lang: "en",
		category: "travel",
		tags: ["travel-notes", "sustainability"],
		cover: "travel",
		posts: [
			{
				title: "Night Trains Are Back, and They Are Worth It",
				markdown: `I took the night train instead of a flight for a 900-kilometre trip. I arrived rested, in the city centre, with a morning ahead of me.

## What to know

- book early for private compartments
- bring earplugs and a small snack
- the dining car is a bonus, not a guarantee

It took longer on paper and less time in practice, because I slept through most of it.`,
			},
			{
				title: "Hiking Without an App for a Day",
				markdown: `I left the tracking app at home and used a paper map for a day in the hills.

## What changed

I looked at the landscape instead of the screen. I talked to two other hikers to confirm a turn. I did not know my pace, and I did not miss knowing it.

Bring a charged phone for emergencies. Just keep it in the bag.`,
			},
		],
	},
	{
		lang: "en",
		category: "food",
		tags: ["cooking", "habits"],
		cover: "food",
		posts: [
			{
				title: "Weeknight Cooking With Five Ingredients",
				markdown: `Most weeknight recipes fail because they need a shopping trip. Five-ingredient dinners do not.

## A favourite

**Lemon pasta:** spaghetti, lemon, butter, parmesan, black pepper.

1. Cook the pasta and keep a cup of water
2. Melt butter with lemon zest and juice
3. Toss everything with cheese and pasta water

Fifteen minutes, one pot, and better than takeaway.`,
			},
			{
				title: "Batch Cooking Sunday Without the Boredom",
				markdown: `Batch cooking the same curry for five days made me hate batch cooking. Now I cook components instead of meals.

## The components

- one grain, like rice or farro
- one tray of roasted vegetables
- one protein
- two sauces

Mixing them differently each day turns one afternoon into five different lunches.`,
			},
		],
	},
	{
		lang: "en",
		category: "food",
		tags: ["cooking", "gardening"],
		cover: "food",
		posts: [
			{
				title: "Growing Herbs on a Small Balcony",
				markdown: `A balcony of two square metres now supplies most of our herbs from May to October.

## What grows easily

- basil, if it gets sun and water
- mint, in its own pot so it does not take over
- chives and thyme, which survive neglect

Water in the morning, harvest often, and the plants keep producing.`,
			},
			{
				title: "Sourdough for Impatient People",
				markdown: `Sourdough has a reputation for being complicated. Most of the time involved is waiting, not working.

## A relaxed schedule

- **Evening:** mix flour, water, starter, and salt
- **Night:** let it rise at room temperature
- **Morning:** shape, then rest in the fridge
- **Evening:** bake

The active work adds up to about twenty minutes.`,
			},
		],
	},
	{
		lang: "en",
		category: "photography",
		tags: ["photography", "creativity"],
		cover: "photography",
		posts: [
			{
				title: "Photographing Ordinary Streets",
				markdown: `The best street photos I have taken were two minutes from home.

## How I practise

- one lens, one focal length, for a month
- the same street at different times of day
- wait for a person to enter the frame instead of chasing them

Familiar places get interesting once you stop expecting them to be.`,
			},
			{
				title: "Editing Photos Without Overdoing It",
				markdown: `The easiest way to ruin a good photo is to edit it for too long.

## My limit

1. Straighten and crop
2. Set white balance
3. Adjust exposure and contrast
4. Stop

If the image needs more, it probably needed a better moment rather than more sliders.`,
			},
		],
	},
	{
		lang: "en",
		category: "photography",
		tags: ["photography", "learning"],
		cover: "photography",
		posts: [
			{
				title: "Learning Light With a Phone Camera",
				markdown: `You do not need a new camera to learn about light. You need to notice it.

## Exercises

- photograph the same object every hour for a day
- shoot one portrait by a window and one under a streetlamp
- find three shadows that are more interesting than their objects

After a week, you start seeing light before you raise the camera.`,
			},
			{
				title: "Printing Photos Changed How I Shoot",
				markdown: `I started printing ten photos a month. Suddenly, I took fewer and better pictures.

## Why printing helps

A print has a size, a cost, and a place on the wall. That makes you choose. Choosing makes you think about what you want to keep before you press the shutter.`,
			},
		],
	},
	{
		lang: "en",
		category: "personal-growth",
		tags: ["learning", "mental-clarity"],
		cover: "growth",
		posts: [
			{
				title: "Learning a New Skill in Public",
				markdown: `I shared my progress learning to draw, every week, for a year. The drawings were bad for a long time.

## Why it helped

- a weekly post created a deadline
- people sent tips I would not have found
- looking back, the improvement was visible and motivating

Learning in public is uncomfortable. It is also the fastest feedback loop I know.`,
			},
			{
				title: "Keeping a Decision Journal",
				markdown: `A decision journal records what you decided, why, and what you expected to happen.

## Each entry

- the decision in one sentence
- the options you rejected
- how confident you felt, from 1 to 10

Reading old entries shows the difference between bad decisions and bad luck, which is surprisingly hard to remember otherwise.`,
			},
		],
	},
	{
		lang: "en",
		category: "personal-growth",
		tags: ["habits", "personal-finance"],
		cover: "growth",
		posts: [
			{
				title: "Building an Emergency Fund Without Shame",
				markdown: `An emergency fund is not a sign of pessimism. It is a way to keep bad days from becoming bad years.

## Start small

- automate a fixed amount on payday
- keep it in a separate account without a card
- celebrate the first month of expenses saved

Progress is slow at first and then surprisingly steady.`,
			},
			{
				title: "A Morning Routine Without Productivity Theatre",
				markdown: `My morning routine used to have eleven steps. I followed it for two weeks.

## What survived

1. Water before coffee
2. Ten minutes outside
3. The day's first task decided the evening before

Everything else was performance. The short version I actually do beats the long version I admire.`,
			},
		],
	},
	{
		lang: "en",
		category: "technology",
		tags: ["open-source", "community"],
		cover: "code",
		posts: [
			{
				title: "Making Open-Source Contributions That Last",
				markdown: `My first pull requests to open-source projects were ignored. The later ones were merged within days.

## What changed

- I read the contributing guide first
- I opened an issue before writing code
- I kept pull requests small and focused

Maintainers are volunteers with limited time. Make your change easy to say yes to.`,
			},
			{
				title: "Maintaining a Small Library Without Burning Out",
				markdown: `A small library with a few thousand users can still produce a steady stream of issues.

## Boundaries that helped

- issue templates that ask for a reproduction
- a clear scope in the README, including what is out of scope
- a monthly triage day instead of daily notifications

Saying no to features is part of maintaining quality.`,
			},
		],
	},
	{
		lang: "en",
		category: "technology",
		tags: ["web-development", "product-design"],
		cover: "code",
		posts: [
			{
				title: "Loading States That Respect the User",
				markdown: `A spinner tells users to wait. A good loading state tells them what is coming.

## Better defaults

- skeletons that match the final layout
- optimistic updates for small actions
- a clear error with a retry button when things fail

Test with a throttled network. Your office Wi-Fi is not your users' reality.`,
			},
			{
				title: "Empty States Are Onboarding",
				markdown: `The first time someone opens a new feature, it is usually empty. That screen is your best onboarding opportunity.

## A good empty state

1. Explains what will appear here
2. Offers one clear first action
3. Avoids blaming the user ("You have no…")

Write it last, after the feature works, and read it as a newcomer would.`,
			},
		],
	},
	{
		lang: "en",
		category: "business",
		tags: ["career", "leadership"],
		cover: "business",
		posts: [
			{
				title: "What Changed When I Became a Tech Lead",
				markdown: `The hardest part of becoming a tech lead was accepting that my most valuable work no longer looked like code.

## New responsibilities

- unblocking others before finishing my own tasks
- writing decisions down so they survive meetings
- noticing when the team is tired

I still write code, just less of it and in smaller pieces.`,
			},
			{
				title: "Preparing for a Career Conversation",
				markdown: `Career conversations go better when you arrive with evidence instead of feelings alone.

## Bring

- three things you shipped and their impact
- one skill you want to grow and why
- a concrete next step you would like support for

Managers can help much more easily when they know exactly what you are asking for.`,
			},
		],
	},
	{
		lang: "en",
		category: "writing",
		tags: ["writing", "community"],
		cover: "books",
		posts: [
			{
				title: "Why I Started a Newsletter Instead of Posting",
				markdown: `Social media rewarded me for reacting. A newsletter rewards me for thinking.

## What changed

- fewer, longer pieces
- readers reply with real questions
- no algorithm between me and the people who subscribed

The audience grew slower and stays longer.`,
			},
			{
				title: "Finding Your Voice by Writing Badly",
				markdown: `Voice is not something you find before writing. It is what remains after you have written a lot.

## An exercise

Write the same short story three times: once formally, once as a text message, once as if telling a friend. Keep the sentences you like from each version.

That mix is closer to your voice than any of the three alone.`,
			},
		],
	},
	{
		lang: "en",
		category: "productivity",
		tags: ["learning", "deep-work"],
		cover: "productivity",
		posts: [
			{
				title: "Note-Taking That Leads to Output",
				markdown: `I used to collect notes like souvenirs. Now every note has to be useful for something I might write.

## The rules

- write notes in my own words, not copied highlights
- link each note to at least one other
- review notes when starting a new piece

A smaller, connected collection beats a large archive nobody reads.`,
			},
			{
				title: "Timeboxing for People Who Hate Timers",
				markdown: `Timeboxing works even if you never set a timer.

## A softer version

- decide how long a task deserves before starting
- write that number next to the task
- when time runs out, decide consciously: continue or stop

The value is not in the alarm. It is in the moment of deciding.`,
			},
		],
	},
];
