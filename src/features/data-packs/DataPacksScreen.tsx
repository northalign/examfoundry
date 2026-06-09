import { Database, Download, Lock } from "lucide-react";
import type { DataPack } from "../../domain/exam/types";

export const DataPacksScreen = ({ dataPack }: { dataPack: DataPack }) => (
  <section className="content-panel narrow">
    <div className="page-heading">
      <h1>Data Packs</h1>
      <p>Review the current local question-bank registry. Generic import tooling is planned for v1.2.</p>
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
          <p>This build includes a one-off local Edexcel 9MU0/03 asset registry.</p>
        </div>
        <button className="quiet-button" disabled type="button">
          <Lock size={15} />
          Import data pack
        </button>
      </div>
      {dataPack.importedPapers?.length ? (
        <div className="settings-row stacked-row">
          <div>
            <strong>Imported papers</strong>
            <p>
              {dataPack.importedPapers.length} Edexcel A level Music Component 3 papers are registered
              locally.
            </p>
          </div>
          <div className="imported-paper-list">
            {dataPack.importedPapers.map((paper) => (
              <article className="imported-paper-item" key={paper.id}>
                <div>
                  <strong>
                    {paper.year} {paper.series}
                  </strong>
                  <p>
                    {paper.board} {paper.qualification} {paper.specification}/{paper.paper} -{" "}
                    {paper.component}
                  </p>
                </div>
                <span className="metadata-pill">{paper.questionIds.length} items</span>
                {paper.hasSeparateResourceBooklet ? (
                  <span className="metadata-pill warning">Separate resource booklet</span>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      ) : null}
      <button className="quiet-button" disabled type="button">
        <Download size={15} />
        Export manifest
      </button>
    </article>
  </section>
);
