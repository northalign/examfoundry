import type {
  Asset,
  PaperDraft,
  PaperSlotKey,
  PaperTemplate,
  Question,
  SubQuestion,
  ValidationMessage,
  ValidationState,
} from "../exam/types";

interface ValidationInput {
  draft: PaperDraft;
  template: PaperTemplate;
  questions: Question[];
  assets?: Asset[];
}

const q1ToQ3Slots: PaperSlotKey[] = ["q1", "q2", "q3"];
const q6Slots: PaperSlotKey[] = ["q6a", "q6b", "q6c", "q6d"];

const enabledSubQuestionMarks = (subQuestions: SubQuestion[]) =>
  subQuestions
    .filter((subQuestion) => subQuestion.enabled)
    .reduce((total, subQuestion) => total + subQuestion.marks, 0);

export const getQuestionMarksForDraft = (question: Question, draft: PaperDraft) => {
  const modifiedSubQuestions = draft.modifiedSubQuestionsByQuestionId[question.id];

  if (modifiedSubQuestions && modifiedSubQuestions.length > 0) {
    return enabledSubQuestionMarks(modifiedSubQuestions);
  }

  if (question.subQuestions.length > 0) {
    return enabledSubQuestionMarks(question.subQuestions);
  }

  return question.marks;
};

export const validateEdexcelALevelMusicPaper = ({
  draft,
  template,
  questions,
  assets = [],
}: ValidationInput): ValidationState => {
  const blockingErrors: ValidationMessage[] = [];
  const warnings: ValidationMessage[] = [];
  const infoMessages: ValidationMessage[] = [];
  const questionById = new Map(questions.map((question) => [question.id, question]));
  const assetById = new Map(assets.map((asset) => [asset.id, asset]));

  const questionForSlot = (slotKey: PaperSlotKey) => {
    const questionId = draft.selectedQuestionIdsBySlot[slotKey];
    return questionId ? questionById.get(questionId) : undefined;
  };

  const selectedQuestions = template.slots
    .map((paperSlot) => questionForSlot(paperSlot.slotKey))
    .filter((question): question is Question => Boolean(question));

  template.slots.forEach((paperSlot) => {
    const questionId = draft.selectedQuestionIdsBySlot[paperSlot.slotKey];
    const question = questionId ? questionById.get(questionId) : undefined;

    if (paperSlot.required && !questionId) {
      blockingErrors.push({
        id: `missing_${paperSlot.slotKey}`,
        label: `${paperSlot.displayLabel} is empty`,
        detail: "Select a question before preview or export.",
        slotKey: paperSlot.slotKey,
      });
      return;
    }

    if (questionId && !question) {
      blockingErrors.push({
        id: `unknown_${paperSlot.slotKey}`,
        label: `${paperSlot.displayLabel} references a missing question`,
        detail: "The selected question is not available in the current data pack.",
        slotKey: paperSlot.slotKey,
      });
      return;
    }

    if (question && !paperSlot.acceptedQuestionTypes.includes(question.questionType)) {
      blockingErrors.push({
        id: `wrong_type_${paperSlot.slotKey}`,
        label: `${paperSlot.displayLabel} has the wrong question type`,
        detail: `Expected ${paperSlot.acceptedQuestionTypes.join(", ")}.`,
        slotKey: paperSlot.slotKey,
      });
    }
  });

  const q1ToQ3Questions = q1ToQ3Slots.map((slotKey) => questionForSlot(slotKey));
  const q1ToQ3Marks = q1ToQ3Questions.reduce((total, question) => {
    return question ? total + getQuestionMarksForDraft(question, draft) : total;
  }, 0);

  if (q1ToQ3Questions.every(Boolean) && q1ToQ3Marks !== 42) {
    const difference = 42 - q1ToQ3Marks;
    blockingErrors.push({
      id: "q1_to_q3_total",
      label: `Questions 1 to 3 total ${q1ToQ3Marks} / 42`,
      detail:
        difference > 0
          ? `Add ${difference} mark${difference === 1 ? "" : "s"} or edit sub-questions.`
          : `Remove ${Math.abs(difference)} mark${Math.abs(difference) === 1 ? "" : "s"} or edit sub-questions.`,
    });
  }

  const q1ToQ3AreaIds = q1ToQ3Questions
    .map((question) => question?.areaOfStudyId)
    .filter((areaOfStudyId): areaOfStudyId is string => Boolean(areaOfStudyId));
  const uniqueQ1ToQ3AreaCount = new Set(q1ToQ3AreaIds).size;
  const q1ToQ3AreasValid = q1ToQ3AreaIds.length === 3 && uniqueQ1ToQ3AreaCount === 3;

  if (q1ToQ3Questions.every(Boolean) && !q1ToQ3AreasValid) {
    blockingErrors.push({
      id: "q1_to_q3_areas",
      label: "Questions 1 to 3 must use three different Areas of Study",
      detail: "Choose one short-answer listening question from each of three different Areas of Study.",
    });
  }

  const q4 = questionForSlot("q4");
  const q4Marks = q4 ? getQuestionMarksForDraft(q4, draft) : 0;
  if (q4 && q4Marks !== 8) {
    blockingErrors.push({
      id: "q4_fixed_marks",
      label: "Question 4 must be 8 marks",
      detail: "All dictation questions are fixed at 8 marks in v0.9.",
      slotKey: "q4",
    });
  }

  const q5 = questionForSlot("q5");
  const q5Marks = q5 ? getQuestionMarksForDraft(q5, draft) : 0;
  if (q5 && q5Marks !== 20) {
    blockingErrors.push({
      id: "q5_fixed_marks",
      label: "Question 5 must be 20 marks",
      detail: "Unfamiliar listening essay questions are fixed at 20 marks in v0.9.",
      slotKey: "q5",
    });
  }

  const q6Questions = q6Slots.map((slotKey) => questionForSlot(slotKey));
  const selectedQ6Questions = q6Questions.filter((question): question is Question => Boolean(question));

  if (selectedQ6Questions.length !== 4) {
    blockingErrors.push({
      id: "q6_options_complete",
      label: "Question 6 needs four essay options",
      detail: "Select options A, B, C, and D.",
    });
  }

  const q6SetWorkIds = selectedQ6Questions
    .map((question) => question.setWorkId)
    .filter((setWorkId): setWorkId is string => Boolean(setWorkId));
  const duplicateQ6SetWorkIds = q6SetWorkIds.filter(
    (setWorkId, index) => q6SetWorkIds.indexOf(setWorkId) !== index,
  );

  if (new Set(duplicateQ6SetWorkIds).size > 0) {
    blockingErrors.push({
      id: "q6_duplicate_set_work",
      label: "Duplicate set work in Question 6 options",
      detail: "Choose four essay options based on different set works.",
    });
  }

  const q6OptionMarks = selectedQ6Questions.map((question) => getQuestionMarksForDraft(question, draft));
  selectedQ6Questions.forEach((question) => {
    if (getQuestionMarksForDraft(question, draft) !== 30) {
      blockingErrors.push({
        id: `q6_fixed_marks_${question.id}`,
        label: "Each Question 6 option must be 30 marks",
        detail: "Set work essay options are fixed at 30 marks in v0.9.",
      });
    }
  });

  const audioRequiringQuestions = selectedQuestions.filter((question) => question.hasAudio);
  const linkedAudioQuestions = audioRequiringQuestions.filter(
    (question) => question.audioAssetIds.length > 0,
  );
  const missingAudioAssetIds = audioRequiringQuestions.flatMap((question) =>
    question.audioAssetIds.filter((assetId) => assetById.get(assetId)?.missing),
  );

  audioRequiringQuestions.forEach((question) => {
    if (question.audioAssetIds.length === 0) {
      warnings.push({
        id: `missing_audio_metadata_${question.id}`,
        label: `${question.title} has no linked audio metadata`,
        detail: "Audio readiness contributes to Paper Health.",
      });
    }
  });

  if (missingAudioAssetIds.length > 0) {
    warnings.push({
      id: "missing_audio_files",
      label: `${missingAudioAssetIds.length} linked audio file${missingAudioAssetIds.length === 1 ? "" : "s"} missing locally`,
      detail: "Local audio assets are referenced by metadata but are not bundled in the repository.",
    });
  }

  const scoreCount = selectedQuestions.filter(
    (question) => question.hasScore || question.scoreAssetIds.length > 0,
  ).length;

  if (blockingErrors.length === 0) {
    infoMessages.push({
      id: "valid_paper",
      label: "Valid paper",
      detail: "All required Edexcel A level Music paper-structure rules are satisfied.",
    });
  }

  const uniqueDuplicateQ6SetWorkIds = [...new Set(duplicateQ6SetWorkIds)];
  const isValid = blockingErrors.length === 0;

  return {
    isValid,
    blockingErrors,
    warnings,
    infoMessages,
    marksSummary: {
      q1ToQ3Total: q1ToQ3Marks,
      q1ToQ3RequiredTotal: 42,
      q4Marks,
      q5Marks,
      q6OptionMarks,
      candidateTotal: q1ToQ3Marks + q4Marks + q5Marks + (q6OptionMarks[0] ?? 0),
    },
    areaOfStudySummary: {
      q1ToQ3AreaIds,
      uniqueQ1ToQ3AreaCount,
      isValid: q1ToQ3AreasValid,
    },
    setWorkSummary: {
      q6SetWorkIds,
      duplicateQ6SetWorkIds: uniqueDuplicateQ6SetWorkIds,
      isValid: uniqueDuplicateQ6SetWorkIds.length === 0 && selectedQ6Questions.length === 4,
    },
    assetSummary: {
      requiredAudioCount: audioRequiringQuestions.length,
      linkedAudioCount: linkedAudioQuestions.length,
      missingAudioAssetIds,
      scoreCount,
    },
    exportReadiness: {
      isReady: isValid,
      reasons: blockingErrors.map((error) => error.label),
    },
  };
};
