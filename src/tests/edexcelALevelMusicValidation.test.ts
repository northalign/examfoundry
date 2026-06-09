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
    const missingSlotError = result.blockingErrors.find((error) => error.id === "missing_q4");
    expect(missingSlotError?.label).toBe("Question 4 is empty");
    expect(missingSlotError?.detail).toBe("Select a question before preview or export.");
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
    const totalError = result.blockingErrors.find((error) => error.id === "q1_to_q3_total");
    expect(totalError?.label).toBe("Questions 1 to 3 total 41 / 42");
    expect(totalError?.detail).toBe("Add 1 mark or edit sub-questions.");
    expect(result.exportReadiness.reasons).toContain("Questions 1 to 3 total 41 / 42");
  });

  it("uses draft-only sub-question edits to recalculate Questions 1 to 3", () => {
    const draft = createInitialPaperDraft();
    const originalQuestion = edexcelMusicDataPack.questions.find(
      (question) => question.id === "q2_synthetic_vocal_13",
    );

    if (!originalQuestion) {
      throw new Error("Expected synthetic Q2 seed question");
    }

    draft.modifiedSubQuestionsByQuestionId.q2_synthetic_vocal_13 = originalQuestion.subQuestions.map(
      (subQuestion) => (subQuestion.id === "q2c" ? { ...subQuestion, marks: 5 } : subQuestion),
    );

    const invalidResult = validate(draft);
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.marksSummary.q1ToQ3Total).toBe(41);

    const firstSubQuestion = originalQuestion.subQuestions[0];
    const secondSubQuestion = originalQuestion.subQuestions[1];

    if (!firstSubQuestion || !secondSubQuestion) {
      throw new Error("Expected synthetic Q2 to have at least two sub-questions");
    }

    draft.modifiedSubQuestionsByQuestionId.q2_synthetic_vocal_13 = [
      firstSubQuestion,
      secondSubQuestion,
      {
        id: "q2_draft_added",
        parentQuestionId: originalQuestion.id,
        label: "c",
        prompt: "Synthetic prompt placeholder.",
        marks: 6,
        displayOrder: 3,
        enabled: true,
      },
    ];

    const validResult = validate(draft);
    expect(validResult.isValid).toBe(true);
    expect(validResult.marksSummary.q1ToQ3Total).toBe(42);
    expect(originalQuestion.subQuestions).toHaveLength(3);
    expect(originalQuestion.subQuestions.find((subQuestion) => subQuestion.id === "q2c")?.marks).toBe(6);
  });

  it("blocks export when Questions 1 to 3 duplicate an Area of Study", () => {
    const draft = createInitialPaperDraft();
    draft.selectedQuestionIdsBySlot.q3 = "q2_synthetic_vocal_13";

    const result = validate(draft);

    expect(result.isValid).toBe(false);
    const areaError = result.blockingErrors.find((error) => error.id === "q1_to_q3_areas");
    expect(areaError?.label).toBe("Questions 1 to 3 must use three different Areas of Study");
  });

  it("blocks export when Question 4 is not fixed at 8 marks", () => {
    const draft = createInitialPaperDraft();
    const questions = edexcelMusicDataPack.questions.map((question) =>
      question.id === "q4_synthetic_dictation_8" ? { ...question, marks: 7 } : question,
    );

    const result = validate(draft, questions);

    expect(result.isValid).toBe(false);
    const q4Error = result.blockingErrors.find((error) => error.id === "q4_fixed_marks");
    expect(q4Error?.label).toBe("Question 4 must be 8 marks");
    expect(q4Error?.detail).toBe("All dictation questions are fixed at 8 marks in v0.9.");
  });

  it("blocks export when Question 5 is not fixed at 20 marks", () => {
    const draft = createInitialPaperDraft();
    const questions = edexcelMusicDataPack.questions.map((question) =>
      question.id === "q5_synthetic_unfamiliar_20" ? { ...question, marks: 19 } : question,
    );

    const result = validate(draft, questions);

    expect(result.isValid).toBe(false);
    const q5Error = result.blockingErrors.find((error) => error.id === "q5_fixed_marks");
    expect(q5Error?.label).toBe("Question 5 must be 20 marks");
    expect(q5Error?.detail).toBe("Unfamiliar listening essay questions are fixed at 20 marks in v0.9.");
  });

  it("blocks export when Question 6 options are incomplete", () => {
    const draft = createInitialPaperDraft();
    delete draft.selectedQuestionIdsBySlot.q6d;

    const result = validate(draft);

    expect(result.isValid).toBe(false);
    expect(result.blockingErrors.map((error) => error.id)).toContain("missing_q6d");
    const q6CompleteError = result.blockingErrors.find((error) => error.id === "q6_options_complete");
    expect(q6CompleteError?.label).toBe("Question 6 needs four essay options");
    expect(q6CompleteError?.detail).toBe("Select options A, B, C, and D.");
  });

  it("blocks export when Question 6 options duplicate a set work", () => {
    const draft = createInitialPaperDraft();
    draft.selectedQuestionIdsBySlot.q6d = "q6a_synthetic_vocal_30";

    const result = validate(draft);

    expect(result.isValid).toBe(false);
    expect(result.setWorkSummary.duplicateQ6SetWorkIds).toContain("sw_vocal_placeholder");
    const duplicateSetWorkError = result.blockingErrors.find((error) => error.id === "q6_duplicate_set_work");
    expect(duplicateSetWorkError?.label).toBe("Duplicate set work in Question 6 options");
    expect(duplicateSetWorkError?.detail).toBe("Choose four essay options based on different set works.");
  });
});
