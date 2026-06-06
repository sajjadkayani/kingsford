"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import BedVisual from "./BedVisual/BedVisual";
import rules from "../data/configurator-rules.json";
import styles from "../Css/Configurator.module.css";

// ─── Price calculator ────────────────────────────────────────────────────────
function calculatePrice(config) {
  const styleData = rules.styles[config.style];
  if (!styleData) return 0;
  const sizeData = rules.sizes.find((s) => s.id === config.size);
  const multiplier = sizeData?.multiplier || 1.0;
  let price = styleData.basePrice * multiplier;
  if (config.storage && config.storage !== "none") {
    price += rules.storageOptions[config.storage]?.price || 0;
  }
  config.addons.forEach((a) => {
    price += rules.addons[a]?.price || 0;
  });
  return Math.round(price);
}

// ─── Filtering ───────────────────────────────────────────────────────────────
function getAvailable(config) {
  const styleData = config.style ? rules.styles[config.style] : null;
  const fabricData = config.fabric ? rules.fabrics[config.fabric] : null;

  return {
    sizes: rules.sizes.filter(
      (s) => !styleData || styleData.availableSizes.includes(s.id),
    ),
    styles: Object.entries(rules.styles)
      .filter(([, s]) => !config.size || s.availableSizes.includes(config.size))
      .map(([id, s]) => ({ id, ...s })),
    fabrics: styleData
      ? styleData.fabrics.map((id) => ({ id, ...rules.fabrics[id] }))
      : [],
    colours: fabricData
      ? fabricData.colours.map((id) => ({ id, ...rules.colours[id] }))
      : [],
    headboards: styleData?.headboards || [],
    legs: styleData?.legs || [],
    addons: styleData
      ? styleData.addons.map((id) => ({ id, ...rules.addons[id] }))
      : [],
    showStorage: styleData?.showStorage || false,
    storageOptions: styleData?.showStorage
      ? Object.entries(rules.storageOptions).map(([id, v]) => ({ id, ...v }))
      : [],
  };
}

// ─── WhatsApp message ────────────────────────────────────────────────────────
function buildWhatsApp(config, price) {
  return encodeURIComponent(
    `Hi Kingsford Sleep! I would like a quote:\n\n` +
      `Size: ${config.size}\n` +
      `Style: ${config.style}\n` +
      `Fabric: ${config.fabric}\n` +
      `Colour: ${config.colour}\n` +
      `Storage: ${config.storage || "None"}\n` +
      `Extras: ${config.addons.join(", ") || "None"}\n` +
      `Quote: £${price}\n\n` +
      `Name: ${config.name || ""}\n` +
      `Email: ${config.email || ""}\n` +
      `Phone: ${config.phone || ""}`,
  );
}

// ─── Step definitions ────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Size" },
  { id: 2, label: "Style" },
  { id: 3, label: "Fabric" },
  { id: 4, label: "Colour" },
  { id: 5, label: "Extras" },
  { id: 6, label: "Order" },
];

// ─── Inner component ─────────────────────────────────────────────────────────
function ConfiguratorInner() {
  const searchParams = useSearchParams();
  const preCategory = searchParams.get("category");
  const preProduct = searchParams.get("product");

  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    size: "single", // ← default size
    style: preCategory || null,
    headboard: null,
    fabric: null,
    colour: null,
    legs: null,
    storage: null,
    addons: [],
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const available = getAvailable(config);

  const price = calculatePrice(config);

  const set = (key, value) => setConfig((prev) => ({ ...prev, [key]: value }));

  const toggleAddon = (id) =>
    setConfig((prev) => ({
      ...prev,
      addons: prev.addons.includes(id)
        ? prev.addons.filter((a) => a !== id)
        : [...prev.addons, id],
    }));

  const canProceed = () => {
    if (step === 1) return !!config.size;
    if (step === 2) return !!config.style;
    if (step === 3) return !!config.fabric;
    if (step === 4) return !!config.colour;
    if (step === 5) return true;
    return false;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setSubmitted(true);
  };

  // ── Success screen ──
  if (submitted) {
    return (
      <div className={styles.success}>
        <div className={styles.successInner}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.successTitle}>Order Received</h1>
          <p className={styles.successText}>
            Thank you {config.name}. We will confirm within 24 hours.
          </p>
          <div className={styles.successDetails}>
            <div className={styles.successRow}>
              <span>Style</span>
              <span>{config.style}</span>
            </div>
            <div className={styles.successRow}>
              <span>Size</span>
              <span>{config.size}</span>
            </div>
            <div className={styles.successRow}>
              <span>Fabric</span>
              <span>{config.fabric}</span>
            </div>
            <div className={styles.successRow}>
              <span>Colour</span>
              <span>{config.colour}</span>
            </div>
            <div className={styles.successRow}>
              <span>Total</span>
              <span className={styles.successPrice}>£{price}</span>
            </div>
          </div>
          <a
            href={`https://wa.me/447700000000?text=${buildWhatsApp(config, price)}`}
            className="btn btn--whatsapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Also confirm via WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className="container">
          <span className="section-label">Bed Configurator</span>
          <h1 className={`display-heading ${styles.title}`}>
            Build your <em>perfect bed</em>
          </h1>
          <p className={styles.subtitle}>
            Every detail made to your specification.
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className={styles.progress}>
        <div className="container">
          <div className={styles.progressSteps}>
            {STEPS.map((s, i) => (
              <div key={s.id} className={styles.progressItem}>
                <button
                  className={`${styles.stepDot} ${step === s.id ? styles.stepDotActive : ""} ${step > s.id ? styles.stepDotDone : ""}`}
                  onClick={() => step > s.id && setStep(s.id)}
                  disabled={step <= s.id}
                >
                  {step > s.id ? (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M2 5l2 2 4-4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    s.id
                  )}
                </button>
                <span
                  className={`${styles.stepDotLabel} ${step === s.id ? styles.stepDotLabelActive : ""}`}
                >
                  {s.label}
                </span>
                {i < STEPS.length - 1 && (
                  <div
                    className={`${styles.progressLine} ${step > s.id ? styles.progressLineDone : ""}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className={styles.main}>
        <div className="container">
          <div className={styles.layout}>
            {/* LEFT — SVG bed visual */}
            <div className={styles.visualCol}>
              <BedVisual
                config={{
                  size: config.size,
                  style: config.style,
                  headboard: config.headboard,
                  fabric: config.fabric,
                  colour: config.colour ? rules.colours[config.colour] : null,
                  legs: config.legs,
                  storage: config.storage,
                  addons: config.addons,
                }}
              />

              {/* Live price under visual */}
              <div className={styles.visualPrice}>
                <span className={styles.visualPriceLabel}>Your quote</span>
                <span className={styles.visualPriceAmount}>
                  {price > 0 ? `£${price}` : "—"}
                </span>
                <span className={styles.visualPriceNote}>
                  inc. free UK delivery
                </span>
              </div>
            </div>

            {/* RIGHT — step content */}
            <div className={styles.stepsCol}>
              <div className={styles.stepCard}>
                {/* Step 1 — Size */}
                {step === 1 && (
                  <div className={styles.stepContent} key="step-1">
                    <h2 className={styles.stepQuestion}>
                      What size do you need?
                    </h2>
                    <p className={styles.stepHint}>
                      Your room size determines the best fit.
                    </p>
                    <div className={styles.sizeGrid}>
                      {available.sizes.map((s) => (
                        <button
                          key={s.id}
                          className={`${styles.sizeBtn} ${config.size === s.id ? styles.sizeBtnActive : ""}`}
                          onClick={() => {
                            set("size", s.id);
                            set("style", null);
                            set("headboard", null);
                          }}
                        >
                          <span className={styles.sizeBtnLabel}>{s.label}</span>
                          <span className={styles.sizeBtnDims}>
                            {s.dimensions}
                          </span>
                          <span className={styles.sizeBtnDesc}>
                            {s.description}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2 — Style */}
                {step === 2 && (
                  <div className={styles.stepContent} key="step-2">
                    <h2 className={styles.stepQuestion}>
                      What style speaks to you?
                    </h2>
                    <p className={styles.stepHint}>
                      All styles available in your chosen size.
                    </p>
                    <div className={styles.styleGrid}>
                      {available.styles.map((s) => (
                        <button
                          key={s.id}
                          className={`${styles.styleBtn} ${config.style === s.id ? styles.styleBtnActive : ""}`}
                          onClick={() => {
                            set("style", s.id);
                            set("headboard", s.headboards?.[0] || null);
                            set("legs", s.legs?.[0] || null);
                            set(
                              "storage",
                              s.storage === "lift-up" ? "lift-up" : null,
                            );
                          }}
                        >
                          <span className={styles.styleBtnName}>{s.label}</span>
                          <span className={styles.styleBtnTagline}>
                            {s.tagline}
                          </span>
                          <span className={styles.styleBtnPrice}>
                            From £
                            {Math.round(
                              s.basePrice *
                                (rules.sizes.find((sz) => sz.id === config.size)
                                  ?.multiplier || 1),
                            )}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3 — Fabric */}
                {step === 3 && (
                  <div className={styles.stepContent} key="step-3">
                    <h2 className={styles.stepQuestion}>Choose your fabric</h2>
                    <p className={styles.stepHint}>
                      Each fabric has its own character and feel.
                    </p>
                    <div className={styles.fabricGrid}>
                      {available.fabrics.map((f) => (
                        <button
                          key={f.id}
                          className={`${styles.fabricBtn} ${config.fabric === f.id ? styles.fabricBtnActive : ""}`}
                          onClick={() => {
                            set("fabric", f.id);
                            set("colour", null);
                          }}
                        >
                          <div
                            className={`${styles.fabricSwatch} ${styles[`swatch-${f.id}`]}`}
                          />
                          <span className={styles.fabricBtnName}>
                            {f.label}
                          </span>
                          <span className={styles.fabricBtnDesc}>
                            {f.description}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4 — Colour */}
                {step === 4 && (
                  <div className={styles.stepContent} key="step-4">
                    <h2 className={styles.stepQuestion}>Pick your colour</h2>
                    <p className={styles.stepHint}>
                      {config.fabric
                        ? `${rules.fabrics[config.fabric]?.label} colours`
                        : "Available colours"}
                    </p>
                    <div className={styles.colourGrid}>
                      {available.colours.map((c) => (
                        <button
                          key={c.id}
                          className={`${styles.colourBtn} ${config.colour === c.id ? styles.colourBtnActive : ""}`}
                          onClick={() => set("colour", c.id)}
                        >
                          <span
                            className={styles.colourDot}
                            style={{ background: c.hex }}
                          />
                          <span className={styles.colourBtnLabel}>
                            {c.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 5 — Extras */}
                {step === 5 && (
                  <div className={styles.stepContent} key="step-5">
                    <h2 className={styles.stepQuestion}>Finishing touches</h2>
                    <p className={styles.stepHint}>
                      All optional — add what feels right.
                    </p>

                    {/* Storage (divan only) */}
                    {available.showStorage && (
                      <div className={styles.extrasSection}>
                        <h3 className={styles.extrasSectionTitle}>Storage</h3>
                        <div className={styles.extrasGrid}>
                          {available.storageOptions.map((opt) => (
                            <button
                              key={opt.id}
                              className={`${styles.extraBtn} ${config.storage === opt.id ? styles.extraBtnActive : ""}`}
                              onClick={() => set("storage", opt.id)}
                            >
                              <span className={styles.extraBtnName}>
                                {opt.label}
                              </span>
                              {opt.price > 0 && (
                                <span className={styles.extraBtnPrice}>
                                  +£{opt.price}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Legs */}
                    {available.legs.length > 0 && (
                      <div className={styles.extrasSection}>
                        <h3 className={styles.extrasSectionTitle}>Legs</h3>
                        <div className={styles.legsGrid}>
                          {available.legs.map((legId) => (
                            <button
                              key={legId}
                              className={`${styles.legBtn} ${config.legs === legId ? styles.legBtnActive : ""}`}
                              onClick={() => set("legs", legId)}
                            >
                              <div
                                className={`${styles.legSwatch} ${styles[`leg-${legId}`]}`}
                              />
                              <span>
                                {legId.charAt(0).toUpperCase() + legId.slice(1)}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add-ons */}
                    {available.addons.length > 0 && (
                      <div className={styles.extrasSection}>
                        <h3 className={styles.extrasSectionTitle}>Add-ons</h3>
                        <div className={styles.addonList}>
                          {available.addons.map((addon) => (
                            <button
                              key={addon.id}
                              className={`${styles.addonBtn} ${config.addons.includes(addon.id) ? styles.addonBtnActive : ""}`}
                              onClick={() => toggleAddon(addon.id)}
                            >
                              <span className={styles.addonCheck}>
                                {config.addons.includes(addon.id) ? "✓" : "+"}
                              </span>
                              <div className={styles.addonInfo}>
                                <span className={styles.addonName}>
                                  {addon.label}
                                </span>
                                <span className={styles.addonDesc}>
                                  {addon.description}
                                </span>
                              </div>
                              <span className={styles.addonPrice}>
                                +£{addon.price}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 6 — Order */}
                {step === 6 && (
                  <div className={styles.stepContent} key="step-6">
                    <h2 className={styles.stepQuestion}>Almost there</h2>
                    <p className={styles.stepHint}>
                      Leave your details and we confirm within 24 hours.
                    </p>

                    {/* Order summary */}
                    <div className={styles.orderSummary}>
                      <div className={styles.orderSummaryRow}>
                        <span>Style</span>
                        <span>{config.style?.replace("-", " ")}</span>
                      </div>
                      <div className={styles.orderSummaryRow}>
                        <span>Size</span>
                        <span>{config.size}</span>
                      </div>
                      <div className={styles.orderSummaryRow}>
                        <span>Fabric</span>
                        <span>{config.fabric}</span>
                      </div>
                      <div className={styles.orderSummaryRow}>
                        <span>Colour</span>
                        <span>
                          {rules.colours[config.colour]?.label || config.colour}
                        </span>
                      </div>
                      {config.addons.length > 0 && (
                        <div className={styles.orderSummaryRow}>
                          <span>Extras</span>
                          <span>
                            {config.addons
                              .map((a) => rules.addons[a]?.label)
                              .join(", ")}
                          </span>
                        </div>
                      )}
                      <div
                        className={`${styles.orderSummaryRow} ${styles.orderSummaryTotal}`}
                      >
                        <span>Total</span>
                        <span className={styles.orderSummaryPrice}>
                          £{price}
                        </span>
                      </div>
                    </div>

                    <div className={styles.form}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Full Name *</label>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder="John Smith"
                          value={config.name}
                          onChange={(e) => set("name", e.target.value)}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Email *</label>
                        <input
                          type="email"
                          className={styles.input}
                          placeholder="john@example.com"
                          value={config.email}
                          onChange={(e) => set("email", e.target.value)}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Phone</label>
                        <input
                          type="tel"
                          className={styles.input}
                          placeholder="+44 7700 000000"
                          value={config.phone}
                          onChange={(e) => set("phone", e.target.value)}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Notes</label>
                        <textarea
                          className={styles.textarea}
                          placeholder="Any special requirements..."
                          value={config.notes}
                          onChange={(e) => set("notes", e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className={styles.orderButtons}>
                      <button
                        className={`btn btn--primary ${styles.submitBtn}`}
                        onClick={handleSubmit}
                        disabled={!config.name || !config.email || submitting}
                      >
                        {submitting ? "Sending…" : `Confirm Order — £${price}`}
                      </button>
                      <a
                        href={`https://wa.me/447700000000?text=${buildWhatsApp(config, price)}`}
                        className={`btn btn--whatsapp ${styles.waBtn}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Order via WhatsApp
                      </a>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className={styles.nav}>
                  {step > 1 && (
                    <button
                      className={`btn btn--outline ${styles.backBtn}`}
                      onClick={() => setStep((s) => s - 1)}
                    >
                      ← Back
                    </button>
                  )}
                  {step < 6 && (
                    <button
                      className={`btn btn--primary ${styles.nextBtn} ${!canProceed() ? styles.nextBtnDisabled : ""}`}
                      onClick={() => canProceed() && setStep((s) => s + 1)}
                      disabled={!canProceed()}
                    >
                      Continue →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Configurator() {
  return (
    <Suspense
      fallback={<div style={{ minHeight: "100vh", background: "#0F0E0C" }} />}
    >
      <ConfiguratorInner />
    </Suspense>
  );
}
