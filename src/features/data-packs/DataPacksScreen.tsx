import { Database, Download, Lock } from "lucide-react";
import type { DataPack } from "../../domain/exam/types";

export const DataPacksScreen = ({ dataPack }: { dataPack: DataPack }) => (
  <section className="content-panel narrow">
    <div className="page-heading">
      <h1>Data Packs</h1>
      <p>Import and manage question bank data packs. v0.9 ships with synthetic development data only.</p>
    </div>

    <article className="settings-card">
      <div className="settings-card-header muted-header">
        <Database size={18} />
        <div>
          <h2>{dataPack.name}</h2>
          <p>{dataPack.notes}</p>
        </div>
        <span className="metadata-pill">{dataPack.dataPackVersion}</span>
      </div>
      <div className="settings-row">
        <div>
          <strong>Distribution</strong>
          <p>
            {dataPack.distributionAllowed
              ? "Allowed for synthetic development data."
              : "Not for distribution."}
          </p>
        </div>
        <span className="metadata-pill">
          {dataPack.containsCopyrightedMaterial ? "Protected" : "Synthetic"}
        </span>
      </div>
      <div className="settings-row">
        <div>
          <strong>Import/export</strong>
          <p>Data pack import and export are planned for v1.2.</p>
        </div>
        <button className="quiet-button" disabled type="button">
          <Lock size={15} />
          Import data pack
        </button>
      </div>
      <button className="quiet-button" disabled type="button">
        <Download size={15} />
        Export manifest
      </button>
    </article>
  </section>
);
