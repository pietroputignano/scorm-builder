# bSmart SCORM Builder v1.7 — standalone

Static site ready to upload to a GitHub Pages repository root. No npm, React build or backend needed.

## What changed

- One lightweight independent runtime (`extended-player.js` / `.css`) used by **every** exercise type in preview and exported SCORM.
- SCORM 1.2 packages embed the exercise, player and any uploaded media, without including the old proprietary bSmart runtime, fonts, CDN assets or remote APIs.
- Completion and reordering support tile click-to-place and desktop drag/drop.
- Supported exercise editors: completion, reorder, media tiles, audio/video choice, matching, per-step audio, example steps, multi-step/all-steps mode.
- The UI follows the V2 visual direction (navy header, cyan tiles, grey tray, white footer, green Verify); it is **not** the actual V2 React implementation nor a pixel-perfect replica.

## Deploy

Unzip and upload the **contents** to the repository root. In GitHub Settings > Pages, choose Deploy from branch / main / root. Open the published `index.html`. Do not upload the ZIP as the only repository file.

## SCORM testing

Export a ZIP from the builder, import it as SCORM 1.2 into an LMS and test: score, status, suspend/resume, each exercise type and audio/video. Opening the ZIP's `index.html` locally tests presentation but not LMS reporting.

## Current limitations

The standalone runtime is a reconstruction, not V2 itself. The all-steps layout retains individual verification controls. Desktop drag/drop is enabled for text/media slots; touch uses tap-to-select/tap-to-place. Test against your target LMS before production use. Existing proprietary runtime files under `player/` are retained in this **builder distribution only** for backwards comparison, but are **not** exported to SCORM.
