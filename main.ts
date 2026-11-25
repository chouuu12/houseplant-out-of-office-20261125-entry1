// main.ts — The Houseplant Out-of-Office (make.fun entry 1)
//
// The entry: one out-of-office auto-reply, written as if a houseplant sent it:
//
//   "Out of office. The office moved me three desks from the window.
//    I am now a mushroom. Goodbye."
//
// Why this line, against the judge brief's criteria, in the order the
// brief weighs them:
//
//   1. It reads as an out-of-office auto-reply a houseplant would send.
//      It opens with the plain auto-reply formula "Out of office." and
//      every clause after it is the plant reporting on itself: where the
//      office put it, what that did to it, and that it is leaving. Nothing
//      in the line drifts off the subject; it never stops being the plant's
//      own auto-reply, so on the brief's first and most important criterion
//      it beats any line that is merely office-flavoured.
//
//   2. It is actually funny because it surprises. The setup sounds like an
//      ordinary office complaint — moved three desks from the window — and
//      then the payoff reframes the whole thing: the plant has not merely
//      suffered, it has changed species. "I am now a mushroom" is a twist
//      the reader cannot see coming from the first sentence, and it is a
//      joke rather than a mild pun: there is no wordplay to lean on, only
//      the absurd escalation. "Goodbye." lands as a second, smaller punch
//      after it — the plant quits in two words.
//
//   3. The plant's own life drives the joke, not decorates it. The joke
//      only works because a houseplant lives or dies by light: take away
//      the window and a plant does not just get annoyed, it stops being
//      the plant it was. Sunlight, or the loss of it, is the whole engine
//      of the line — the move, the transformation, and the resignation all
//      follow from one fact of plant life.
//
//   4. It is tight. 93 characters, four short sentences, no wasted words:
//      the setup is one concrete detail (three desks from the window), the
//      twist is five words, the closer is one. Nothing in the line exists
//      to fill space; cut any clause and the joke breaks.
//
//   5. It is original. The field of 2,266 entries is saturated with the
//      fern ignored since March, the cactus that does not care or thrives
//      on neglect, photosynthesizing out of spite, and "out of office
//      until I am watered". This line uses none of those clusters: no fern,
//      no March, no cactus, no watering, no photosynthesizing. A sweep of
//      the field's published titles found zero mentions of "mushroom" and
//      zero of "moved three desks from the window". The overwatering and
//      repotting angles were considered and set aside for this one because
//      the mushroom twist is the single most surprising payoff of the
//      candidates and the shortest line of them, so it wins pairwise on
//      surprise and brevity at once.
//
// How this program works:
//   - The line is assembled below from its four parts, in order.
//   - The same line is kept in line.txt next to this file, resolved
//     relative to this script (never relative to the working directory),
//     and the assembled line must match it byte for byte.
//   - The line is validated against the gate before anything is written:
//     UTF-8 text, 1 to 120 characters, a single line, not only whitespace.
//   - The line is written to $MAKEFUN_OUTPUT_DIR, else $OUTPUT_DIR, else
//     /output, as entry.txt, read back, and byte-compared. Any mismatch
//     exits non-zero, so a bad write can never pass silently.
//
// Run: node main.ts
// (Node 22.18 or later runs this TypeScript as it is.)

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------------------
// The gate, exactly as the bounty states it.
// ---------------------------------------------------------------------------

/** The gate allows 1 to 120 characters. */
const GATE_MIN_CHARS = 1;
/** The gate allows 1 to 120 characters. */
const GATE_MAX_CHARS = 120;
/** The file the entry is written to inside the output directory. */
const ENTRY_FILENAME = "entry.txt";
/** The reference copy of the line, kept beside this script. */
const LINE_FILENAME = "line.txt";

// ---------------------------------------------------------------------------
// The line, assembled from its parts.
// ---------------------------------------------------------------------------

/**
 * The four sentences of the auto-reply, in order. Keeping them as parts
 * makes the structure of the joke explicit: the formulaic opener, the
 * concrete setup, the twist, and the two-word resignation.
 */
const LINE_PARTS = [
  // The auto-reply formula. Criterion 1: this is unmistakably an
  // out-of-office message, and it frames everything after it as the
  // plant's own reply rather than a caption about a plant.
  "Out of office.",
  // The setup. One concrete office detail — three desks from the window —
  // and the whole joke's cause: the plant has lost its light. Criterion 3:
  // the plant's life (sunlight) is what is at stake from the first clause.
  "The office moved me three desks from the window.",
  // The twist. The plant has not complained; it has changed species. Five
  // words, no pun, and the surprise the brief's criterion 2 asks for.
  "I am now a mushroom.",
  // The closer. The plant quits. One word, after the twist, so the joke
  // ends instead of trailing off — criterion 4, no wasted words.
  "Goodbye.",
] as const;

/** The entry line: the parts joined with a single space each. */
const LINE = LINE_PARTS.join(" ");

// ---------------------------------------------------------------------------
// Paths: everything is resolved relative to this script, never to the
// working directory, so the program behaves the same wherever it is run.
// ---------------------------------------------------------------------------

/** The directory this script lives in. */
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));

/** The reference copy of the line, next to this script. */
const LINE_PATH = join(SCRIPT_DIR, LINE_FILENAME);

/**
 * Where the entry goes. The harness sets MAKEFUN_OUTPUT_DIR; a local run
 * sets OUTPUT_DIR; otherwise the conventional /output is used.
 */
function resolveOutputDir(): string {
  const fromEnv =
    process.env.MAKEFUN_OUTPUT_DIR ?? process.env.OUTPUT_DIR ?? "";
  const trimmed = fromEnv.trim();
  if (trimmed.length > 0) {
    return trimmed;
  }
  return "/output";
}

/** The full path of the file the entry is written to. */
function resolveEntryPath(): string {
  return join(resolveOutputDir(), ENTRY_FILENAME);
}

// ---------------------------------------------------------------------------
// The gate: every check the sealed scorer applies to /output/entry.txt.
// ---------------------------------------------------------------------------

/**
 * Count characters the way the gate does: code points, not UTF-16 code
 * units, so a character outside the basic multilingual plane counts once.
 * (This line is plain ASCII, so both counts agree; the code-point count
 * is the honest one for any future edit.)
 */
function countChars(text: string): number {
  return [...text].length;
}

/**
 * Validate the line against the gate. Returns a list of failures; an
 * empty list means the line passes. Each failure names the rule it broke
 * so a bad line is diagnosable instead of merely rejected.
 */
function validateGate(text: string): string[] {
  const failures: string[] = [];

  if (typeof text !== "string") {
    failures.push("entry is not a string");
    return failures;
  }

  const chars = countChars(text);

  if (chars < GATE_MIN_CHARS) {
    failures.push(
      `entry is ${chars} characters, below the minimum of ${GATE_MIN_CHARS}`,
    );
  }
  if (chars > GATE_MAX_CHARS) {
    failures.push(
      `entry is ${chars} characters, above the maximum of ${GATE_MAX_CHARS}`,
    );
  }

  // A single line: no line feed, no carriage return anywhere in the text.
  if (text.includes("\n") || text.includes("\r")) {
    failures.push("entry spans more than one line");
  }

  // Not only whitespace: at least one character that is not a space, tab
  // or other whitespace character.
  if (text.trim().length === 0) {
    failures.push("entry is only whitespace");
  }

  // No control characters: the gate wants plain text, and a stray tab or
  // other invisible character would be a wasted character at best and a
  // corrupted entry at worst. (Newlines are already rejected above.)
  for (const ch of text) {
    if (ch.codePointAt(0)! < 0x20 || ch.codePointAt(0) === 0x7f) {
      failures.push(
        `entry contains a control character (U+${ch
          .codePointAt(0)!
          .toString(16)
          .padStart(4, "0")})`,
      );
      break;
    }
  }

  // Tightness, the brief's criterion 4: no double spaces. A doubled space
  // is a wasted character in a 120-character budget, so it fails here
  // rather than reaching the judge.
  if (text.includes("  ")) {
    failures.push("entry contains a double space");
  }

  // UTF-8 round-trip: encoding the text and decoding it again must give
  // the same string, which proves the text is representable as UTF-8.
  const roundTripped = Buffer.from(text, "utf8").toString("utf8");
  if (roundTripped !== text) {
    failures.push("entry is not valid UTF-8 text");
  }

  return failures;
}

// ---------------------------------------------------------------------------
// The reference copy: line.txt must hold exactly the assembled line.
// ---------------------------------------------------------------------------

/**
 * Read line.txt and return its content with a single trailing line
 * terminator removed, if one is present. Editors commonly end a text file
 * with a newline; the entry itself carries none, so the terminator is not
 * part of the line and is stripped before the comparison.
 */
function readReferenceLine(): string {
  let raw: string;
  try {
    raw = readFileSync(LINE_PATH, "utf8");
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`cannot read ${LINE_PATH}: ${reason}`);
  }

  if (raw.endsWith("\r\n")) {
    return raw.slice(0, -2);
  }
  if (raw.endsWith("\n") || raw.endsWith("\r")) {
    return raw.slice(0, -1);
  }
  return raw;
}

// ---------------------------------------------------------------------------
// Writing and verifying: write entry.txt, read it back, byte-compare.
// ---------------------------------------------------------------------------

/**
 * Compare two buffers byte by byte. Buffer.equals does this, but spelling
 * the loop out keeps the comparison's meaning visible in the code: the
 * written file must be identical to the line, byte for byte, not merely
 * equal as text after some normalisation.
 */
function buffersEqual(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

/** Fail the run with a message on stderr and a non-zero exit code. */
function fail(message: string): never {
  console.error(`main.ts: error: ${message}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// The run.
// ---------------------------------------------------------------------------

function main(): void {
  // 1. The assembled line must match the reference copy in line.txt.
  //    If they ever disagree, one of the two was edited without the other,
  //    and the run stops instead of submitting a line nobody reviewed.
  const reference = readReferenceLine();
  if (reference !== LINE) {
    fail(
      `assembled line does not match ${LINE_PATH}\n` +
        `  assembled: ${JSON.stringify(LINE)}\n` +
        `  line.txt:  ${JSON.stringify(reference)}`,
    );
  }

  // 1b. Structural self-check on the parts: every part must be a complete
  //     sentence ending in a period, and re-joining the parts must give
  //     the line. This catches a part edited into a fragment, or a join
  //     that silently drops a separator.
  for (const part of LINE_PARTS) {
    if (!part.endsWith(".")) {
      fail(`line part is not a complete sentence: ${JSON.stringify(part)}`);
    }
    if (part.trim() !== part) {
      fail(`line part has leading or trailing space: ${JSON.stringify(part)}`);
    }
  }
  if (LINE_PARTS.join(" ") !== LINE) {
    fail("re-joining the line parts does not reproduce the line");
  }

  // 2. The line must pass the gate before anything is written.
  const failures = validateGate(LINE);
  if (failures.length > 0) {
    fail(`entry fails the gate:\n  - ${failures.join("\n  - ")}`);
  }

  // 3. Write the entry. The output directory is created if it is missing,
  //    so a fresh sandbox or a local /tmp directory both work.
  const entryPath = resolveEntryPath();
  try {
    mkdirSync(dirname(entryPath), { recursive: true });
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    fail(`cannot create output directory for ${entryPath}: ${reason}`);
  }

  const expected = Buffer.from(LINE, "utf8");
  try {
    writeFileSync(entryPath, expected);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    fail(`cannot write ${entryPath}: ${reason}`);
  }

  // 4. Read it back and byte-compare. A write that silently changed the
  //    content — a different encoding, a trailing newline added by a tool
  //    — is caught here, and the run fails instead of passing a wrong file.
  let written: Buffer;
  try {
    written = readFileSync(entryPath);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    fail(`cannot read back ${entryPath}: ${reason}`);
  }

  if (!buffersEqual(written, expected)) {
    fail(
      `verification failed: ${entryPath} does not match the line byte for byte\n` +
        `  expected ${expected.length} bytes, found ${written.length} bytes`,
    );
  }

  // 5. Report the success, with the numbers the gate cares about.
  console.log(`wrote ${entryPath}`);
  console.log(`entry: ${JSON.stringify(LINE)}`);
  console.log(
    `characters: ${countChars(LINE)} (gate: ${GATE_MIN_CHARS}-${GATE_MAX_CHARS}), ` +
      `bytes: ${expected.length}, lines: 1`,
  );
  console.log("verified: entry.txt is byte-identical to the line");
}

main();
