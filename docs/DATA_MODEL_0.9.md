# Data Model 0.9

## Design goals

The data model must support the narrow v0.9 product without painting the app into a corner.

It should allow:

- Edexcel A level Music in v0.9
- Edexcel GCSE Music in v1.0
- Data-pack import and export in v1.2 to v1.3
- Other exam boards in v2.0
- Separate public and internal builds
- Local protected assets without committing copyrighted material

## Core entities

### BrandProfile

Represents app branding.

Fields:

- id
- name
- mode: stonyhurst, neutral, custom
- logoAssetId
- primaryColour
- accentColour
- documentHeaderText
- documentFooterText
- internalBuildLabel
- enabled

### ExamBoard

Fields:

- id
- name
- slug
- enabled

Example:

- edexcel

### Qualification

Fields:

- id
- name
- slug
- enabled

Example:

- a-level
- gcse, future

### Subject

Fields:

- id
- name
- slug
- enabled

Example:

- music

### Specification

Fields:

- id
- examBoardId
- qualificationId
- subjectId
- code
- title
- versionLabel
- enabled

Example:

- 9MU0/03
- Edexcel A level Music, Appraising

### AreaOfStudy

Fields:

- id
- specificationId
- name
- slug
- displayOrder
- enabled

### SetWork

Fields:

- id
- specificationId
- areaOfStudyId
- title
- composerOrArtist
- movementOrExtract
- notes
- enabled

In the public codebase, sample set works should be synthetic unless rights and accuracy have been checked.

### QuestionType

Recommended enum:

- set_work_short_answer_listening
- dictation
- unfamiliar_listening_essay
- set_work_essay_option

### Question

Fields:

- id
- specificationId
- questionType
- title
- areaOfStudyId
- setWorkId
- marks
- defaultQuestionNumber
- sourceLabel
- sourceYear
- sourceSession
- hasAudio
- hasScore
- audioAssetIds
- scoreAssetIds
- subQuestions
- copyrightStatus
- sourceNotes
- internalNotes
- enabled
- archived

### SubQuestion

Fields:

- id
- parentQuestionId
- label
- prompt
- marks
- answerSpaceHint
- displayOrder
- enabled

For v0.9, the prompt can be synthetic or placeholder text if real exam content is not rights-cleared.

### Asset

Represents audio, score, image, or document files.

Fields:

- id
- type: audio, score, image, document
- title
- localPath
- fileName
- mimeType
- durationSeconds
- pageCount
- checksum
- copyrightStatus
- sourceNotes
- dataPackId
- missing

### PaperTemplate

Represents the rules for a paper architecture.

Fields:

- id
- specificationId
- name
- versionLabel
- slots
- validationRules
- enabled

### PaperSlot

Fields:

- id
- paperTemplateId
- slotKey
- displayLabel
- questionNumber
- optionLabel
- acceptedQuestionTypes
- fixedMarks
- required
- displayOrder

Examples:

- q1
- q2
- q3
- q4
- q5
- q6a
- q6b
- q6c
- q6d

### PaperDraft

Fields:

- id
- title
- specificationId
- paperTemplateId
- brandProfileId
- selectedQuestionIdsBySlot
- modifiedSubQuestionsByQuestionId
- createdAt
- updatedAt
- validationState
- notes

### ValidationState

Fields:

- isValid
- blockingErrors
- warnings
- infoMessages
- marksSummary
- areaOfStudySummary
- assetSummary
- exportReadiness

### DataPack

Fields:

- id
- name
- version
- publisher
- description
- specificationIds
- containsCopyrightedMaterial
- localOnly
- createdAt
- importedAt
- manifestVersion
- checksum

## Suggested TypeScript types

```ts
type QuestionType =
  | "set_work_short_answer_listening"
  | "dictation"
  | "unfamiliar_listening_essay"
  | "set_work_essay_option";

type BrandMode = "stonyhurst" | "neutral" | "custom";

type AssetType = "audio" | "score" | "image" | "document";

type CopyrightStatus =
  | "synthetic"
  | "user_provided"
  | "licensed_internal"
  | "public_domain"
  | "unknown"
  | "not_for_distribution";
```

## Data-pack strategy

Data packs should eventually contain:

- manifest
- boards
- qualifications
- subjects
- specifications
- Areas of Study
- set works
- questions
- sub-questions
- asset metadata
- optional local asset bundle

Data packs should not be required for v0.9, but the data model should not block them.

## Versioning

Use semantic version fields for data packs.

Example:

```json
{
  "manifestVersion": "0.1",
  "dataPackVersion": "0.9.0",
  "targetAppVersion": ">=0.9.0"
}
```

## Validation should not live only in UI

The validation engine should accept a `PaperDraft`, a `PaperTemplate`, and relevant `Question` records, then return a `ValidationState`.

This makes validation testable and reusable for export, previews, and future CLI tasks.
