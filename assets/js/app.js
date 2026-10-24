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
      title: "EVERCLOSE · FLAGSHIP SERIES",
      video: "assets/reel-01-everclose.mp4",
      src: "assets/reel-01-everclose-poster.jpg",
      topCredit: "WRITTEN & DIRECTED BY ANDREJ KLIMOV",
      bottomRightCredit: "An independent action drama series, choreographed by a martial artist with 25 years' experience.",
      laurels: [
        { src: "assets/laurel-shaike-glass.png", alt: "Official Selection, Best Animation, Shaike Film Festival, La Ciotat 2026", width: 2485, height: 767 },
        { src: "assets/laurel-aimovie-glass.png", alt: "Official Selection, AI Movie Awards 2026", width: 1665, height: 1078 },
        { src: "assets/laurel-bigscreenhack-glass.png", alt: "Finalist, Big Screen Hack London 2026", width: 1540, height: 1291 },
      ],
    },
    {
      num: "02",
      title: "ERA OF GIANTS · PREHISTORIC MICRO DRAMA PILOT",
      video: "assets/reel-02-era-of-giants.mp4",
      src: "assets/reel-02-era-of-giants-poster.jpg",
      topCredit: "WRITTEN & DIRECTED BY ANDREJ KLIMOV",
      bottomRightCredit: "Prehistoric micro drama pilot, winner Best Action Film at AI London Film Festival 2026.",
      laurels: [
        { src: "assets/laurel-metamorph-glass.png", alt: "Shortlist, Metamorph Award 2026", width: 2024, height: 1100 },
        { src: "assets/laurel-bionic-glass.png", alt: "Finalist, BIONIC Awards 2026", width: 1665, height: 1078 },
        { src: "assets/laurel-ailondon-glass.png", alt: "Winner, AI London Film Festival 2026", width: 1698, height: 1100 },
        { src: "assets/laurel-kursaal-glass.png", alt: "Official Selection, Kursaal-AI Film Festival San Sebastián 2026", width: 1128, height: 863 },
      ],
    },
    {
      num: "03",
      code: "03",
      title: "ASHES · ANIMATED SHORT FILM",
      topCredit: "WRITTEN & DIRECTED BY ANDREJ KLIMOV",
      directorTag: "Animated drama short film, official selection at seven international festivals.",
      bottomRightCredit: "Animated drama short film, official selection at seven international festivals.",
      videoSrc: "assets/reel-03-ashes.mp4",
      video: "assets/reel-03-ashes.mp4",
      posterSrc: "assets/reel-03-ashes-poster.jpg",
      src: "assets/reel-03-ashes-poster.jpg",
      laurels: [
        { src: "assets/laurel-kursaal-finalist-glass.png", alt: "Finalist Nominee, Kursaal-AI Film Festival San Sebastián 2026", width: 549, height: 420 },
        { src: "assets/laurel-ashes-aimovie-glass.png", alt: "Official Selection, AI Movie Awards Magaluf, Spain 2026", width: 620, height: 420 },
        { src: "assets/laurel-ashes-shaike-glass.png", alt: "SHAIKE Best Animation TOP10 2025", width: 647, height: 420 },
        { src: "assets/laurel-aifilm3-glass.png", alt: "Official Selection, AI Film 3 - AI Film and Art Festival | Arizona | Year II 2025", width: 649, height: 420 },
        { src: "assets/laurel-aifj-glass.png", alt: "Official Selection, AI-FJ | AI Film Festival Japan 2025", width: 649, height: 420 },
        { src: "assets/laurel-lifeart-glass.png", alt: "Official Selection, LifeArt Festival 2026", width: 649, height: 420 },
        { src: "assets/laurel-monaco-glass.png", alt: "Official Selection, AI Film Fest Monaco", width: 835, height: 420 },
      ],
    },
    {
      num: "04",
      title: "VEILED · UPCOMING FANTASY SERIES",
      video: "assets/reel-04-veiled.mp4",
      src: "assets/reel-04-veiled-poster.jpg",
      topCredit: "WRITTEN & DIRECTED BY ANDREJ KLIMOV",
      bottomRightCredit: "The second flagship series, an original fantasy world of adventure and magic, now in development.",
      status: "IN DEVELOPMENT",
      laurels: [],
    },
    {
      num: "05",
      title: "NOCTURNE IX · PRIVATE AVIATION",
      topCredit: "WRITTEN & DIRECTED BY ANDREJ KLIMOV",
      bottomRightCredit: "BESPOKE CABIN STUDY · GENEVA COMMISSION · DIR. ANDREJ KLIMOV",
      laurels: [
        { src: "assets/laurel-monaco-glass.svg", alt: "Monaco Yacht Show Grand Prix", width: 808, height: 672 },
        { src: "assets/laurel-lia-glass.svg", alt: "London International Awards", width: 808, height: 672 },
      ],
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

  /**
   * Layer 2 on a phone. The sheet is already larger than the main panel;
   * this contour keeps the outer top-right and bottom-left on that larger
   * box and steps the opposite corners in, so both wings read from behind
   * the main frame.
   */
  function buildRearPanelPath(w, h, inset) {
    const rad = Math.max(8, 16 - inset);
    const x0 = inset;
    const y0 = inset;
    const x1 = w - inset;
    const y1 = h - inset;
    const rise = Math.round(Math.min(16, Math.max(11, h * 0.014)));
    const step = Math.round(Math.min(26, Math.max(16, w * 0.048)));
    const topJoin = Math.round(Math.min(w * 0.64, x1 - rad - step - 12));
    const botJoin = Math.round(Math.max(w * 0.32, x0 + rad + step + 12));
    return [
      `M ${x0 + rad} ${y0 + rise}`,
      `L ${topJoin - step} ${y0 + rise}`,
      `C ${topJoin - step * 0.35} ${y0 + rise}, ${topJoin - step * 0.12} ${y0}, ${topJoin + step * 0.4} ${y0}`,
      `L ${x1 - rad} ${y0}`,
      `Q ${x1} ${y0} ${x1} ${y0 + rad}`,
      `L ${x1} ${y1 - rise - rad}`,
      `Q ${x1} ${y1 - rise} ${x1 - rad} ${y1 - rise}`,
      `L ${botJoin + step} ${y1 - rise}`,
      `C ${botJoin + step * 0.35} ${y1 - rise}, ${botJoin + step * 0.12} ${y1}, ${botJoin - step * 0.4} ${y1}`,
      `L ${x0 + rad} ${y1}`,
      `Q ${x0} ${y1} ${x0} ${y1 - rad}`,
      `L ${x0} ${y0 + rise + rad}`,
      `Q ${x0} ${y0 + rise} ${x0 + rad} ${y0 + rise}`,
      "Z",
    ].join(" ");
  }

  function buildChassisPath(w, h, r, inset, stepXRatio, stepDrop) {
    const mobile = layoutIsMobile();
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
    const isMobile = layoutIsMobile();
    const r = isMobile ? 22 : 30;
    const rad = Math.max(8, r - inset);
    const rTopLeft = Math.max(8, (isMobile ? 16 : r) - inset);
    const x0 = inset;
    const y0 = inset;
    const x1 = w - inset;
    const y1 = h - inset;

    // Top-left sanctuary wing. It follows the live logo panel so the longer
    // lockup, including CINEMATIC ATELIER, sits on the raised glass before the slope.
    const wingW = measureSanctuaryWing(isMobile, w, x1, rad);
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
      `M ${x0 + rTopLeft} ${y0}`,
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
      `L ${x0} ${y0 + rTopLeft}`,
      `Q ${x0} ${y0} ${x0 + rTopLeft} ${y0}`,
      "Z",
    ].join(" ");
  }

  function measureSanctuaryWing(isMobile, w, x1, rad) {
    const slopeW = isMobile ? 42 : 68;
    const fallback = isMobile
      ? Math.min(Math.round(w * 0.78), 295)
      : Math.max(340, Math.min(440, Math.round(w * 0.29)));
    const brand = document.getElementById("brand-sanctuary");
    const layer = document.getElementById("glass-layer-3");
    let wingW = fallback;
    if (brand && layer && brand.offsetWidth > 8) {
      const br = brand.getBoundingClientRect();
      const lr = layer.getBoundingClientRect();
      const pad = isMobile ? 14 : 24;
      wingW = Math.round(br.right - lr.left + pad);
    }
    const maxWing = Math.max(140, x1 - rad - slopeW - 10);
    const minWing = isMobile ? 140 : 220;
    return Math.max(minWing, Math.min(wingW, maxWing));
  }

  function layoutIsMobile() {
    return window.matchMedia("(max-width: 768px)").matches;
  }

  /**
   * Taper and fillet lengths for the commission trapezoid.
   * Top flat is narrower than the bottom by `taper` on each side.
   * tanTop / tanBot are the tangent lengths of the rounded shoulders.
   */
  function ctaMetrics(w, h, inset) {
    const isMobile = layoutIsMobile();
    const taper = isMobile ? Math.round(Math.min(w * 0.12, Math.max(18, h * 0.42))) : Math.round(w * 0.12);
    const rTop = isMobile ? 14 : 18;
    const rBot = isMobile ? 12 : 18;
    const x0 = inset;
    const y0 = inset;
    const x1 = w - inset;
    const y1 = h - inset;
    const innerW = Math.max(1, x1 - x0);
    const innerH = Math.max(1, y1 - y0);
    const t = Math.min(taper, innerW * 0.22);
    const side = Math.hypot(t, innerH);
    const ux = t / side;
    const uy = innerH / side;
    const interiorTop = Math.acos(Math.max(-1, Math.min(1, -ux)));
    const interiorBot = Math.acos(Math.max(-1, Math.min(1, ux)));
    const topRoom = Math.max(8, (innerW - 2 * t) / 2 - 4);
    const tanTop = Math.min(Math.max(6, rTop * Math.tan((Math.PI - interiorTop) / 2)), topRoom, side * 0.38);
    const tanBot = Math.min(Math.max(6, rBot * Math.tan((Math.PI - interiorBot) / 2)), innerW / 2 - 4, side * 0.38);
    return { t, tanTop, tanBot, side, ux, uy, slope: t / innerH, x0, y0, x1, y1 };
  }

  /**
   * Symmetrical tapered trapezoid. Every corner is a quadratic fillet
   * tangent to both edges, so the shoulders stay rounded.
   */
  function buildCtaPath(w, h, inset) {
    const { t, tanTop, tanBot, ux, uy, x0, y0, x1, y1 } = ctaMetrics(w, h, inset);
    const trX = x1 - t + ux * tanTop;
    const trY = y0 + uy * tanTop;
    const brX = x1 - ux * tanBot;
    const brY = y1 - uy * tanBot;
    const blX = x0 + ux * tanBot;
    const blY = y1 - uy * tanBot;
    const tlX = x0 + t - ux * tanTop;
    const tlY = y0 + uy * tanTop;

    return [
      `M ${x0 + t + tanTop} ${y0}`,
      `L ${x1 - t - tanTop} ${y0}`,
      `Q ${x1 - t} ${y0} ${trX} ${trY}`,
      `L ${brX} ${brY}`,
      `Q ${x1} ${y1} ${x1 - tanBot} ${y1}`,
      `L ${x0 + tanBot} ${y1}`,
      `Q ${x0} ${y1} ${blX} ${blY}`,
      `L ${tlX} ${tlY}`,
      `Q ${x0 + t} ${y0} ${x0 + t + tanTop} ${y0}`,
      "Z",
    ].join(" ");
  }

  /**
   * Pocket that mirrors the CTA trapezoid: same slope, ceiling and sides
   * held a uniform channel off the button's top and shoulders.
   */
  function measureCtaNotch(vpEl, btnEl) {
    const isMobile = layoutIsMobile();
    const channel = isMobile ? 8 : 9;
    const v = vpEl.getBoundingClientRect();
    const b = btnEl.getBoundingClientRect();
    const W = btnEl.clientWidth;
    const H = btnEl.clientHeight;
    if (W < 2 || H < 2 || v.width < 2) return null;

    const shape = ctaMetrics(W, H, 0);
    const overlap = v.bottom - b.top;
    // Ceiling sits one channel above the button. Raising the button deepens
    // the notch by the same amount, so the gap stays 8px on mobile / 9px on desktop.
    const depth = overlap > 0
      ? Math.round(Math.min(Math.max(overlap + channel, 28), 58))
      : (isMobile ? 42 : 44);
    const topHalf = W / 2 - shape.t;
    const ceilingHalf = topHalf + (channel * shape.side) / H - shape.slope * channel;

    return {
      depth,
      ceilingHalf,
      slope: shape.slope,
      shoulder: shape.tanTop,
      mouthRadius: isMobile ? 10 : 14,
      center: b.left - v.left + b.width / 2,
    };
  }

  /**
   * Generates the Sculpted Asymmetrical Cinema Viewport Path:
   * - Top-left tailored diagonal/S-curve chamfer echoing the Creature's ear angle
   *   and Attachment 3's asymmetrical upper-left sweep, refined to Leica/Aston Martin precision
   * - Sweeping 28px corners
   * - Sculpted bottom-center trapezoid S-curve sanctuary notch for the "Commission a Work" CTA dock
   *   (upgraded from Attachment 3's bottom CTA notch)
   */
  function buildViewportPath(w, h, inset, notch) {
    const isMobile = layoutIsMobile();
    const r = isMobile ? 20 : 28;
    const rad = Math.max(6, r - inset);
    const x0 = inset;
    const y0 = inset;
    const x1 = w - inset;
    const y1 = h - inset;

    // Top-left asymmetrical diagonal sweep (echoing the creature's left ear slope)
    const cutX = isMobile ? Math.min(52, Math.round(w * 0.13)) : Math.min(118, Math.round(w * 0.082));
    const cutY = isMobile ? Math.min(34, Math.round(h * 0.065)) : Math.min(68, Math.round(h * 0.095));

    // Bottom-center trapezoid notch. Defaults match the tapered CTA;
    // updateFluidGlassGeometry passes a measured pocket so the channel stays even.
    let brCutX = isMobile ? 28 : 56;
    let brCutY = isMobile ? 20 : 42;
    const notchDepth = notch ? notch.depth : isMobile ? 32 : 44;
    let ceilingHalf = notch ? notch.ceilingHalf : isMobile ? 108 : 160;
    const slope = notch ? notch.slope : isMobile ? 0.42 : 0.62;
    let shoulder = notch ? notch.shoulder : isMobile ? 9 : 12;
    let mouthR = notch ? notch.mouthRadius : isMobile ? 8 : 14;
    // The commission button is locked to 50%. The notch shares that center
    // so a longer reel credit cannot slide the cutout.
    const cx = w / 2;
    let mouthHalf = ceilingHalf + slope * notchDepth;

    // Keep the bottom-right chamfer outside the notch mouth. On a narrow
    // phone the tapered button needs the full mouth, so the chamfer yields
    // instead of pinching the ceiling narrower than the button.
    const sidePad = isMobile ? 4 : 8;
    const sideRoom = cx - (x0 + rad + mouthR + sidePad);
    const rightRoom = x1 - rad * 0.6 - mouthHalf - mouthR - sidePad - cx;
    if (rightRoom < brCutX) brCutX = Math.max(12, rightRoom);
    if (brCutX < 28 && isMobile) brCutY = Math.max(10, Math.round(brCutY * (brCutX / 28)));
    if (mouthHalf + mouthR > sideRoom && sideRoom > 48) {
      mouthHalf = sideRoom - mouthR;
      ceilingHalf = Math.max(36, mouthHalf - slope * notchDepth);
    }
    const sideUnit = Math.hypot(slope, 1);
    const slopeLen = notchDepth * sideUnit;
    shoulder = Math.min(shoulder, ceilingHalf - 8, slopeLen * 0.4);
    mouthR = Math.min(mouthR, slopeLen * 0.36);
    if (shoulder < 6) shoulder = 6;
    if (mouthR < 6) mouthR = 6;

    const nTopY = y1 - notchDepth;
    const ux = slope / sideUnit;
    const uy = 1 / sideUnit;
    const rCeilX = cx + ceilingHalf;
    const lCeilX = cx - ceilingHalf;
    const rMouthX = cx + mouthHalf;
    const lMouthX = cx - mouthHalf;
    const rSlopeHighX = rCeilX + ux * shoulder;
    const rSlopeHighY = nTopY + uy * shoulder;
    const lSlopeHighX = lCeilX - ux * shoulder;
    const lSlopeHighY = nTopY + uy * shoulder;
    const rSlopeLowX = rMouthX - ux * mouthR;
    const rSlopeLowY = y1 - uy * mouthR;
    const lSlopeLowX = lMouthX + ux * mouthR;
    const lSlopeLowY = y1 - uy * mouthR;

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
      // Bottom edge into the tapered CTA notch (rounded mouth, sloped sides, rounded ceiling)
      `L ${rMouthX + mouthR} ${y1}`,
      `Q ${rMouthX} ${y1} ${rSlopeLowX} ${rSlopeLowY}`,
      `L ${rSlopeHighX} ${rSlopeHighY}`,
      `Q ${rCeilX} ${nTopY} ${rCeilX - shoulder} ${nTopY}`,
      `L ${lCeilX + shoulder} ${nTopY}`,
      `Q ${lCeilX} ${nTopY} ${lSlopeHighX} ${lSlopeHighY}`,
      `L ${lSlopeLowX} ${lSlopeLowY}`,
      `Q ${lMouthX} ${y1} ${lMouthX - mouthR} ${y1}`,
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

  /**
   * The arc SVG uses the emitter's own pixel box as its viewBox, so a radius
   * is a radius on every screen. preserveAspectRatio meet keeps that 1:1.
   */
  function renderLightArcs() {
    const emitter = document.getElementById("light-emitter-layer");
    const svg = document.getElementById("svg-light-arcs");
    if (!emitter || !svg) return;
    const w = Math.round(emitter.clientWidth);
    const h = Math.round(emitter.clientHeight);
    if (w < 2 || h < 2) return;

    const isMobile = layoutIsMobile();
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.setAttribute("width", String(w));
    svg.setAttribute("height", String(h));
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

    const rTop = isMobile ? Math.round(Math.min(w * 0.24, 95)) : 155;
    const cx = Math.round(w * (isMobile ? 0.74 : 0.78));
    const cy = isMobile ? 110 : 180;

    // Side circles share the emitter's pixel box. Their chords sit inside
    // the cinema frame (the video hides the tips) and the minor arc bulges
    // outward, so the bright stroke crosses both frosted sheets and crests
    // in the dark margin. A chord on the outer rim never enters the glass.
    const viewport = document.getElementById("cinema-viewport");
    const emitterRect = emitter.getBoundingClientRect();
    const vpRect = viewport && viewport.clientWidth > 2 ? viewport.getBoundingClientRect() : null;
    const vpLeft = vpRect ? vpRect.left - emitterRect.left : w * 0.12;
    const vpRight = vpRect ? vpRect.right - emitterRect.left : w * 0.88;
    const vpTop = vpRect ? vpRect.top - emitterRect.top : h * 0.16;
    const vpBottom = vpRect ? vpRect.bottom - emitterRect.top : h * 0.84;
    const inset = isMobile ? 24 : 50;
    const lx = Math.round(vpLeft + inset);
    const rx = Math.round(vpRight - inset);

    let sideR = isMobile ? Math.round(h * 0.17) : Math.round(h * 0.25);
    let dy = sideR * 0.92;
    const chordRoom = Math.max(48, (vpBottom - vpTop) / 2 - (isMobile ? 18 : 28));
    if (dy > chordRoom) {
      dy = chordRoom;
      sideR = dy / 0.92;
    }
    const cySide = (vpTop + vpBottom) / 2;
    const vpH = vpBottom - vpTop;
    // Right circle sits higher, left sits lower. The shift stops once a tip
    // would leave the flat side of the frame and enter the corner radius.
    const corner = isMobile ? 36 : 48;
    const slack = Math.max(0, vpH / 2 - dy - corner);
    const shift = Math.min(Math.round(vpH * (isMobile ? 0.1 : 0.11)), Math.floor(slack));
    const rightCy = Math.round(cySide - shift);
    const leftCy = Math.round(cySide + shift);
    sideR = Math.round(sideR);
    const leftY1 = Math.round(leftCy - dy);
    const leftY2 = Math.round(leftCy + dy);
    const rightY1 = Math.round(rightCy - dy);
    const rightY2 = Math.round(rightCy + dy);

    const topD = `M ${cx - rTop} ${cy} A ${rTop} ${rTop} 0 0 1 ${cx + rTop} ${cy}`;
    const leftD = `M ${lx} ${leftY1} A ${sideR} ${sideR} 0 0 0 ${lx} ${leftY2}`;
    const rightD = `M ${rx} ${rightY1} A ${sideR} ${sideR} 0 0 1 ${rx} ${rightY2}`;

    svg.innerHTML = `
      <path d="${leftD}" fill="none" stroke="url(#champagne-arc-grad-vert)" stroke-width="5.5" stroke-linecap="round" class="caustic-arc caustic-arc--left" />
      <path d="${leftD}" fill="none" stroke="url(#champagne-core-vert)" stroke-width="2" stroke-linecap="round" />
      <path d="${rightD}" fill="none" stroke="url(#champagne-arc-grad-vert)" stroke-width="5" stroke-linecap="round" class="caustic-arc caustic-arc--right" />
      <path d="${rightD}" fill="none" stroke="url(#champagne-core-vert)" stroke-width="1.8" stroke-linecap="round" />
      <path d="${topD}" fill="none" stroke="url(#champagne-arc-grad-top)" stroke-width="5.5" stroke-linecap="round" class="caustic-arc caustic-arc--top" />
      <path d="${topD}" fill="none" stroke="url(#champagne-core-grad)" stroke-width="2" stroke-linecap="round" />
    `;

    const x1 = cx - rTop;
    const x2 = cx + rTop;
    ["champagne-arc-grad-top", "champagne-core-grad"].forEach((id) => {
      const grad = document.getElementById(id);
      if (!grad) return;
      grad.setAttribute("gradientUnits", "userSpaceOnUse");
      grad.setAttribute("x1", String(x1));
      grad.setAttribute("y1", String(cy));
      grad.setAttribute("x2", String(x2));
      grad.setAttribute("y2", String(cy));
    });
  }

  function updateFluidGlassGeometry() {
    renderLightArcs();
    const l1 = document.getElementById("glass-layer-1");
    const l2 = document.getElementById("glass-layer-2");
    const l3 = document.getElementById("glass-layer-3");
    const vp = document.getElementById("cinema-viewport");
    const cta = document.getElementById("cta-command-button");

    // Rear planes stay simple rounded rectangles. A negative stepDrop on
    // layer 1 pushed the stroke above y = 0, so the clip chopped the fill
    // and the rim floated across layer 2 in the top-right.
    const b1 = elementBox(l1);
    if (b1) {
      const dOuter = roundedRectPath(b1.w, b1.h, 30, 0.5);
      const dInset = roundedRectPath(b1.w, b1.h, 30, 2.5);
      applyClip(l1, dOuter);
      renderDualRimSVG(document.getElementById("svg-layer-1"), dOuter, dInset, b1.w, b1.h, true);
    }

    const b2 = elementBox(l2);
    if (b2) {
      const rear = layoutIsMobile();
      const dOuter = rear ? buildRearPanelPath(b2.w, b2.h, 0.5) : roundedRectPath(b2.w, b2.h, 30, 0.5);
      const dInset = rear ? buildRearPanelPath(b2.w, b2.h, 2.5) : roundedRectPath(b2.w, b2.h, 30, 2.5);
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

    const bcta = elementBox(cta);
    if (bcta && cta) {
      const dClip = buildCtaPath(bcta.w, bcta.h, 0.5);
      const dRim = buildCtaPath(bcta.w, bcta.h, 1.15);
      const dInset = buildCtaPath(bcta.w, bcta.h, 2.6);
      applyClip(cta, dClip);
      renderDualRimSVG(document.getElementById("svg-cta-rim"), dRim, dInset, bcta.w, bcta.h, true);
    }

    // #svg-viewport-rim lives inside #cinema-viewport. Its viewBox is that
    // element's clientWidth × clientHeight, the same box the image fills.
    // The notch is measured from the CTA so the two rims share a slope.
    const bvp = elementBox(vp);
    if (bvp) {
      const notch = cta ? measureCtaNotch(vp, cta) : null;
      const dClip = buildViewportPath(bvp.w, bvp.h, 0.5, notch);
      const dRim = buildViewportPath(bvp.w, bvp.h, 1.15, notch);
      const dInset = buildViewportPath(bvp.w, bvp.h, 2.6, notch);
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

    const elVhudCode = document.getElementById("vhud-reel-code");
    const elVhudTitle = document.getElementById("vhud-reel-title");
    const elTopCredit = document.getElementById("slope-credit");
    const elCredit = document.getElementById("vhud-director-tag");

    if (elVhudCode) elVhudCode.textContent = data.num;
    if (elVhudTitle) elVhudTitle.textContent = data.title;
    if (elTopCredit) elTopCredit.textContent = data.topCredit || "";
    if (elCredit) elCredit.textContent = data.bottomRightCredit || data.directorTag || "";
    renderLaurels(data.laurels || [], data.status || "");

    document.querySelectorAll(".reel-slide video").forEach((video) => {
      const slide = video.closest(".reel-slide");
      const active = slide && slide.classList.contains("is-active");
      if (active) {
        if (data.video && video.getAttribute("src") !== data.video) video.src = data.video;
        const play = video.play();
        if (play && play.catch) play.catch(() => {});
      } else {
        video.pause();
        if (video.hasAttribute("data-end-fade")) video.style.opacity = "1";
      }
    });

    if (userTriggered) {
      restartAutoCycle();
    }
  }

  let laurelsMarkup = "";

  function laurelSpan(item, extra) {
    const cls = extra ? `viewport-laurel ${extra}` : "viewport-laurel";
    const width = item.width ? ` width="${item.width}"` : "";
    const height = item.height ? ` height="${item.height}"` : "";
    return `<span class="${cls}"><img src="${item.src}" alt="${item.alt}"${width}${height} decoding="sync" loading="eager"></span>`;
  }

  function renderLaurels(laurels, status) {
    const host = document.getElementById("viewport-laurels");
    if (!host || !laurels) return;
    const count = laurels.length;
    let markup;
    if (!count) {
      markup = status ? `<span class="reel-status">${status}</span>` : "";
    } else if (count > 4) {
      const spans = laurels.map((item, i) => laurelSpan(item, i === count - 1 ? "is-base" : ""));
      const split = count - 3;
      markup = `<div class="laurel-cluster laurel-cluster--left">${spans.slice(0, split).join("")}</div><div class="laurel-cluster laurel-cluster--right">${spans.slice(split).join("")}</div>`;
    } else {
      markup = laurels.map((item) => laurelSpan(item)).join("");
    }
    const countKey = count ? String(count) : status ? "status" : "0";
    if (markup === laurelsMarkup && host.dataset.laurelCount === countKey) return;
    host.dataset.laurelCount = countKey;
    host.classList.toggle("has-status", !count && !!status);
    host.setAttribute("aria-label", count ? "Festival laurels" : status || "");
    host.toggleAttribute("hidden", !count && !status);
    host.innerHTML = markup;
    laurelsMarkup = markup;
  }

  /* Reel 04 ends on a full-frame flash. Fade the last 360ms, then fade back
     in at the first frame so the loop does not cut. */
  function bindEndFade(video) {
    if (!video || video.dataset.endFadeBound) return;
    video.dataset.endFadeBound = "1";
    const fadeMs = 360;
    let dimmed = false;
    let timer = 0;

    const apply = (mediaTime) => {
      const t = typeof mediaTime === "number" ? mediaTime : video.currentTime;
      if (!video.duration || !isFinite(video.duration) || video.paused) return;
      const remain = video.duration - t;
      if (remain <= fadeMs / 1000 && t > 0.5) {
        if (!dimmed) {
          dimmed = true;
          video.style.transition = `opacity ${fadeMs}ms linear`;
          video.style.opacity = "0";
        }
      } else if (remain > 1) {
        dimmed = false;
      }
    };

    let frameWatch = 0;
    const watchFrame = (_now, meta) => {
      apply(meta && meta.mediaTime);
      if (!video.paused && !video.ended && video.requestVideoFrameCallback) {
        frameWatch = video.requestVideoFrameCallback(watchFrame);
      }
    };
    const arm = () => {
      if (!timer) timer = window.setInterval(apply, 40);
      if (video.requestVideoFrameCallback && !frameWatch) {
        frameWatch = video.requestVideoFrameCallback(watchFrame);
      }
    };
    const disarm = () => {
      if (timer) {
        window.clearInterval(timer);
        timer = 0;
      }
      if (frameWatch && video.cancelVideoFrameCallback) {
        video.cancelVideoFrameCallback(frameWatch);
        frameWatch = 0;
      }
    };

    video.addEventListener("play", arm);
    video.addEventListener("pause", disarm);
    video.addEventListener("timeupdate", () => apply());
    video.addEventListener("ended", () => {
      disarm();
      const slide = video.closest(".reel-slide");
      dimmed = false;
      if (!slide || !slide.classList.contains("is-active")) {
        video.style.opacity = "1";
        return;
      }
      video.currentTime = 0;
      const play = video.play();
      if (play && play.catch) play.catch(() => {});
      window.requestAnimationFrame(() => {
        video.style.transition = `opacity ${fadeMs}ms linear`;
        video.style.opacity = "1";
      });
    });
  }

  function preloadLaurels() {
    const seen = Object.create(null);
    REELS.forEach((reel) => {
      (reel.laurels || []).forEach((item) => {
        if (!item.src || seen[item.src]) return;
        seen[item.src] = true;
        const img = new Image();
        img.decoding = "sync";
        if (item.width) img.width = item.width;
        if (item.height) img.height = item.height;
        img.src = item.src;
        if (typeof img.decode === "function") img.decode().catch(() => {});
      });
    });
  }

  function restartAutoCycle() {
    if (autoCycleTimer) clearInterval(autoCycleTimer);
    autoCycleTimer = setInterval(() => {
      setActiveReel(activeReelIndex + 1, false);
    }, 6500);
  }

  function setNavActive(name) {
    if (!name) return;
    document.querySelectorAll(".hud-nav-item, .mobile-menu-row").forEach((el) => {
      el.classList.toggle("is-active", el.getAttribute("data-nav") === name);
    });
  }

  function initMobileMenu() {
    const trigger = document.getElementById("mobile-menu-trigger");
    const menu = document.getElementById("mobile-glass-menu");
    if (!trigger || !menu) return;

    const setOpen = (open) => {
      menu.classList.toggle("is-open", open);
      trigger.classList.toggle("is-open", open);
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
      menu.setAttribute("aria-hidden", open ? "false" : "true");
    };

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      setOpen(!menu.classList.contains("is-open"));
    });

    menu.addEventListener("click", (event) => {
      const item = event.target.closest("[data-nav]");
      if (item) setNavActive(item.getAttribute("data-nav"));
      if (event.target.closest("a, button")) setOpen(false);
    });

    document.addEventListener("click", (event) => {
      if (!menu.classList.contains("is-open")) return;
      if (menu.contains(event.target) || trigger.contains(event.target)) return;
      setOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });

    const wide = window.matchMedia("(min-width: 769px)");
    const closeOnDesktop = () => {
      if (wide.matches) setOpen(false);
    };
    if (wide.addEventListener) wide.addEventListener("change", closeOnDesktop);
    else wide.addListener(closeOnDesktop);
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
        setNavActive(navBtn.getAttribute("data-nav"));
      });
    });

    initMobileMenu();

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

  preloadLaurels();
  document.querySelectorAll("video[data-end-fade]").forEach(bindEndFade);

  window.addEventListener("DOMContentLoaded", () => {
    updateFluidGlassGeometry();
    initInteractivity();

    if ("ResizeObserver" in window) {
      const ro = new ResizeObserver(() => {
        window.requestAnimationFrame(updateFluidGlassGeometry);
      });
      ["stage-assembly", "light-emitter-layer", "glass-layer-1", "glass-layer-2", "glass-layer-3", "cinema-viewport", "cta-command-button", "brand-sanctuary"].forEach((id) => {
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
