import { useMemo, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { brandProfiles } from "../domain/branding/brandProfiles";
import { edexcelALevelMusicTemplate } from "../domain/exam/template";
import type { BrandMode, PaperDraft, PaperSlotKey } from "../domain/exam/types";
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
  const [draft, setDraft] = useState<PaperDraft>(() => createInitialPaperDraft());

  const activeBrand = useMemo(() => {
    const fallbackBrand = brandProfiles[0];
    if (!fallbackBrand) {
      throw new Error("Exam Foundry requires at least one brand profile.");
    }

    return brandProfiles.find((brandProfile) => brandProfile.mode === brandMode) ?? fallbackBrand;
  }, [brandMode]);

  const validationState = useMemo(
    () =>
      validateEdexcelALevelMusicPaper({
        draft,
        template: edexcelALevelMusicTemplate,
        questions: edexcelMusicDataPack.questions,
        assets: edexcelMusicDataPack.assets,
      }),
    [draft],
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

  const handleBrandModeChange = (nextMode: BrandMode) => {
    setBrandMode(nextMode);
    const nextBrand = brandProfiles.find((brandProfile) => brandProfile.mode === nextMode);
    if (nextBrand) {
      setDraft((currentDraft) => ({
        ...currentDraft,
        brandProfileId: nextBrand.id,
        updatedAt: new Date().toISOString(),
      }));
    }
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case "paper-builder":
        return (
          <PaperBuilderScreen
            dataPack={edexcelMusicDataPack}
            draft={draft}
            template={edexcelALevelMusicTemplate}
            validationState={validationState}
            onSlotChange={handleSlotChange}
          />
        );
      case "question-bank":
        return <QuestionBankScreen dataPack={edexcelMusicDataPack} />;
      case "question-editor":
        return <QuestionEditorScreen dataPack={edexcelMusicDataPack} />;
      case "question-writer":
        return <QuestionWriterScreen />;
      case "audio-library":
        return <AudioLibraryScreen dataPack={edexcelMusicDataPack} />;
      case "data-packs":
        return <DataPacksScreen dataPack={edexcelMusicDataPack} />;
      case "settings":
        return (
          <SettingsScreen
            activeBrand={activeBrand}
            brandMode={brandMode}
            dataPack={edexcelMusicDataPack}
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
