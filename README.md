# bSmart SCORM Builder v1

Static web app ready for GitHub Pages. It creates SCORM 1.2 single-SCO packages using the supplied bSmart exercise player.

## V1 scope

- `INSERISCI` exercises with draggable/selectable tiles.
- Completion syntax: `Je [vais] à l'école.`
- Reorder syntax: `Je | vais | à l'école`
- Multiple steps and multiple gaps per step.
- Per-step tile banks (small runtime adaptation over the supplied player).
- UI language: IT / EN / FR / ES / DE.
- Attempts, step evaluation, solutions, reset, help and title options.
- SCORM 1.2 export with `suspend_data`, lesson location, raw score and lesson status.

## Deploy on GitHub Pages

Upload the entire folder contents to the repository root (or `/docs`) and enable GitHub Pages for that branch/folder. No build step is required.

## Player runtime changes

The original supplied minified bundle included a hard-coded demo bootstrap. `player/exercises-player.runtime.js` keeps the player library but removes that demo bootstrap. Two targeted patches are included for this authoring tool:

1. call `onVerify` also after desktop answer changes, so SCORM state can be written promptly;
2. allow a tile bank (`entitiesOptions`) per step and compute used tiles from the currently active step(s).

## Known v1 limitation

The supplied CSS references font/icon/image assets that were not included in the source files provided for this first version. The app works with browser fallbacks, but for pixel-identical rendering/offline completeness the original `fonts/` and `images/` folders should be added under `player/` (or the CSS URLs adjusted accordingly).


## Asset grafici inclusi
La V1 include gli asset originali forniti per il player bSmart:
- `player/fonts/` (KaTeX, Material Icons, Muli)
- `images/` (icone e controlli del player)

Gli asset vengono usati sia dalla preview su GitHub Pages sia inclusi automaticamente in ogni ZIP SCORM esportato, mantenendo i path attesi da `player/exercises-player.min.css`.

## Test locale

Gli SCORM esportati dalla versione aggiornata incorporano il contenuto dell'esercizio anche nel bootstrap. Per questo il file `index.html` del pacchetto puo essere aperto direttamente da disco (`file://`) per un test visuale di base, senza dipendere da `fetch(content.json)`. In un LMS/Books viene comunque usata la normale API SCORM 1.2 quando disponibile.

## v1.1 - test locale
Gli SCORM esportati incorporano il contenuto dell'esercizio nel bootstrap: il file `index.html` puo quindi essere aperto anche direttamente da disco (`file://`) per un test visuale di base. `content.json` resta incluso nel pacchetto. In Books/LMS, quando presente, viene usata la normale API SCORM 1.2.
