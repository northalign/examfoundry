import { FileQuestion, Lock, MessageSquare, Sparkles, Workflow } from "lucide-react";

const plannedFeatures = [
  {
    title: "Suggest command words",
    description:
      "Generate specification-appropriate command words for different question types and mark allocations.",
    icon: MessageSquare,
  },
  {
    title: "Generate question stems",
    description: "Draft opening question stems based on Area of Study, set work, and target marks.",
    icon: Sparkles,
  },
  {
    title: "Compare against previous papers",
    description: "Cross-reference new questions against the existing question bank to avoid repetition.",
    icon: Workflow,
  },
  {
    title: "Draft mark schemes",
    description: "Generate indicative mark scheme content aligned to the specification and question type.",
    icon: FileQuestion,
  },
  {
    title: "Create alternative sub-questions",
    description: "Suggest alternative sub-question structures for the same set work or extract.",
    icon: Sparkles,
  },
];

export const QuestionWriterScreen = () => (
  <section className="writer-page">
    <div className="page-heading centered">
      <h1>
        Question Writer <span className="metadata-pill">Coming soon</span>
      </h1>
      <p>AI-assisted question writing tools for exam paper authors.</p>
    </div>

    <div className="writer-hero">
      <div className="hero-icon">
        <Sparkles size={28} />
      </div>
      <h2>AI-assisted question writing will be introduced in a later version.</h2>
      <p>
        Exam Foundry will use assisted workflows to help exam writers draft questions, generate mark schemes,
        and cross-reference the question bank - all within Edexcel specification guidelines.
      </p>
      <div className="disabled-action-row">
        <button className="quiet-button" disabled type="button">
          <Lock size={15} />
          Generate ideas
        </button>
        <span>Disabled in v0.9</span>
      </div>
    </div>

    <div className="planned-list">
      <h2>Planned features</h2>
      {plannedFeatures.map(({ description, icon: Icon, title }) => (
        <article className="planned-card" key={title}>
          <Icon size={18} />
          <div>
            <strong>{title}</strong>
            <p>{description}</p>
          </div>
          <span className="metadata-pill">Planned</span>
        </article>
      ))}
      <p className="small-note">
        Question Writer features are scheduled for a later version. No AI API code is present in v0.9.
      </p>
    </div>
  </section>
);
