import {
  BookOpen,
  Database,
  FileText,
  Headphones,
  PenLine,
  ScrollText,
  Settings,
  ShieldQuestion,
  Star,
} from "lucide-react";
import type { ScreenId } from "../../app/App";
import type { BrandProfile } from "../../domain/exam/types";

const workspaceItems: Array<{ id: ScreenId; label: string; icon: typeof FileText }> = [
  { id: "paper-builder", label: "Paper Builder", icon: FileText },
  { id: "question-editor", label: "Question Editor", icon: PenLine },
  { id: "question-writer", label: "Question Writer", icon: ShieldQuestion },
];

const resourceItems: Array<{ id: ScreenId; label: string; icon: typeof FileText }> = [
  { id: "question-bank", label: "Question Bank", icon: BookOpen },
  { id: "audio-library", label: "Audio Library", icon: Headphones },
  { id: "data-packs", label: "Data Packs", icon: Database },
];

interface SidebarProps {
  activeBrand: BrandProfile;
  activeScreen: ScreenId;
  onScreenChange: (screenId: ScreenId) => void;
}

export const Sidebar = ({ activeBrand, activeScreen, onScreenChange }: SidebarProps) => {
  const BrandIcon = activeBrand.mode === "neutral" ? BookOpen : Star;

  const renderItem = ({ id, label, icon: Icon }: { id: ScreenId; label: string; icon: typeof FileText }) => (
    <button
      className={activeScreen === id ? "sidebar-item active" : "sidebar-item"}
      key={id}
      onClick={() => onScreenChange(id)}
      type="button"
    >
      <Icon aria-hidden="true" size={17} />
      <span>{label}</span>
    </button>
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className={`crest-mark ${activeBrand.mode}`} aria-hidden="true">
          <BrandIcon size={18} fill={activeBrand.mode === "stonyhurst" ? "currentColor" : "none"} />
        </div>
        <span>{activeBrand.documentHeaderText}</span>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        <div className="sidebar-group">
          <p className="sidebar-heading">Workspace</p>
          {workspaceItems.map(renderItem)}
        </div>
        <div className="sidebar-group">
          <p className="sidebar-heading">Resources</p>
          {resourceItems.map(renderItem)}
        </div>
      </nav>

      <div className="sidebar-footer">
        <button
          className={activeScreen === "settings" ? "sidebar-item active" : "sidebar-item"}
          onClick={() => onScreenChange("settings")}
          type="button"
        >
          <Settings aria-hidden="true" size={17} />
          <span>Settings</span>
        </button>
        <div className="build-label">
          <ScrollText size={14} />
          <span>{activeBrand.internalBuildLabel}</span>
          <span>v0.9</span>
        </div>
      </div>
    </aside>
  );
};
