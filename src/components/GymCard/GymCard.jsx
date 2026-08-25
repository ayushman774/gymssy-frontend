/**
 * GymCard.jsx — EXISTING component, defensively patched.
 *
 * Root cause fix:
 *   API returns objects inside arrays (tags / facilities / amenities)
 *   and address as an object — all must be safely converted to
 *   strings before rendering as React children.
 */

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiMapPin,
  FiClock,
  FiChevronRight,
  FiStar,
  FiNavigation,
} from "react-icons/fi";
import styles from "./GymCard.module.css";

/* ─────────────────────────────────────────────────────────────
   UTILITY — safely convert ANY value to a renderable string.
   Handles: string | number | object | null | undefined
   
   This is the core fix for "Objects are not valid as React child".
───────────────────────────────────────────────────────────── */
const toStr = (val, fallback = "") => {
  if (val === null || val === undefined) return fallback;
  if (typeof val === "string") return val.trim() || fallback;
  if (typeof val === "number") return String(val);
  if (typeof val === "boolean") return fallback; // don't render true/false
  if (typeof val === "object") {
    // Try common label fields in priority order
    const extracted =
      val.name ??
      val.title ??
      val.label ??
      val.text ??
      val.displayName ??
      val.value ??
      null;
    if (extracted !== null) return toStr(extracted, fallback);
    // Last resort: try city, street for address-like objects
    const addr =
      val.city ?? val.area ?? val.locality ?? val.street ?? val.address ?? null;
    if (addr !== null) return toStr(addr, fallback);
    return fallback;
  }
  return fallback;
};

/* ─────────────────────────────────────────────────────────────
   UTILITY — safely convert ANY array-like to string[].
   Each element is passed through toStr() so objects become
   their .name (or similar) field.
───────────────────────────────────────────────────────────── */
const toStringArray = (val) => {
  if (!Array.isArray(val)) return [];
  return val.map((item) => toStr(item)).filter(Boolean); // drop empty strings
};

/* ─────────────────────────────────────────────────────────────
   UTILITY — resolve image URL from any API shape.
───────────────────────────────────────────────────────────── */
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=70&fit=crop&auto=format";

const resolveImage = (img) => {
  if (!img) return FALLBACK_IMG;
  if (typeof img === "string") return img || FALLBACK_IMG;
  if (Array.isArray(img)) {
    const first = img[0];
    if (!first) return FALLBACK_IMG;
    if (typeof first === "string") return first || FALLBACK_IMG;
    return first?.url || FALLBACK_IMG;
  }
  if (typeof img === "object") return img.url || img.src || FALLBACK_IMG;
  return FALLBACK_IMG;
};

/* ─────────────────────────────────────────────────────────────
   UTILITY — format number as INR currency string.
───────────────────────────────────────────────────────────── */
const formatINR = (val) => {
  const num = Number(val);
  if (!val || isNaN(num) || num <= 0) return null;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
};

/* ─────────────────────────────────────────────────────────────
   UTILITY — resolve address to a display string.
   Handles: string | { city, area, street, address, ... }
───────────────────────────────────────────────────────────── */
const resolveAddress = (gym) => {
  // Try direct string fields first
  if (typeof gym.address === "string" && gym.address.trim()) {
    return gym.address.trim();
  }

  // address is an object
  if (gym.address && typeof gym.address === "object") {
    const parts = [
      gym.address.area ?? gym.address.locality,
      gym.address.city,
      gym.address.state,
    ].filter(Boolean);
    if (parts.length) return parts.join(", ");
    // fallback to any string field inside
    return toStr(gym.address);
  }

  // location field
  if (gym.location) {
    if (typeof gym.location === "string") return gym.location;
    if (typeof gym.location === "object") {
      const parts = [
        gym.location.area ?? gym.location.locality,
        gym.location.city,
        gym.location.address,
      ].filter(Boolean);
      if (parts.length) return parts.join(", ");
      return toStr(gym.location);
    }
  }

  // flat fields
  return gym.city ?? gym.area ?? gym.locality ?? null;
};

/* ─────────────────────────────────────────────────────────────
   UTILITY — resolve opening hours to a display string.
───────────────────────────────────────────────────────────── */
const resolveHours = (gym) => {
  // gym.hours.weekday
  if (gym.hours?.weekday) return toStr(gym.hours.weekday);

  // gym.openingHours.weekday
  if (gym.openingHours?.weekday) return toStr(gym.openingHours.weekday);

  // gym.operatingHours — may be string or object
  if (gym.operatingHours) return toStr(gym.operatingHours);

  // gym.timing
  if (gym.timing) return toStr(gym.timing);

  return null;
};

/* ─────────────────────────────────────────────────────────────
   GYM CARD
───────────────────────────────────────────────────────────── */
const GymCard = ({ gym, index = 0, isHighlighted = false, onViewDetails }) => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  if (!gym) return null;

  /* ── All fields safely extracted as primitives ── */
  const name = toStr(gym.name, "Unnamed Venue");
  const slug = gym.slug ?? gym._id ?? null;
  const address = resolveAddress(gym);
  const distance = gym.distance ? toStr(gym.distance) : null;
  const rating = gym.rating ? Number(gym.rating) : null;
  const reviewCount = gym.reviewCount ?? gym.reviews ?? null;
  const featured = Boolean(gym.featured ?? gym.isFeatured);
  const hoursWeekday = resolveHours(gym);
  const formattedPrice = formatINR(
    gym.membershipFrom ?? gym.priceFrom ?? gym.price,
  );

  /* Image */
  const imageSrc = resolveImage(gym.image ?? gym.images);

  /* ── Tags — convert every item to a string ──
     API may return: string[] | object[] | mixed[]            */
  const rawTags =
    gym.tags ?? gym.categories ?? gym.amenities ?? gym.facilities ?? [];
  const tags = toStringArray(rawTags);

  /* ── Facilities — convert every item to a string ── */
  const rawFacilities = gym.facilities ?? gym.amenities ?? gym.features ?? [];
  const facilities = toStringArray(rawFacilities);

  /* ── Navigation ── */
  const handleViewDetails = () => {
    if (typeof onViewDetails === "function") {
      onViewDetails(gym);
    } else if (slug) {
      navigate(`/gym-detail/${slug}`);
    }
  };

  return (
    <motion.article
      ref={ref}
      className={`${styles.card} ${isHighlighted ? styles.cardHighlighted : ""}`}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.65,
        delay: (index % 3) * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* ════ IMAGE ════ */}
      <div className={styles.imageWrapper}>
        <img
          src={imageSrc}
          alt={`${name} — fitness venue`}
          className={styles.image}
          loading={index < 4 ? "eager" : "lazy"}
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMG;
          }}
        />
        <div className={styles.imageOverlay} />

        {/* ── Badges ── */}
        <div className={styles.imageBadges}>
          {featured && (
            <span className={styles.featuredBadge}>
              <FiStar className={styles.featuredIcon} />
              Featured
            </span>
          )}
        </div>

        {/* ── Distance ── */}
        {distance && (
          <div className={styles.distanceBadge}>
            <FiNavigation className={styles.distanceIcon} />
            {/* distance is already a string from toStr() */}
            {distance}
          </div>
        )}

        {/* ── Rating ── */}
        {rating !== null && (
          <div className={styles.ratingBadge}>
            <FiStar className={styles.ratingIcon} />
            <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
            {reviewCount !== null && (
              <span className={styles.ratingCount}>
                ({Number(reviewCount).toLocaleString()})
              </span>
            )}
          </div>
        )}
      </div>

      {/* ════ CONTENT ════ */}
      <div className={styles.content}>
        {/* ── Header ── */}
        <div className={styles.cardHeader}>
          {/* name is a plain string — safe */}
          <h3 className={styles.name}>{name}</h3>
          {address && (
            <div className={styles.address}>
              <FiMapPin className={styles.addressIcon} />
              {/* address is a plain string from resolveAddress() */}
              <span>{address}</span>
            </div>
          )}
        </div>

        {/* ── Tags ── */}
        {tags.length > 0 && (
          <div className={styles.tags}>
            {tags.slice(0, 3).map((tag, i) => (
              /* tag is guaranteed to be a string from toStringArray() */
              <span key={`tag-${i}-${tag}`} className={styles.tag}>
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className={styles.tagMore}>+{tags.length - 3}</span>
            )}
          </div>
        )}

        {/* ── Hours ── */}
        {hoursWeekday && (
          <div className={styles.hours}>
            <FiClock className={styles.hoursIcon} />
            {/* hoursWeekday is a plain string from resolveHours() */}
            <span className={styles.hoursText}>{hoursWeekday}</span>
          </div>
        )}

        {/* ── Facilities ── */}
        {facilities.length > 0 && (
          <div className={styles.facilities}>
            {facilities.slice(0, 3).map((f, i) => (
              /* f is guaranteed to be a string from toStringArray() */
              <span key={`fac-${i}-${f}`} className={styles.facility}>
                {f}
              </span>
            ))}
          </div>
        )}

        {/* ── Footer ── */}
        <div className={styles.cardFooter}>
          {formattedPrice ? (
            <div className={styles.pricing}>
              <span className={styles.pricingFrom}>From</span>
              {/* formattedPrice is a plain string from formatINR() */}
              <span className={styles.pricingValue}>{formattedPrice}</span>
              <span className={styles.pricingPer}>/mo</span>
            </div>
          ) : (
            <div />
          )}

          <div className={styles.actions}>
            <motion.button
              className={styles.btnSecondary}
              onClick={handleViewDetails}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              View Details
            </motion.button>

            <motion.button
              className={styles.btnPrimary}
              onClick={handleViewDetails}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              View
              <FiChevronRight />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Top border glow */}
      <div className={styles.topBorder} />
    </motion.article>
  );
};

export default GymCard;
