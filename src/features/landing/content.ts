import { BookOpen, Download, Feather, Send, Sparkles, Sprout, type LucideIcon } from "lucide-react"

/**
 * Every word on the landing page lives here — sections stay purely
 * presentational, and copy can be reviewed/edited in one file.
 *
 * Narrative arc: Problem → Vision → Solution (features) → Proof (peek) →
 * Difference (why) → Future (roadmap teaser) → FAQ → Waitlist.
 */

export const hero = {
  badge: "Early access · opening in circles",
  headline: "A quieter home for the written word.",
  subheadline:
    "Umberleaf is a writing platform for people who take words seriously — a focused editor, a companion that sharpens your craft, and readers who actually read.",
  primaryCta: "Join the waitlist",
  secondaryCta: "Read our story",
  assurance: "No spam. One letter when the doors open.",
} as const

export const vision = {
  eyebrow: "Why we're building this",
  title: "The internet taught writers to perform. We'd rather help you write.",
  paragraphs: [
    "Somewhere between the feed and the follower count, writing online stopped being about writing. Every platform asks the same question — how do we keep people scrolling? — and every writer pays for the answer in fractured attention and thinner work.",
    "Umberleaf asks a different question: what would a home for writing look like if it cared about the writing? A place with the calm of a notebook, the discipline of a good editor, and readers who arrive to read — not to skim, react, and vanish.",
  ],
  pullQuote: "Tools shape the work. A louder internet needs quieter rooms.",
} as const

export interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

export const features = {
  eyebrow: "What Umberleaf is",
  title: "Everything the writing deserves. Nothing it doesn't.",
  description: "Six commitments, built into the product from the first line of code.",
  items: [
    {
      icon: Feather,
      title: "A room of your own",
      description:
        "An editor that disappears around your words. No toolbars shouting, no red badges begging. Open it, and the only thing asking for attention is the page.",
    },
    {
      icon: Sparkles,
      title: "A craft companion, not a ghostwriter",
      description:
        "Umberleaf reads like an editor — rhythm, clarity, structure — and asks the questions a good one would. It never writes for you. Your voice stays yours.",
    },
    {
      icon: BookOpen,
      title: "Readers, not audiences",
      description:
        "Your work reaches people who chose to read it — in full pages, at reading pace. Discovery favors resonance over reach.",
    },
    {
      icon: Send,
      title: "Publish with intention",
      description:
        "Essays, stories, poems — released when they're ready, typeset beautifully by default, living at a permanent address you control.",
    },
    {
      icon: Sprout,
      title: "Growth you can trust",
      description:
        "See who read, who returned, and what resonated — numbers in service of craft, not a scoreboard to perform for.",
    },
    {
      icon: Download,
      title: "Own your words",
      description:
        "Export everything, anytime, in open formats. Your writing is yours — no lock-in, no hostage clauses, no fine print.",
    },
  ] satisfies readonly Feature[],
} as const

export const sneakPeek = {
  eyebrow: "A first look",
  title: "Quiet on the surface. Considered underneath.",
  description:
    "Three corners of Umberleaf, sketched from the working product. Details are still settling — the temperament is not.",
  caption: "Interface previews. The final product will differ in detail, not in spirit.",
  panels: [
    {
      id: "editor",
      label: "The editor",
      description: "Where the work happens — just you, the page, and a margin that listens.",
    },
    {
      id: "reader",
      label: "The reading room",
      description: "Where your words are met — full pages, reading pace, no infinite scroll.",
    },
    {
      id: "desk",
      label: "Your desk",
      description: "Where you see how writing lands — readers, returns, resonance.",
    },
  ],
} as const

export const whyUmberleaf = {
  eyebrow: "The difference",
  title: "Not another feed with a text box.",
  description:
    "Most platforms optimize for time spent. Umberleaf optimizes for work made — and for the people it reaches.",
  rows: [
    {
      elsewhere: "Feeds engineered for the next scroll",
      here: "Reading rooms designed for the current page",
    },
    {
      elsewhere: "AI that writes so you don't have to",
      here: "A companion that makes your writing more yours",
    },
    {
      elsewhere: "Follower counts as the measure of worth",
      here: "Returning readers as the measure of resonance",
    },
    {
      elsewhere: "Your words, their platform, their terms",
      here: "Your words, exportable to the last comma",
    },
  ],
} as const

export const roadmapTeaser = {
  eyebrow: "What's ahead",
  title: "Built in the open, in order.",
  description:
    "The waitlist opens first. Then the editor, the reading rooms, and the craft companion — in circles small enough to listen to.",
  cta: "See the full roadmap",
} as const

export interface FaqItem {
  question: string
  answer: string
}

export const faq = {
  eyebrow: "Questions",
  title: "Asked, answered.",
  items: [
    {
      question: "When does Umberleaf launch?",
      answer:
        "We're opening in small circles through 2026, starting with the waitlist. Early circles get in first and shape the product with us — the order of the list is the order of the invitations.",
    },
    {
      question: "What will it cost?",
      answer:
        "Joining the waitlist is free, and there will always be a genuinely useful free way to write on Umberleaf. Deeper features will live in a fair, transparent paid plan — and the earliest members will be treated kindly when that day comes.",
    },
    {
      question: "What kinds of writing is Umberleaf for?",
      answer:
        "Essays, fiction, poetry, criticism, letters — anything meant to be read rather than skimmed. If you care how a sentence sounds, you'll feel at home.",
    },
    {
      question: "Does the AI write for me?",
      answer:
        "No — and that's a promise, not a limitation. It won't draft for you, finish your sentence, or hand you an opening line. What it does is read your draft like a thoughtful editor: it points at rhythm, clarity and structure, and asks the questions a good editor asks. Ask it to tighten a paragraph you've already written and it will show you a tighter one, beside your words, to take or leave. Nothing reaches the page unless you put it there.",
    },
    {
      question: "Who owns what I write?",
      answer:
        "You do. Entirely, always. You can export every word in open formats at any time, and deleting your work actually deletes it.",
    },
    {
      question: "Will there be mobile apps?",
      answer:
        "Yes — Umberleaf is being built for the web, iOS, and Android together, with the same care on every screen. Write at your desk, edit on the train, read anywhere.",
    },
    {
      question: "What does joining the waitlist actually mean?",
      answer:
        "Your place in line, held. We'll email you once when your circle opens — no drip campaigns, no weekly nudges. Just the one letter that matters.",
    },
  ] satisfies readonly FaqItem[],
} as const

export const waitlistSection = {
  eyebrow: "Join us",
  title: "Be there when the doors open.",
  description:
    "We're inviting writers in small circles, so the first rooms feel like rooms — not stadiums. Add your name, and you'll hear from us when it matters.",
} as const
