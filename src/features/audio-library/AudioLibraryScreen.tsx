import { AlertTriangle, CheckCircle2, Clock3, FileAudio, Link2 } from "lucide-react";
import type { Asset, DataPack, Question } from "../../domain/exam/types";

export const AudioLibraryScreen = ({ dataPack }: { dataPack: DataPack }) => {
  const audioAssets = dataPack.assets
    .filter((asset) => asset.type === "audio")
    .sort((firstAsset, secondAsset) => Number(secondAsset.missing) - Number(firstAsset.missing));
  const audioRows = audioAssets.map((asset) => ({
    asset,
    linkedQuestions: questionsLinkedToAudioAsset(asset, dataPack.questions),
  }));
  const missingAudioAssets = audioAssets.filter((asset) => asset.missing);
  const availableAudioAssets = audioAssets.filter((asset) => !asset.missing);
  const questionsExpectingAudio = dataPack.questions.filter(
    (question) => question.enabled && !question.archived && question.hasAudio,
  );
  const questionsWithoutAudioMetadata = questionsExpectingAudio.filter(
    (question) => question.audioAssetIds.length === 0,
  );

  return (
    <section className="content-panel">
      <div className="page-heading">
        <h1>Audio Library</h1>
        <p>Track linked audio metadata, missing local files, and readiness for listening-paper assembly.</p>
      </div>

      <div className="audio-summary-grid">
        <AudioSummaryCard
          detail={`${questionsExpectingAudio.length} questions need audio`}
          icon={FileAudio}
          label="Audio records"
          value={audioAssets.length}
        />
        <AudioSummaryCard
          detail="Present in local metadata"
          icon={CheckCircle2}
          label="Available"
          value={availableAudioAssets.length}
        />
        <AudioSummaryCard
          detail="Expected, not yet supplied"
          icon={AlertTriangle}
          label="Missing"
          tone="warning"
          value={missingAudioAssets.length}
        />
        <AudioSummaryCard
          detail="Require an asset link"
          icon={Link2}
          label="No metadata"
          tone={questionsWithoutAudioMetadata.length > 0 ? "warning" : "default"}
          value={questionsWithoutAudioMetadata.length}
        />
      </div>

      <article className="audio-future-note">
        <Clock3 size={20} />
        <div>
          <strong>GCSE audio stitching is planned for a later phase.</strong>
          <p>
            v0.9 only tracks readiness. It does not stitch tracks, alter audio files, or generate a playback
            sequence.
          </p>
        </div>
        <span className="metadata-pill">Future</span>
      </article>

      {questionsWithoutAudioMetadata.length > 0 ? (
        <section className="audio-section">
          <h2>Questions Needing Audio Metadata</h2>
          <div className="audio-gap-list">
            {questionsWithoutAudioMetadata.map((question) => (
              <span className="metadata-pill warning" key={question.id}>
                {question.sourceLabel}: {question.title}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <section className="audio-section">
        <h2>Linked Audio Assets</h2>
        <div className="resource-list audio-resource-list">
          {audioRows.map(({ asset, linkedQuestions }) => (
            <article
              className={asset.missing ? "resource-card audio-card missing" : "resource-card audio-card"}
              key={asset.id}
            >
              <FileAudio size={20} />
              <div className="audio-card-main">
                <div className="audio-title-row">
                  <strong>{asset.title}</strong>
                  <div className={asset.missing ? "resource-status warn" : "resource-status good"}>
                    {asset.missing ? <AlertTriangle size={15} /> : <CheckCircle2 size={15} />}
                    {asset.missing ? "Missing locally" : "Available"}
                  </div>
                </div>
                <p>{asset.fileName}</p>
                <span>{asset.localPath}</span>
                <dl className="asset-metadata-list">
                  <div>
                    <dt>Type</dt>
                    <dd>{asset.mimeType}</dd>
                  </div>
                  <div>
                    <dt>Copyright</dt>
                    <dd>{asset.copyrightStatus}</dd>
                  </div>
                  <div>
                    <dt>Linked questions</dt>
                    <dd>{linkedQuestions.length}</dd>
                  </div>
                  {asset.durationSeconds ? (
                    <div>
                      <dt>Duration</dt>
                      <dd>{asset.durationSeconds}s</dd>
                    </div>
                  ) : null}
                </dl>
                <div className="linked-audio-questions">
                  {linkedQuestions.length > 0 ? (
                    linkedQuestions.map((question) => (
                      <span className="metadata-pill" key={question.id}>
                        {question.sourceLabel} Q{question.defaultQuestionNumber}
                      </span>
                    ))
                  ) : (
                    <span className="metadata-pill warning">Not linked to an active question</span>
                  )}
                </div>
                {asset.sourceNotes ? <p className="asset-source-note">{asset.sourceNotes}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
};

const questionsLinkedToAudioAsset = (asset: Asset, questions: Question[]) =>
  questions.filter(
    (question) => question.enabled && !question.archived && question.audioAssetIds.includes(asset.id),
  );

const AudioSummaryCard = ({
  detail,
  icon: Icon,
  label,
  tone = "default",
  value,
}: {
  detail: string;
  icon: typeof FileAudio;
  label: string;
  tone?: "default" | "warning";
  value: number;
}) => (
  <article className={tone === "warning" ? "audio-summary-card warning" : "audio-summary-card"}>
    <Icon size={18} />
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </div>
  </article>
);
