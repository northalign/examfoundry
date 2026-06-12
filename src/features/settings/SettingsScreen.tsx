import { Lock, Settings, Shield, Upload } from "lucide-react";
import { brandProfiles } from "../../domain/branding/brandProfiles";
import type { BrandMode, BrandProfile, DataPack } from "../../domain/exam/types";

interface SettingsScreenProps {
  activeBrand: BrandProfile;
  brandMode: BrandMode;
  dataPack: DataPack;
  onBrandModeChange: (brandMode: BrandMode) => void;
}

export const SettingsScreen = ({
  activeBrand,
  brandMode,
  dataPack,
  onBrandModeChange,
}: SettingsScreenProps) => (
  <section className="settings-page">
    <div className="page-heading">
      <h1>Settings</h1>
      <p>Application preferences and branding configuration.</p>
    </div>

    <article className="settings-card">
      <div className="settings-card-title">
        <h2>Branding</h2>
        <p>Control how the app and exported documents are branded.</p>
      </div>
      <div className="settings-row">
        <div>
          <strong>Brand mode</strong>
          <p>Choose the branding style for the app and exported papers.</p>
        </div>
        <div className="segmented-control">
          {brandProfiles.map((brandProfile) => (
            <button
              className={brandMode === brandProfile.mode ? "active" : ""}
              disabled={!brandProfile.enabled}
              key={brandProfile.id}
              onClick={() => onBrandModeChange(brandProfile.mode)}
              title={brandProfile.enabled ? undefined : "Custom branding is planned for a later version."}
              type="button"
            >
              <span>{brandProfile.name}</span>
              {!brandProfile.enabled ? <span className="segmented-note">Planned</span> : null}
            </button>
          ))}
        </div>
      </div>
      <div className="settings-row">
        <div>
          <strong>Crest / logo</strong>
          <p>Upload a crest or logo for use in the sidebar and exported documents.</p>
        </div>
        <div className="logo-dropzone">
          <Shield size={28} />
          <strong>{activeBrand.name} crest placeholder</strong>
          <button className="quiet-button" disabled type="button">
            <Upload size={15} />
            Upload new crest
          </button>
        </div>
      </div>
      <div className="settings-row">
        <div>
          <strong>Accent colour</strong>
          <p>Used for active navigation items, badges, and highlight elements.</p>
        </div>
        <div className="colour-control">
          <span style={{ background: activeBrand.accentColour }} />
          <code>{activeBrand.accentColour}</code>
          <p>{activeBrand.name} accent</p>
        </div>
      </div>
    </article>

    <article className="settings-card">
      <div className="settings-card-title">
        <h2>Document output</h2>
        <p>Settings applied to exported exam papers.</p>
      </div>
      <div className="settings-row">
        <div>
          <strong>Document footer</strong>
          <p>Text printed in the footer of each exported page.</p>
        </div>
        <input className="field-control settings-input" readOnly value={activeBrand.documentFooterText} />
      </div>
      <ToggleRow label="Include crest on cover page" />
      <ToggleRow label="Include specification code" />
    </article>

    <article className="settings-card">
      <div className="settings-card-title">
        <h2>Build settings</h2>
        <p>Internal build controls for v0.9.</p>
      </div>
      <ToggleRow label="Internal build warning" />
      <div className="settings-row">
        <div>
          <strong>Build tag</strong>
          <p>The label shown at the bottom of the sidebar.</p>
        </div>
        <code className="locked-code">
          {activeBrand.internalBuildLabel} - v0.9 <Lock size={14} />
        </code>
      </div>
    </article>

    <article className="settings-card">
      <div className="settings-card-header muted-header">
        <Settings size={18} />
        <div>
          <h2>Data packs</h2>
          <p>Current pack: {dataPack.name}</p>
        </div>
        <span className="metadata-pill">v1.2</span>
      </div>
      <div className="notice-box">
        Data pack import/export is coming in v1.2 for local, rights-cleared content.
      </div>
      <button className="quiet-button" disabled type="button">
        <Upload size={15} />
        Import data pack
      </button>
    </article>
  </section>
);

const ToggleRow = ({ label }: { label: string }) => (
  <div className="settings-row">
    <div>
      <strong>{label}</strong>
      <p>Enabled for the internal v0.9 build.</p>
    </div>
    <span className="toggle-on">On</span>
  </div>
);
