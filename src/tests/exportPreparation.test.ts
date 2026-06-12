import { describe, expect, it } from "vitest";
import { edexcelALevelMusicTemplate } from "../domain/exam/template";
import type { PaperDraft } from "../domain/exam/types";
import { createExportPreparationState } from "../domain/export/exportService";
import { validateEdexcelALevelMusicPaper } from "../domain/validation/edexcelALevelMusic";
import { createInitialPaperDraft, edexcelMusicDataPack } from "../seed/edexcelMusicSeed";

const validate = (draft: PaperDraft) =>
  validateEdexcelALevelMusicPaper({
    draft,
    template: edexcelALevelMusicTemplate,
    questions: edexcelMusicDataPack.questions,
    assets: edexcelMusicDataPack.assets,
  });

describe("export preparation", () => {
  it("marks a valid paper as ready for the future PDF export service", () => {
    const state = createExportPreparationState(validate(createInitialPaperDraft()));

    expect(state.canPreview).toBe(true);
    expect(state.canExport).toBe(true);
    expect(state.statusLabel).toBe("Ready");
    expect(state.blockingReasons).toEqual([]);
    expect(state.implementationStatus).toBe("planned");
  });

  it("surfaces human-readable reasons when export is blocked", () => {
    const draft = createInitialPaperDraft();
    delete draft.selectedQuestionIdsBySlot.q4;

    const state = createExportPreparationState(validate(draft));

    expect(state.canPreview).toBe(true);
    expect(state.canExport).toBe(false);
    expect(state.statusLabel).toBe("Blocked");
    expect(state.primaryReason).toBe("Question 4 is empty");
    expect(state.blockingReasons).toContain("Question 4 is empty");
  });
});
