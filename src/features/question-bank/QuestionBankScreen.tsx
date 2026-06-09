import { BookOpen, FileAudio, FileText, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { QuestionType } from "../../domain/exam/types";
import type { DataPack, QuestionType as QuestionTypeValue } from "../../domain/exam/types";

const typeLabels: Record<QuestionTypeValue, string> = {
  [QuestionType.SetWorkShortAnswerListening]: "Set work short-answer listening",
  [QuestionType.Dictation]: "Dictation",
  [QuestionType.UnfamiliarListeningEssay]: "Unfamiliar listening essay",
  [QuestionType.SetWorkEssayOption]: "Set work essay option",
};

export const QuestionBankScreen = ({ dataPack }: { dataPack: DataPack }) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<QuestionTypeValue | "all">("all");
  const [areaFilter, setAreaFilter] = useState<string>("all");

  const areaById = new Map(dataPack.areasOfStudy.map((area) => [area.id, area]));
  const setWorkById = new Map(dataPack.setWorks.map((setWork) => [setWork.id, setWork]));

  const filteredQuestions = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return dataPack.questions.filter((question) => {
      const matchesSearch =
        !searchTerm ||
        question.title.toLowerCase().includes(searchTerm) ||
        question.sourceLabel.toLowerCase().includes(searchTerm);
      const matchesType = typeFilter === "all" || question.questionType === typeFilter;
      const matchesArea = areaFilter === "all" || question.areaOfStudyId === areaFilter;

      return question.enabled && !question.archived && matchesSearch && matchesType && matchesArea;
    });
  }, [areaFilter, dataPack.questions, search, typeFilter]);

  return (
    <section className="content-panel">
      <div className="page-heading">
        <h1>Question Bank</h1>
        <p>Browse synthetic development questions and asset metadata for the v0.9 build.</p>
      </div>

      <div className="toolbar-row">
        <label className="search-field">
          <Search size={16} />
          <input
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search questions..."
            type="search"
            value={search}
          />
        </label>
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
          onChange={(event) => setAreaFilter(event.target.value)}
          value={areaFilter}
        >
          <option value="all">All areas</option>
          {dataPack.areasOfStudy.map((area) => (
            <option key={area.id} value={area.id}>
              {area.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bank-grid">
        {filteredQuestions.map((question) => {
          const area = question.areaOfStudyId ? areaById.get(question.areaOfStudyId) : undefined;
          const setWork = question.setWorkId ? setWorkById.get(question.setWorkId) : undefined;

          return (
            <article className="bank-card" key={question.id}>
              <div className="bank-card-top">
                <BookOpen size={18} />
                <strong>{question.title}</strong>
                <span>{question.marks}m</span>
              </div>
              <p>{typeLabels[question.questionType]}</p>
              <div className="card-chip-row">
                {area ? <span className="metadata-pill">{area.name}</span> : null}
                {setWork ? <span className="metadata-pill">{setWork.title}</span> : null}
                <span className="metadata-pill">{question.copyrightStatus}</span>
              </div>
              <div className="asset-row">
                <span className={question.hasAudio ? "asset-indicator good" : "asset-indicator muted"}>
                  <FileAudio size={14} />
                  {question.hasAudio ? "Audio" : "No audio"}
                </span>
                <span className={question.hasScore ? "asset-indicator good" : "asset-indicator muted"}>
                  <FileText size={14} />
                  {question.hasScore ? "Score" : "No score"}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
