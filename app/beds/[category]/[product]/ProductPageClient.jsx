"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { addItem } from "../../../store/cartSlice";
import { COLOUR_HEX } from "../../../components/data/colours";
import styles from "../../../components/Css/BedProduct.module.css";

const DEFAULT_ADDON_PRICES = {
  "Diamond Buttoning": 80,
  "Chrome Feet": 40,
  "Gold Feet": 60,
  "Wooden Feet": 30,
  "Matching Headboard": 120,
  "USB Ports": 50,
};

const SIZE_MULTIPLIERS = {
  Single: 0.8,
  "Small Double": 0.9,
  Double: 1,
  King: 1.2,
  "Super King": 1.4,
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
};

const accordionVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.28, ease: "easeOut" },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

export default function ProductPageClient({ cat, prod }) {
  const dispatch = useDispatch();
  const [activeImage, setActiveImage] = useState(0);

  const initialFabric = prod?.fabrics?.[0] || "";
  const initialColour =
    (prod?.fabricColours?.[initialFabric]?.[0]) ||
    prod?.colours?.[0] ||
    "";

  const [selected, setSelected] = useState({
    size: prod?.sizes?.[2] || prod?.sizes?.[0] || "",
    fabric: initialFabric,
    colour: initialColour,
    addons: [],
  });
  const [openSections, setOpenSections] = useState({
    size: true,
    fabric: true,
    colour: true,
    extras: false,
  });
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [ordered, setOrdered] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [pricePulse, setPricePulse] = useState(false);
  const prevPrice = useRef(null);

  const images = prod.images || [];
  const sizes = prod.sizes || [];
  const fabrics = prod.fabrics || [];
  const addons = prod.addons || [];
  const ADDON_PRICES = { ...DEFAULT_ADDON_PRICES, ...(prod.addonPrices || {}) };
  const fabricColoursMap = prod.fabricColours || {};
  const fabricImagesMap = prod.fabricImages || {};

  // Colours specific to the selected fabric; fall back to flat list for old products
  const colours = fabricColoursMap[selected.fabric]?.length
    ? fabricColoursMap[selected.fabric]
    : prod.colours || [];

  const calculatePrice = () => {
    const base = prod.basePrice * (SIZE_MULTIPLIERS[selected.size] || 1);
    const addonsTotal = selected.addons.reduce(
      (sum, a) => sum + (ADDON_PRICES[a] || 0),
      0,
    );
    return Math.round(base + addonsTotal);
  };

  const price = calculatePrice();

  // Reset colour when fabric changes if current colour isn't available in new fabric
  useEffect(() => {
    const available = fabricColoursMap[selected.fabric];
    if (available?.length && !available.includes(selected.colour)) {
      setSelected((prev) => ({ ...prev, colour: available[0] }));
    }
  }, [selected.fabric]);

  useEffect(() => {
    if (prevPrice.current !== null && prevPrice.current !== price) {
      setPricePulse(true);
      const t = setTimeout(() => setPricePulse(false), 400);
      return () => clearTimeout(t);
    }
    prevPrice.current = price;
  }, [price]);

  function handleAddToCart() {
    const cartId = `${prod.id}-${selected.size}-${selected.fabric}-${selected.colour}`;
    dispatch(
      addItem({
        cartId,
        productId: prod.id,
        name: prod.name,
        categorySlug: cat.slug,
        categoryName: cat.category,
        productSlug: prod.slug,
        image: prod.images?.[0] || null,
        size: selected.size,
        fabric: selected.fabric,
        colour: selected.colour,
        addons: selected.addons,
        basePrice: prod.basePrice,
        price,
      }),
    );
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  const toggleAddon = (addon) => {
    setSelected((prev) => ({
      ...prev,
      addons: prev.addons.includes(addon)
        ? prev.addons.filter((a) => a !== addon)
        : [...prev.addons, addon],
    }));
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const buildWhatsAppMessage = () =>
    encodeURIComponent(
      `Hi Kingsford Sleep! I would like to order:\n\n` +
        `Bed: ${prod.name}\nSize: ${selected.size}\nFabric: ${selected.fabric}\n` +
        `Colour: ${selected.colour}\nExtras: ${selected.addons.length > 0 ? selected.addons.join(", ") : "None"}\n` +
        `Total: £${price}\n\nName: ${form.name || "Not provided"}\nEmail: ${form.email || "Not provided"}`,
    );

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: prod.name,
          category: cat.category,
          ...selected,
          price,
          ...form,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setOrdered(true);
    } catch {
      alert("Something went wrong. Please use WhatsApp to place your order.");
    } finally {
      setSubmitting(false);
    }
  };

  if (ordered) {
    return (
      <motion.div
        className={styles.success}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          className={styles.successIcon}
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2,
          }}
        >
          ✓
        </motion.div>
        <h2 className={styles.successTitle}>Order Request Placed</h2>
        <p className={styles.successText}>
          Thank you {form.name}. We will email you a deposit invoice for <strong>£{Math.round(price / 2)}</strong> within 24 hours — production begins as soon as it&apos;s paid. Your bed will be ready in 3–4 weeks.
        </p>
        <div className={styles.successSummary}>
          {[
            ["Bed", prod.name],
            ["Size", selected.size],
            ["Fabric", selected.fabric],
            ["Colour", selected.colour],
            ["Total", `£${price}`],
            ["Deposit due", `£${Math.round(price / 2)}`],
          ].map(([label, val], i) => (
            <motion.div
              key={label}
              className={styles.successRow}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.07 }}
            >
              <span>{label}</span>
              <span
                className={label === "Total" || label === "Deposit due" ? styles.successPrice : undefined}
              >
                {val}
              </span>
            </motion.div>
          ))}
        </div>
        <Link href="/beds" className="btn btn--outline">
          Browse More Beds
        </Link>
      </motion.div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <motion.div
        className={styles.breadcrumb}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="container-1">
          <nav aria-label="Breadcrumb">
            <Link href="/" className={styles.bcLink}>
              Home
            </Link>
            <span className={styles.bcSep}>/</span>
            <Link href="/beds" className={styles.bcLink}>
              Collection
            </Link>
            <span className={styles.bcSep}>/</span>
            <Link href={`/beds/${cat.slug}`} className={styles.bcLink}>
              {cat.category}
            </Link>
            <span className={styles.bcSep}>/</span>
            <span className={styles.bcCurrent}>{prod.name}</span>
          </nav>
        </div>
      </motion.div>

      <div className="container-1">
        <div className={styles.layout}>
          {/* ── Image column ── */}
          <motion.div
            className={styles.imageCol}
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {images.length > 1 && (
              <div className={styles.thumbCol}>
                <div className={styles.thumbnails}>
                  {images.map((img, i) => (
                    <motion.button
                      key={i}
                      className={`${styles.thumb} ${i === activeImage ? styles.thumbActive : ""}`}
                      onClick={() => setActiveImage(i)}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                    >
                      {img ? (
                        <img
                          src={img}
                          alt={`${prod.name} view ${i + 1}`}
                          className={styles.thumbImg}
                        />
                      ) : (
                        <div className={styles.thumbPlaceholder} />
                      )}
                    </motion.button>
                  ))}
                </div>
                <div className={styles.thumbFade} />
              </div>
            )}

            <div className={styles.mainImageWrap}>
              <AnimatePresence mode="wait">
                {images[activeImage] ? (
                  <motion.img
                    key={activeImage}
                    src={images[activeImage]}
                    alt={prod.name}
                    className={styles.mainImage}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  />
                ) : (
                  <div className={styles.imagePlaceholder}>
                    <svg width="56" height="56" viewBox="0 0 48 48" fill="none">
                      <path
                        d="M6 38V18L24 8L42 18V38"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16 38V28H32V38"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6 26H42"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className={styles.placeholderName}>{prod.name}</span>
                    <span className={styles.placeholderSub}>
                      Photo coming soon
                    </span>
                  </div>
                )}
              </AnimatePresence>
              {prod.badge && <span className={styles.badge}>{prod.badge}</span>}
            </div>
          </motion.div>

          {/* ── Config panel ── */}
          <motion.div
            className={styles.panel}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <motion.div
              className={styles.panelHeader}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              <span className={styles.categoryLabel}>{cat.category}</span>
              <h1 className={`display-heading ${styles.bedName}`}>
                {prod.name}
              </h1>
              <p className={styles.tagline}>{prod.tagline}</p>
            </motion.div>

            <motion.div
              className={styles.priceRow}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              <div className={styles.price}>
                <span className={styles.priceFrom}>From</span>
                <motion.span
                  className={styles.priceAmount}
                  animate={
                    pricePulse
                      ? {
                          scale: [1, 1.08, 1],
                          color: ["#e8d5a3", "#c9a96e", "#e8d5a3"],
                        }
                      : {}
                  }
                  transition={{ duration: 0.35 }}
                >
                  £{price}
                </motion.span>
              </div>
              <span className={styles.priceNote}>Free UK delivery</span>
            </motion.div>

            <motion.div
              className={styles.trustBadges}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
            >
              <span>✓ UK manufactured</span>
              <span>✓ Made to order</span>
              <span>✓ Free UK delivery</span>
            </motion.div>

            <motion.div
              className={styles.options}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
            >
              {/* Size */}
              <div className={styles.optionRow}>
                <button
                  className={styles.optionToggle}
                  onClick={() => toggleSection("size")}
                >
                  <div className={styles.optionToggleLeft}>
                    <span className={styles.optionToggleLabel}>Size</span>
                    <span className={styles.optionToggleValue}>
                      {selected.size}
                    </span>
                  </div>
                  <motion.svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    animate={{ rotate: openSections.size ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={styles.chevron}
                  >
                    <path
                      d="M2 4l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                </button>
                <AnimatePresence initial={false}>
                  {openSections.size && (
                    <motion.div
                      variants={accordionVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      style={{ overflow: "hidden" }}
                    >
                      <div className={styles.optionPanel}>
                        <div className={styles.sizeGrid}>
                          {sizes.map((size) => (
                            <motion.button
                              key={size}
                              className={`${styles.sizeBtn} ${selected.size === size ? styles.sizeBtnActive : ""}`}
                              onClick={() =>
                                setSelected((prev) => ({ ...prev, size }))
                              }
                              whileTap={{ scale: 0.95 }}
                            >
                              {size}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Fabric */}
              <div className={styles.optionRow}>
                <button
                  className={styles.optionToggle}
                  onClick={() => toggleSection("fabric")}
                >
                  <div className={styles.optionToggleLeft}>
                    <span className={styles.optionToggleLabel}>Fabric</span>
                    <span className={styles.optionToggleValue}>
                      {selected.fabric}
                    </span>
                  </div>
                  <motion.svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    animate={{ rotate: openSections.fabric ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={styles.chevron}
                  >
                    <path
                      d="M2 4l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                </button>
                <AnimatePresence initial={false}>
                  {openSections.fabric && (
                    <motion.div
                      variants={accordionVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      style={{ overflow: "hidden" }}
                    >
                      <div className={styles.optionPanel}>
                        <div className={styles.fabricGrid}>
                          {fabrics.map((fabric) => (
                            <motion.button
                              key={fabric}
                              className={`${styles.fabricBtn} ${selected.fabric === fabric ? styles.fabricBtnActive : ""}`}
                              onClick={() =>
                                setSelected((prev) => ({ ...prev, fabric }))
                              }
                              whileTap={{ scale: 0.95 }}
                            >
                              {fabricImagesMap[fabric] ? (
                                <img
                                  src={fabricImagesMap[fabric]}
                                  alt={fabric}
                                  style={{
                                    width: 40,
                                    height: 40,
                                    objectFit: "cover",
                                    borderRadius: 4,
                                    display: "block",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                  }}
                                />
                              ) : (
                                <div className={styles.fabricSwatch} />
                              )}
                              <span>{fabric}</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Colour */}
              <div className={styles.optionRow}>
                <button
                  className={styles.optionToggle}
                  onClick={() => toggleSection("colour")}
                >
                  <div className={styles.optionToggleLeft}>
                    <span className={styles.optionToggleLabel}>Colour</span>
                    <span className={styles.optionToggleValue}>
                      {selected.colour}
                    </span>
                  </div>
                  <motion.svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    animate={{ rotate: openSections.colour ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={styles.chevron}
                  >
                    <path
                      d="M2 4l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                </button>
                <AnimatePresence initial={false}>
                  {openSections.colour && (
                    <motion.div
                      variants={accordionVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      style={{ overflow: "hidden" }}
                    >
                      <div className={styles.optionPanel}>
                        <div className={styles.colourGrid}>
                          {colours.map((colour) => (
                            <motion.button
                              key={colour}
                              className={`${styles.colourBtn} ${selected.colour === colour ? styles.colourBtnActive : ""}`}
                              onClick={() =>
                                setSelected((prev) => ({ ...prev, colour }))
                              }
                              whileTap={{ scale: 0.95 }}
                            >
                              <span
                                style={{
                                  width: 14,
                                  height: 14,
                                  borderRadius: 3,
                                  flexShrink: 0,
                                  background: COLOUR_HEX[colour] || "#888",
                                  border: "1px solid rgba(255,255,255,0.15)",
                                  display: "inline-block",
                                }}
                              />
                              <span>{colour}</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Extras */}
              {addons.length > 0 && (
                <div className={styles.optionRow}>
                  <button
                    className={styles.optionToggle}
                    onClick={() => toggleSection("extras")}
                  >
                    <div className={styles.optionToggleLeft}>
                      <span className={styles.optionToggleLabel}>Extras</span>
                      <span className={styles.optionToggleValue}>
                        {selected.addons.length > 0
                          ? `${selected.addons.length} selected`
                          : "None"}
                      </span>
                    </div>
                    <motion.svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      animate={{ rotate: openSections.extras ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className={styles.chevron}
                    >
                      <path
                        d="M2 4l4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  </button>
                  <AnimatePresence initial={false}>
                    {openSections.extras && (
                      <motion.div
                        variants={accordionVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        style={{ overflow: "hidden" }}
                      >
                        <div className={styles.optionPanel}>
                          <div className={styles.addonList}>
                            {addons.map((addon) => (
                              <motion.button
                                key={addon}
                                className={`${styles.addonBtn} ${selected.addons.includes(addon) ? styles.addonBtnActive : ""}`}
                                onClick={() => toggleAddon(addon)}
                                whileTap={{ scale: 0.98 }}
                              >
                                <span className={styles.addonCheck}>
                                  {selected.addons.includes(addon) ? "✓" : "+"}
                                </span>
                                <span className={styles.addonName}>
                                  {addon}
                                </span>
                                {ADDON_PRICES[addon] > 0 && (
                                  <span className={styles.addonPrice}>
                                    +£{ADDON_PRICES[addon]}
                                  </span>
                                )}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>

            {/* Action buttons / Order form */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={4}
            >
              <AnimatePresence mode="wait">
                {!showOrderForm ? (
                  <motion.div
                    key="actions"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22 }}
                  >
                    <div className={styles.orderButtons}>
                      <motion.button
                        className={`btn btn--outline ${styles.orderBtn}`}
                        onClick={() => setShowOrderForm(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Order Now
                      </motion.button>
                      <motion.a
                        href={`https://wa.me/923174704165?text=${buildWhatsAppMessage()}`}
                        className={`btn btn--whatsapp ${styles.waBtn}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
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
                      </motion.a>
                    </div>
                    <motion.button
                      className={`btn btn--primary ${styles.orderBtn}`}
                      onClick={handleAddToCart}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      animate={addedToCart ? { background: "#3a6a3a" } : {}}
                      style={{ marginTop: "12px" }}
                    >
                      {addedToCart
                        ? "✓ Added to Cart"
                        : `Add to Cart — £${price}`}
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    className={styles.orderForm}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                  >
                    <h3 className={styles.formTitle}>Place Your Order</h3>
                    <p style={{ fontSize: '0.78rem', color: '#888', margin: '-0.25rem 0 0.85rem', lineHeight: 1.5 }}>
                      We&apos;ll email you a deposit invoice for £{Math.round(price / 2)} within 24 hours. Production starts when it&apos;s paid.
                    </p>
                    {[
                      {
                        label: "Full Name *",
                        key: "name",
                        type: "text",
                        placeholder: "John Smith",
                      },
                      {
                        label: "Email *",
                        key: "email",
                        type: "email",
                        placeholder: "john@example.com",
                      },
                      {
                        label: "Phone *",
                        key: "phone",
                        type: "tel",
                        placeholder: "+44 7700 000000",
                      },
                    ].map(({ label, key, type, placeholder }) => (
                      <div key={key} className={styles.formGroup}>
                        <label className={styles.label}>{label}</label>
                        <input
                          type={type}
                          className={styles.input}
                          placeholder={placeholder}
                          value={form[key]}
                          onChange={(e) =>
                            setForm((p) => ({ ...p, [key]: e.target.value }))
                          }
                        />
                      </div>
                    ))}
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Notes</label>
                      <textarea
                        className={styles.textarea}
                        placeholder="Any special requirements..."
                        value={form.notes}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, notes: e.target.value }))
                        }
                        rows={3}
                      />
                    </div>
                    <div className={styles.formButtons}>
                      <motion.button
                        className={`btn btn--primary ${styles.submitBtn}`}
                        onClick={handleSubmit}
                        disabled={!form.name || !form.email || !form.phone || submitting}
                        whileTap={{ scale: 0.97 }}
                      >
                        {submitting
                          ? "Sending..."
                          : `Place Order Request — £${price}`}
                      </motion.button>
                      <motion.button
                        className={`btn btn--outline ${styles.cancelBtn}`}
                        onClick={() => setShowOrderForm(false)}
                        whileTap={{ scale: 0.97 }}
                      >
                        Back
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              className={styles.description}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={5}
            >
              <p>{prod.description}</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
