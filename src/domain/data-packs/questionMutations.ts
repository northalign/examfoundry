import type { DataPack, Question } from "../exam/types";

export const saveQuestionToDataPack = (dataPack: DataPack, question: Question): DataPack => ({
  ...dataPack,
  questions: dataPack.questions.map((existingQuestion) =>
    existingQuestion.id === question.id ? question : existingQuestion,
  ),
});

export const duplicateQuestionInDataPack = (
  dataPack: DataPack,
  sourceQuestionId: string,
  duplicateQuestionId: string,
): DataPack => {
  const sourceQuestion = dataPack.questions.find((question) => question.id === sourceQuestionId);

  if (!sourceQuestion) {
    return dataPack;
  }

  const duplicateQuestion: Question = {
    ...sourceQuestion,
    id: duplicateQuestionId,
    title: `${sourceQuestion.title} (copy)`,
    sourceLabel: "Synthetic copy",
    archived: false,
    subQuestions: sourceQuestion.subQuestions.map((subQuestion) => ({
      ...subQuestion,
      id: `${duplicateQuestionId}_${subQuestion.label || subQuestion.id}`,
      parentQuestionId: duplicateQuestionId,
    })),
  };

  return {
    ...dataPack,
    questions: dataPack.questions.flatMap((question) =>
      question.id === sourceQuestionId ? [question, duplicateQuestion] : [question],
    ),
  };
};

export const archiveQuestionInDataPack = (dataPack: DataPack, questionId: string): DataPack => ({
  ...dataPack,
  questions: dataPack.questions.map((question) =>
    question.id === questionId ? { ...question, archived: true } : question,
  ),
});
