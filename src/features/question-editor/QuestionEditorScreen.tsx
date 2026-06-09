import { Archive, Copy, Save, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CopyrightStatus, QuestionType } from "../../domain/exam/types";
import type {
  Asset,
  CopyrightStatus as CopyrightStatusValue,
  DataPack,
  Question,
  QuestionType as QuestionTypeValue,
} from "../../domain/exam/types";

interface QuestionEditorScreenProps {
  dataPack: DataPack;
  onQuestionArchive: (questionId: string) => void;
  onQuestionDuplicate: (questionId: string) => string;
  onQuestionSave: (question: Question) => void;
}

const typeLabels: Record<QuestionTypeValue, string> = {
  [QuestionType.SetWorkShortAnswerListening]: "Set work short-answer listening",
  [QuestionType.Dictation]: "Dictation",
  [QuestionType.UnfamiliarListeningEssay]: "Unfamiliar listening essay",
  [QuestionType.SetWorkEssayOption]: "Set work essay option",
};

const copyrightLabels: Record<CopyrightStatusValue, string> = {
  [CopyrightStatus.Synthetic]: "Synthetic",
  [CopyrightStatus.UserProvided]: "User provided",
  [CopyrightStatus.LicensedInternal]: "Licensed internal",
  [CopyrightStatus.PublicDomain]: "Public domain",
  [CopyrightStatus.Unknown]: "Unknown",
  [CopyrightStatus.NotForDistribution]: "Not for distribution",
};

export const QuestionEditorScreen = ({
  dataPack,
  onQuestionArchive,
  onQuestionDuplicate,
  onQuestionSave,
}: QuestionEditorScreenProps) => {
  const firstQuestionId = dataPack.questions[0]?.id ?? "";
  const [selectedQuestionId, setSelectedQuestionId] = useState(firstQuestionId);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<QuestionTypeValue | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"active" | "archived" | "all">("active");

  const selectedQuestion = dataPack.questions.find((question) => question.id === selectedQuestionId);
  const [draftQuestion, setDraftQuestion] = useState<Question | null>(() =>
    selectedQuestion ? cloneQuestion(selectedQuestion) : null,
  );

  const assetById = new Map(dataPack.assets.map((asset) => [asset.id, asset]));

  const filteredQuestions = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return dataPack.questions.filter((question) => {
      const matchesSearch =
        !searchTerm ||
        question.title.toLowerCase().includes(searchTerm) ||
        question.id.toLowerCase().includes(searchTerm) ||
        question.sourceLabel.toLowerCase().includes(searchTerm);
      const matchesType = typeFilter === "all" || question.questionType === typeFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && !question.archived) ||
        (statusFilter === "archived" && question.archived);

      return question.enabled && matchesSearch && matchesType && matchesStatus;
    });
  }, [dataPack.questions, search, statusFilter, typeFilter]);

  useEffect(() => {
    if (selectedQuestion) {
      setDraftQuestion(cloneQuestion(selectedQuestion));
      return;
    }

    const fallbackQuestion = dataPack.questions.find((question) => question.enabled && !question.archived);
    setSelectedQuestionId(fallbackQuestion?.id ?? "");
    setDraftQuestion(fallbackQuestion ? cloneQuestion(fallbackQuestion) : null);
  }, [dataPack.questions, selectedQuestion]);

  const updateDraft = (updates: Partial<Question>) => {
    setDraftQuestion((currentDraft) => (currentDraft ? { ...currentDraft, ...updates } : currentDraft));
  };

  const saveQuestion = () => {
    if (!draftQuestion) {
      return;
    }

    onQuestionSave(draftQuestion);
  };

  const duplicateQuestion = () => {
    if (!draftQuestion) {
      return;
    }

    const duplicatedQuestionId = onQuestionDuplicate(draftQuestion.id);
    setSelectedQuestionId(duplicatedQuestionId);
    setStatusFilter("active");
  };

  const archiveQuestion = () => {
    if (!draftQuestion) {
      return;
    }

    onQuestionArchive(draftQuestion.id);
    const nextActiveQuestion = dataPack.questions.find(
      (question) => question.id !== draftQuestion.id && question.enabled && !question.archived,
    );
    setSelectedQuestionId(nextActiveQuestion?.id ?? "");
  };

  const linkedAssets = draftQuestion ? assetsForQuestion(draftQuestion, assetById) : [];

  return (
    <section className="editor-layout">
      <aside className="question-list-panel">
        <label className="search-field">
          <Search size={16} />
          <input
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search questions..."
            type="search"
            value={search}
          />
        </label>
        <div className="editor-filter-grid">
          <select
            className="field-control compact"
            onChange={(event) => setTypeFilter(event.target.value as QuestionTypeValue | "all")}
            value={typeFilter}
          >
            <option value="all">All types</option>
            {Object.entries(typeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            className="field-control compact"
            onChange={(event) => setStatusFilter(event.target.value as "active" | "archived" | "all")}
            value={statusFilter}
          >
            <option value="active">Active</option>
            <option value="archived">Archived</option>
            <option value="all">All statuses</option>
          </select>
        </div>

        <div className="question-list">
          {filteredQuestions.map((question) => (
            <button
              className={
                question.id === selectedQuestionId ? "question-list-item active" : "question-list-item"
              }
              key={question.id}
              onClick={() => setSelectedQuestionId(question.id)}
              type="button"
            >
              <strong>{question.title}</strong>
              <span>
                {typeLabels[question.questionType]} - {question.marks}m
              </span>
              {question.archived ? <span className="archived-label">Archived</span> : null}
            </button>
          ))}
        </div>
      </aside>

      <div className="editor-form-panel">
        <div className="page-heading inline-heading">
          <h1>Question Editor</h1>
          <span className="metadata-pill">ID {draftQuestion?.id ?? "none"}</span>
          {draftQuestion?.archived ? <span className="validity-badge warning">Archived</span> : null}
        </div>

        {draftQuestion ? (
          <form className="editor-form" onSubmit={(event) => event.preventDefault()}>
            <label className="field-group full-width">
              <span>Question title</span>
              <input
                className="field-control"
                onChange={(event) => updateDraft({ title: event.target.value })}
                value={draftQuestion.title}
              />
            </label>
            <label className="field-group">
              <span>Question type</span>
              <select
                className="field-control"
                onChange={(event) => updateDraft({ questionType: event.target.value as QuestionTypeValue })}
                value={draftQuestion.questionType}
              >
                {Object.entries(typeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-group">
              <span>Area of Study</span>
              <select
                className="field-control"
                onChange={(event) => updateDraft({ areaOfStudyId: event.target.value || null })}
                value={draftQuestion.areaOfStudyId ?? ""}
              >
                <option value="">None</option>
                {dataPack.areasOfStudy.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-group">
              <span>Set work</span>
              <select
                className="field-control"
                onChange={(event) => updateDraft({ setWorkId: event.target.value || null })}
                value={draftQuestion.setWorkId ?? ""}
              >
                <option value="">None</option>
                {dataPack.setWorks.map((setWork) => (
                  <option key={setWork.id} value={setWork.id}>
                    {setWork.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-group">
              <span>Total marks</span>
              <input
                className="field-control"
                min="0"
                onChange={(event) => updateDraft({ marks: Number.parseInt(event.target.value, 10) || 0 })}
                type="number"
                value={draftQuestion.marks}
              />
            </label>
            <label className="field-group">
              <span>Source label</span>
              <input
                className="field-control"
                onChange={(event) => updateDraft({ sourceLabel: event.target.value })}
                value={draftQuestion.sourceLabel}
              />
            </label>
            <label className="field-group">
              <span>Source year</span>
              <input
                className="field-control"
                onChange={(event) =>
                  updateDraft({ sourceYear: Number.parseInt(event.target.value, 10) || 0 })
                }
                type="number"
                value={draftQuestion.sourceYear}
              />
            </label>
            <label className="field-group">
              <span>Source session</span>
              <input
                className="field-control"
                onChange={(event) => updateDraft({ sourceSession: event.target.value })}
                value={draftQuestion.sourceSession}
              />
            </label>
            <label className="field-group">
              <span>Copyright status</span>
              <select
                className="field-control"
                onChange={(event) =>
                  updateDraft({ copyrightStatus: event.target.value as CopyrightStatusValue })
                }
                value={draftQuestion.copyrightStatus}
              >
                {Object.entries(copyrightLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="checkbox-row">
              <input
                checked={draftQuestion.hasAudio}
                onChange={(event) => updateDraft({ hasAudio: event.target.checked })}
                type="checkbox"
              />
              <span>Audio required or expected</span>
            </label>
            <label className="checkbox-row">
              <input
                checked={draftQuestion.hasScore}
                onChange={(event) => updateDraft({ hasScore: event.target.checked })}
                type="checkbox"
              />
              <span>Score indicated</span>
            </label>

            <label className="field-group">
              <span>Audio asset IDs</span>
              <input
                className="field-control"
                onChange={(event) => updateDraft({ audioAssetIds: parseAssetIds(event.target.value) })}
                value={draftQuestion.audioAssetIds.join(", ")}
              />
            </label>
            <label className="field-group">
              <span>Score asset IDs</span>
              <input
                className="field-control"
                onChange={(event) => updateDraft({ scoreAssetIds: parseAssetIds(event.target.value) })}
                value={draftQuestion.scoreAssetIds.join(", ")}
              />
            </label>

            <div className="editor-form-section full-width">
              <h2>Asset and copyright metadata</h2>
              <div className="asset-metadata-grid">
                {linkedAssets.length > 0 ? (
                  linkedAssets.map((asset) => <AssetMetadataCard asset={asset} key={asset.id} />)
                ) : (
                  <p>No linked asset metadata for this question.</p>
                )}
              </div>
              <p>
                Copyright status: <strong>{copyrightLabels[draftQuestion.copyrightStatus]}</strong>
              </p>
            </div>

            <label className="field-group full-width">
              <span>Copyright / source notes</span>
              <textarea
                className="field-control"
                onChange={(event) => updateDraft({ sourceNotes: event.target.value })}
                value={draftQuestion.sourceNotes ?? ""}
              />
            </label>
            <label className="field-group full-width">
              <span>Internal notes</span>
              <textarea
                className="field-control"
                onChange={(event) => updateDraft({ internalNotes: event.target.value })}
                value={draftQuestion.internalNotes ?? ""}
              />
            </label>

            <div className="editor-actions full-width">
              <button className="quiet-button" onClick={duplicateQuestion} type="button">
                <Copy size={15} />
                Duplicate
              </button>
              <button
                className="quiet-button danger-text"
                disabled={draftQuestion.archived}
                onClick={archiveQuestion}
                type="button"
              >
                <Archive size={15} />
                Archive
              </button>
              <button className="primary-button" onClick={saveQuestion} type="button">
                <Save size={15} />
                Save Question
              </button>
            </div>
          </form>
        ) : (
          <p>No question selected.</p>
        )}
      </div>
    </section>
  );
};

const cloneQuestion = (question: Question): Question => ({
  ...question,
  audioAssetIds: [...question.audioAssetIds],
  scoreAssetIds: [...question.scoreAssetIds],
  supportingAssetIds: question.supportingAssetIds ? [...question.supportingAssetIds] : undefined,
  sourceDocumentAssetIds: question.sourceDocumentAssetIds ? [...question.sourceDocumentAssetIds] : undefined,
  subQuestions: question.subQuestions.map((subQuestion) => ({ ...subQuestion })),
});

const parseAssetIds = (value: string) =>
  value
    .split(",")
    .map((assetId) => assetId.trim())
    .filter(Boolean);

const assetsForQuestion = (question: Question, assetById: Map<string, Asset>) =>
  [
    ...question.audioAssetIds,
    ...question.scoreAssetIds,
    ...(question.supportingAssetIds ?? []),
    ...(question.sourceDocumentAssetIds ?? []),
  ]
    .map((assetId) => assetById.get(assetId))
    .filter((asset): asset is Asset => Boolean(asset));

const AssetMetadataCard = ({ asset }: { asset: Asset }) => (
  <article className="asset-metadata-card">
    <strong>{asset.title}</strong>
    <span>{asset.type}</span>
    <p>{asset.fileName}</p>
    <p>{asset.localPath}</p>
    <div className="card-chip-row">
      <span className={asset.missing ? "metadata-pill warning" : "metadata-pill"}>
        {asset.missing ? "Missing" : "Available"}
      </span>
      <span className="metadata-pill">{asset.copyrightStatus}</span>
    </div>
  </article>
);
