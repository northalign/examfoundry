import { AlertTriangle, CheckCircle2, FileAudio } from "lucide-react";
import type { DataPack } from "../../domain/exam/types";

export const AudioLibraryScreen = ({ dataPack }: { dataPack: DataPack }) => {
  const audioAssets = dataPack.assets.filter((asset) => asset.type === "audio");

  return (
    <section className="content-panel">
      <div className="page-heading">
        <h1>Audio Library</h1>
        <p>
          Track linked audio metadata for the current local data pack. Audio stitching is outside v0.9 scope.
        </p>
      </div>

      <div className="resource-list">
        {audioAssets.map((asset) => (
          <article className="resource-card" key={asset.id}>
            <FileAudio size={20} />
            <div>
              <strong>{asset.title}</strong>
              <p>{asset.fileName}</p>
              <span>{asset.localPath}</span>
            </div>
            <div className={asset.missing ? "resource-status warn" : "resource-status good"}>
              {asset.missing ? <AlertTriangle size={15} /> : <CheckCircle2 size={15} />}
              {asset.missing ? "Missing locally" : "Available"}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
