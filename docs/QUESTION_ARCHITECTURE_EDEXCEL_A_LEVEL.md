# Question Architecture: Edexcel A level Music 0.9

## Scope

This document defines the paper structure for Exam Foundry 0.9.

It reflects the intended internal architecture for Edexcel A level Music papers in this app.

## Paper overview

The paper has six question groups:

1. Question 1: Set work short-answer listening
2. Question 2: Set work short-answer listening
3. Question 3: Set work short-answer listening
4. Question 4: Dictation
5. Question 5: Unfamiliar listening essay
6. Question 6: Set work essay options

## Questions 1 to 3

Type:

- Set work short-answer listening

Rules:

- Each of Questions 1, 2, and 3 must be selected.
- The three questions must come from different Areas of Study.
- The total marks across Questions 1, 2, and 3 must equal 42.
- Individual questions can have different mark totals.
- The user may edit, add, or remove sub-questions in order to reach a valid 42-mark total.
- The app must show the current total and whether it is valid.
- The app must show whether the Areas of Study are valid.

Validation examples:

Valid:

- Q1: 14 marks, Area of Study A
- Q2: 13 marks, Area of Study B
- Q3: 15 marks, Area of Study C
- Total: 42
- Areas of Study: three different areas

Invalid, wrong total:

- Q1: 14
- Q2: 12
- Q3: 15
- Total: 41

Invalid, duplicated Area of Study:

- Q1: Vocal Music
- Q2: Vocal Music
- Q3: Instrumental Music

## Question 4

Type:

- Dictation

Rules:

- One dictation question must be selected.
- Question 4 is always 8 marks.
- All dictation questions are treated as equivalent in mark length for v0.9.
- Audio must be linked for readiness, but export may initially be blocked only if the implementation requires audio.

## Question 5

Type:

- Unfamiliar listening essay

Rules:

- One Question 5 item must be selected.
- Question 5 is always 20 marks.
- There is no special selection constraint in v0.9 beyond having a selected question.
- Audio should be linked where required.
- Score indicators should be shown where relevant.

## Question 6

Type:

- Set work essay options

Rules:

- There are four option slots, labelled A, B, C, and D.
- Each option must contain one essay question.
- Each option is worth 30 marks.
- The four options must not duplicate the same set work.
- The app should display the set work and Area of Study for each option.
- Export should be blocked if any option is empty.
- Export should be blocked if two options use the same set work.

## Total marks

A complete paper is expected to total 100 marks when one Question 6 option is answered by the candidate:

- Questions 1 to 3: 42
- Question 4: 8
- Question 5: 20
- Question 6: 30

The builder displays all four Question 6 options, but the candidate answers one.

## Validation outputs

The validation engine should return:

- isValid
- blocking errors
- warnings
- info messages
- marks summary
- Area of Study summary
- set work summary
- asset summary

## Blocking errors

Block export if:

- Any required question slot is empty.
- Questions 1 to 3 do not total 42 marks.
- Questions 1 to 3 do not use three different Areas of Study.
- Any Question 6 option is empty.
- Any Question 6 option duplicates a set work.
- A required audio asset is missing, if the chosen export mode requires audio.

## Warnings

Warnings should not always block export.

Examples:

- Score missing for a question where a score would normally be useful.
- Copyright status is unknown.
- Asset file exists in metadata but cannot be found locally.
- Question has internal notes marked unresolved.
- Question was manually edited after import.

## UI language

Use concise, teacher-friendly validation language.

Examples:

- Valid paper
- Needs attention
- Questions 1 to 3 total 39 / 42
- Add 3 marks or edit sub-questions
- Areas of Study valid
- Duplicate set work in Question 6 options
- Export blocked until required selections are complete
