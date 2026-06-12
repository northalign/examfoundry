import { useMemo, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { brandProfiles } from "../domain/branding/brandProfiles";
import {
  archiveQuestionInDataPack,
  duplicateQuestionInDataPack,
  saveQuestionToDataPack,
} from "../domain/data-packs/questionMutations";
import { edexcelALevelMusicTemplate } from "../domain/exam/template";
import type {
  BrandMode,
  DataPack,
  PaperDraft,
  PaperSlotKey,
  Question,
  SubQuestion,
} from "../domain/exam/types";
import { validateEdexcelALevelMusicPaper } from "../domain/validation/edexcelALevelMusic";
import { AudioLibraryScreen } from "../features/audio-library/AudioLibraryScreen";
import { DataPacksScreen } from "../features/data-packs/DataPacksScreen";
import { PaperBuilderScreen } from "../features/paper-builder/PaperBuilderScreen";
import { QuestionBankScreen } from "../features/question-bank/QuestionBankScreen";
import { QuestionEditorScreen } from "../features/question-editor/QuestionEditorScreen";
import { QuestionWriterScreen } from "../features/question-writer/QuestionWriterScreen";
import { SettingsScreen } from "../features/settings/SettingsScreen";
import { createInitialPaperDraft, edexcelMusicDataPack } from "../seed/edexcelMusicSeed";

export type ScreenId =
  | "paper-builder"
  | "question-bank"
  | "question-editor"
  | "question-writer"
  | "audio-library"
  | "data-packs"
  | "settings";

const screenLabels: Record<ScreenId, string> = {
  "paper-builder": "Paper Builder",
  "question-bank": "Question Bank",
  "question-editor": "Question Editor",
  "question-writer": "Question Writer",
  "audio-library": "Audio Library",
  "data-packs": "Data Packs",
  settings: "Settings",
};

export const App = () => {
  const [activeScreen, setActiveScreen] = useState<ScreenId>("paper-builder");
  const [brandMode, setBrandMode] = useState<BrandMode>("stonyhurst");
  const [dataPack, setDataPack] = useState<DataPack>(() => cloneDataPack(edexcelMusicDataPack));
  const [draft, setDraft] = useState<PaperDraft>(() => createInitialPaperDraft());

  const activeBrand = useMemo(() => {
    const fallbackBrand = brandProfiles[0];
    if (!fallbackBrand) {
      throw new Error("Exam Foundry requires at least one brand profile.");
    }

    return (
      brandProfiles.find((brandProfile) => brandProfile.mode === brandMode && brandProfile.enabled) ??
      fallbackBrand
    );
  }, [brandMode]);

  const validationState = useMemo(
    () =>
      validateEdexcelALevelMusicPaper({
        draft,
        template: edexcelALevelMusicTemplate,
        questions: dataPack.questions,
        assets: dataPack.assets,
      }),
    [dataPack.assets, dataPack.questions, draft],
  );

  const handleSlotChange = (slotKey: PaperSlotKey, questionId: string) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      selectedQuestionIdsBySlot: {
        ...currentDraft.selectedQuestionIdsBySlot,
        [slotKey]: questionId || undefined,
      },
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleSubQuestionsSave = (questionId: string, subQuestions: SubQuestion[]) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      modifiedSubQuestionsByQuestionId: {
        ...currentDraft.modifiedSubQuestionsByQuestionId,
        [questionId]: subQuestions,
      },
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleQuestionSave = (question: Question) => {
    setDataPack((currentDataPack) => saveQuestionToDataPack(currentDataPack, question));
  };

  const handleQuestionDuplicate = (questionId: string) => {
    const duplicateQuestionId = createDuplicateQuestionId(questionId);
    setDataPack((currentDataPack) =>
      duplicateQuestionInDataPack(currentDataPack, questionId, duplicateQuestionId),
    );

    return duplicateQuestionId;
  };

  const handleQuestionArchive = (questionId: string) => {
    setDataPack((currentDataPack) => archiveQuestionInDataPack(currentDataPack, questionId));
  };

  const handleBrandModeChange = (nextMode: BrandMode) => {
    const nextBrand = brandProfiles.find(
      (brandProfile) => brandProfile.mode === nextMode && brandProfile.enabled,
    );

    if (!nextBrand) {
      return;
    }

    setBrandMode(nextMode);
    setDraft((currentDraft) => ({
      ...currentDraft,
      brandProfileId: nextBrand.id,
      updatedAt: new Date().toISOString(),
    }));
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case "paper-builder":
        return (
          <PaperBuilderScreen
            dataPack={dataPack}
            draft={draft}
            template={edexcelALevelMusicTemplate}
            validationState={validationState}
            onSlotChange={handleSlotChange}
            onSubQuestionsSave={handleSubQuestionsSave}
          />
        );
      case "question-bank":
        return <QuestionBankScreen dataPack={dataPack} />;
      case "question-editor":
        return (
          <QuestionEditorScreen
            dataPack={dataPack}
            onQuestionArchive={handleQuestionArchive}
            onQuestionDuplicate={handleQuestionDuplicate}
            onQuestionSave={handleQuestionSave}
          />
        );
      case "question-writer":
        return <QuestionWriterScreen />;
      case "audio-library":
        return <AudioLibraryScreen dataPack={dataPack} />;
      case "data-packs":
        return <DataPacksScreen dataPack={dataPack} />;
      case "settings":
        return (
          <SettingsScreen
            activeBrand={activeBrand}
            brandMode={brandMode}
            dataPack={dataPack}
            onBrandModeChange={handleBrandModeChange}
          />
        );
    }
  };

  return (
    <AppShell
      activeBrand={activeBrand}
      activeScreen={activeScreen}
      activeScreenLabel={screenLabels[activeScreen]}
      brandMode={brandMode}
      draftTitle={draft.title}
      isPaperValid={validationState.isValid}
      onBrandModeChange={handleBrandModeChange}
      onScreenChange={setActiveScreen}
    >
      {renderScreen()}
    </AppShell>
  );
};

const cloneDataPack = (dataPack: DataPack): DataPack => JSON.parse(JSON.stringify(dataPack)) as DataPack;

const createDuplicateQuestionId = (questionId: string) =>
  `${questionId}_copy_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
