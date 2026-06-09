# Imported Edexcel 9MU0/03 local assets

This project now has a one-off local import of Edexcel A level Music 9MU0/03 Component 3/Appraising asset packages.

## Asset location

The original package contents were extracted into:

```text
local-assets/examfoundry-imports/edexcel/alevel/9mu0/03/
```

Each package has a year/series folder:

```text
2018-june/
2019-june/
2020-october/
2021-november/
2022-june/
2023-june/
2024-june/
2025-june/
```

The extracted folders preserve the package structure, including `source/`, `working/`, `import-ready/`, manifests, paper JSON, question JSON, markdown files, Q4 image crops, Q6 score PDFs, and expected-audio filename lists. The `local-assets/` folder is gitignored because these packages contain protected material.

The app-visible metadata registry is stored at:

```text
seed-data/edexcel-a-level-music-imported-9mu0-03.json
```

That registry contains metadata and local paths only. It does not inline paper text, mark-scheme text, score content, or source PDF content.

## Imported years

- 2018 June
- 2019 June
- 2020 October
- 2021 November
- 2022 June
- 2023 June
- 2024 June
- 2025 June

2020 is marked with `hasSeparateResourceBooklet: true`; its resource booklet path points to:

```text
local-assets/examfoundry-imports/edexcel/alevel/9mu0/03/2020-october/source/resource-booklets/edexcel_alevel_9mu0_2020_october_03_resource-booklet.pdf
```

## Missing audio

Audio files are intentionally not included and no placeholder audio files were created. The app registry records these assets as expected and missing.

Expected filenames:

```text
edexcel_alevel_9mu0_2018_june_03_q1_audio.mp3
edexcel_alevel_9mu0_2018_june_03_q2_audio.mp3
edexcel_alevel_9mu0_2018_june_03_q3_audio.mp3
edexcel_alevel_9mu0_2018_june_03_q4_audio.mp3
edexcel_alevel_9mu0_2018_june_03_q5_audio.mp3
edexcel_alevel_9mu0_2019_june_03_q1_audio.mp3
edexcel_alevel_9mu0_2019_june_03_q2_audio.mp3
edexcel_alevel_9mu0_2019_june_03_q3_audio.mp3
edexcel_alevel_9mu0_2019_june_03_q4_audio.mp3
edexcel_alevel_9mu0_2019_june_03_q5_audio.mp3
edexcel_alevel_9mu0_2020_october_03_q1_audio.mp3
edexcel_alevel_9mu0_2020_october_03_q2_audio.mp3
edexcel_alevel_9mu0_2020_october_03_q3_audio.mp3
edexcel_alevel_9mu0_2020_october_03_q4_audio.mp3
edexcel_alevel_9mu0_2020_october_03_q5_audio.mp3
edexcel_alevel_9mu0_2021_november_03_q1_audio.mp3
edexcel_alevel_9mu0_2021_november_03_q2_audio.mp3
edexcel_alevel_9mu0_2021_november_03_q3_audio.mp3
edexcel_alevel_9mu0_2021_november_03_q4_audio.mp3
edexcel_alevel_9mu0_2021_november_03_q5_audio.mp3
edexcel_alevel_9mu0_2022_june_03_q1_audio.mp3
edexcel_alevel_9mu0_2022_june_03_q2_audio.mp3
edexcel_alevel_9mu0_2022_june_03_q3_audio.mp3
edexcel_alevel_9mu0_2022_june_03_q4_audio.mp3
edexcel_alevel_9mu0_2022_june_03_q5_audio.mp3
edexcel_alevel_9mu0_2023_june_03_q1_audio.mp3
edexcel_alevel_9mu0_2023_june_03_q2_audio.mp3
edexcel_alevel_9mu0_2023_june_03_q3_audio.mp3
edexcel_alevel_9mu0_2023_june_03_q4_audio.mp3
edexcel_alevel_9mu0_2023_june_03_q5_audio.mp3
edexcel_alevel_9mu0_2024_june_03_q1_audio.mp3
edexcel_alevel_9mu0_2024_june_03_q2_audio.mp3
edexcel_alevel_9mu0_2024_june_03_q3_audio.mp3
edexcel_alevel_9mu0_2024_june_03_q4_audio.mp3
edexcel_alevel_9mu0_2024_june_03_q5_audio.mp3
edexcel_alevel_9mu0_2025_june_03_q1_audio.mp3
edexcel_alevel_9mu0_2025_june_03_q2_audio.mp3
edexcel_alevel_9mu0_2025_june_03_q3_audio.mp3
edexcel_alevel_9mu0_2025_june_03_q4_audio.mp3
edexcel_alevel_9mu0_2025_june_03_q5_audio.mp3
```

## Adding audio later

Add real audio files to the relevant year folder using this convention:

```text
local-assets/examfoundry-imports/edexcel/alevel/9mu0/03/<year-series>/audio/<expected-filename>.mp3
```

Then update the matching audio asset records in `seed-data/edexcel-a-level-music-imported-9mu0-03.json` from `"missing": true` to `"missing": false`. Do not commit the audio files.

## Assumptions

- This was a one-off local import, not a reusable importer.
- Q1 to Q5 are registered as paper questions.
- Q6 options are registered as individual reusable score-based question-bank items.
- 2018, 2019, and 2020 have three Q6 options; later packages have four.
- Where older package JSON omitted a title, the markdown heading was used as metadata.
- Question markdown and mark-scheme markdown remain in `local-assets/`; seed data stores pointers to those files.
- Imported material is marked `not_for_distribution`, the merged app data pack is marked `localOnly`, and export/distribution is not allowed.
