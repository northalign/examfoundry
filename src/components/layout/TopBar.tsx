import { Download, Eye, Save } from "lucide-react";
import type { BrandMode } from "../../domain/exam/types";

interface TopBarProps {
  brandMode: BrandMode;
  draftTitle: string;
  isPaperValid: boolean;
  onBrandModeChange: (brandMode: BrandMode) => void;
}

export const TopBar = ({ brandMode, draftTitle, isPaperValid, onBrandModeChange }: TopBarProps) => {
  return (
    <header className="top-bar">
      <div className="top-title">
        <strong>Exam Foundry</strong>
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
          <option value="stonyhurst">Stonyhurst</option>
          <option value="neutral">Neutral</option>
          <option value="custom">Custom</option>
        </select>
        <button className="quiet-button" type="button">
          <Save size={15} />
          Save Draft
        </button>
        <button className="quiet-button" type="button">
          <Eye size={15} />
          Preview Paper
        </button>
        <button
          className="primary-button"
          disabled={!isPaperValid}
          onClick={() => window.alert("PDF export is planned for a later Exam Foundry milestone.")}
          title={isPaperValid ? "PDF export placeholder" : "Fix Paper Health issues before export"}
          type="button"
        >
          <Download size={16} />
          Export PDF
        </button>
      </div>
    </header>
  );
};
