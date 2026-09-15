#!/usr/bin/env node
/**
 * Verify that the client and firestore.rules still agree.
 *
 * Why this exists: a write the rules reject comes back as `permission-denied`,
 * which the UI reports as "you're already on the list". So the failure mode for
 * client/rules drift is not an error — it is every visitor being congratulated
 * while nothing is stored. There is no runtime signal, which means the check
 * has to happen before deploy.
 *
 * The expectations below are the contract. Both sides are read as text and
 * compared against it, so a change to EITHER the schemas or the rules fails
 * until the other one follows. Text, not imports, because the rules file is not
 * JavaScript and the alternative is a Firestore emulator in CI for six numbers.
 *
 *   node tool/check-rules-contract.mjs      (pnpm check:contract)
 */
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const read = (p) => readFileSync(join(ROOT, p), "utf8")

const CONTRACT = {
  waitlist: {
    keys: ["email", "name", "interest", "createdAt", "source", "status"],
    email: { min: 6, max: 254 },
    nameMax: 80,
    sourceMax: 120,
    status: "pending",
    interests: ["writing", "reading", "both"],
    schema: "src/features/waitlist/schemas/waitlist-schema.ts",
    service: "src/features/waitlist/services/waitlist-service.ts",
  },
  newsletter: {
    keys: ["email", "createdAt", "source", "status"],
    email: { min: 6, max: 254 },
    sourceMax: 120,
    status: "subscribed",
    schema: "src/features/newsletter/schemas/newsletter-schema.ts",
    service: "src/features/newsletter/services/newsletter-service.ts",
  },
}

const failures = []
const fail = (where, message) => failures.push(`${where}: ${message}`)
const sorted = (list) => [...list].sort().join(",")

const rules = read("firestore.rules")

/*
  Brace counting has to ignore braces that aren't structure: the `{entryId}`
  wildcard on the match line itself, and quantifiers inside quoted patterns
  like '^[a-f0-9]{64}$'. Quoted runs are blanked to spaces so the offsets of
  everything else stay put.
*/
const scannable = rules.replace(/'[^']*'/g, (match) => " ".repeat(match.length))

/** The body of one `match /<collection>/{...} { … }` block. */
function rulesBlock(collection) {
  const start = rules.indexOf(`match /${collection}/`)
  if (start === -1) return null
  // The block opens at the LAST brace on the match line — the earlier one
  // belongs to the `{entryId}` wildcard.
  const lineEnd = rules.indexOf("\n", start)
  const open = scannable.lastIndexOf("{", lineEnd)
  if (open < start) return null
  let depth = 0
  for (let i = open; i < scannable.length; i += 1) {
    if (scannable[i] === "{") depth += 1
    else if (scannable[i] === "}") {
      depth -= 1
      if (depth === 0) return rules.slice(open, i)
    }
  }
  return null
}

function listIn(text, pattern) {
  const match = text.match(pattern)
  if (!match) return null
  return match[1]
    .split(",")
    .map((entry) => entry.trim().replace(/^['"]|['"]$/g, ""))
    .filter(Boolean)
}

// ── Shared rules invariants ─────────────────────────────────────────────────
const email = CONTRACT.waitlist.email
const validEmail = rules.match(/function validEmail\(email\)[\s\S]*?\n {4}}/)?.[0] ?? ""
if (!validEmail.includes(`email.size() >= ${email.min}`)) {
  fail("firestore.rules", `validEmail must enforce a minimum size of ${email.min}`)
}
if (!validEmail.includes(`email.size() <= ${email.max}`)) {
  fail("firestore.rules", `validEmail must enforce a maximum size of ${email.max}`)
}
if (!validEmail.includes("email == email.lower()")) {
  fail("firestore.rules", "validEmail must require a lowercased address (the client normalizes)")
}
if (!/function idBindsEmail\(/.test(rules)) {
  fail(
    "firestore.rules",
    "idBindsEmail() is missing — document ids would stop being bound to the address",
  )
}
if (!new RegExp(`validSource[\\s\\S]*?size\\(\\) <= ${CONTRACT.waitlist.sourceMax}`).test(rules)) {
  fail("firestore.rules", `validSource must cap source at ${CONTRACT.waitlist.sourceMax}`)
}
if (!/match \/\{document=\*\*\} \{\s*allow read, write: if false;/.test(rules)) {
  fail("firestore.rules", "the catch-all deny rule is missing or no longer denies everything")
}

// ── Per collection ──────────────────────────────────────────────────────────
for (const [collection, spec] of Object.entries(CONTRACT)) {
  const block = rulesBlock(collection)
  if (!block) {
    fail("firestore.rules", `no match block for /${collection}`)
    continue
  }
  const where = `firestore.rules /${collection}`

  for (const fn of ["hasOnly", "hasAll"]) {
    const keys = listIn(block, new RegExp(`${fn}\\(\\[([^\\]]*)\\]`))
    if (!keys) fail(where, `create rule is missing keys().${fn}([…])`)
    else if (sorted(keys) !== sorted(spec.keys)) {
      fail(where, `${fn} is [${sorted(keys)}], contract says [${sorted(spec.keys)}]`)
    }
  }

  if (!block.includes("allow read, update, delete: if false;")) {
    fail(where, "must stay create-only (read/update/delete denied)")
  }
  if (!block.includes("idBindsEmail(entryId, request.resource.data.email)")) {
    fail(where, "create rule does not bind the document id to the email")
  }
  if (!block.includes("request.resource.data.createdAt == request.time")) {
    fail(where, "createdAt must be pinned to request.time (serverTimestamp)")
  }
  if (!block.includes(`request.resource.data.status == '${spec.status}'`)) {
    fail(where, `status must be locked to '${spec.status}'`)
  }
  if (spec.nameMax && !block.includes(`name.size() <= ${spec.nameMax}`)) {
    fail(where, `name must be capped at ${spec.nameMax}`)
  }
  if (spec.interests) {
    const enumerated = listIn(block, /interest in \[([^\]]*)\]/)
    if (!enumerated) fail(where, "interest enum is missing")
    else if (sorted(enumerated) !== sorted(spec.interests)) {
      fail(
        where,
        `interest enum is [${sorted(enumerated)}], contract says [${sorted(spec.interests)}]`,
      )
    }
  }

  // ── Client side ───────────────────────────────────────────────────────────
  const schema = read(spec.schema)
  const schemaWhere = spec.schema
  if (!new RegExp(`\\.min\\(${spec.email.min}[,)]`).test(schema)) {
    fail(schemaWhere, `email must enforce .min(${spec.email.min}) to match the rules`)
  }
  if (!new RegExp(`\\.max\\(${spec.email.max}[,)]`).test(schema)) {
    fail(schemaWhere, `email must enforce .max(${spec.email.max}) to match the rules`)
  }
  if (spec.nameMax && !new RegExp(`\\.max\\(${spec.nameMax}[,)]`).test(schema)) {
    fail(schemaWhere, `name must enforce .max(${spec.nameMax}) to match the rules`)
  }
  if (spec.interests) {
    const declared = listIn(schema, /WAITLIST_INTERESTS = \[([^\]]*)\]/)
    if (!declared) fail(schemaWhere, "WAITLIST_INTERESTS is missing")
    else if (sorted(declared) !== sorted(spec.interests)) {
      fail(
        schemaWhere,
        `WAITLIST_INTERESTS is [${sorted(declared)}], rules say [${sorted(spec.interests)}]`,
      )
    }
  }
  /*
    The honeypot must accept any value. Constraining it here does not reject
    bots — it stops react-hook-form from ever calling the submit handler, so
    the handler's bot branch (which reports success without writing) becomes
    unreachable and the form silently dies for everyone who trips it.
  */
  if (!/company: z\.string\(\)\.optional\(\)/.test(schema)) {
    fail(
      schemaWhere,
      "the honeypot must stay `z.string().optional()` — a constraint here disables the submit handler",
    )
  }

  const service = read(spec.service)
  if (!new RegExp(`source\\.slice\\(0, ${spec.sourceMax}\\)`).test(service)) {
    fail(spec.service, `source must be truncated to ${spec.sourceMax} before the write`)
  }
  if (!service.includes(`status: "${spec.status}"`)) {
    fail(spec.service, `status must be written as "${spec.status}"`)
  }
  if (!/sha256Hex\(/.test(service)) {
    fail(spec.service, "the document id must be derived with sha256Hex — the rules now require it")
  }
}

if (failures.length > 0) {
  console.error("client ✗ firestore.rules — the contract is broken:\n")
  for (const line of failures) console.error(`  • ${line}`)
  console.error("\nA mismatch here reaches production as a silent success. Fix both sides.")
  process.exit(1)
}

console.log(`client ↔ firestore.rules in agreement (${Object.keys(CONTRACT).length} collections)`)
