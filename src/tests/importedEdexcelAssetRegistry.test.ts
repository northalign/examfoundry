import { describe, expect, it } from "vitest";
import importedLocalDataPack from "../../seed-data/edexcel-a-level-music-imported-9mu0-03.json";
import type { DataPack } from "../domain/exam/types";
import { edexcelMusicDataPack } from "../seed/edexcelMusicSeed";

const importedDataPack = importedLocalDataPack as DataPack;

describe("imported Edexcel 9MU0/03 local asset registry", () => {
  it("registers the requested papers and question-bank items", () => {
    expect(importedDataPack.importedPapers?.map((paper) => `${paper.year} ${paper.series}`)).toEqual([
      "2018 June",
      "2019 June",
      "2020 October",
      "2021 November",
      "2022 June",
      "2023 June",
      "2024 June",
      "2025 June",
    ]);
    expect(importedDataPack.questions).toHaveLength(69);
    expect(
      importedDataPack.questions.filter((question) => question.questionType === "set_work_essay_option"),
    ).toHaveLength(29);
  });

  it("tracks expected audio as missing metadata instead of required files", () => {
    const audioAssets = importedDataPack.assets.filter((asset) => asset.type === "audio");

    expect(audioAssets).toHaveLength(40);
    expect(audioAssets.every((asset) => asset.missing)).toBe(true);
    expect(audioAssets.every((asset) => asset.localPath.includes("/audio/"))).toBe(true);
  });

  it("preserves the 2020 separate resource booklet metadata", () => {
    const october2020Paper = importedDataPack.importedPapers?.find(
      (paper) => paper.id === "edexcel_alevel_9mu0_2020_october_03",
    );

    expect(october2020Paper?.hasSeparateResourceBooklet).toBe(true);
    expect(october2020Paper?.resourceBookletPath).toContain("source/resource-booklets");
  });

  it("merges the imported local registry into the app seed data", () => {
    expect(edexcelMusicDataPack.localOnly).toBe(true);
    expect(edexcelMusicDataPack.distributionAllowed).toBe(false);
    expect(edexcelMusicDataPack.containsCopyrightedMaterial).toBe(true);
    expect(edexcelMusicDataPack.importedPapers).toHaveLength(8);
    expect(edexcelMusicDataPack.questions.length).toBeGreaterThan(importedDataPack.questions.length);
  });
});
