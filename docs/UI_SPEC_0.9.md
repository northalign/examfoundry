# UI Specification 0.9

## Figma Make reference

Figma Make link:

https://www.figma.com/make/sCIDBKqZgj472NGRqy4fBm/Review-Attached-Text?t=W7L2tGNOuhTu2jZE-1

Use this as visual inspiration, not as a binding implementation contract.

## Design principle

Exam Foundry should feel like a calm academic workbench for constructing exam papers.

It should be more elegant than a utilitarian admin tool, but still practical and efficient.

## Target canvas

Desktop app, designed first for 1440 by 960.

The app should be comfortable at common laptop and desktop widths. It should not require a web-first responsive layout in v0.9, though components should not be intentionally fixed in a way that blocks future responsiveness.

## Overall shell

The shell has:

- Left navigation sidebar
- Top app bar
- Main content area
- Optional right-hand inspector panel

## Left navigation

Items:

1. Paper Builder
2. Question Bank
3. Question Editor
4. Question Writer
5. Audio Library
6. Data Packs
7. Settings

Sidebar footer:

- Stonyhurst Internal Build
- v0.9

The sidebar should work in neutral branding mode too. In neutral mode, the footer can read:

- Internal Build
- v0.9

## Top app bar

Contents:

- App name: Exam Foundry
- Current project name: Edexcel A level Music Paper
- Brand mode selector: Stonyhurst, Neutral, Custom
- Save Draft button
- Preview Paper button
- Export PDF button

For v0.9, Export PDF may be visible but disabled until export is implemented. If disabled, it should explain why.

## Visual style

Use:

- Warm off-white background
- Deep navy text and sidebar
- Muted burgundy accent
- Subtle gold accent
- Warm grey dividers
- Clean card surfaces
- Refined badges
- Light shadows
- Generous spacing

Avoid:

- Generic bright blue dashboard styling
- Over-dense tables
- Loud red warnings
- Heavy skeuomorphic paper textures
- Decorative clutter

## Paper Builder screen

The Paper Builder is the default screen.

It contains:

1. Configuration panel
2. Paper structure builder
3. Paper Health inspector

### Configuration panel

Fields:

- Exam Board: Edexcel, locked dropdown in v0.9
- Qualification: A level, locked dropdown in v0.9
- Subject: Music
- Specification: 9MU0/03
- Build status: Valid paper or Needs attention

Small note:

> v0.9 supports Edexcel A level Music only. Other boards and GCSE will be enabled in future versions.

### Paper structure builder

Show six question groups.

Each group should look like a polished card row. It should have a clear title, type, selected question, marks, asset indicators, and edit actions.

#### Question 1

Type:

- Set work short-answer listening

Fields:

- Area of Study badge
- Selected question dropdown
- Marks badge
- Audio file indicator
- Score included indicator
- Edit sub-questions button

#### Question 2

Same pattern as Question 1.

#### Question 3

Same pattern as Question 1.

#### Questions 1 to 3 validation

Display a visible validation block after Question 3.

Rules shown:

- Questions 1 to 3 must total 42 marks.
- Questions 1 to 3 must use three different Areas of Study.

Example status:

- Current total: 39 / 42
- Invalid: add 3 marks or edit sub-questions
- Areas of Study: valid

Use calm warning styling. Use red only for export-blocking errors.

#### Question 4

Type:

- Dictation

Fields:

- Selected dictation question dropdown
- Fixed marks badge: 8
- Audio file indicator

Note:

> All dictation questions are 8 marks.

#### Question 5

Type:

- Unfamiliar listening essay

Fields:

- Selected question dropdown
- Fixed marks badge: 20
- Audio file indicator
- Score indicator where applicable

No special validation beyond selection.

#### Question 6

Type:

- Set work essay options

Show four option slots:

- A
- B
- C
- D

Each option has:

- Selected essay question dropdown
- Set work badge
- Area of Study badge
- Fixed marks badge: 30

Validation:

- Four options must be selected.
- Question 6 options must not duplicate the same set work.
- The app should warn if the design later requires Area of Study constraints.

Example valid message:

> 4 options selected. No duplicated set works.

## Paper Health inspector

This right-hand panel should remain visible during paper building.

Sections:

- Overall status
- Marks check
- Area of Study check
- Required questions
- Audio readiness
- Score readiness
- Copyright and data-pack status
- Export readiness

Example invalid state:

- Overall: Needs attention
- Questions 1 to 3 total: 39 / 42
- Areas of Study: valid
- Question 4: valid
- Question 5: valid
- Question 6 options: valid
- Audio: 6 of 6 files linked
- Scores: 4 included
- Export: blocked until marks total is fixed

Example valid state:

- Overall: Valid paper
- Questions 1 to 3 total: 42 / 42
- Areas of Study: valid
- Required slots: complete
- Audio: all required audio linked
- Export: ready

## Edit sub-questions modal or slide-over

Triggered from Questions 1, 2, or 3.

Title example:

> Edit sub-questions for Question 2

Contents:

- Parent question summary
- List of sub-questions
- Mark value for each sub-question
- Add sub-question button
- Remove sub-question action
- Running total for this question
- Overall Q1 to Q3 total
- Warning if the overall total is not 42

Buttons:

- Cancel
- Save Changes

The modal should make it clear that editing sub-questions may affect the whole paper's validity.

## Question Bank screen

Purpose:

Browse existing questions.

Layout:

- Search field
- Filters
- Question list
- Summary badges

Filters:

- Board
- Qualification
- Subject
- Specification
- Area of Study
- Set Work
- Question Type
- Marks
- Audio included
- Score included
- Copyright status

## Question Editor screen

Purpose:

Edit an existing question or create a manual question.

Layout:

- Question list on the left
- Editing form on the right

Fields:

- Question title
- Question type
- Board
- Qualification
- Subject
- Specification
- Area of Study
- Set work
- Marks
- Sub-questions
- Audio file link
- Score attachment
- Source notes
- Copyright notes
- Internal notes

Buttons:

- Save Question
- Duplicate
- Archive

## Question Writer screen

Purpose in v0.9:

Placeholder only.

Header:

> Question Writer

Empty-state message:

> AI-assisted question writing will be introduced in a later version.

Future feature cards:

- Suggest command words
- Generate question stems
- Compare against previous exam questions
- Draft mark schemes
- Create alternative sub-questions

Disabled button:

> Generate ideas

Small note:

> Disabled in v0.9.

Do not wire this to any AI API in v0.9.

## Audio Library screen

Purpose:

Manage linked audio assets.

v0.9 behaviour:

- Show audio files linked to questions.
- Show missing files.
- Show file metadata.
- Do not stitch audio.
- Do not edit audio.

Future v1.0 note:

> GCSE audio stitching will be introduced in a later version.

## Data Packs screen

Purpose in v0.9:

Mostly placeholder, but the architecture should be visible.

Show:

- Installed data packs
- Internal seed data
- Import data pack, disabled in v0.9
- Export data pack, disabled in v0.9
- Copyright warning

Future note:

> Data-pack import and export are planned for v1.2 to v1.3.

## Settings and Branding screen

Fields:

- Brand mode: Stonyhurst, Neutral, Custom
- Crest or logo placeholder
- Accent colour selector
- Document header options
- Document footer options
- Internal build warning toggle
- Data storage location
- Copyright asset folder location

Stonyhurst mode should feel branded, but not visually heavy.
