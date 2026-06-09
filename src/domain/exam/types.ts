export type BrandMode = "stonyhurst" | "neutral" | "custom";

export const QuestionType = {
  SetWorkShortAnswerListening: "set_work_short_answer_listening",
  Dictation: "dictation",
  UnfamiliarListeningEssay: "unfamiliar_listening_essay",
  SetWorkEssayOption: "set_work_essay_option",
} as const;

export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];

export type AssetType = "audio" | "score" | "image" | "document";

export const CopyrightStatus = {
  Synthetic: "synthetic",
  UserProvided: "user_provided",
  LicensedInternal: "licensed_internal",
  PublicDomain: "public_domain",
  Unknown: "unknown",
  NotForDistribution: "not_for_distribution",
} as const;

export type CopyrightStatus = (typeof CopyrightStatus)[keyof typeof CopyrightStatus];

export type PaperSlotKey = "q1" | "q2" | "q3" | "q4" | "q5" | "q6a" | "q6b" | "q6c" | "q6d";

export interface BrandProfile {
  id: string;
  name: string;
  mode: BrandMode;
  logoAssetId: string | null;
  primaryColour: string;
  accentColour: string;
  documentHeaderText: string;
  documentFooterText: string;
  internalBuildLabel: string;
  enabled: boolean;
}

export interface ExamBoard {
  id: string;
  name: string;
  slug: string;
  enabled: boolean;
}

export interface Qualification {
  id: string;
  name: string;
  slug: string;
  enabled: boolean;
}

export interface Subject {
  id: string;
  name: string;
  slug: string;
  enabled: boolean;
}

export interface Specification {
  id: string;
  examBoardId: string;
  qualificationId: string;
  subjectId: string;
  code: string;
  title: string;
  versionLabel: string;
  enabled: boolean;
}

export interface AreaOfStudy {
  id: string;
  specificationId: string;
  name: string;
  slug: string;
  displayOrder: number;
  enabled: boolean;
}

export interface SetWork {
  id: string;
  specificationId: string;
  areaOfStudyId: string;
  title: string;
  composerOrArtist: string;
  movementOrExtract: string;
  notes?: string;
  enabled: boolean;
}

export interface SubQuestion {
  id: string;
  parentQuestionId?: string;
  label: string;
  prompt: string;
  marks: number;
  answerSpaceHint?: string;
  displayOrder: number;
  enabled: boolean;
}

export interface Question {
  id: string;
  specificationId: string;
  questionType: QuestionType;
  title: string;
  areaOfStudyId: string | null;
  setWorkId: string | null;
  marks: number;
  defaultQuestionNumber: number;
  sourceLabel: string;
  sourceYear: number;
  sourceSession: string;
  hasAudio: boolean;
  hasScore: boolean;
  audioAssetIds: string[];
  scoreAssetIds: string[];
  subQuestions: SubQuestion[];
  copyrightStatus: CopyrightStatus;
  sourceNotes?: string;
  internalNotes?: string;
  enabled: boolean;
  archived: boolean;
}

export interface Asset {
  id: string;
  type: AssetType;
  title: string;
  localPath: string;
  fileName: string;
  mimeType: string;
  durationSeconds?: number;
  pageCount?: number;
  checksum: string | null;
  copyrightStatus: CopyrightStatus;
  sourceNotes?: string;
  dataPackId?: string;
  missing: boolean;
}

export interface PaperSlot {
  id: string;
  paperTemplateId: string;
  slotKey: PaperSlotKey;
  displayLabel: string;
  questionNumber: number;
  optionLabel?: "A" | "B" | "C" | "D";
  acceptedQuestionTypes: QuestionType[];
  fixedMarks: number | null;
  required: boolean;
  displayOrder: number;
}

export interface PaperTemplate {
  id: string;
  specificationId: string;
  name: string;
  versionLabel: string;
  slots: PaperSlot[];
  validationRules: string[];
  enabled: boolean;
}

export type SelectedQuestionIdsBySlot = Partial<Record<PaperSlotKey, string>>;

export interface PaperDraft {
  id: string;
  title: string;
  specificationId: string;
  paperTemplateId: string;
  brandProfileId: string;
  selectedQuestionIdsBySlot: SelectedQuestionIdsBySlot;
  modifiedSubQuestionsByQuestionId: Record<string, SubQuestion[]>;
  createdAt: string;
  updatedAt: string;
  validationState?: ValidationState;
  notes?: string;
}

export interface ValidationMessage {
  id: string;
  label: string;
  detail?: string;
  slotKey?: PaperSlotKey;
}

export interface MarksSummary {
  q1ToQ3Total: number;
  q1ToQ3RequiredTotal: number;
  q4Marks: number;
  q5Marks: number;
  q6OptionMarks: number[];
  candidateTotal: number;
}

export interface AreaOfStudySummary {
  q1ToQ3AreaIds: string[];
  uniqueQ1ToQ3AreaCount: number;
  isValid: boolean;
}

export interface SetWorkSummary {
  q6SetWorkIds: string[];
  duplicateQ6SetWorkIds: string[];
  isValid: boolean;
}

export interface AssetSummary {
  requiredAudioCount: number;
  linkedAudioCount: number;
  missingAudioAssetIds: string[];
  scoreCount: number;
}

export interface ExportReadiness {
  isReady: boolean;
  reasons: string[];
}

export interface ValidationState {
  isValid: boolean;
  blockingErrors: ValidationMessage[];
  warnings: ValidationMessage[];
  infoMessages: ValidationMessage[];
  marksSummary: MarksSummary;
  areaOfStudySummary: AreaOfStudySummary;
  setWorkSummary: SetWorkSummary;
  assetSummary: AssetSummary;
  exportReadiness: ExportReadiness;
}

export interface DataPack {
  manifestVersion: string;
  dataPackVersion: string;
  packId: string;
  name: string;
  publisher: string;
  containsCopyrightedMaterial: boolean;
  distributionAllowed: boolean;
  localOnly: boolean;
  notes: string;
  examBoards: ExamBoard[];
  qualifications: Qualification[];
  subjects: Subject[];
  specifications: Specification[];
  areasOfStudy: AreaOfStudy[];
  setWorks: SetWork[];
  assets: Asset[];
  questions: Question[];
}
