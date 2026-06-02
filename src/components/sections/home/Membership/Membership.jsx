import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { FiShield, FiCheckCircle } from "react-icons/fi";
import PricingCard from "./PricingCard";
import PricingToggle from "./PricingToggle";
import {
  PLANS,
  MEMBERSHIP_FAQS,
  TRUST_BADGES,
} from "../../../../assets/data/membership";
import styles from "./Membership.module.css";

gsap.registerPlugin(ScrollTrigger);

// ── FAQ Item ──────────────────────────────────────────────────────────────
const FAQItem = ({ faq, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ""}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <button
        className={styles.faqQuestion}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
      >
        <span>{faq.q}</span>
        <motion.span
          className={styles.faqChevron}
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          aria-hidden="true"
        >
          +
        </motion.span>
      </button>

      <motion.div
        id={`faq-answer-${index}`}
        className={styles.faqAnswer}
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        style={{ overflow: "hidden" }}
      >
        <p className={styles.faqAnswerText}>{faq.a}</p>
      </motion.div>
    </motion.div>
  );
};

// ── Membership ────────────────────────────────────────────────────────────
const Membership = () => {
  const sectionRef = useRef(null);
  const neonLineRef = useRef(null);
  const particlesRef = useRef(null);
  const [isAnnual, setIsAnnual] = useState(false);

  const isInView = useInView(sectionRef, {
    once: true,
    margin: "-8% 0px",
  });

  // ── GSAP — neon line draw ──────────────────────────────────────────────
  useEffect(() => {
    if (!neonLineRef.current || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        neonLineRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ── GSAP — floating particles ──────────────────────────────────────────
  useEffect(() => {
    if (!particlesRef.current) return;

    const particles = particlesRef.current.querySelectorAll("[data-particle]");

    const ctx = gsap.context(() => {
      particles.forEach((particle, i) => {
        gsap.to(particle, {
          y: `${(Math.random() - 0.5) * 60}px`,
          x: `${(Math.random() - 0.5) * 30}px`,
          opacity: Math.random() * 0.4 + 0.1,
          duration: 3 + Math.random() * 4,
          repeat: -1,
          yoyo: true,
          delay: i * 0.3,
          ease: "sine.inOut",
        });
      });
    }, particlesRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.membership}
      aria-labelledby="membership-heading"
      id="membership"
    >
      {/* ── BACKGROUNDS ─────────────────────────────── */}
      <div className={styles.bgBase} aria-hidden="true" />
      <div className={styles.bgGlow} aria-hidden="true" />
      <div className={styles.bgNoise} aria-hidden="true" />

      {/* ── FLOATING PARTICLES ──────────────────────── */}
      <div ref={particlesRef} className={styles.particles} aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            data-particle
            className={styles.particle}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              opacity: Math.random() * 0.2 + 0.05,
              background:
                i % 3 === 0
                  ? "var(--color-neon)"
                  : i % 3 === 1
                    ? "var(--color-blue)"
                    : "rgba(255,255,255,0.6)",
            }}
          />
        ))}
      </div>

      <div className={styles.container}>
        {/* ── HEADER ────────────────────────────────── */}
        <div className={styles.header}>
          {/* Label */}
          <motion.div
            className={styles.labelRow}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className={styles.labelLine} aria-hidden="true" />
            <span className={styles.labelText}>Membership Plans</span>
            <span className={styles.labelLine} aria-hidden="true" />
          </motion.div>

          {/* Headline */}
          <motion.h2
            id="membership-heading"
            className={styles.headline}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Choose Your <span className={styles.headlineAccent}>Level.</span>
          </motion.h2>

          {/* Sub copy */}
          <motion.p
            className={styles.subCopy}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Transparent pricing. No hidden fees. No lock-in contracts. Just
            premium fitness at a level that fits your goals.
          </motion.p>

          {/* Neon line */}
          <div className={styles.neonLineWrapper} aria-hidden="true">
            <div ref={neonLineRef} className={styles.neonLine} />
          </div>

          {/* Billing toggle */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <PricingToggle
              isAnnual={isAnnual}
              onToggle={() => setIsAnnual((p) => !p)}
            />
          </motion.div>
        </div>

        {/* ── PRICING CARDS ─────────────────────────── */}
        <div
          className={styles.plansGrid}
          role="list"
          aria-label="Membership plans"
        >
          {PLANS.map((plan, index) => (
            <div key={plan.id} role="listitem">
              <PricingCard
                plan={plan}
                isAnnual={isAnnual}
                index={index}
                isInView={isInView}
              />
            </div>
          ))}
        </div>

        {/* ── TRUST BADGES ──────────────────────────── */}
        <motion.div
          className={styles.trustRow}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-5%" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          aria-label="Trust and guarantee badges"
        >
          <FiShield className={styles.trustShield} aria-hidden="true" />
          {TRUST_BADGES.map((badge, i) => (
            <div key={i} className={styles.trustBadge}>
              <span className={styles.trustIcon} aria-hidden="true">
                {badge.icon}
              </span>
              <span className={styles.trustText}>{badge.text}</span>
              {i < TRUST_BADGES.length - 1 && (
                <span className={styles.trustSep} aria-hidden="true" />
              )}
            </div>
          ))}
        </motion.div>

        {/* ── FAQ SECTION ───────────────────────────── */}
        <div className={styles.faqSection}>
          <motion.div
            className={styles.faqHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5%" }}
            transition={{ duration: 0.6 }}
          >
            <h3 className={styles.faqHeadline}>Common Questions</h3>
            <p className={styles.faqSubtext}>
              Everything you need to know before joining.
            </p>
          </motion.div>

          <div
            className={styles.faqList}
            role="list"
            aria-label="Frequently asked questions"
          >
            {MEMBERSHIP_FAQS.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* ── EDGE FADES ──────────────────────────────── */}
      <div className={styles.edgeFadeTop} aria-hidden="true" />
      <div className={styles.edgeFadeBottom} aria-hidden="true" />
    </section>
  );
};

export default Membership;
