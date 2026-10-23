# MINDATTIC.io — Section 1 prototype

Static preview of Section 1, the hero, for MINDATTIC.io: the smoked-crystal stage, platinum foil lockup, and story reel. Everything lives in `index.html` plus `assets/`.

## Open the file

From this directory, open `index.html` in a browser. Styles, scripts, fonts, and images use relative paths, so a file URL is enough for a first look:

```bash
xdg-open index.html
```

On macOS, use `open index.html`.

## Serve it

A local server is the reliable way to preview Section 1, especially if the browser restricts fonts on `file://`:

```bash
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080). The page is Section 1 only (`#hero-section`). Resize the window to check the mobile layout.

## Reference screenshots

- `section1-hero-full.png` — full hero at 1920×1080
- `section1-glass-detail.png` — glass rim and wordmark
- `section1-mobile.png` — mobile at 390×844
- `previews/` — the same frame at 375×667, 390×844, 430×932, 480×980, and 1920×1080

Add `?reel=4&autoplay=0` to hold one reel still.
