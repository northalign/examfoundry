import { describe, expect, it } from "vitest";
import {
  archiveQuestionInDataPack,
  duplicateQuestionInDataPack,
  saveQuestionToDataPack,
} from "../domain/data-packs/questionMutations";
import { edexcelMusicDataPack } from "../seed/edexcelMusicSeed";

describe("question data-pack mutations", () => {
  it("saves edits to an existing synthetic question", () => {
    const sourceQuestion = edexcelMusicDataPack.questions[0];

    if (!sourceQuestion) {
      throw new Error("Expected seed data to include a question");
    }

    const updatedDataPack = saveQuestionToDataPack(edexcelMusicDataPack, {
      ...sourceQuestion,
      title: "Synthetic edited title",
      internalNotes: "Edited locally in Question Editor.",
    });

    const savedQuestion = updatedDataPack.questions.find((question) => question.id === sourceQuestion.id);

    expect(savedQuestion?.title).toBe("Synthetic edited title");
    expect(savedQuestion?.internalNotes).toBe("Edited locally in Question Editor.");
    expect(edexcelMusicDataPack.questions.find((question) => question.id === sourceQuestion.id)?.title).toBe(
      sourceQuestion.title,
    );
  });

  it("duplicates a question without altering the original", () => {
    const sourceQuestion = edexcelMusicDataPack.questions.find(
      (question) => question.subQuestions.length > 0,
    );

    if (!sourceQuestion) {
      throw new Error("Expected seed data to include a question with sub-questions");
    }

    const duplicateQuestionId = `${sourceQuestion.id}_copy_test`;
    const updatedDataPack = duplicateQuestionInDataPack(
      edexcelMusicDataPack,
      sourceQuestion.id,
      duplicateQuestionId,
    );
    const originalQuestion = updatedDataPack.questions.find((question) => question.id === sourceQuestion.id);
    const duplicateQuestion = updatedDataPack.questions.find(
      (question) => question.id === duplicateQuestionId,
    );

    expect(updatedDataPack.questions).toHaveLength(edexcelMusicDataPack.questions.length + 1);
    expect(originalQuestion?.title).toBe(sourceQuestion.title);
    expect(duplicateQuestion?.title).toBe(`${sourceQuestion.title} (copy)`);
    expect(duplicateQuestion?.sourceLabel).toBe("Synthetic copy");
    expect(duplicateQuestion?.archived).toBe(false);
    expect(duplicateQuestion?.subQuestions).toHaveLength(sourceQuestion.subQuestions.length);
    expect(
      duplicateQuestion?.subQuestions.every(
        (subQuestion) => subQuestion.parentQuestionId === duplicateQuestionId,
      ),
    ).toBe(true);
  });

  it("archives a question rather than deleting it", () => {
    const sourceQuestion = edexcelMusicDataPack.questions[0];

    if (!sourceQuestion) {
      throw new Error("Expected seed data to include a question");
    }

    const updatedDataPack = archiveQuestionInDataPack(edexcelMusicDataPack, sourceQuestion.id);
    const archivedQuestion = updatedDataPack.questions.find((question) => question.id === sourceQuestion.id);

    expect(updatedDataPack.questions).toHaveLength(edexcelMusicDataPack.questions.length);
    expect(archivedQuestion?.archived).toBe(true);
    expect(
      edexcelMusicDataPack.questions.find((question) => question.id === sourceQuestion.id)?.archived,
    ).toBe(false);
  });
});
