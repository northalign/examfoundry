import {
  AlertTriangle,
  CheckCircle2,
  CircleAlert,
  FilePenLine,
  Info,
  Music2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { QuestionType } from "../../domain/exam/types";
import type {
  AreaOfStudy,
  DataPack,
  PaperDraft,
  PaperSlotKey,
  PaperTemplate,
  Question,
  QuestionType as QuestionTypeValue,
  SetWork,
  SubQuestion,
  ValidationState,
} from "../../domain/exam/types";
import { getQuestionMarksForDraft } from "../../domain/validation/edexcelALevelMusic";

interface PaperBuilderScreenProps {
  dataPack: DataPack;
  draft: PaperDraft;
  template: PaperTemplate;
  validationState: ValidationState;
  onSlotChange: (slotKey: PaperSlotKey, questionId: string) => void;
  onSubQuestionsSave: (questionId: string, subQuestions: SubQuestion[]) => void;
}

const questionTypeLabels: Record<QuestionTypeValue, string> = {
  [QuestionType.SetWorkShortAnswerListening]: "Set work short-answer listening",
  [QuestionType.Dictation]: "Dictation",
  [QuestionType.UnfamiliarListeningEssay]: "Unfamiliar listening essay",
  [QuestionType.SetWorkEssayOption]: "Set work essay options",
};

const q1ToQ3Slots: Array<{ slotKey: PaperSlotKey; label: string; number: string }> = [
  { slotKey: "q1", label: "Question 1", number: "1" },
  { slotKey: "q2", label: "Question 2", number: "2" },
  { slotKey: "q3", label: "Question 3", number: "3" },
];

const q6Slots: Array<{ slotKey: PaperSlotKey; optionLabel: "A" | "B" | "C" | "D" }> = [
  { slotKey: "q6a", optionLabel: "A" },
  { slotKey: "q6b", optionLabel: "B" },
  { slotKey: "q6c", optionLabel: "C" },
  { slotKey: "q6d", optionLabel: "D" },
];

export const PaperBuilderScreen = ({
  dataPack,
  draft,
  template,
  validationState,
  onSlotChange,
  onSubQuestionsSave,
}: PaperBuilderScreenProps) => {
  const [editingSlotKey, setEditingSlotKey] = useState<PaperSlotKey | null>(null);
  const specification = dataPack.specifications.find((item) => item.id === template.specificationId);
  const examBoard = dataPack.examBoards.find((item) => item.id === specification?.examBoardId);
  const qualification = dataPack.qualifications.find((item) => item.id === specification?.qualificationId);
  const subject = dataPack.subjects.find((item) => item.id === specification?.subjectId);
  const areaById = new Map(dataPack.areasOfStudy.map((area) => [area.id, area]));
  const setWorkById = new Map(dataPack.setWorks.map((setWork) => [setWork.id, setWork]));
  const questionById = new Map(dataPack.questions.map((question) => [question.id, question]));

  const questionsByType = (questionType: QuestionTypeValue) =>
    dataPack.questions.filter(
      (question) => question.enabled && !question.archived && question.questionType === questionType,
    );

  const totalProgress = Math.min(100, (validationState.marksSummary.q1ToQ3Total / 42) * 100);
  const q1ToQ3ValidationValid =
    validationState.marksSummary.q1ToQ3Total === 42 && validationState.areaOfStudySummary.isValid;
  const slotStatus = (slotKey: PaperSlotKey) =>
    getSlotStatus({
      slotKey,
      draft,
      validationState,
      isSelected: Boolean(draft.selectedQuestionIdsBySlot[slotKey]),
    });
  const editingQuestion = editingSlotKey
    ? selectedQuestionForSlot(draft, questionById, editingSlotKey)
    : undefined;

  return (
    <div className="paper-builder-layout">
      <section className="paper-builder-main">
        <div className="configuration-panel">
          <div className="config-grid">
            <LockedConfig label="Exam board" value={examBoard?.name ?? "Edexcel"} />
            <LockedConfig label="Qualification" value={qualification?.name ?? "A level"} />
            <LockedConfig label="Subject" value={subject?.name ?? "Music"} />
            <LockedConfig label="Specification" value={specification?.code ?? "9MU0/03"} />
          </div>
          <div className={validationState.isValid ? "status-pill valid" : "status-pill warning"}>
            {validationState.isValid ? <CheckCircle2 size={15} /> : <CircleAlert size={15} />}
            {validationState.isValid ? "Valid paper" : "Needs attention"}
          </div>
          <p className="config-note">
            <Info size={14} />
            v0.9 supports Edexcel A level Music only. Other boards and GCSE will be enabled in future
            versions.
          </p>
        </div>

        <div className="section-heading-row">
          <h1>Paper Structure</h1>
          <span>Total: {validationState.marksSummary.candidateTotal} marks</span>
        </div>

        <div className="question-stack">
          {q1ToQ3Slots.map(({ slotKey, label, number }) => (
            <QuestionCard
              areaById={areaById}
              badgeLabel={questionTypeLabels[QuestionType.SetWorkShortAnswerListening]}
              draft={draft}
              key={slotKey}
              number={number}
              onSlotChange={onSlotChange}
              onEditSubQuestions={() => setEditingSlotKey(slotKey)}
              options={questionsByType(QuestionType.SetWorkShortAnswerListening)}
              questionById={questionById}
              setWorkById={setWorkById}
              slotKey={slotKey}
              status={slotStatus(slotKey)}
              title={label}
            />
          ))}

          <div className={q1ToQ3ValidationValid ? "validation-card valid" : "validation-card warning"}>
            <div className="validation-card-header">
              <strong>
                {q1ToQ3ValidationValid ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                Questions 1-3 Validation
              </strong>
              <span>
                {validationState.marksSummary.q1ToQ3Total} /{" "}
                {validationState.marksSummary.q1ToQ3RequiredTotal}
              </span>
            </div>
            <div className="validation-progress" aria-hidden="true">
              <span style={{ width: `${totalProgress}%` }} />
            </div>
            <p>
              Questions 1-3 must total 42 marks.{" "}
              {validationState.marksSummary.q1ToQ3Total === 42
                ? "The mark total is valid."
                : "Edit selections or sub-questions."}
            </p>
            <p
              className={
                validationState.areaOfStudySummary.isValid ? "validation-line good" : "validation-line warn"
              }
            >
              {validationState.areaOfStudySummary.isValid ? (
                <CheckCircle2 size={15} />
              ) : (
                <AlertTriangle size={15} />
              )}
              {validationState.areaOfStudySummary.isValid
                ? "Questions 1-3 use three different Areas of Study"
                : "Questions 1-3 must use three different Areas of Study"}
            </p>
          </div>

          <QuestionCard
            areaById={areaById}
            badgeLabel={questionTypeLabels[QuestionType.Dictation]}
            draft={draft}
            fixedMarksLabel="8 marks fixed"
            number="4"
            onSlotChange={onSlotChange}
            options={questionsByType(QuestionType.Dictation)}
            questionById={questionById}
            setWorkById={setWorkById}
            slotKey="q4"
            status={slotStatus("q4")}
            title="Question 4"
          />

          <QuestionCard
            areaById={areaById}
            badgeLabel={questionTypeLabels[QuestionType.UnfamiliarListeningEssay]}
            draft={draft}
            fixedMarksLabel="20 marks fixed"
            number="5"
            onSlotChange={onSlotChange}
            options={questionsByType(QuestionType.UnfamiliarListeningEssay)}
            questionById={questionById}
            setWorkById={setWorkById}
            slotKey="q5"
            status={slotStatus("q5")}
            title="Question 5"
          />

          <div className="question-card q6-card">
            <div className="question-number">6</div>
            <div className="question-card-body">
              <div className="question-card-heading">
                <strong>Question 6</strong>
                <span className="type-badge">{questionTypeLabels[QuestionType.SetWorkEssayOption]}</span>
                <span className="mark-badge">30 marks fixed</span>
                <ValidityBadge
                  label={validationState.setWorkSummary.isValid ? "Valid" : "Needs attention"}
                  tone={validationState.setWorkSummary.isValid ? "valid" : "warning"}
                />
              </div>
              <div className="q6-options">
                {q6Slots.map(({ slotKey, optionLabel }) => {
                  const selectedQuestion = selectedQuestionForSlot(draft, questionById, slotKey);
                  const setWork = selectedQuestion?.setWorkId
                    ? setWorkById.get(selectedQuestion.setWorkId)
                    : undefined;
                  const area = selectedQuestion?.areaOfStudyId
                    ? areaById.get(selectedQuestion.areaOfStudyId)
                    : undefined;
                  const optionStatus = slotStatus(slotKey);

                  return (
                    <div className="q6-option-row" key={slotKey}>
                      <span className="option-letter">{optionLabel}</span>
                      <select
                        aria-label={`Question 6 option ${optionLabel}`}
                        className="field-control question-select"
                        onChange={(event) => onSlotChange(slotKey, event.target.value)}
                        value={draft.selectedQuestionIdsBySlot[slotKey] ?? ""}
                      >
                        <option value="">Select essay option</option>
                        {questionsByType(QuestionType.SetWorkEssayOption).map((question) => (
                          <option key={question.id} value={question.id}>
                            {question.title}
                          </option>
                        ))}
                      </select>
                      <span className="metadata-pill">{setWork?.title ?? "Set work needed"}</span>
                      <span className="metadata-pill">{area?.name ?? "AoS needed"}</span>
                      <ValidityBadge label={optionStatus.label} tone={optionStatus.tone} />
                    </div>
                  );
                })}
              </div>
              <div
                className={
                  validationState.setWorkSummary.isValid ? "card-footnote good" : "card-footnote warn"
                }
              >
                {validationState.setWorkSummary.isValid ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <CircleAlert size={15} />
                )}
                {validationState.setWorkSummary.isValid
                  ? "4 options selected. No duplicated set works."
                  : "Question 6 needs four options with no duplicated set works."}
              </div>
            </div>
          </div>
        </div>
      </section>

      <PaperHealthPanel validationState={validationState} />

      {editingQuestion ? (
        <SubQuestionEditorModal
          draft={draft}
          onClose={() => setEditingSlotKey(null)}
          onSave={(subQuestions) => {
            onSubQuestionsSave(editingQuestion.id, subQuestions);
            setEditingSlotKey(null);
          }}
          question={editingQuestion}
          questionById={questionById}
        />
      ) : null}
    </div>
  );
};

const LockedConfig = ({ label, value }: { label: string; value: string }) => (
  <div className="locked-config">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

interface QuestionCardProps {
  areaById: Map<string, AreaOfStudy>;
  badgeLabel: string;
  draft: PaperDraft;
  fixedMarksLabel?: string;
  number: string;
  onEditSubQuestions?: () => void;
  onSlotChange: (slotKey: PaperSlotKey, questionId: string) => void;
  options: Question[];
  questionById: Map<string, Question>;
  setWorkById: Map<string, SetWork>;
  slotKey: PaperSlotKey;
  status: SlotStatus;
  title: string;
}

const QuestionCard = ({
  areaById,
  badgeLabel,
  draft,
  fixedMarksLabel,
  number,
  onEditSubQuestions,
  onSlotChange,
  options,
  questionById,
  setWorkById,
  slotKey,
  status,
  title,
}: QuestionCardProps) => {
  const selectedQuestion = selectedQuestionForSlot(draft, questionById, slotKey);
  const marks = selectedQuestion ? getQuestionMarksForDraft(selectedQuestion, draft) : 0;
  const area = selectedQuestion?.areaOfStudyId ? areaById.get(selectedQuestion.areaOfStudyId) : undefined;
  const setWork = selectedQuestion?.setWorkId ? setWorkById.get(selectedQuestion.setWorkId) : undefined;

  return (
    <div className="question-card">
      <div className="question-number">{number}</div>
      <div className="question-card-body">
        <div className="question-card-heading">
          <strong>{title}</strong>
          <span className="type-badge">{badgeLabel}</span>
          {fixedMarksLabel ? <span className="mark-badge">{fixedMarksLabel}</span> : null}
          <ValidityBadge label={status.label} tone={status.tone} />
        </div>

        <div className="question-fields">
          {area ? (
            <FieldDisplay label="Area of Study" value={area.name} />
          ) : selectedQuestion?.questionType === "set_work_short_answer_listening" ? (
            <FieldDisplay label="Area of Study" value="Select question" muted />
          ) : null}
          <label className="field-group question-field">
            <span>Question</span>
            <select
              className="field-control"
              onChange={(event) => onSlotChange(slotKey, event.target.value)}
              value={draft.selectedQuestionIdsBySlot[slotKey] ?? ""}
            >
              <option value="">Select question</option>
              {options.map((question) => (
                <option key={question.id} value={question.id}>
                  {question.title}
                </option>
              ))}
            </select>
          </label>
          <FieldDisplay label="Marks" value={marks ? String(marks) : "-"} />
          {!fixedMarksLabel ? <span className="mark-badge">{marks || "-"} marks</span> : null}
        </div>

        <div className="question-card-footer">
          <span
            className={
              selectedQuestion?.audioAssetIds.length ? "asset-indicator good" : "asset-indicator muted"
            }
          >
            <Music2 size={14} />
            {selectedQuestion?.audioAssetIds.length ? "Audio metadata linked" : "No audio metadata"}
          </span>
          <span className={selectedQuestion?.hasScore ? "asset-indicator good" : "asset-indicator muted"}>
            <FilePenLine size={14} />
            {selectedQuestion?.hasScore ? "Score indicated" : "No score"}
          </span>
          {setWork ? <span className="metadata-pill">{setWork.title}</span> : null}
          {selectedQuestion?.questionType === "set_work_short_answer_listening" ? (
            <button className="subquestion-button" onClick={onEditSubQuestions} type="button">
              <FilePenLine size={15} />
              Edit sub-questions
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const FieldDisplay = ({ label, muted = false, value }: { label: string; muted?: boolean; value: string }) => (
  <div className={muted ? "field-group readonly muted" : "field-group readonly"}>
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

interface SlotStatus {
  label: string;
  tone: "valid" | "warning";
}

const getSlotStatus = ({
  draft,
  isSelected,
  slotKey,
  validationState,
}: {
  draft: PaperDraft;
  isSelected: boolean;
  slotKey: PaperSlotKey;
  validationState: ValidationState;
}): SlotStatus => {
  const selectedQuestionId = draft.selectedQuestionIdsBySlot[slotKey];
  const slotError = validationState.blockingErrors.find(
    (error) =>
      error.slotKey === slotKey ||
      error.id === `missing_${slotKey}` ||
      error.id === `unknown_${slotKey}` ||
      error.id === `wrong_type_${slotKey}` ||
      (slotKey === "q4" && error.id === "q4_fixed_marks") ||
      (slotKey === "q5" && error.id === "q5_fixed_marks") ||
      (slotKey.startsWith("q6") && error.id === "q6_fixed_marks_" + selectedQuestionId),
  );

  if (slotError) {
    return { label: "Needs attention", tone: "warning" };
  }

  if (
    q1ToQ3Slots.some((slot) => slot.slotKey === slotKey) &&
    validationState.blockingErrors.some(
      (error) => error.id === "q1_to_q3_total" || error.id === "q1_to_q3_areas",
    )
  ) {
    return { label: "Review group", tone: "warning" };
  }

  if (
    slotKey.startsWith("q6") &&
    validationState.blockingErrors.some((error) => error.id === "q6_duplicate_set_work")
  ) {
    return { label: "Review options", tone: "warning" };
  }

  if (!isSelected) {
    return { label: "Needs selection", tone: "warning" };
  }

  return { label: "Valid", tone: "valid" };
};

const ValidityBadge = ({ label, tone }: SlotStatus) => (
  <span className={`validity-badge ${tone}`}>
    {tone === "valid" ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
    {label}
  </span>
);

interface SubQuestionEditorModalProps {
  draft: PaperDraft;
  onClose: () => void;
  onSave: (subQuestions: SubQuestion[]) => void;
  question: Question;
  questionById: Map<string, Question>;
}

const SubQuestionEditorModal = ({
  draft,
  onClose,
  onSave,
  question,
  questionById,
}: SubQuestionEditorModalProps) => {
  const [rows, setRows] = useState<SubQuestion[]>(() => subQuestionsForDraft(question, draft));

  useEffect(() => {
    setRows(subQuestionsForDraft(question, draft));
  }, [draft, question]);

  const questionTotal = useMemo(() => sumEnabledMarks(rows), [rows]);
  const q1ToQ3Total = useMemo(
    () =>
      q1ToQ3Slots.reduce((total, slot) => {
        const selectedQuestion = selectedQuestionForSlot(draft, questionById, slot.slotKey);

        if (!selectedQuestion) {
          return total;
        }

        return (
          total +
          (selectedQuestion.id === question.id
            ? questionTotal
            : getQuestionMarksForDraft(selectedQuestion, draft))
        );
      }, 0),
    [draft, question.id, questionById, questionTotal],
  );

  const updateMarks = (subQuestionId: string, marksValue: string) => {
    const parsedMarks = Number.parseInt(marksValue, 10);
    const marks = Number.isFinite(parsedMarks) ? Math.max(0, parsedMarks) : 0;

    setRows((currentRows) => currentRows.map((row) => (row.id === subQuestionId ? { ...row, marks } : row)));
  };

  const addSubQuestion = () => {
    setRows((currentRows) => {
      const displayOrder = currentRows.length + 1;

      return [
        ...currentRows,
        {
          id: createDraftSubQuestionId(question.id),
          parentQuestionId: question.id,
          label: nextSubQuestionLabel(displayOrder),
          prompt: "Draft sub-question placeholder.",
          marks: 1,
          displayOrder,
          enabled: true,
        },
      ];
    });
  };

  const removeSubQuestion = (subQuestionId: string) => {
    setRows((currentRows) => currentRows.filter((row) => row.id !== subQuestionId));
  };

  const saveRows = () => {
    onSave(
      rows.map((row, index) => ({
        ...row,
        parentQuestionId: question.id,
        displayOrder: index + 1,
        enabled: true,
      })),
    );
  };

  return (
    <div className="modal-backdrop">
      <section aria-modal="true" className="subquestion-modal" role="dialog">
        <div className="modal-header">
          <div>
            <h2>Edit sub-questions</h2>
            <p>{question.title}</p>
          </div>
          <button
            aria-label="Close sub-question editor"
            className="icon-button"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-summary">
          <div>
            <span>Question total</span>
            <strong>{questionTotal} marks</strong>
          </div>
          <div className={q1ToQ3Total === 42 ? "modal-total valid" : "modal-total warning"}>
            <span>Q1-3 total</span>
            <strong>{q1ToQ3Total} / 42</strong>
          </div>
        </div>

        <div className="subquestion-list">
          {rows.map((row, index) => (
            <div className="subquestion-row" key={row.id}>
              <span className="option-letter">{row.label || nextSubQuestionLabel(index + 1)}</span>
              <div>
                <strong>Sub-question {row.label || nextSubQuestionLabel(index + 1)}</strong>
                <p>{row.prompt}</p>
              </div>
              <label className="field-group mark-editor">
                <span>Marks</span>
                <input
                  className="field-control"
                  min="0"
                  onChange={(event) => updateMarks(row.id, event.target.value)}
                  type="number"
                  value={row.marks}
                />
              </label>
              <button
                aria-label={`Remove sub-question ${row.label || index + 1}`}
                className="icon-button danger"
                onClick={() => removeSubQuestion(row.id)}
                type="button"
              >
                <Trash2 size={17} />
              </button>
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button className="quiet-button" onClick={addSubQuestion} type="button">
            <Plus size={15} />
            Add sub-question
          </button>
          <div>
            <button className="quiet-button" onClick={onClose} type="button">
              Cancel
            </button>
            <button className="primary-button" onClick={saveRows} type="button">
              Save Changes
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const subQuestionsForDraft = (question: Question, draft: PaperDraft): SubQuestion[] => {
  const subQuestions = draft.modifiedSubQuestionsByQuestionId[question.id] ?? question.subQuestions;

  return subQuestions.map((subQuestion, index) => ({
    ...subQuestion,
    parentQuestionId: question.id,
    displayOrder: index + 1,
  }));
};

const sumEnabledMarks = (subQuestions: SubQuestion[]) =>
  subQuestions
    .filter((subQuestion) => subQuestion.enabled)
    .reduce((total, subQuestion) => total + subQuestion.marks, 0);

const nextSubQuestionLabel = (displayOrder: number) =>
  displayOrder <= 26 ? String.fromCharCode(96 + displayOrder) : `z${displayOrder}`;

const createDraftSubQuestionId = (questionId: string) =>
  `${questionId}_draft_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const selectedQuestionForSlot = (
  draft: PaperDraft,
  questionById: Map<string, Question>,
  slotKey: PaperSlotKey,
): Question | undefined => {
  const questionId = draft.selectedQuestionIdsBySlot[slotKey];
  return questionId ? questionById.get(questionId) : undefined;
};

const PaperHealthPanel = ({ validationState }: { validationState: ValidationState }) => {
  const missingAudioCount = validationState.assetSummary.missingAudioAssetIds.length;
  const availableAudioCount = Math.max(0, validationState.assetSummary.linkedAudioCount - missingAudioCount);
  const audioReady =
    validationState.assetSummary.requiredAudioCount === validationState.assetSummary.linkedAudioCount &&
    missingAudioCount === 0;
  const audioDetail =
    validationState.assetSummary.requiredAudioCount === 0
      ? "No audio required"
      : `${availableAudioCount} / ${validationState.assetSummary.requiredAudioCount} available`;

  return (
    <aside className="paper-health-panel">
      <h2>Paper Health</h2>
      <div className={validationState.isValid ? "health-status valid" : "health-status warning"}>
        {validationState.isValid ? <CheckCircle2 size={17} /> : <AlertTriangle size={17} />}
        <strong>{validationState.isValid ? "Valid paper" : "Needs attention"}</strong>
      </div>

      <div className="health-list">
        <HealthRow
          detail={`${validationState.marksSummary.q1ToQ3Total} / ${validationState.marksSummary.q1ToQ3RequiredTotal}`}
          good={validationState.marksSummary.q1ToQ3Total === validationState.marksSummary.q1ToQ3RequiredTotal}
          label="Questions 1-3 total"
        />
        <HealthRow good={validationState.areaOfStudySummary.isValid} label="Areas of Study" />
        <HealthRow
          good={!validationState.blockingErrors.some((error) => error.id.includes("q4"))}
          label="Question 4"
        />
        <HealthRow
          good={!validationState.blockingErrors.some((error) => error.id.includes("q5"))}
          label="Question 5"
        />
        <HealthRow good={validationState.setWorkSummary.isValid} label="Question 6 options" />
        <HealthRow detail={audioDetail} good={audioReady} label="Audio readiness" />
        <HealthRow detail={`${validationState.assetSummary.scoreCount} indicated`} good label="Scores" />
        <HealthRow
          detail={validationState.isValid ? "Ready for preview" : "Blocked"}
          good={validationState.isValid}
          label="Export readiness"
        />
      </div>

      {validationState.blockingErrors.length > 0 ? (
        <div className="health-message-list blocking">
          {validationState.blockingErrors.map((error) => (
            <p key={error.id}>{error.label}</p>
          ))}
        </div>
      ) : null}

      {validationState.warnings.length > 0 ? (
        <div className="health-message-list warning">
          {validationState.warnings.slice(0, 3).map((warning) => (
            <p key={warning.id}>{warning.label}</p>
          ))}
        </div>
      ) : null}

      <div className="marks-breakdown">
        <h3>Marks Breakdown</h3>
        <dl>
          <div>
            <dt>Q1-3 set work</dt>
            <dd>{validationState.marksSummary.q1ToQ3Total}/42</dd>
          </div>
          <div>
            <dt>Q4 dictation</dt>
            <dd>{validationState.marksSummary.q4Marks}/8</dd>
          </div>
          <div>
            <dt>Q5 unfamiliar</dt>
            <dd>{validationState.marksSummary.q5Marks}/20</dd>
          </div>
          <div>
            <dt>Q6 essay</dt>
            <dd>{validationState.marksSummary.q6OptionMarks[0] ?? 0}/30</dd>
          </div>
          <div className="total-row">
            <dt>Total</dt>
            <dd>{validationState.marksSummary.candidateTotal}</dd>
          </div>
        </dl>
      </div>
    </aside>
  );
};

const HealthRow = ({ detail, good, label }: { detail?: string; good: boolean; label: string }) => (
  <div className="health-row">
    <span className={good ? "health-icon good" : "health-icon warn"}>
      {good ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
    </span>
    <span>{label}</span>
    {detail ? <strong>{detail}</strong> : <strong>{good ? "Valid" : "Check"}</strong>}
  </div>
);
