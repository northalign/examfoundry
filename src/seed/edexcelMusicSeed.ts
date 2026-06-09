import importedLocalDataPack from "../../seed-data/edexcel-a-level-music-imported-9mu0-03.json";
import rawSeedData from "../../seed-data/edexcel-a-level-music-sample.json";
import { brandProfiles } from "../domain/branding/brandProfiles";
import { edexcelALevelMusicTemplate } from "../domain/exam/template";
import type { DataPack, PaperDraft, PaperSlotKey, QuestionType } from "../domain/exam/types";

const syntheticDataPack = rawSeedData as DataPack;
const importedDataPack = importedLocalDataPack as DataPack;

export const edexcelMusicDataPack: DataPack = mergeDataPacks(syntheticDataPack, importedDataPack);

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

function mergeDataPacks(baseDataPack: DataPack, localDataPack: DataPack): DataPack {
  return {
    ...baseDataPack,
    name: "Edexcel A level Music Seed and Imported Local Registry",
    containsCopyrightedMaterial:
      baseDataPack.containsCopyrightedMaterial || localDataPack.containsCopyrightedMaterial,
    distributionAllowed: baseDataPack.distributionAllowed && localDataPack.distributionAllowed,
    localOnly: baseDataPack.localOnly || localDataPack.localOnly,
    notes:
      "Synthetic development data is bundled, and local imported 9MU0/03 metadata is available. Protected imported assets remain in local-assets/.",
    examBoards: mergeById(baseDataPack.examBoards, localDataPack.examBoards),
    qualifications: mergeById(baseDataPack.qualifications, localDataPack.qualifications),
    subjects: mergeById(baseDataPack.subjects, localDataPack.subjects),
    specifications: mergeById(baseDataPack.specifications, localDataPack.specifications),
    areasOfStudy: mergeById(baseDataPack.areasOfStudy, localDataPack.areasOfStudy),
    setWorks: mergeById(baseDataPack.setWorks, localDataPack.setWorks),
    assets: mergeById(baseDataPack.assets, localDataPack.assets),
    questions: mergeById(baseDataPack.questions, localDataPack.questions),
    importedPapers: mergeById(baseDataPack.importedPapers ?? [], localDataPack.importedPapers ?? []),
  };
}

function mergeById<TItem extends { id: string }>(firstItems: TItem[], secondItems: TItem[]): TItem[] {
  const itemById = new Map<string, TItem>();

  for (const item of [...firstItems, ...secondItems]) {
    itemById.set(item.id, item);
  }

  return [...itemById.values()];
}
