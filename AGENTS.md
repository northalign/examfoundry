# AGENTS.md

## Project

Exam Foundry is a desktop exam-paper assembly tool. Version 0.9 is an internal Stonyhurst College build focused only on Edexcel A level Music. It must be architected so that the same app can later run in a neutral brand mode or be rebranded for other schools.

## Core implementation target

Build the project as a Windows-ready desktop app suitable for later Microsoft Store distribution.

Preferred stack unless the user changes direction:

- Tauri 2
- React
- TypeScript
- Vite
- Local-first persistence
- SQLite or a simple file-backed store during early development
- Strongly typed domain logic
- Export to PDF as a later milestone
- No OpenAI API integration in v0.9

Do not assume a cloud backend is required for v0.9.

## Product scope for v0.9

In scope:

- Edexcel only
- A level only
- Music only
- Paper Builder screen
- Question Bank screen
- Question Editor screen
- Question Writer placeholder screen
- Audio Library screen
- Branding and settings screen
- Local seed data loading
- Validation for Edexcel A level Music paper architecture
- Stonyhurst internal branding mode
- Neutral branding mode
- Data model that can support future data packs

Out of scope for v0.9:

- GCSE
- Other exam boards
- Audio stitching
- AI-generated question writing
- Distribution of copyrighted exam papers, scores, or audio in any public build
- Authentication
- Cloud sync
- Multi-user collaboration

## Visual design rules

The UI must feel elegant, academic, calm, and editorial. It must not feel like a raw database or a generic admin dashboard.

Use:

- Warm off-white backgrounds
- Deep navy
- Muted burgundy
- Warm grey
- Subtle gold accents
- Rounded cards
- Fine divider lines
- Calm validation states
- Clear paper-health feedback

Avoid:

- Neon colours
- Overly bright SaaS styling
- Cartoon icons
- Dense tables without visual hierarchy
- Aggressive red warnings except for hard blockers
- Stonyhurst over-branding

Reference the Figma Make concept here: https://www.figma.com/make/sCIDBKqZgj472NGRqy4fBm/Review-Attached-Text?t=W7L2tGNOuhTu2jZE-1

## Domain rules that must be protected by tests

For Edexcel A level Music v0.9:

- The paper has six question groups.
- Questions 1, 2, and 3 are set-work short-answer listening questions.
- Questions 1, 2, and 3 must come from three different Areas of Study.
- The total marks for Questions 1, 2, and 3 must equal 42.
- Questions 1, 2, and 3 may be edited at sub-question level to change marks.
- Question 4 is dictation and is always 8 marks.
- Question 5 is an unfamiliar listening essay and is always 20 marks.
- Question 6 contains four essay options, labelled A to D.
- Each Question 6 option is always 30 marks.
- Question 6 options must not duplicate the same set work.
- The export must be blocked if any required slot is empty.
- The export must be blocked if Questions 1 to 3 do not total 42.
- The export must be blocked if Questions 1 to 3 duplicate an Area of Study.
- The app should display reasons for invalidity in a Paper Health panel.

## Copyright and data-handling instructions

Do not hard-code copyrighted exam text, scores, or audio into source files.

Use synthetic examples in seed data unless the user explicitly provides rights-cleared content.

Treat protected content as local data-pack content:

- Imported by the user
- Stored locally
- Excluded from public builds
- Excluded from Git
- Represented in code by metadata, filenames, checksums, and asset references

Add `.gitignore` entries for local copyrighted asset folders.

## Code style

- Use TypeScript strict mode.
- Prefer clear domain types over loose objects.
- Keep validation logic pure and testable.
- Keep UI components separated from exam-rule logic.
- Use small components with readable names.
- Avoid premature abstraction.
- Avoid single huge files.
- Write tests for validation before adding export behaviour.

## Suggested folder structure

```text
src/
  app/
  components/
  domain/
    exam/
    validation/
    branding/
    data-packs/
  features/
    paper-builder/
    question-bank/
    question-editor/
    question-writer/
    audio-library/
    settings/
  seed/
  styles/
  tests/
docs/
seed-data/
```

## Work approach for Codex

When asked to implement:

1. Read this file first.
2. Read the relevant docs in `/docs`.
3. Make the smallest coherent implementation.
4. Add or update tests for validation logic.
5. Do not introduce real exam-board copyrighted content.
6. Do not add AI API calls in v0.9.
7. Summarise changes and list any remaining decisions.
