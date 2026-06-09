# Audio and Copyright Strategy

## Version 0.9

Version 0.9 is an internal Stonyhurst-only build.

It may be used with locally held internal materials, but the repository and public app build must not include copyrighted exam-board paper text, audio, or scores unless the user has explicit rights to distribute them.

## Audio in v0.9

For A level in v0.9:

- Audio files are linked to questions.
- Audio files are not stitched.
- Audio files are not edited.
- The app displays whether audio is present or missing.
- Audio readiness contributes to Paper Health.

The v0.9 Audio Library should support:

- Showing linked files.
- Showing missing files.
- Displaying duration, filename, and local path where available.
- Opening or previewing audio later if implementation permits.
- Keeping audio metadata separate from copyrighted asset files.

## Audio in v1.0

For GCSE in v1.0:

- The app should support audio stitching.
- The app should combine supplied audio files into a usable exam playback sequence.
- This is not required for v0.9.
- The data model should not prevent it.

Possible future fields:

- playbackOrder
- repeatCount
- silenceBeforeSeconds
- silenceAfterSeconds
- candidateReadingTimeSeconds
- totalDurationSeconds
- stitchedAudioAssetId

## Copyright categories

Recommended status values:

- synthetic
- user_provided
- licensed_internal
- public_domain
- unknown
- not_for_distribution

## Public build rule

Public or release builds must not bundle:

- protected audio
- protected score images or PDFs
- protected past-paper text
- protected mark schemes
- protected exam-board source files

Public builds may include:

- synthetic sample data
- templates
- empty data-pack import tools
- schema definitions
- user-created content tools

## Internal build rule

Internal builds may reference local asset packs, but those packs must be kept outside the source repository.

Recommended folders:

```text
local-assets/
  audio/
  scores/
  source-pdfs/
  exports/
```

Add these folders to `.gitignore`.

## Data packs

A future data pack should include a manifest.

Example fields:

- packId
- name
- publisher
- version
- containsCopyrightedMaterial
- distributionAllowed
- targetAppVersion
- specifications
- checksum
- assetManifest

For Stonyhurst internal use, a data pack can be marked:

```json
{
  "containsCopyrightedMaterial": true,
  "distributionAllowed": false,
  "localOnly": true
}
```

## App warnings

The app should warn when:

- copyright status is unknown
- a question is marked not for distribution
- a protected data pack is installed
- the user tries to export a distributable data pack containing protected materials

## Implementation guidance

Do not place real copyrighted content in:

- source code
- tests
- public seed files
- screenshots
- documentation examples

Use synthetic placeholders unless the content is rights-cleared.
