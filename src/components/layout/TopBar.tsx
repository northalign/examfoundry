import { Download, Eye, Save } from "lucide-react";
import { brandProfiles } from "../../domain/branding/brandProfiles";
import type { BrandMode, BrandProfile } from "../../domain/exam/types";

interface TopBarProps {
  activeBrand: BrandProfile;
  brandMode: BrandMode;
  draftTitle: string;
  isPaperValid: boolean;
  onBrandModeChange: (brandMode: BrandMode) => void;
}

export const TopBar = ({
  activeBrand,
  brandMode,
  draftTitle,
  isPaperValid,
  onBrandModeChange,
}: TopBarProps) => {
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
