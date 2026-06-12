import type { CSSProperties, ReactNode } from "react";
import type { ScreenId } from "../../app/App";
import type { BrandMode, BrandProfile } from "../../domain/exam/types";
import type { ExportPreparationState } from "../../domain/export/exportService";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface AppShellProps {
  activeBrand: BrandProfile;
  activeScreen: ScreenId;
  activeScreenLabel: string;
  brandMode: BrandMode;
  children: ReactNode;
  draftTitle: string;
  exportPreparation: ExportPreparationState;
  isPaperValid: boolean;
  onBrandModeChange: (brandMode: BrandMode) => void;
  onScreenChange: (screenId: ScreenId) => void;
}

export const AppShell = ({
  activeBrand,
  activeScreen,
  activeScreenLabel,
  brandMode,
  children,
  draftTitle,
  exportPreparation,
  isPaperValid,
  onBrandModeChange,
  onScreenChange,
}: AppShellProps) => {
  const shellStyle = {
    "--brand-primary": activeBrand.primaryColour,
    "--brand-accent": activeBrand.accentColour,
  } as CSSProperties;

  return (
    <div className="app-shell" style={shellStyle}>
      <Sidebar activeBrand={activeBrand} activeScreen={activeScreen} onScreenChange={onScreenChange} />
      <div className="app-frame">
        <TopBar
          activeBrand={activeBrand}
          brandMode={brandMode}
          draftTitle={draftTitle}
          exportPreparation={exportPreparation}
          isPaperValid={isPaperValid}
          onBrandModeChange={onBrandModeChange}
        />
        <div className="breadcrumb-bar">
          <span>{activeBrand.documentHeaderText}</span>
          <span className="breadcrumb-divider">/</span>
          <strong>{activeScreenLabel}</strong>
        </div>
        <main className="app-main">{children}</main>
      </div>
    </div>
  );
};
