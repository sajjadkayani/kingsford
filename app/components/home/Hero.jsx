"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "../Css/Hero.module.css";
import img1 from "../../../public/backgrounds/1.png";
import img2 from "../../../public/backgrounds/2.png";
import img3 from "../../../public/backgrounds/3.png";
import img5 from "../../../public/backgrounds/5.png";
import img6 from "../../../public/backgrounds/6.png";
import img7 from "../../../public/backgrounds/7.png";
import img4 from "../../../public/backgrounds/4.png";
import img8 from "../../../public/backgrounds/8.png";
import img9 from "../../../public/backgrounds/9.png";
import img10 from "../../../public/backgrounds/10.png";
import img11 from "../../../public/backgrounds/11.png";
import img12 from "../../../public/backgrounds/12.png";
import img13 from "../../../public/backgrounds/13.png";
import img14 from "../../../public/backgrounds/14.png";

const ease = [0.22, 1, 0.36, 1];

const slides = [
  {
    id: 1,
    bg: img1,
    accent: "#C9A96E",
  },
  {
    id: 2,
    bg: img2,
    accent: "#8BA5B8",
  },
  {
    id: 3,
    bg: img3,
    accent: "#B8B88A",
  },
  {
    id: 10,
    bg: img10,
    accent: "#B88AA0",
  },
  {
    id: 11,
    bg: img11,
    accent: "#B88AA0",
  },
  {
    id: 12,
    bg: img12,
    accent: "#B88AA0",
  },
  {
    id: 13,
    bg: img13,
    accent: "#B88AA0",
  },
  {
    id: 14,
    bg: img14,
    accent: "#B88AA0",
  },
  {
    id: 4,
    bg: img4,
    accent: "#B88AA0",
  },
  {
    id: 5,
    bg: img5,
    accent: "#B88AA0",
  },
  {
    id: 6,
    bg: img6,
    accent: "#B88AA0",
  },
  {
    id: 7,
    bg: img7,
    accent: "#B88AA0",
  },
  {
    id: 8,
    bg: img8,
    accent: "#B88AA0",
  },
  {
    id: 9,
    bg: img9,
    accent: "#B88AA0",
  },
];

const slideLabels = [
  "Kingsford Sleep Hand Crafted Beds",
  "Kingsford Sleep Hand Crafted Beds",
  "Kingsford Sleep Hand Crafted Beds",
  "Kingsford Sleep Hand Crafted Beds",
  "Kingsford Sleep Hand Crafted Beds",
  "Kingsford Sleep Hand Crafted Beds",
  "Kingsford Sleep Hand Crafted Beds",
  "Kingsford Sleep Hand Crafted Beds",
  "Kingsford Sleep Hand Crafted Beds",
  "Kingsford Sleep Hand Crafted Beds",
  "Kingsford Sleep Hand Crafted Beds",
  "Kingsford Sleep Hand Crafted Beds",
  "Kingsford Sleep Hand Crafted Beds",
  "Kingsford Sleep Hand Crafted Beds",
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrev(current);
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [current]);

  return (
    <section
      className={styles.hero}
      aria-label="Kingsford Sleep — Handcrafted British Beds"
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`${styles.slide} ${index === current ? styles.slideActive : ""} ${index === prev ? styles.slidePrev : ""}`}
          aria-hidden={index !== current}
        >
          {/* Background image */}
          <Image
            src={slide.bg}
            alt=""
            fill
            priority={index === 0}
            quality={90}
            className={styles.slideImage}
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          <div className={styles.silhouette}>
            <svg
              viewBox="0 0 800 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.silhouetteSvg}
            >
              <rect
                x="100"
                y="80"
                width="600"
                height="180"
                rx="8"
                fill={slide.accent}
                fillOpacity="0.06"
              />
              <rect
                x="100"
                y="80"
                width="600"
                height="20"
                rx="4"
                fill={slide.accent}
                fillOpacity="0.12"
              />
              <rect
                x="80"
                y="240"
                width="640"
                height="80"
                rx="6"
                fill={slide.accent}
                fillOpacity="0.08"
              />
              <rect
                x="100"
                y="310"
                width="600"
                height="40"
                rx="4"
                fill={slide.accent}
                fillOpacity="0.1"
              />
              <rect
                x="110"
                y="348"
                width="20"
                height="30"
                rx="3"
                fill={slide.accent}
                fillOpacity="0.15"
              />
              <rect
                x="670"
                y="348"
                width="20"
                height="30"
                rx="3"
                fill={slide.accent}
                fillOpacity="0.15"
              />
              <rect
                x="160"
                y="170"
                width="180"
                height="60"
                rx="30"
                fill={slide.accent}
                fillOpacity="0.1"
              />
              <rect
                x="460"
                y="170"
                width="180"
                height="60"
                rx="30"
                fill={slide.accent}
                fillOpacity="0.1"
              />
            </svg>
          </div>
        </div>
      ))}

      <div
        className={styles.overlay}
        style={{ transform: `translateY(${scrollY * 0.15}px)` }}
      />
      <div className={styles.vignette} />
      <div className={styles.grain} />

      <div className={styles.content}>
        <motion.span
          className={`section-label ${styles.label}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
        >
          British Craftsmanship · Factory Direct
        </motion.span>

        <h1 className={styles.headline}>
          {["Sleep in", "something", "beautiful"].map((word, i) => (
            <motion.span
              key={word}
              className={`${styles.line} ${i === 1 ? styles.lineItalic : ""}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 + i * 0.12, ease }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className={styles.sub}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.72, ease }}
        >
          Handcrafted beds made in our UK factory. Custom sizes, fabrics &amp;
          finishes. Built to order. Delivered across Britain.
        </motion.p>

        <motion.div
          className={styles.ctas}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.88, ease }}
        >
          <Link
            href="/beds"
            className={`btn btn--primary ${styles.ctaPrimary}`}
          >
            View Collection
            <svg
              width="15"
              height="15"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <Link href="/configure" className="btn btn--outline">
            Build Your Bed
          </Link>
        </motion.div>

        <motion.div
          className={styles.trust}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1, ease }}
        >
          <div className={styles.trustItem}>
            <span className={styles.trustDot} />
            <span>UK Manufactured</span>
          </div>
          <div className={styles.trustDivider} />
          <div className={styles.trustItem}>
            <span className={styles.trustDot} />
            <span>Custom Made to Order</span>
          </div>
          <div className={styles.trustDivider} />
          <div className={styles.trustItem}>
            <span className={styles.trustDot} />
            <span>Free UK Delivery</span>
          </div>
        </motion.div>
      </div>

      {/* Prev / Next arrows */}
      <button
        className={styles.arrowPrev}
        onClick={() => { setPrev(current); setCurrent((current - 1 + slides.length) % slides.length) }}
        aria-label="Previous slide"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button
        className={styles.arrowNext}
        onClick={() => { setPrev(current); setCurrent((current + 1) % slides.length) }}
        aria-label="Next slide"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className={styles.indicators} aria-hidden="true">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${index === current ? styles.indicatorActive : ""}`}
            onClick={() => {
              setPrev(current);
              setCurrent(index);
            }}
            aria-label={slideLabels[index]}
          />
        ))}
      </div>

      <div className={styles.slideLabel} aria-hidden="true">
        <span key={current} className={styles.slideLabelText}>
          {slideLabels[current]}
        </span>
      </div>

      <div className={styles.scroll} aria-hidden="true">
        <div className={styles.scrollLine} />
        <span>Scroll</span>
      </div>
    </section>
  );
}
