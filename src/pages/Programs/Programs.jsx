import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import {
  FiHome,
  FiChevronRight,
  FiArrowRight,
  FiArrowUpRight,
  FiCheck,
  FiPlus,
  FiMinus,
  FiClock,
  FiBarChart2,
  FiCalendar,
} from "react-icons/fi";

import SectionLabel from "../../components/ui/SectionLabel/SectionLabel";
import MagneticButton from "../../components/ui/MagneticButton/MagneticButton";
import { useCursorVariant } from "../../hooks/useCursorVariant";

import {
  programs,
  processSteps,
  whyItWorks,
  transformationStats,
  faqs,
} from "../../assets/data/programs-page";

import styles from "./Programs.module.css";

gsap.registerPlugin(ScrollTrigger);

// ─── Shared animation variants ────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

// ══════════════════════════════════════════
// PAGE HEADER
// ══════════════════════════════════════════
const PageHeader = () => {
  const bgRef = useRef(null);

  useGSAP(() => {
    gsap.to(bgRef.current, {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: bgRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });
  });

  return (
    <section className={styles.pageHeader} aria-label="Programs page header">
      <div ref={bgRef} className={styles.headerBg} aria-hidden="true" />
      <div className={styles.headerOverlay} aria-hidden="true" />
      <div className={styles.headerGlow} aria-hidden="true" />
      <div className={styles.headerNoise} aria-hidden="true" />

      <div className={styles.headerContainer}>
        {/* Breadcrumb */}
        <motion.nav
          className={styles.breadcrumb}
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          aria-label="Breadcrumb"
        >
          <Link to="/" className={styles.breadcrumbLink}>
            <FiHome aria-hidden="true" />
            <span>Home</span>
          </Link>
          <FiChevronRight className={styles.breadcrumbSep} aria-hidden="true" />
          <span className={styles.breadcrumbCurrent} aria-current="page">
            Programs
          </span>
        </motion.nav>

        <motion.h1
          className={styles.headerHeading}
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Our <span className={styles.headerAccent}>Programs</span>
        </motion.h1>

        <motion.p
          className={styles.headerSubtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          Expert-designed training programs tailored to every fitness goal.
        </motion.p>

        <motion.div
          className={styles.headerLine}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
};

// ══════════════════════════════════════════
// PROGRAMS INTRODUCTION
// ══════════════════════════════════════════
const ProgramsIntro = () => {
  const sectionRef = useRef(null);
  const imgRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  useGSAP(
    () => {
      gsap.to(imgRef.current, {
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className={styles.intro}
      aria-labelledby="intro-heading"
    >
      <div className={styles.sectionContainer}>
        <div className={styles.introGrid}>
          {/* Image */}
          <motion.div
            className={styles.introImgWrapper}
            variants={fadeLeft}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <div className={styles.introImgInner}>
              <img
                ref={imgRef}
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80"
                alt="Gymssy training floor"
                className={styles.introImg}
                loading="eager"
              />
              <div className={styles.introImgOverlay} aria-hidden="true" />
            </div>

            {/* Floating stat */}
            <motion.div
              className={styles.introFloatBadge}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={
                isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }
              }
              transition={{
                duration: 0.6,
                delay: 0.5,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              <span className={styles.introFloatNum}>6</span>
              <span className={styles.introFloatText}>Elite Programs</span>
            </motion.div>

            {/* Decorative corner */}
            <div className={styles.introImgCorner} aria-hidden="true" />
          </motion.div>

          {/* Content */}
          <motion.div
            className={styles.introContent}
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.div variants={staggerItem}>
              <SectionLabel text="EXPERT PROGRAMMING" variant="light" />
            </motion.div>

            <motion.h2
              id="intro-heading"
              className={styles.introHeading}
              variants={staggerItem}
            >
              Find The Perfect
              <br />
              <span className={styles.accentText}>Training Program</span>
            </motion.h2>

            <motion.p className={styles.introText} variants={staggerItem}>
              Every body is different. Every goal is unique. That's why Gymssy
              offers six distinct performance programs — each built around a
              specific fitness objective and engineered by coaches who have
              helped thousands of members achieve extraordinary results.
            </motion.p>

            <motion.p className={styles.introText} variants={staggerItem}>
              Whether you're here to build raw strength, lose body fat, improve
              athleticism, or simply feel better than you ever have — there is a
              program at Gymssy that was designed specifically for your journey.
            </motion.p>

            {/* Program count pills */}
            <motion.div className={styles.introPills} variants={staggerItem}>
              {[
                "Strength Training",
                "Personal Training",
                "Weight Loss",
                "Functional Fitness",
                "Cardio",
                "Nutrition",
              ].map((p) => (
                <span key={p} className={styles.introPill}>
                  {p}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ══════════════════════════════════════════
// PROGRAM SECTION (Reusable)
// ══════════════════════════════════════════
const ProgramSection = ({ program, index }) => {
  const sectionRef = useRef(null);
  const imgRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-8%" });
  const reverse = index % 2 !== 0;
  const { setCursor, resetCursor } = useCursorVariant();

  useGSAP(
    () => {
      gsap.to(imgRef.current, {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <article
      ref={sectionRef}
      className={`${styles.programSection} ${
        reverse ? styles.programSectionReverse : ""
      }`}
      aria-labelledby={`program-${program.id}-heading`}
    >
      {/* Image column */}
      <motion.div
        className={styles.programImgCol}
        variants={reverse ? fadeRight : fadeLeft}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className={styles.programImgWrapper}>
          <div className={styles.programImgInner}>
            <img
              ref={imgRef}
              src={program.image}
              alt={program.title}
              className={styles.programImg}
              loading="lazy"
            />
            <div className={styles.programImgOverlay} aria-hidden="true" />
          </div>

          {/* Tag badge */}
          <div
            className={`${styles.programTag} ${
              styles[`programTag--${program.tagColor}`]
            }`}
          >
            {program.tag}
          </div>

          {/* Meta pills */}
          <div className={styles.programMeta}>
            <div className={styles.programMetaItem}>
              <FiClock aria-hidden="true" />
              <span>{program.duration}</span>
            </div>
            <div className={styles.programMetaItem}>
              <FiBarChart2 aria-hidden="true" />
              <span>{program.level}</span>
            </div>
            <div className={styles.programMetaItem}>
              <FiCalendar aria-hidden="true" />
              <span>{program.sessions}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content column */}
      <motion.div
        className={styles.programContentCol}
        variants={reverse ? fadeLeft : fadeRight}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Program number */}
        <span className={styles.programNumber}>0{program.id}</span>

        <h2
          id={`program-${program.id}-heading`}
          className={styles.programTitle}
        >
          {program.title}
        </h2>

        <p className={styles.programSubtitle}>{program.subtitle}</p>
        <p className={styles.programDesc}>{program.desc}</p>

        {/* Benefits */}
        <div className={styles.programBenefits}>
          <p className={styles.programBenefitsLabel}>What You Get</p>
          <ul className={styles.programBenefitsList} role="list">
            {program.benefits.map((b) => (
              <li key={b} className={styles.programBenefit}>
                <FiCheck
                  className={`${styles.programBenefitIcon} ${
                    styles[`programBenefitIcon--${program.color}`]
                  }`}
                  aria-hidden="true"
                />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <MagneticButton strength={0.3}>
          <motion.button
            className={`${styles.programBtn} ${
              styles[`programBtn--${program.color}`]
            }`}
            onMouseEnter={() => setCursor("hover")}
            onMouseLeave={resetCursor}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>Start This Program</span>
            <FiArrowRight aria-hidden="true" />
            <span className={styles.programBtnShimmer} aria-hidden="true" />
          </motion.button>
        </MagneticButton>
      </motion.div>
    </article>
  );
};

// ══════════════════════════════════════════
// FEATURED PROGRAMS
// ══════════════════════════════════════════
const FeaturedPrograms = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-5%" });

  return (
    <section
      ref={sectionRef}
      className={styles.featuredSection}
      aria-labelledby="featured-heading"
    >
      <div className={styles.sectionContainer}>
        <motion.div
          className={styles.sectionHeader}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <SectionLabel text="OUR PROGRAMS" variant="light" />
          <h2 id="featured-heading" className={styles.sectionHeading}>
            Choose Your <span className={styles.accentText}>Path</span>
          </h2>
          <p className={styles.sectionSubtext}>
            Six elite programs. One goal: your transformation.
          </p>
        </motion.div>

        {/* Program sections */}
        <div className={styles.programsList}>
          {programs.map((program, i) => (
            <ProgramSection key={program.id} program={program} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ══════════════════════════════════════════
// TRAINING PROCESS TIMELINE
// ══════════════════════════════════════════
const TrainingProcess = () => {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  useGSAP(
    () => {
      if (!isInView) return;

      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.5,
          ease: "power3.out",
          delay: 0.3,
        },
      );
    },
    { scope: sectionRef, dependencies: [isInView] },
  );

  return (
    <section
      ref={sectionRef}
      className={styles.processSection}
      aria-labelledby="process-heading"
    >
      <div className={styles.processBg} aria-hidden="true" />
      <div className={styles.processNoise} aria-hidden="true" />
      <div className={styles.processGlow} aria-hidden="true" />

      <div className={styles.sectionContainer}>
        <motion.div
          className={styles.sectionHeader}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <SectionLabel text="HOW IT WORKS" variant="light" />
          <h2 id="process-heading" className={styles.sectionHeading}>
            Your Journey <span className={styles.accentText}>Starts Here</span>
          </h2>
          <p className={styles.sectionSubtext}>
            A proven five-step system that takes you from where you are to where
            you want to be.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className={styles.timeline}>
          {/* Progress line */}
          <div className={styles.timelineLine} aria-hidden="true">
            <div ref={lineRef} className={styles.timelineLineFill} />
          </div>

          {/* Steps */}
          <motion.div
            className={styles.timelineSteps}
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {processSteps.map((step) => (
              <motion.div
                key={step.id}
                className={styles.timelineStep}
                variants={staggerItem}
              >
                {/* Dot */}
                <div className={styles.timelineDot} aria-hidden="true">
                  <div className={styles.timelineDotInner} />
                  <div className={styles.timelineDotRing} />
                </div>

                {/* Content */}
                <div className={styles.timelineContent}>
                  <span className={styles.timelineIcon} aria-hidden="true">
                    {step.icon}
                  </span>
                  <span className={styles.timelineNumber}>{step.number}</span>
                  <h3 className={styles.timelineTitle}>{step.title}</h3>
                  <p className={styles.timelineDesc}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ══════════════════════════════════════════
// WHY OUR PROGRAMS WORK
// ══════════════════════════════════════════
const WhyItWorks = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  return (
    <section
      ref={sectionRef}
      className={styles.whySection}
      aria-labelledby="why-heading"
    >
      <div className={styles.sectionContainer}>
        <motion.div
          className={styles.sectionHeader}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <SectionLabel text="THE Gymssy ADVANTAGE" variant="light" />
          <h2 id="why-heading" className={styles.sectionHeading}>
            Why Our Programs <span className={styles.accentText}>Work</span>
          </h2>
        </motion.div>

        <motion.div
          className={styles.whyGrid}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {whyItWorks.map((item) => (
            <motion.div
              key={item.id}
              className={`${styles.whyCard} ${
                styles[`whyCard--${item.color}`]
              }`}
              variants={staggerItem}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <span className={styles.whyIcon} aria-hidden="true">
                {item.icon}
              </span>
              <h3 className={styles.whyTitle}>{item.title}</h3>
              <p className={styles.whyDesc}>{item.desc}</p>

              {/* Glow + border */}
              <div className={styles.whyCardGlow} aria-hidden="true" />
              <div
                className={`${styles.whyCardBorder} ${
                  styles[`whyCardBorder--${item.color}`]
                }`}
                aria-hidden="true"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ══════════════════════════════════════════
// TRANSFORMATION RESULTS
// ══════════════════════════════════════════
const TransformationResults = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  useGSAP(
    () => {
      if (!isInView) return;

      transformationStats.forEach((stat, i) => {
        const el = sectionRef.current?.querySelector(
          `[data-tstat="${stat.id}"]`,
        );
        if (!el) return;

        const counter = { val: 0 };
        gsap.to(counter, {
          val: stat.value,
          duration: 2.2,
          delay: i * 0.15,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent =
              Math.round(counter.val).toLocaleString() + stat.suffix;
          },
        });
      });
    },
    { scope: sectionRef, dependencies: [isInView] },
  );

  return (
    <section
      ref={sectionRef}
      className={styles.resultsSection}
      aria-labelledby="results-heading"
    >
      <div className={styles.resultsBg} aria-hidden="true" />
      <div className={styles.resultsGlow} aria-hidden="true" />
      <div className={styles.resultsNoise} aria-hidden="true" />

      <div className={styles.sectionContainer}>
        <motion.div
          className={styles.sectionHeader}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <SectionLabel text="PROVEN RESULTS" variant="light" />
          <h2 id="results-heading" className={styles.sectionHeading}>
            Real People.{" "}
            <span className={styles.accentText}>Real Results.</span>
          </h2>
          <p className={styles.sectionSubtext}>
            Numbers that reflect a decade of commitment to member
            transformation.
          </p>
        </motion.div>

        <motion.div
          className={styles.resultsGrid}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {transformationStats.map((stat) => (
            <motion.div
              key={stat.id}
              className={styles.resultCard}
              variants={staggerItem}
            >
              <div className={styles.resultCardInner}>
                <span
                  data-tstat={stat.id}
                  className={styles.resultNumber}
                  aria-label={`${stat.value}${stat.suffix} ${stat.label}`}
                >
                  0{stat.suffix}
                </span>
                <span className={styles.resultLabel}>{stat.label}</span>
                <span className={styles.resultDesc}>{stat.desc}</span>
                <div className={styles.resultAccent} aria-hidden="true" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Transformation image strip */}
        <motion.div
          className={styles.imgStrip}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {[
            "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=70",
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=70",
            "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=70",
            "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=500&q=70",
          ].map((src, i) => (
            <motion.div
              key={i}
              className={styles.imgStripItem}
              variants={staggerItem}
              whileHover={{
                scale: 1.04,
                transition: { duration: 0.4 },
              }}
            >
              <img
                src={src}
                alt={`Transformation result ${i + 1}`}
                className={styles.imgStripImg}
                loading="lazy"
              />
              <div className={styles.imgStripOverlay} aria-hidden="true" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ══════════════════════════════════════════
// FAQ ITEM (Reusable)
// ══════════════════════════════════════════
const FAQItem = ({ faq, isOpen, onToggle }) => {
  const { setCursor, resetCursor } = useCursorVariant();

  return (
    <div className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ""}`}>
      <button
        className={styles.faqQuestion}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${faq.id}`}
        onMouseEnter={() => setCursor("hover")}
        onMouseLeave={resetCursor}
      >
        <span className={styles.faqQuestionText}>{faq.question}</span>
        <motion.span
          className={styles.faqIcon}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        >
          {isOpen ? <FiMinus /> : <FiPlus />}
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-answer-${faq.id}`}
            role="region"
            className={styles.faqAnswer}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.faqAnswerInner}>
              <p>{faq.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ══════════════════════════════════════════
// FAQ SECTION
// ══════════════════════════════════════════
const FAQSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });
  const [openId, setOpenId] = useState(1);

  const handleToggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      ref={sectionRef}
      className={styles.faqSection}
      aria-labelledby="faq-heading"
    >
      <div className={styles.sectionContainer}>
        <div className={styles.faqGrid}>
          {/* Left — heading */}
          <motion.div
            className={styles.faqLeft}
            variants={fadeLeft}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <SectionLabel text="FAQ" variant="light" />
            <h2 id="faq-heading" className={styles.faqHeading}>
              Common <span className={styles.accentText}>Questions</span>
            </h2>
            <p className={styles.faqSubtext}>
              Everything you need to know before starting your Gymssy journey.
              Still have questions?{" "}
              <Link to="/contact" className={styles.faqLink}>
                Talk to a coach.
              </Link>
            </p>

            {/* Decorative */}
            <div className={styles.faqDecor} aria-hidden="true">
              ?
            </div>
          </motion.div>

          {/* Right — accordion */}
          <motion.div
            className={styles.faqRight}
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {faqs.map((faq) => (
              <motion.div key={faq.id} variants={staggerItem}>
                <FAQItem
                  faq={faq}
                  isOpen={openId === faq.id}
                  onToggle={() => handleToggle(faq.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ══════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════
const Programs = () => {
  return (
    <>
      <main className={styles.page}>
        <PageHeader />
        <ProgramsIntro />
        <FeaturedPrograms />
        <TrainingProcess />
        <WhyItWorks />
        <TransformationResults />
        <FAQSection />
      </main>
    </>
  );
};

export default Programs;
