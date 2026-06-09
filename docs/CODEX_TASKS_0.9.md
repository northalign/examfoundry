# Codex Tasks 0.9

## Purpose

This document breaks Exam Foundry 0.9 into implementation tasks suitable for Codex.

Codex should not attempt all tasks at once. Work in small coherent passes.

## Phase 1: Repository setup

Goal:

Create the app shell and project structure.

Tasks:

1. Create a Tauri 2, React, TypeScript, Vite project.
2. Enable TypeScript strict mode.
3. Add basic linting and formatting.
4. Add folders for domain, features, components, styles, seed data, and tests.
5. Add `.gitignore` entries for local protected assets.
6. Add a simple app shell with sidebar and top bar.
7. Add placeholder routes for all main screens.

Definition of done:

- App starts locally.
- Sidebar routes work.
- No real exam content is embedded.
- README run instructions are current.

## Phase 2: Domain model

Goal:

Create typed domain structures.

Tasks:

1. Add types for BrandProfile, ExamBoard, Qualification, Subject, Specification, AreaOfStudy, SetWork, Question, SubQuestion, Asset, PaperTemplate, PaperDraft, ValidationState, and DataPack.
2. Add question type enums.
3. Add copyright status enums.
4. Add synthetic seed data loader.
5. Display seed data in a simple debug view or Question Bank.

Definition of done:

- Types compile.
- Seed data loads.
- No UI-specific validation logic is embedded in the data model.

## Phase 3: Validation engine

Goal:

Implement Edexcel A level Music rules.

Tasks:

1. Implement a pure validation function.
2. Validate required slots.
3. Validate Q1 to Q3 total 42.
4. Validate Q1 to Q3 different Areas of Study.
5. Validate Q4 fixed 8 marks.
6. Validate Q5 fixed 20 marks.
7. Validate Q6 four options.
8. Validate no duplicate set works in Q6.
9. Add unit tests for valid and invalid papers.

Definition of done:

- Tests cover valid paper.
- Tests cover wrong Q1 to Q3 total.
- Tests cover duplicated Q1 to Q3 Area of Study.
- Tests cover missing slot.
- Tests cover duplicate Q6 set work.
- Validation returns human-readable messages.

## Phase 4: Paper Builder UI

Goal:

Build the central user workflow.

Tasks:

1. Create the configuration panel.
2. Create question cards for Q1 to Q6.
3. Add dropdown selection for each slot.
4. Show badges for marks, Area of Study, set work, audio, score, and validity.
5. Add the Q1 to Q3 validation panel.
6. Add the Paper Health inspector.
7. Connect UI to validation engine.
8. Disable export when invalid.

Definition of done:

- The user can assemble a paper from seed questions.
- Paper Health updates immediately.
- Invalid state is clear.
- Valid state is clear.
- UI is elegant and calm, not a raw table.

## Phase 5: Sub-question editor

Goal:

Allow Q1 to Q3 mark adjustment.

Tasks:

1. Add Edit sub-questions action for Q1 to Q3.
2. Open a modal or slide-over.
3. List sub-questions.
4. Allow mark editing.
5. Allow adding sub-questions.
6. Allow removing sub-questions.
7. Show question total.
8. Show total for Q1 to Q3.
9. Save modifications into the current PaperDraft only.

Definition of done:

- Editing sub-question marks changes Paper Health.
- The original question bank item is not permanently altered unless explicitly saved in Question Editor.
- The user can reach 42 marks by editing sub-questions.

## Phase 6: Question Bank and Question Editor

Goal:

Provide manageable question data workflows.

Tasks:

1. Add question list.
2. Add search and filters.
3. Add Question Editor form.
4. Allow editing synthetic questions.
5. Allow duplicating a question.
6. Allow archiving a question.
7. Show asset and copyright metadata.

Definition of done:

- Question Bank is browseable.
- Question Editor saves local changes.
- Questions can be archived rather than deleted.

## Phase 7: Question Writer placeholder

Goal:

Add future-facing screen without implementing AI.

Tasks:

1. Add attractive placeholder screen.
2. Show disabled future feature cards.
3. Add disabled Generate ideas button.
4. Add v0.9 note.

Definition of done:

- No OpenAI API code is added.
- User understands that the feature is planned but disabled.

## Phase 8: Audio Library

Goal:

Show audio asset readiness.

Tasks:

1. Display linked audio assets.
2. Display missing assets.
3. Show asset metadata.
4. Add future note about GCSE audio stitching.
5. Do not implement stitching.

Definition of done:

- Paper Health can reflect audio readiness.
- Audio Library is informative even before editing features exist.

## Phase 9: Branding settings

Goal:

Support Stonyhurst and neutral branding.

Tasks:

1. Add brand mode selection.
2. Add Stonyhurst mode.
3. Add neutral mode.
4. Add custom mode placeholder.
5. Ensure app shell responds to brand mode.
6. Keep branding separate from exam logic.

Definition of done:

- Switching between Stonyhurst and neutral changes visible branding.
- No Stonyhurst assumptions exist inside validation logic.

## Phase 10: Export preparation

Goal:

Prepare for export without overbuilding.

Tasks:

1. Add Preview Paper placeholder.
2. Add Export PDF button.
3. Disable Export PDF when invalid.
4. Add clear disabled-state reasons.
5. Add a future export service interface.

Definition of done:

- Export readiness is visible.
- Export is blocked when validation fails.
- Export implementation can be added later without changing validation logic.

## First Codex prompt to use

Use this prompt in Codex after creating the repo:

```text
Build the initial Exam Foundry 0.9 app shell. Follow AGENTS.md and the documents in /docs. Use Tauri 2, React, TypeScript, and Vite unless the existing repo indicates otherwise. Create the sidebar, top bar, placeholder screens, core domain types, synthetic seed data loader, and a first version of the Paper Builder screen. Do not add real copyrighted exam content. Do not add OpenAI API calls. Add tests for the Edexcel A level Music validation rules before wiring export behaviour.
```

## Second Codex prompt to use

```text
Implement the Edexcel A level Music validation engine from docs/QUESTION_ARCHITECTURE_EDEXCEL_A_LEVEL.md. Keep the validation logic pure and testable. Add tests for valid papers, missing slots, wrong Q1 to Q3 totals, duplicate Q1 to Q3 Areas of Study, missing Question 6 options, and duplicated Question 6 set works. Wire validation output into the Paper Health inspector.
```

## Third Codex prompt to use

```text
Implement the sub-question editor for Questions 1 to 3. It should open as a modal or slide-over, allow adding, removing, and changing sub-question mark values, update the current PaperDraft only, and immediately update the Q1 to Q3 total and Paper Health state.
```
