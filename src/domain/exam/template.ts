import type { PaperSlot, PaperTemplate } from "./types";

const templateId = "template_edexcel_a_level_music_9mu0_03_v0_9";
const specificationId = "spec_edexcel_a_level_music_9mu0_03";

const slot = (
  slotKey: PaperSlot["slotKey"],
  displayLabel: string,
  questionNumber: number,
  acceptedQuestionTypes: PaperSlot["acceptedQuestionTypes"],
  displayOrder: number,
  fixedMarks: number | null = null,
  optionLabel?: PaperSlot["optionLabel"],
): PaperSlot => ({
  id: `slot_${slotKey}`,
  paperTemplateId: templateId,
  slotKey,
  displayLabel,
  questionNumber,
  optionLabel,
  acceptedQuestionTypes,
  fixedMarks,
  required: true,
  displayOrder,
});

export const edexcelALevelMusicTemplate: PaperTemplate = {
  id: templateId,
  specificationId,
  name: "Edexcel A level Music Appraising 9MU0/03",
  versionLabel: "v0.9",
  enabled: true,
  validationRules: [
    "required_slots_complete",
    "q1_to_q3_total_42",
    "q1_to_q3_different_areas_of_study",
    "q4_fixed_8",
    "q5_fixed_20",
    "q6_four_options",
    "q6_no_duplicate_set_works",
  ],
  slots: [
    slot("q1", "Question 1", 1, ["set_work_short_answer_listening"], 1),
    slot("q2", "Question 2", 2, ["set_work_short_answer_listening"], 2),
    slot("q3", "Question 3", 3, ["set_work_short_answer_listening"], 3),
    slot("q4", "Question 4", 4, ["dictation"], 4, 8),
    slot("q5", "Question 5", 5, ["unfamiliar_listening_essay"], 5, 20),
    slot("q6a", "Question 6 option A", 6, ["set_work_essay_option"], 6, 30, "A"),
    slot("q6b", "Question 6 option B", 6, ["set_work_essay_option"], 7, 30, "B"),
    slot("q6c", "Question 6 option C", 6, ["set_work_essay_option"], 8, 30, "C"),
    slot("q6d", "Question 6 option D", 6, ["set_work_essay_option"], 9, 30, "D"),
  ],
};

export const paperSlotKeys = edexcelALevelMusicTemplate.slots.map((paperSlot) => paperSlot.slotKey);
