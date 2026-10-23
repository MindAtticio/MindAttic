/* ==========================================================================
   MIND ATTIC — FLUID ASYMMETRIC GLASS ENGINE & 5-REEL SWITCHER
   No hardcoded SVG paths: uses live ResizeObserver to compute responsive
   luxury asymmetrical bezier contours for all 3 glass planes + cinema viewport.
   ========================================================================== */

(function () {
  "use strict";

  const REELS = [
    {
      num: "01",
      title: "THE OCULUS · MEMORY ARCHIVE",
      eyebrow: "FRAME I — THE OCULUS · STORY FIRST",
      headlinePrimary: "Without narrative, it is just stone and steel.",
      headlineItalic: "We craft mythology.",
      subline:
        "A cinematic atelier. Eleven-time festival-selected authorship for maisons and founders that build for legacy.",
      timecode: "00:14:08:22",
      format: "35MM ANAMORPHIC",
      category: "ARCHIVE 01 // THE OCULUS",
      desc: "Golden-hour corneal reflection · Memory & origin study",
      laurel: "CANNES · TRIBECA · ANNECY HERITAGE",
    },
    {
      num: "02",
      title: "THE RAW · UNCUT OBSIDIAN AT DAWN",
      eyebrow: "FRAME II — THE RAW · ORIGIN SLATE",
      headlinePrimary: "A blank slate. A silent room.",
      headlineItalic: "Before the first cut.",
      subline:
        "The finest materials — marble, steel, silk, timber — find their meaning through narrative. We give them mythology.",
      timecode: "00:29:16:04",
      format: "65MM LARGE FORMAT",
      category: "ARCHIVE 02 // THE RAW",
      desc: "Monolithic obsidian marble · Still horizon at first light",
      laurel: "OFFICIAL SELECTION · AI MOVIE AWARDS 2026",
    },
    {
      num: "03",
      title: "THE MARK · PLATINUM LINE & SKETCH",
      eyebrow: "FRAME III — THE MARK · ARCHITECTURAL PRECISION",
      headlinePrimary: "Without narrative, it is just stone and steel.",
      headlineItalic: "Authorship is the edge.",
      subline:
        "Every engagement is a personal commission with a named director. Uncompromising craft from first line to final master.",
      timecode: "00:42:51:18",
      format: "MACRO PRIME · 50MM",
      category: "ARCHIVE 03 // THE MARK",
      desc: "Brushed platinum elevation · Superyacht & horology study",
      laurel: "FINALIST · BIG SCREEN HACK LONDON 2026",
    },
    {
      num: "04",
      title: "THE LEGACY · SUPERYACHT TWILIGHT",
      eyebrow: "FRAME IV — THE LEGACY · SOVEREIGN WORLDS",
      headlinePrimary: "Built for those who shape permanence.",
      headlineItalic: "We craft mythology.",
      subline:
        "Bespoke cinema for superyacht builders, luxury maisons, high jewelry, and private architectural sanctuaries.",
      timecode: "01:04:19:09",
      format: "ANAMORPHIC 2.39:1",
      category: "ARCHIVE 04 // THE LEGACY",
      desc: "Cantilevered smoked crystal · Mediterranean twilight cove",
      laurel: "WINNER · LONDON AI FILM FESTIVAL",
    },
    {
      num: "05",
      title: "EVERCLOSE · AUTEUR ANIMATED SERIES",
      eyebrow: "FRAME V — EVERCLOSE · ORIGINAL MYTHOLOGY",
      headlinePrimary: "The bond that saves you.",
      headlineItalic: "The bond that breaks you.",
      subline:
        "Written, directed, animated, and scored by Andrej Klimov. 27-minute flagship season — eleven-time festival selected.",
      timecode: "01:19:44:12",
      format: "DIGITAL ARTISTRY · 24FPS",
      category: "ARCHIVE 05 // EVERCLOSE",
      desc: "Siera & Anora · Flagship auteur animated drama",
      laurel: "BEST ANIMATION · SHAIKE FILM FESTIVAL LA CIOTAT",
    },
  ];

  /* ------------------------------------------------------------------------
     1. PARAMETRIC BEZIER PATH GENERATORS (Responsive to any W x H)
     ------------------------------------------------------------------------ */

  /**
   * Generates a rounded asymmetrical polygon/bezier path for Layer 1 & Layer 2
   * with a sleek architectural terrace step on the top edge.
   */
  function roundedRectPath(w, h, r, inset) {
    const rad = Math.max(8, r - inset);
    const x0 = inset;
    const y0 = inset;
    const x1 = w - inset;
    const y1 = h - inset;
    return [
      `M ${x0 + rad} ${y0}`,
      `L ${x1 - rad} ${y0}`,
      `Q ${x1} ${y0} ${x1} ${y0 + rad}`,
      `L ${x1} ${y1 - rad}`,
      `Q ${x1} ${y1} ${x1 - rad} ${y1}`,
      `L ${x0 + rad} ${y1}`,
      `Q ${x0} ${y1} ${x0} ${y1 - rad}`,
      `L ${x0} ${y0 + rad}`,
      `Q ${x0} ${y0} ${x0 + rad} ${y0}`,
      "Z",
    ].join(" ");
  }

  function buildChassisPath(w, h, r, inset, stepXRatio, stepDrop) {
    const mobile = w < 768;
    const x0 = inset;
    const y0 = inset;
    const x1 = w - inset;
    const y1 = h - inset;
    const radius = mobile ? 24 : r;
    const rad = Math.max(8, radius - inset);

    const stepX = Math.round(w * stepXRatio);
    const sDrop = mobile ? Math.round(stepDrop * 0.65) : stepDrop;
    const sWidth = mobile ? Math.min(36, Math.max(20, w * 0.06)) : Math.min(54, Math.max(24, w * 0.04));

    return [
      `M ${x0 + rad} ${y0}`,
      `L ${stepX - sWidth} ${y0}`,
      `C ${stepX - sWidth * 0.35} ${y0}, ${stepX - sWidth * 0.25} ${y0 + sDrop}, ${stepX + sWidth * 0.4} ${y0 + sDrop}`,
      `L ${x1 - rad} ${y0 + sDrop}`,
      `Q ${x1} ${y0 + sDrop} ${x1} ${y0 + sDrop + rad}`,
      `L ${x1} ${y1 - rad}`,
      `Q ${x1} ${y1} ${x1 - rad} ${y1}`,
      `L ${x0 + rad} ${y1}`,
      `Q ${x0} ${y1} ${x0} ${y1 - rad}`,
      `L ${x0} ${y0 + rad}`,
      `Q ${x0} ${y0} ${x0 + rad} ${y0}`,
      "Z",
    ].join(" ");
  }

  /**
   * Generates the Primary Layer 3 Asymmetrical Luxury Glass Path:
   * - Raised top-left Brand Sanctuary wing (echoing the Creature's taller left ear)
   * - Silky S-curve transition down to the HUD navigation terrace
   * - 30px rounded corners
   * - Subtle bottom architectural command dock step
   */
  function buildLayer3Path(w, h, inset) {
    const isMobile = w < 768;
    const r = isMobile ? 22 : 30;
    const rad = Math.max(8, r - inset);
    const x0 = inset;
    const y0 = inset;
    const x1 = w - inset;
    const y1 = h - inset;

    // Top-left sanctuary wing. On mobile the wing only covers the logo badge
    // (about 9px of drop at the top edge). The nav rail sits a full row below.
    const wingW = isMobile
      ? Math.min(Math.round(w * 0.64), 270)
      : Math.min(410, Math.max(280, Math.round(w * 0.27)));
    const slopeW = isMobile ? 42 : 68;
    const drop = isMobile ? 9 : 12;
    const slopeEnd = Math.min(wingW + slopeW, x1 - rad - 8);

    if (!isMobile) {
      return [
        `M ${x0 + rad} ${y0}`,
        `L ${wingW} ${y0}`,
        `C ${wingW + slopeW * 0.45} ${y0}, ${wingW + slopeW * 0.55} ${y0 + drop}, ${wingW + slopeW} ${y0 + drop}`,
        `L ${x1 - rad} ${y0 + drop}`,
        `Q ${x1} ${y0 + drop} ${x1} ${y0 + drop + rad}`,
        `L ${x1} ${y1 - rad}`,
        `Q ${x1} ${y1} ${x1 - rad} ${y1}`,
        `L ${x0 + rad} ${y1}`,
        `Q ${x0} ${y1} ${x0} ${y1 - rad}`,
        `L ${x0} ${y0 + rad}`,
        `Q ${x0} ${y0} ${x0 + rad} ${y0}`,
        "Z",
      ].join(" ");
    }

    const brCutX = 22;
    const brCutY = 16;
    return [
      `M ${x0 + rad} ${y0}`,
      `L ${wingW} ${y0}`,
      `C ${wingW + slopeW * 0.45} ${y0}, ${wingW + slopeW * 0.55} ${y0 + drop}, ${slopeEnd} ${y0 + drop}`,
      `L ${x1 - rad} ${y0 + drop}`,
      `Q ${x1} ${y0 + drop} ${x1} ${y0 + drop + rad}`,
      `L ${x1} ${y1 - brCutY - rad * 0.4}`,
      `Q ${x1} ${y1 - brCutY} ${x1 - brCutX * 0.35} ${y1 - brCutY * 0.55}`,
      `L ${x1 - brCutX * 0.75} ${y1 - brCutY * 0.15}`,
      `Q ${x1 - brCutX} ${y1} ${x1 - brCutX - rad * 0.5} ${y1}`,
      `L ${x0 + rad} ${y1}`,
      `Q ${x0} ${y1} ${x0} ${y1 - rad}`,
      `L ${x0} ${y0 + rad}`,
      `Q ${x0} ${y0} ${x0 + rad} ${y0}`,
      "Z",
    ].join(" ");
  }

  /**
   * Generates the Sculpted Asymmetrical Cinema Viewport Path:
   * - Top-left tailored diagonal/S-curve chamfer echoing the Creature's ear angle
   *   and Attachment 3's asymmetrical upper-left sweep, refined to Leica/Aston Martin precision
   * - Sweeping 28px corners
   * - Sculpted bottom-center trapezoid S-curve sanctuary notch for the "Commission a Work" CTA dock
   *   (upgraded from Attachment 3's bottom CTA notch)
   */
  function buildViewportPath(w, h, inset) {
    const isMobile = w < 768;
    const r = isMobile ? 20 : 28;
    const rad = Math.max(6, r - inset);
    const x0 = inset;
    const y0 = inset;
    const x1 = w - inset;
    const y1 = h - inset;

    // Top-left asymmetrical diagonal sweep (echoing the creature's left ear slope)
    const cutX = isMobile ? Math.min(52, Math.round(w * 0.13)) : Math.min(118, Math.round(w * 0.082));
    const cutY = isMobile ? Math.min(34, Math.round(h * 0.065)) : Math.min(68, Math.round(h * 0.095));

    // Bottom-center sculpted notch for the Commission a Work dock.
    const notchCurve = isMobile ? 26 : 48;
    const brCutX = isMobile ? 28 : 56;
    const brCutY = isMobile ? 20 : 42;
    let notchHalfW = isMobile
      ? Math.min(122, Math.max(96, Math.round(w * 0.33)))
      : Math.min(196, Math.max(28, Math.round(w * 0.3)));
    const notchDepth = isMobile ? 26 : 34;
    const cx = w * 0.5;
    // Keep the notch mouth to the left of the bottom-right chamfer.
    const brLanding = x1 - brCutX - rad * 0.6;
    const maxHalf = brLanding - cx - notchCurve - 6;
    if (maxHalf > 48) notchHalfW = Math.min(notchHalfW, maxHalf);

    const nLeftStart = cx - notchHalfW - notchCurve;
    const nLeftInner = cx - notchHalfW + notchCurve * 0.35;
    const nRightInner = cx + notchHalfW - notchCurve * 0.35;
    const nRightEnd = cx + notchHalfW + notchCurve;
    const nTopY = y1 - notchDepth;

    return [
      // Start after top-left diagonal sweep
      `M ${x0 + cutX} ${y0}`,
      // Top edge to top-right corner
      `L ${x1 - rad} ${y0}`,
      `Q ${x1} ${y0} ${x1} ${y0 + rad}`,
      // Right edge down to bottom-right sculpted chamfer
      `L ${x1} ${y1 - brCutY - rad * 0.5}`,
      `Q ${x1} ${y1 - brCutY} ${x1 - brCutX * 0.35} ${y1 - brCutY * 0.55}`,
      `L ${x1 - brCutX * 0.75} ${y1 - brCutY * 0.15}`,
      `Q ${x1 - brCutX} ${y1} ${x1 - brCutX - rad * 0.6} ${y1}`,
      // Bottom edge to right side of CTA notch
      `L ${nRightEnd} ${y1}`,
      `C ${nRightEnd - notchCurve * 0.55} ${y1}, ${nRightInner + notchCurve * 0.4} ${nTopY}, ${nRightInner} ${nTopY}`,
      `L ${nLeftInner} ${nTopY}`,
      `C ${nLeftInner - notchCurve * 0.4} ${nTopY}, ${nLeftStart + notchCurve * 0.55} ${y1}, ${nLeftStart} ${y1}`,
      // Bottom edge to bottom-left corner
      `L ${x0 + rad} ${y1}`,
      `Q ${x0} ${y1} ${x0} ${y1 - rad}`,
      // Left edge up to top-left diagonal sweep
      `L ${x0} ${y0 + cutY + rad * 0.45}`,
      `Q ${x0} ${y0 + cutY} ${x0 + cutX * 0.32} ${y0 + cutY * 0.62}`,
      `L ${x0 + cutX * 0.74} ${y0 + cutY * 0.18}`,
      `Q ${x0 + cutX * 0.92} ${y0} ${x0 + cutX} ${y0}`,
      "Z",
    ].join(" ");
  }

  /**
   * Renders the dual specular rims (1px #FFFFFF outer rim at opacity 1.0 +
   * 1px #FFFFFF inset border at opacity 0.50 + platinum accent arc) into an SVG element.
   */
  /**
   * The rim SVG must use the same pixel box as the element it outlines.
   * viewBox is that box in CSS pixels and preserveAspectRatio="none" prevents
   * a mismatched SVG viewport from letterboxing the stroke.
   * The visible stroke is inset by half its width so clip-path does not eat it,
   * while the clip itself is the element's exact perimeter.
   */
  function renderDualRimSVG(svgEl, outerD, insetD, w, h, showTopHighlight) {
    if (!svgEl) return;
    svgEl.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svgEl.setAttribute("width", String(w));
    svgEl.setAttribute("height", String(h));
    svgEl.setAttribute("preserveAspectRatio", "none");
    svgEl.innerHTML = `
      <path d="${insetD}" fill="none" stroke="rgba(255,255,255,0.50)" stroke-width="1" vector-effect="non-scaling-stroke" />
      <path d="${outerD}" fill="none" stroke="url(#platinum-rim-grad)" stroke-width="1.25" vector-effect="non-scaling-stroke" />
      ${
        showTopHighlight
          ? `<path d="${outerD}" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.95" vector-effect="non-scaling-stroke" stroke-dasharray="${Math.round(
              w * 0.42
            )} ${Math.round(w * 2 + h * 2)}" stroke-dashoffset="-${Math.round(w * 0.04)}" />`
          : ""
      }
    `;
  }

  function elementBox(el) {
    if (!el) return null;
    const w = Math.round(el.clientWidth);
    const h = Math.round(el.clientHeight);
    if (w < 2 || h < 2) return null;
    return { w, h };
  }

  function applyClip(el, d) {
    el.style.clipPath = `path("${d}")`;
    el.style.webkitClipPath = `path("${d}")`;
  }

  function updateFluidGlassGeometry() {
    const l1 = document.getElementById("glass-layer-1");
    const l2 = document.getElementById("glass-layer-2");
    const l3 = document.getElementById("glass-layer-3");
    const vp = document.getElementById("cinema-viewport");

    const b1 = elementBox(l1);
    if (b1) {
      const dOuter = buildChassisPath(b1.w, b1.h, 30, 0.5, 0.58, -8);
      const dInset = buildChassisPath(b1.w, b1.h, 30, 2.5, 0.58, -8);
      applyClip(l1, dOuter);
      renderDualRimSVG(document.getElementById("svg-layer-1"), dOuter, dInset, b1.w, b1.h, true);
    }

    const b2 = elementBox(l2);
    if (b2) {
      const dOuter = buildChassisPath(b2.w, b2.h, 30, 0.5, 0.24, 8);
      const dInset = buildChassisPath(b2.w, b2.h, 30, 2.5, 0.24, 8);
      applyClip(l2, dOuter);
      renderDualRimSVG(document.getElementById("svg-layer-2"), dOuter, dInset, b2.w, b2.h, true);
    }

    // #svg-layer-3 is absolutely inset on #glass-layer-3, so the path uses that
    // element's client box — not a padded or minimum height.
    const b3 = elementBox(l3);
    if (b3) {
      const dClip = buildLayer3Path(b3.w, b3.h, 0.5);
      const dRim = buildLayer3Path(b3.w, b3.h, 1.15);
      const dInset = buildLayer3Path(b3.w, b3.h, 2.6);
      applyClip(l3, dClip);
      renderDualRimSVG(document.getElementById("svg-layer-3"), dRim, dInset, b3.w, b3.h, true);
    }

    // #svg-viewport-rim lives inside #cinema-viewport. Its viewBox is that
    // element's clientWidth × clientHeight, the same box the image fills.
    const bvp = elementBox(vp);
    if (bvp) {
      const dClip = buildViewportPath(bvp.w, bvp.h, 0.5);
      const dRim = buildViewportPath(bvp.w, bvp.h, 1.15);
      const dInset = buildViewportPath(bvp.w, bvp.h, 2.6);
      applyClip(vp, dClip);
      renderDualRimSVG(document.getElementById("svg-viewport-rim"), dRim, dInset, bvp.w, bvp.h, true);
    }
  }

  /* ------------------------------------------------------------------------
     2. 5-REEL INTERACTIVE SWITCHER & HUD TELEMETRY UPDATER
     ------------------------------------------------------------------------ */
  let activeReelIndex = 0;
  let autoCycleTimer = null;

  function setActiveReel(index, userTriggered) {
    const nextIdx = ((index % REELS.length) + REELS.length) % REELS.length;
    activeReelIndex = nextIdx;
    const data = REELS[nextIdx];

    // Update slides
    const slides = document.querySelectorAll(".reel-slide");
    slides.forEach((s, i) => {
      s.classList.toggle("is-active", i === nextIdx);
    });

    // Update 5 frosted switcher buttons (active one scales 1.4x)
    const btns = document.querySelectorAll(".frosted-reel-btn");
    btns.forEach((b, i) => {
      b.classList.toggle("is-active", i === nextIdx);
    });

    // Update HUD telemetry readouts
    const elTopIdx = document.getElementById("hud-top-reel-idx");
    const elTopLaurel = document.getElementById("hud-top-laurel");
    const elVhudCode = document.getElementById("vhud-reel-code");
    const elVhudTitle = document.getElementById("vhud-reel-title");
    const elVhudTc = document.getElementById("vhud-timecode");
    const elVhudFormat = document.getElementById("vhud-format");
    const elSrNum = document.getElementById("sr-active-num");
    const elEyebrow = document.getElementById("editorial-eyebrow-text");
    const elHeadline = document.getElementById("editorial-headline");
    const elSubline = document.getElementById("editorial-subline");
    const elDockCat = document.getElementById("dock-reel-category");
    const elDockDesc = document.getElementById("dock-reel-desc");

    if (elTopIdx) elTopIdx.textContent = data.num;
    if (elTopLaurel) elTopLaurel.textContent = data.laurel;
    if (elVhudCode) elVhudCode.textContent = `REEL ${data.num} / 05`;
    if (elVhudTitle) elVhudTitle.textContent = data.title;
    if (elVhudTc) elVhudTc.textContent = data.timecode;
    if (elVhudFormat) elVhudFormat.textContent = data.format;
    if (elSrNum) elSrNum.textContent = data.num;
    if (elEyebrow) elEyebrow.textContent = data.eyebrow;
    if (elHeadline) {
      elHeadline.innerHTML = `<span class="headline-primary">${data.headlinePrimary}</span><em class="headline-italic">${data.headlineItalic}</em>`;
    }
    if (elSubline) elSubline.textContent = data.subline;
    if (elDockCat) elDockCat.textContent = data.category;
    if (elDockDesc) elDockDesc.textContent = data.desc;

    if (userTriggered) {
      restartAutoCycle();
    }
  }

  function restartAutoCycle() {
    if (autoCycleTimer) clearInterval(autoCycleTimer);
    autoCycleTimer = setInterval(() => {
      setActiveReel(activeReelIndex + 1, false);
    }, 6500);
  }

  function initInteractivity() {
    // 5 Right-Side Frosted Glass Buttons
    document.querySelectorAll(".frosted-reel-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-reel") || "0", 10);
        setActiveReel(idx, true);
      });
    });

    // Top-Right Stepped Glass HUD Navigation Rail
    document.querySelectorAll(".hud-nav-item").forEach((navBtn) => {
      navBtn.addEventListener("click", () => {
        document.querySelectorAll(".hud-nav-item").forEach((b) => b.classList.remove("is-active"));
        navBtn.classList.add("is-active");
      });
    });

    // Bottom Dock Next Reel Cycle Button
    const nextBtn = document.getElementById("dock-cycle-btn");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        setActiveReel(activeReelIndex + 1, true);
      });
    }

    // URL query param support for deterministic screenshot/preview states (?reel=1..5)
    const params = new URLSearchParams(window.location.search);
    const reelParam = parseInt(params.get("reel") || "1", 10);
    if (reelParam >= 1 && reelParam <= 5) {
      setActiveReel(reelParam - 1, false);
    }

    if (params.get("autoplay") !== "0") {
      restartAutoCycle();
    }
  }

  // Expose helper for programmatic control
  window.MindAtticHero = {
    setActiveReel,
    updateFluidGlassGeometry,
  };

  window.addEventListener("DOMContentLoaded", () => {
    updateFluidGlassGeometry();
    initInteractivity();

    if ("ResizeObserver" in window) {
      const ro = new ResizeObserver(() => {
        window.requestAnimationFrame(updateFluidGlassGeometry);
      });
      ["stage-assembly", "glass-layer-1", "glass-layer-2", "glass-layer-3", "cinema-viewport"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) ro.observe(el);
      });
    }
    window.addEventListener("resize", updateFluidGlassGeometry);
    window.addEventListener("load", updateFluidGlassGeometry);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updateFluidGlassGeometry);
    }
  });
})();
