import { AlertTriangle, CheckCircle2, Download, Eye, Save, X } from "lucide-react";
import { useState } from "react";
import { brandProfiles } from "../../domain/branding/brandProfiles";
import type { BrandMode, BrandProfile } from "../../domain/exam/types";
import type { ExportPreparationState } from "../../domain/export/exportService";

interface TopBarProps {
  activeBrand: BrandProfile;
  brandMode: BrandMode;
  draftTitle: string;
  exportPreparation: ExportPreparationState;
  isPaperValid: boolean;
  onBrandModeChange: (brandMode: BrandMode) => void;
}

export const TopBar = ({
  activeBrand,
  brandMode,
  draftTitle,
  exportPreparation,
  isPaperValid,
  onBrandModeChange,
}: TopBarProps) => {
  const [activeExportDialog, setActiveExportDialog] = useState<"preview" | "export" | null>(null);
  const exportTitle = exportPreparation.canExport
    ? "PDF export placeholder"
    : `Export blocked: ${exportPreparation.primaryReason}`;

  return (
    <header className="top-bar">
      <div className="top-title">
        <strong>{activeBrand.documentHeaderText}</strong>
        <span className="top-title-divider" />
        <span>
          Project: <b>{draftTitle}</b>
        </span>
      </div>

      <div className="top-actions">
        <select
          aria-label="Brand mode"
          className="brand-select"
          onChange={(event) => onBrandModeChange(event.target.value as BrandMode)}
          value={brandMode}
        >
          {brandProfiles.map((brandProfile) => (
            <option disabled={!brandProfile.enabled} key={brandProfile.id} value={brandProfile.mode}>
              {brandProfile.enabled ? brandProfile.name : `${brandProfile.name} (planned)`}
            </option>
          ))}
        </select>
        <button className="quiet-button" type="button">
          <Save size={15} />
          Save Draft
        </button>
        <button
          className="quiet-button"
          disabled={!exportPreparation.canPreview}
          onClick={() => setActiveExportDialog("preview")}
          title="Preview placeholder"
          type="button"
        >
          <Eye size={15} />
          Preview Paper
        </button>
        <div className="export-control">
          <button
            aria-describedby={exportPreparation.canExport ? undefined : "export-disabled-reason"}
            className="primary-button"
            disabled={!exportPreparation.canExport || !isPaperValid}
            onClick={() => setActiveExportDialog("export")}
            title={exportTitle}
            type="button"
          >
            <Download size={16} />
            Export PDF
          </button>
          {!exportPreparation.canExport ? (
            <span className="export-disabled-reason" id="export-disabled-reason">
              {exportPreparation.primaryReason}
            </span>
          ) : null}
        </div>
      </div>

      {activeExportDialog ? (
        <ExportPlaceholderDialog
          draftTitle={draftTitle}
          exportPreparation={exportPreparation}
          mode={activeExportDialog}
          onClose={() => setActiveExportDialog(null)}
        />
      ) : null}
    </header>
  );
};

interface ExportPlaceholderDialogProps {
  draftTitle: string;
  exportPreparation: ExportPreparationState;
  mode: "preview" | "export";
  onClose: () => void;
}

const ExportPlaceholderDialog = ({
  draftTitle,
  exportPreparation,
  mode,
  onClose,
}: ExportPlaceholderDialogProps) => {
  const isPreview = mode === "preview";
  const title = isPreview ? "Preview Paper" : "Export PDF";

  return (
    <div className="modal-backdrop">
      <section aria-modal="true" className="export-modal" role="dialog">
        <div className="modal-header">
          <div>
            <h2>{title}</h2>
            <p>{draftTitle}</p>
          </div>
          <button aria-label={`Close ${title}`} className="icon-button" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        <div
          className={
            exportPreparation.canExport
              ? "export-readiness-summary valid"
              : "export-readiness-summary warning"
          }
        >
          {exportPreparation.canExport ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <div>
            <strong>
              {isPreview
                ? "Preview placeholder"
                : exportPreparation.canExport
                  ? "Export placeholder"
                  : "Export blocked"}
            </strong>
            <p>
              {isPreview
                ? "Paper preview will use the future export service interface."
                : exportPreparation.canExport
                  ? "PDF export will use the future export service interface."
                  : exportPreparation.primaryReason}
            </p>
          </div>
        </div>

        {exportPreparation.blockingReasons.length > 0 ? (
          <div className="export-reason-list blocking">
            <strong>Blocked by</strong>
            {exportPreparation.blockingReasons.map((reason) => (
              <p key={reason}>{reason}</p>
            ))}
          </div>
        ) : (
          <div className="export-reason-list ready">
            <strong>Ready for export preparation</strong>
            <p>Validation has no export-blocking issues.</p>
          </div>
        )}

        {exportPreparation.warningReasons.length > 0 ? (
          <div className="export-reason-list warning">
            <strong>Warnings</strong>
            {exportPreparation.warningReasons.slice(0, 3).map((reason) => (
              <p key={reason}>{reason}</p>
            ))}
          </div>
        ) : null}

        <div className="modal-actions">
          <span className="export-service-note">
            Export service status: {exportPreparation.implementationStatus}
          </span>
          <button className="primary-button" onClick={onClose} type="button">
            Done
          </button>
        </div>
      </section>
    </div>
  );
};
