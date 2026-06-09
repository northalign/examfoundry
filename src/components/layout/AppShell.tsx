import type { CSSProperties, ReactNode } from "react";
import type { ScreenId } from "../../app/App";
import type { BrandMode, BrandProfile } from "../../domain/exam/types";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface AppShellProps {
  activeBrand: BrandProfile;
  activeScreen: ScreenId;
  activeScreenLabel: string;
  brandMode: BrandMode;
  children: ReactNode;
  draftTitle: string;
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
          brandMode={brandMode}
          draftTitle={draftTitle}
          isPaperValid={isPaperValid}
          onBrandModeChange={onBrandModeChange}
        />
        <div className="breadcrumb-bar">
          <span>Exam Foundry</span>
          <span className="breadcrumb-divider">/</span>
          <strong>{activeScreenLabel}</strong>
        </div>
        <main className="app-main">{children}</main>
      </div>
    </div>
  );
};
