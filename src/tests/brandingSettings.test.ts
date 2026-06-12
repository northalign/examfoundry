import { describe, expect, it } from "vitest";
import { brandProfiles } from "../domain/branding/brandProfiles";
import { edexcelALevelMusicTemplate } from "../domain/exam/template";
import { validateEdexcelALevelMusicPaper } from "../domain/validation/edexcelALevelMusic";
import { createInitialPaperDraft, edexcelMusicDataPack } from "../seed/edexcelMusicSeed";

describe("branding settings", () => {
  it("supports enabled Stonyhurst and neutral modes with a disabled custom placeholder", () => {
    const stonyhurstProfile = brandProfiles.find((brandProfile) => brandProfile.mode === "stonyhurst");
    const neutralProfile = brandProfiles.find((brandProfile) => brandProfile.mode === "neutral");
    const customProfile = brandProfiles.find((brandProfile) => brandProfile.mode === "custom");

    expect(stonyhurstProfile).toMatchObject({ enabled: true, name: "Stonyhurst" });
    expect(neutralProfile).toMatchObject({ enabled: true, name: "Neutral" });
    expect(customProfile).toMatchObject({ enabled: false, name: "Custom" });
    expect(neutralProfile?.primaryColour).not.toBe(stonyhurstProfile?.primaryColour);
    expect(neutralProfile?.accentColour).not.toBe(stonyhurstProfile?.accentColour);
  });

  it("keeps Edexcel validation independent from the selected brand profile", () => {
    const stonyhurstDraft = createInitialPaperDraft();
    const neutralProfile = brandProfiles.find((brandProfile) => brandProfile.mode === "neutral");

    if (!neutralProfile) {
      throw new Error("Expected neutral brand profile");
    }

    const neutralDraft = {
      ...createInitialPaperDraft(),
      brandProfileId: neutralProfile.id,
    };

    const validate = (draft: typeof stonyhurstDraft) =>
      validateEdexcelALevelMusicPaper({
        draft,
        template: edexcelALevelMusicTemplate,
        questions: edexcelMusicDataPack.questions,
        assets: edexcelMusicDataPack.assets,
      });

    const stonyhurstResult = validate(stonyhurstDraft);
    const neutralResult = validate(neutralDraft);

    expect(neutralResult.isValid).toBe(stonyhurstResult.isValid);
    expect(neutralResult.blockingErrors).toEqual(stonyhurstResult.blockingErrors);
    expect(neutralResult.warnings).toEqual(stonyhurstResult.warnings);
    expect(neutralResult.marksSummary).toEqual(stonyhurstResult.marksSummary);
    expect(neutralResult.areaOfStudySummary).toEqual(stonyhurstResult.areaOfStudySummary);
    expect(neutralResult.setWorkSummary).toEqual(stonyhurstResult.setWorkSummary);
  });
});
