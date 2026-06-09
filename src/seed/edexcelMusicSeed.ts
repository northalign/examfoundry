import rawSeedData from "../../seed-data/edexcel-a-level-music-sample.json";
import { brandProfiles } from "../domain/branding/brandProfiles";
import { edexcelALevelMusicTemplate } from "../domain/exam/template";
import type { DataPack, PaperDraft, PaperSlotKey, QuestionType } from "../domain/exam/types";

export const edexcelMusicDataPack = rawSeedData as DataPack;

export const questionsByType = (questionType: QuestionType) =>
  edexcelMusicDataPack.questions.filter(
    (question) => question.enabled && !question.archived && question.questionType === questionType,
  );

export const createInitialPaperDraft = (): PaperDraft => {
  const selectedQuestionIdsBySlot: Partial<Record<PaperSlotKey, string>> = {
    q1: "q1_synthetic_instrumental_14",
    q2: "q2_synthetic_vocal_13",
    q3: "q3_synthetic_film_15",
    q4: "q4_synthetic_dictation_8",
    q5: "q5_synthetic_unfamiliar_20",
    q6a: "q6a_synthetic_vocal_30",
    q6b: "q6b_synthetic_instrumental_30",
    q6c: "q6c_synthetic_popular_30",
    q6d: "q6d_synthetic_fusions_30",
  };

  const now = new Date("2026-06-09T00:00:00.000Z").toISOString();

  return {
    id: "draft_internal_stonyhurst_0_9",
    title: "Edexcel A level Music Paper",
    specificationId: edexcelALevelMusicTemplate.specificationId,
    paperTemplateId: edexcelALevelMusicTemplate.id,
    brandProfileId: brandProfiles[0]?.id ?? "brand_stonyhurst_internal",
    selectedQuestionIdsBySlot,
    modifiedSubQuestionsByQuestionId: {},
    createdAt: now,
    updatedAt: now,
  };
};
