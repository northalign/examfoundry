# Exam Foundry

Exam Foundry is a desktop app for assembling valid exam papers from a structured question bank.

Version 0.9 is an internal Stonyhurst College build focused on Edexcel A level Music. It is deliberately narrow, but the architecture must allow future expansion to GCSE, other boards, other subjects, data packs, audio processing, and neutral or custom branding.

## What v0.9 does

- Lets a user assemble an Edexcel A level Music paper.
- Provides six question groups matching the intended paper architecture.
- Validates the paper as questions are selected.
- Prepares the sub-question editing workflow for Questions 1 to 3.
- Shows a persistent Paper Health panel.
- Supports Stonyhurst and neutral branding modes.
- Uses synthetic seed data for development.

## What v0.9 does not do

- It does not generate AI questions.
- It does not stitch audio.
- It does not distribute copyrighted exam content.
- It does not support GCSE or other exam boards.
- It does not require cloud sync.

## Core documents

Read these before building:

- `AGENTS.md`
- `docs/PRODUCT_BRIEF_0.9.md`
- `docs/UI_SPEC_0.9.md`
- `docs/DATA_MODEL_0.9.md`
- `docs/QUESTION_ARCHITECTURE_EDEXCEL_A_LEVEL.md`
- `docs/AUDIO_AND_COPYRIGHT_STRATEGY.md`
- `docs/CODEX_TASKS_0.9.md`

## Figma reference

The current Figma Make concept is recorded in `docs/UI_SPEC_0.9.md`.

## Seed data

Synthetic seed data lives in:

```text
seed-data/edexcel-a-level-music-sample.json
```

This data is for development only and must not be confused with real exam-board material.

## Current implementation

This initial app shell includes:

- Tauri 2, React, TypeScript, and Vite project setup.
- Strict TypeScript, ESLint, and Vitest.
- A desktop-style shell with sidebar, top bar, branding selector, and placeholder routes.
- Core domain types for brands, exam metadata, questions, assets, paper templates, drafts, validation, and data packs.
- A synthetic seed data loader.
- A first Paper Builder screen wired to the Edexcel A level Music validation engine.
- Unit tests for the protected validation rules.

Not yet implemented:

- PDF export.
- Sub-question editing modal.
- Local persistence beyond in-memory state.
- Real data-pack import/export.
- AI-assisted question writing.

## Run locally

Install dependencies:

```bash
npm install
```

Run the browser development shell:

```bash
npm run dev
```

Run checks:

```bash
npm run lint
npm run format:check
npm test
npm run build
```

Run the Tauri desktop shell:

```bash
npm run tauri:dev
```
