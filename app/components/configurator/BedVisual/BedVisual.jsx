'use client'

import { useEffect, useRef } from "react";
import styles from "../../Css/BedVisual.module.css";

// ── Colour math ───────────────────────────────────────────────────────────────

function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h, s, l };
}

function hue2rgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function hslToRgb(h, s, l) {
  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: Math.min(255, Math.max(0, Math.round(hue2rgb(p, q, h + 1 / 3) * 255))),
    g: Math.min(255, Math.max(0, Math.round(hue2rgb(p, q, h) * 255))),
    b: Math.min(255, Math.max(0, Math.round(hue2rgb(p, q, h - 1 / 3) * 255))),
  };
}

// ── Core recolour — HSL method ────────────────────────────────────────────────
// Takes hue + saturation from the chosen colour, keeps every pixel's original
// lightness. Result: shadows stay dark, highlights stay bright, colour is exact.

function recolourCanvas(canvas, img, colourHex) {
  if (!canvas || !img || !img.naturalWidth) return;

  const ctx = canvas.getContext("2d");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);

  if (!colourHex) return;

  const { r: tr, g: tg, b: tb } = hexToRgb(colourHex);
  const { h: th, s: ts } = rgbToHsl(tr, tg, tb);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 10) continue; // skip transparent pixels

    const { l } = rgbToHsl(data[i], data[i + 1], data[i + 2]);
    const { r, g, b } = hslToRgb(th, ts, l); // target H+S, original L
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    // alpha unchanged
  }

  ctx.putImageData(imageData, 0, 0);
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function BedVisual({ config }) {
  const {
    size = null,
    style = null,
    fabric = null,
    colour = null,
  } = config || {};

  const canvasRef = useRef(null);
  const srcImgRef = useRef(null);
  const colourHex = colour?.hex || null;

  const showFrame = size && !style;
  const imageSrc = fabric
    ? `/beds/${style}-${fabric}.png`
    : showFrame
      ? `/beds/frames/${size}.png`
      : style
        ? `/beds/${style}.png`
        : null;

  // Re-run whenever colour or image changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = srcImgRef.current;
    if (!canvas || !img) return;
    if (img.complete && img.naturalWidth) {
      recolourCanvas(canvas, img, colourHex);
    }
  }, [colourHex, imageSrc]);

  const handleLoad = (e) => {
    recolourCanvas(canvasRef.current, e.target, colourHex);
  };

  const SIZE_DIMENSIONS = {
    single: { w: "90 cm", h: "190 cm" },
    "small-double": { w: "120 cm", h: "190 cm" },
    double: { w: "135 cm", h: "190 cm" },
    king: { w: "150 cm", h: "200 cm" },
    "super-king": { w: "180 cm", h: "200 cm" },
  };
  const dims = size ? SIZE_DIMENSIONS[size] : null;
  const labelParts = [style, size, fabric, colour?.label].filter(Boolean);

  return (
    <div className={styles.wrap}>
      <div className={styles.bedContainer}>
        {!imageSrc ? (
          <div className={styles.placeholder}>
            <span className={styles.placeholderText}>Start by selecting a size</span>
          </div>
        ) : (
          <div className={styles.visual}>
            {/* Hidden source — canvas reads pixels from here */}
            <img
              ref={srcImgRef}
              src={imageSrc}
              alt=""
              onLoad={handleLoad}
              className={styles.hiddenImg}
            />
            {/* Canvas: active when colour is chosen — shows HSL-recoloured image */}
            <canvas
              ref={canvasRef}
              className={styles.bedCanvas}
              style={{ display: colourHex ? "block" : "none" }}
            />
            {/* Plain image: shown before any colour is picked */}
            <img
              src={imageSrc}
              alt={labelParts.join(" ")}
              className={styles.baseImage}
              style={{ display: colourHex ? "none" : "block" }}
            />
          </div>
        )}
      </div>

      {dims && (
        <>
          <svg
            className={styles.measureSvgW}
            viewBox="0 0 100 10"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="2" y1="5" x2="98" y2="5" stroke="rgba(201,169,110,0.5)" strokeWidth="0.8" />
            <line x1="2" y1="1" x2="2" y2="9" stroke="rgba(201,169,110,0.5)" strokeWidth="0.8" />
            <line x1="98" y1="1" x2="98" y2="9" stroke="rgba(201,169,110,0.5)" strokeWidth="0.8" />
          </svg>
          <span className={styles.measureW}>{dims.w}</span>
          <svg
            className={styles.measureSvgH}
            viewBox="0 0 10 100"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="5" y1="2" x2="5" y2="98" stroke="rgba(201,169,110,0.5)" strokeWidth="0.8" />
            <line x1="1" y1="2" x2="9" y2="2" stroke="rgba(201,169,110,0.5)" strokeWidth="0.8" />
            <line x1="1" y1="98" x2="9" y2="98" stroke="rgba(201,169,110,0.5)" strokeWidth="0.8" />
          </svg>
          <span className={styles.measureH}>{dims.h}</span>
        </>
      )}

      {labelParts.length > 0 && (
        <span className={styles.label} key={labelParts.join("-")}>
          {labelParts.join(" · ").toUpperCase()}
        </span>
      )}
    </div>
  );
}
