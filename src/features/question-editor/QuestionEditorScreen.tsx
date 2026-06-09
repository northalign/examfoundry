import { Save, Search } from "lucide-react";
import { useState } from "react";
import type { DataPack } from "../../domain/exam/types";

export const QuestionEditorScreen = ({ dataPack }: { dataPack: DataPack }) => {
  const [selectedQuestionId, setSelectedQuestionId] = useState(dataPack.questions[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const selectedQuestion =
    dataPack.questions.find((question) => question.id === selectedQuestionId) ?? dataPack.questions[0];
  const area = dataPack.areasOfStudy.find((item) => item.id === selectedQuestion?.areaOfStudyId);
  const setWork = dataPack.setWorks.find((item) => item.id === selectedQuestion?.setWorkId);

  const filteredQuestions = dataPack.questions.filter((question) =>
    question.title.toLowerCase().includes(search.trim().toLowerCase()),
  );

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
        <div className="question-list">
          {filteredQuestions.map((question) => (
            <button
              className={
                question.id === selectedQuestion?.id ? "question-list-item active" : "question-list-item"
              }
              key={question.id}
              onClick={() => setSelectedQuestionId(question.id)}
              type="button"
            >
              <strong>{question.title}</strong>
              <span>
                {question.questionType.replaceAll("_", " ")} - {question.marks}m
              </span>
            </button>
          ))}
        </div>
      </aside>

      <div className="editor-form-panel">
        <div className="page-heading inline-heading">
          <h1>Question Editor</h1>
          <span className="metadata-pill">ID {selectedQuestion?.id ?? "none"}</span>
        </div>

        {selectedQuestion ? (
          <form className="editor-form">
            <label className="field-group full-width">
              <span>Question title</span>
              <input className="field-control" readOnly value={selectedQuestion.title} />
            </label>
            <label className="field-group">
              <span>Question type</span>
              <input
                className="field-control"
                readOnly
                value={selectedQuestion.questionType.replaceAll("_", " ")}
              />
            </label>
            <label className="field-group">
              <span>Area of Study</span>
              <input className="field-control" readOnly value={area?.name ?? "None"} />
            </label>
            <label className="field-group">
              <span>Set work</span>
              <input className="field-control" readOnly value={setWork?.title ?? "None"} />
            </label>
            <label className="field-group">
              <span>Total marks</span>
              <input className="field-control" readOnly value={selectedQuestion.marks} />
            </label>
            <label className="field-group">
              <span>Audio file</span>
              <input
                className="field-control"
                readOnly
                value={selectedQuestion.audioAssetIds.join(", ") || "No audio metadata"}
              />
            </label>
            <label className="field-group">
              <span>Score attachment</span>
              <input
                className="field-control"
                readOnly
                value={selectedQuestion.scoreAssetIds.join(", ") || "No score metadata"}
              />
            </label>
            <label className="field-group full-width">
              <span>Copyright / source notes</span>
              <textarea
                className="field-control"
                readOnly
                value={`${selectedQuestion.copyrightStatus}. Synthetic development data only.`}
              />
            </label>
            <label className="field-group full-width">
              <span>Internal notes</span>
              <textarea
                className="field-control"
                readOnly
                value={selectedQuestion.internalNotes ?? "No internal notes."}
              />
            </label>
            <button className="primary-button form-save" disabled type="button">
              <Save size={15} />
              Save Question
            </button>
          </form>
        ) : (
          <p>No question selected.</p>
        )}
      </div>
    </section>
  );
};
