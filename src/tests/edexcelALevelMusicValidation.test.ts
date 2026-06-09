import { describe, expect, it } from "vitest";
import { edexcelALevelMusicTemplate } from "../domain/exam/template";
import type { PaperDraft, Question } from "../domain/exam/types";
import { validateEdexcelALevelMusicPaper } from "../domain/validation/edexcelALevelMusic";
import { createInitialPaperDraft, edexcelMusicDataPack } from "../seed/edexcelMusicSeed";

const validate = (draft: PaperDraft, questions: Question[] = edexcelMusicDataPack.questions) =>
  validateEdexcelALevelMusicPaper({
    draft,
    template: edexcelALevelMusicTemplate,
    questions,
    assets: edexcelMusicDataPack.assets,
  });

describe("Edexcel A level Music validation", () => {
  it("accepts a complete valid paper", () => {
    const result = validate(createInitialPaperDraft());

    expect(result.isValid).toBe(true);
    expect(result.blockingErrors).toEqual([]);
    expect(result.marksSummary.q1ToQ3Total).toBe(42);
    expect(result.areaOfStudySummary.isValid).toBe(true);
    expect(result.setWorkSummary.isValid).toBe(true);
  });

  it("blocks export when a required slot is empty", () => {
    const draft = createInitialPaperDraft();
    delete draft.selectedQuestionIdsBySlot.q4;

    const result = validate(draft);

    expect(result.isValid).toBe(false);
    expect(result.blockingErrors.map((error) => error.id)).toContain("missing_q4");
  });

  it("blocks export when Questions 1 to 3 do not total 42", () => {
    const draft = createInitialPaperDraft();
    draft.modifiedSubQuestionsByQuestionId.q2_synthetic_vocal_13 = [
      {
        id: "q2a_modified",
        label: "a",
        prompt: "Synthetic prompt placeholder.",
        marks: 4,
        displayOrder: 1,
        enabled: true,
      },
      {
        id: "q2b_modified",
        label: "b",
        prompt: "Synthetic prompt placeholder.",
        marks: 4,
        displayOrder: 2,
        enabled: true,
      },
      {
        id: "q2c_modified",
        label: "c",
        prompt: "Synthetic prompt placeholder.",
        marks: 4,
        displayOrder: 3,
        enabled: true,
      },
    ];

    const result = validate(draft);

    expect(result.isValid).toBe(false);
    expect(result.marksSummary.q1ToQ3Total).toBe(41);
    expect(result.blockingErrors.map((error) => error.id)).toContain("q1_to_q3_total");
  });

  it("blocks export when Questions 1 to 3 duplicate an Area of Study", () => {
    const draft = createInitialPaperDraft();
    draft.selectedQuestionIdsBySlot.q3 = "q2_synthetic_vocal_13";

    const result = validate(draft);

    expect(result.isValid).toBe(false);
    expect(result.blockingErrors.map((error) => error.id)).toContain("q1_to_q3_areas");
  });

  it("blocks export when Question 6 options are incomplete", () => {
    const draft = createInitialPaperDraft();
    delete draft.selectedQuestionIdsBySlot.q6d;

    const result = validate(draft);

    expect(result.isValid).toBe(false);
    expect(result.blockingErrors.map((error) => error.id)).toContain("missing_q6d");
    expect(result.blockingErrors.map((error) => error.id)).toContain("q6_options_complete");
  });

  it("blocks export when Question 6 options duplicate a set work", () => {
    const draft = createInitialPaperDraft();
    draft.selectedQuestionIdsBySlot.q6d = "q6a_synthetic_vocal_30";

    const result = validate(draft);

    expect(result.isValid).toBe(false);
    expect(result.setWorkSummary.duplicateQ6SetWorkIds).toContain("sw_vocal_placeholder");
    expect(result.blockingErrors.map((error) => error.id)).toContain("q6_duplicate_set_work");
  });
});
