import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import {
  FiHome,
  FiChevronRight,
  FiArrowRight,
  FiArrowUpRight,
  FiInstagram,
  FiLinkedin,
  FiCheck,
  FiStar,
} from "react-icons/fi";
import SectionLabel from "../../components/sections/home/ui/SectionLabel/SectionLabel";
import MagneticButton from "../../components/sections/home/ui/MagneticButton/MagneticButton";
import { useCursorVariant } from "../../hooks/useCursorVariant";
import { stats, facilities, coaches, values } from "../../assets/data/about";
import styles from "./About.module.css";

gsap.registerPlugin(ScrollTrigger);

// ─── Animation Variants ───────────────────────────────────────────────
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
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
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

const communityImages = [
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
  "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80",
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
];

// ─── Page Header ──────────────────────────────────────────────────────
const PageHeader = () => (
  <section className={styles.pageHeader} aria-label="About Us page header">
    {/* Background */}
    <div className={styles.headerBg} aria-hidden="true" />
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
          About Us
        </span>
      </motion.nav>

      {/* Heading */}
      <motion.h1
        className={styles.headerHeading}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        About <span className={styles.headerHeadingAccent}>Us</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className={styles.headerSubtitle}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        Building stronger bodies, stronger minds, and a stronger community.
      </motion.p>

      {/* Bottom neon line */}
      <motion.div
        className={styles.headerLine}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden="true"
      />
    </div>
  </section>
);

// ─── Our Story ────────────────────────────────────────────────────────
const OurStory = () => {
  const sectionRef = useRef(null);
  const imgRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  // Parallax on image
  useGSAP(
    () => {
      gsap.to(imgRef.current, {
        y: -60,
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
      className={styles.story}
      aria-labelledby="story-heading"
    >
      <div className={styles.sectionContainer}>
        <div className={styles.storyGrid}>
          {/* Left — Image */}
          <motion.div
            className={styles.storyImgWrapper}
            variants={fadeLeft}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <div className={styles.storyImgInner}>
              <img
                ref={imgRef}
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80"
                alt="APEX Fitness main training floor"
                className={styles.storyImg}
                loading="eager"
              />
              <div className={styles.storyImgOverlay} aria-hidden="true" />
            </div>

            {/* Floating badge */}
            <motion.div
              className={styles.storyBadge}
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
              <span className={styles.storyBadgeNumber}>10+</span>
              <span className={styles.storyBadgeText}>Years of Excellence</span>
            </motion.div>

            {/* Decorative corner */}
            <div className={styles.storyImgCorner} aria-hidden="true" />
          </motion.div>

          {/* Right — Content */}
          <motion.div
            className={styles.storyContent}
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.div variants={staggerItem}>
              <SectionLabel text="OUR STORY" variant="light" />
            </motion.div>

            <motion.h2
              id="story-heading"
              className={styles.storyHeading}
              variants={staggerItem}
            >
              We Don't Build <span className={styles.accentText}>Gyms.</span>
              <br />
              We Build <span className={styles.accentText}>Champions.</span>
            </motion.h2>

            <motion.p className={styles.storyText} variants={staggerItem}>
              APEX Fitness was born from a simple but powerful belief — that
              every person carries within them the potential for extraordinary
              physical achievement. Founded in 2014 by former Olympic athlete
              Marcus Reid, we set out to create something the fitness world had
              never seen.
            </motion.p>

            <motion.p className={styles.storyText} variants={staggerItem}>
              Not just a gym. A performance temple. A place where the equipment
              is world-class, the coaches are elite, and the community pushes
              you beyond what you thought possible. Every detail — from the
              lighting to the layout to the programming — is engineered for one
              purpose: your transformation.
            </motion.p>

            {/* Story highlights */}
            <motion.div
              className={styles.storyHighlights}
              variants={staggerItem}
            >
              {[
                "Founded by Olympic athlete Marcus Reid",
                "10,000+ member community worldwide",
                "Award-winning coaching methodology",
                "State-of-the-art 25,000 sq ft facility",
              ].map((item) => (
                <div key={item} className={styles.storyHighlight}>
                  <FiCheck
                    className={styles.storyHighlightIcon}
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </div>
              ))}
            </motion.div>

            <motion.div variants={staggerItem}>
              <MagneticButton strength={0.3}>
                <Link to="/programs" className={styles.storyBtn}>
                  <span>Explore Programs</span>
                  <FiArrowRight aria-hidden="true" />
                </Link>
              </MagneticButton>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── Mission & Vision ─────────────────────────────────────────────────
const MissionVision = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  const cards = [
    {
      type: "Mission",
      icon: "🎯",
      title: "Our Mission",
      text: "To provide an unparalleled fitness environment where every member — regardless of their starting point — has access to world-class facilities, elite coaching, and a community that refuses to let them settle for anything less than their best.",
      color: "neon",
    },
    {
      type: "Vision",
      icon: "👁",
      title: "Our Vision",
      text: "To become the global standard for premium fitness experiences. A world where peak physical performance is accessible, where strength is celebrated, and where every person who walks through our doors leaves more capable than when they arrived.",
      color: "blue",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className={styles.missionSection}
      aria-labelledby="mission-heading"
    >
      <div className={styles.missionBg} aria-hidden="true" />
      <div className={styles.missionNoise} aria-hidden="true" />

      <div className={styles.sectionContainer}>
        <motion.div
          className={styles.sectionHeader}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <SectionLabel text="PURPOSE" variant="light" />
          <h2 id="mission-heading" className={styles.sectionHeading}>
            Why We <span className={styles.accentText}>Exist</span>
          </h2>
        </motion.div>

        <motion.div
          className={styles.missionGrid}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {cards.map((card, i) => (
            <motion.div
              key={card.type}
              className={`${styles.missionCard} ${
                styles[`missionCard--${card.color}`]
              }`}
              variants={staggerItem}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              {/* Glass shine */}
              <div className={styles.cardShine} aria-hidden="true" />
              <div className={styles.cardGlow} aria-hidden="true" />

              <span className={styles.missionIcon} aria-hidden="true">
                {card.icon}
              </span>
              <h3 className={styles.missionCardTitle}>{card.title}</h3>
              <p className={styles.missionCardText}>{card.text}</p>

              {/* Bottom accent */}
              <div
                className={`${styles.missionCardAccent} ${
                  styles[`missionCardAccent--${card.color}`]
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

// ─── Stats ────────────────────────────────────────────────────────────
const Stats = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  useGSAP(
    () => {
      if (!isInView) return;

      stats.forEach((stat, i) => {
        const el = sectionRef.current?.querySelector(
          `[data-stat="${stat.id}"]`,
        );

        // ✅ Safety check
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
      className={styles.statsSection}
      aria-labelledby="stats-heading"
    >
      <div className={styles.statsBg} aria-hidden="true" />
      <div className={styles.statsGlow} aria-hidden="true" />

      <div className={styles.sectionContainer}>
        <motion.div
          className={styles.sectionHeader}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <SectionLabel text="BY THE NUMBERS" variant="light" />
          <h2 id="stats-heading" className={styles.sectionHeading}>
            The <span className={styles.accentText}>Numbers</span> Speak
          </h2>
        </motion.div>

        <motion.div
          className={styles.statsGrid}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              className={styles.statCard}
              variants={staggerItem}
            >
              <div className={styles.statCardInner}>
                <span
                  data-stat={stat.id}
                  className={styles.statNumber}
                  aria-label={`${stat.value}${stat.suffix} ${stat.label}`}
                >
                  0{stat.suffix}
                </span>
                <span className={styles.statLabel}>{stat.label}</span>
                <span className={styles.statDesc}>{stat.desc}</span>
                <div className={styles.statAccent} aria-hidden="true" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ─── Facilities ───────────────────────────────────────────────────────
const Facilities = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-5%" });

  return (
    <section
      ref={sectionRef}
      className={styles.facilitiesSection}
      aria-labelledby="facilities-heading"
    >
      <div className={styles.sectionContainer}>
        <motion.div
          className={styles.sectionHeader}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <SectionLabel text="WORLD-CLASS FACILITIES" variant="light" />
          <h2 id="facilities-heading" className={styles.sectionHeading}>
            Built for <span className={styles.accentText}>Champions</span>
          </h2>
          <p className={styles.sectionSubtext}>
            Every corner of APEX is engineered to elevate your performance.
          </p>
        </motion.div>

        {/* Alternating facility rows */}
        <div className={styles.facilitiesList}>
          {facilities.map((facility, i) => (
            <FacilityRow
              key={facility.id}
              facility={facility}
              reverse={i % 2 !== 0}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const FacilityRow = ({ facility, reverse, index }) => {
  const rowRef = useRef(null);
  const imgRef = useRef(null);
  const isInView = useInView(rowRef, { once: true, margin: "-10%" });

  // Parallax
  useGSAP(
    () => {
      gsap.to(imgRef.current, {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: rowRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    },
    { scope: rowRef },
  );

  return (
    <div
      ref={rowRef}
      className={`${styles.facilityRow} ${
        reverse ? styles.facilityRowReverse : ""
      }`}
    >
      {/* Image */}
      <motion.div
        className={styles.facilityImgWrapper}
        variants={reverse ? fadeRight : fadeLeft}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className={styles.facilityImgInner}>
          <img
            ref={imgRef}
            src={facility.image}
            alt={facility.title}
            className={styles.facilityImg}
            loading="lazy"
          />
          <div className={styles.facilityImgOverlay} aria-hidden="true" />

          {/* Tag */}
          <div className={styles.facilityTag}>
            <span className={styles.facilityTagDot} aria-hidden="true" />
            {facility.tag}
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        className={styles.facilityContent}
        variants={reverse ? fadeLeft : fadeRight}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <span className={styles.facilityNumber}>0{index + 1}</span>
        <h3 className={styles.facilityTitle}>{facility.title}</h3>
        <p className={styles.facilitySubtitle}>{facility.subtitle}</p>
        <p className={styles.facilityDesc}>{facility.desc}</p>

        <ul className={styles.facilityFeatures} role="list">
          {facility.features.map((f) => (
            <li key={f} className={styles.facilityFeature}>
              <FiCheck
                className={styles.facilityFeatureIcon}
                aria-hidden="true"
              />
              {f}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

// ─── Coaches ──────────────────────────────────────────────────────────
const Coaches = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  return (
    <section
      ref={sectionRef}
      className={styles.coachesSection}
      aria-labelledby="coaches-heading"
    >
      <div className={styles.coachesBg} aria-hidden="true" />
      <div className={styles.coachesNoise} aria-hidden="true" />

      <div className={styles.sectionContainer}>
        <motion.div
          className={styles.sectionHeader}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <SectionLabel text="MEET THE TEAM" variant="light" />
          <h2 id="coaches-heading" className={styles.sectionHeading}>
            Trained by the <span className={styles.accentText}>Best</span>
          </h2>
          <p className={styles.sectionSubtext}>
            Our coaches are not just trainers — they are performance architects
            who design your path to greatness.
          </p>
        </motion.div>

        <motion.div
          className={styles.coachesGrid}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {coaches.map((coach) => (
            <CoachCard key={coach.id} coach={coach} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const CoachCard = ({ coach }) => {
  const { setCursor, resetCursor } = useCursorVariant();

  return (
    <motion.article
      className={styles.coachCard}
      variants={staggerItem}
      onMouseEnter={() => setCursor("hover")}
      onMouseLeave={resetCursor}
    >
      {/* Image wrapper */}
      <div className={styles.coachImgWrapper}>
        <img
          src={coach.image}
          alt={coach.name}
          className={styles.coachImg}
          loading="lazy"
        />
        <div className={styles.coachImgOverlay} aria-hidden="true" />

        {/* Social icons — reveal on hover */}
        <div
          className={styles.coachSocials}
          role="list"
          aria-label={`${coach.name} social links`}
        >
          {coach.socials.instagram && (
            <a
              href={coach.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${coach.name} on Instagram`}
              className={styles.coachSocialBtn}
              role="listitem"
            >
              <FiInstagram />
            </a>
          )}
          {coach.socials.linkedin && (
            <a
              href={coach.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${coach.name} on LinkedIn`}
              className={styles.coachSocialBtn}
              role="listitem"
            >
              <FiLinkedin />
            </a>
          )}
        </div>

        {/* Experience badge */}
        <div className={styles.coachExp}>
          <FiStar aria-hidden="true" />
          <span>{coach.experience}</span>
        </div>
      </div>

      {/* Info */}
      <div className={styles.coachInfo}>
        <h3 className={styles.coachName}>{coach.name}</h3>
        <p className={styles.coachPosition}>{coach.position}</p>
        <p className={styles.coachSpec}>{coach.specialization}</p>

        {/* Certifications */}
        <div className={styles.coachCerts}>
          {coach.certifications.map((cert) => (
            <span key={cert} className={styles.coachCert}>
              {cert}
            </span>
          ))}
        </div>
      </div>

      {/* Hover glow */}
      <div className={styles.coachGlow} aria-hidden="true" />
    </motion.article>
  );
};

// ─── Values ───────────────────────────────────────────────────────────
const Values = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  return (
    <section
      ref={sectionRef}
      className={styles.valuesSection}
      aria-labelledby="values-heading"
    >
      <div className={styles.sectionContainer}>
        <motion.div
          className={styles.sectionHeader}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <SectionLabel text="WHAT WE STAND FOR" variant="light" />
          <h2 id="values-heading" className={styles.sectionHeading}>
            Our Core <span className={styles.accentText}>Values</span>
          </h2>
        </motion.div>

        <motion.div
          className={styles.valuesGrid}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {values.map((value) => (
            <motion.div
              key={value.id}
              className={`${styles.valueCard} ${
                styles[`valueCard--${value.color}`]
              }`}
              variants={staggerItem}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <span className={styles.valueIcon} aria-hidden="true">
                {value.icon}
              </span>
              <h3 className={styles.valueTitle}>{value.title}</h3>
              <p className={styles.valueDesc}>{value.desc}</p>
              <div className={styles.valueCardGlow} aria-hidden="true" />
              <div
                className={`${styles.valueCardBorder} ${
                  styles[`valueCardBorder--${value.color}`]
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

// ─── Community ────────────────────────────────────────────────────────
const Community = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  return (
    <section
      ref={sectionRef}
      className={styles.communitySection}
      aria-labelledby="community-heading"
    >
      <div className={styles.communityBg} aria-hidden="true" />
      <div className={styles.communityOverlay} aria-hidden="true" />
      <div className={styles.communityGlow} aria-hidden="true" />

      <div className={styles.sectionContainer}>
        <motion.div
          className={styles.communityContent}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div variants={staggerItem}>
            <SectionLabel text="OUR COMMUNITY" variant="light" />
          </motion.div>

          <motion.h2
            id="community-heading"
            className={styles.communityHeading}
            variants={staggerItem}
          >
            More Than a Gym.
            <br />
            <span className={styles.accentText}>A Movement.</span>
          </motion.h2>

          <motion.p className={styles.communityText} variants={staggerItem}>
            At APEX, you're joining more than a fitness facility. You're joining
            a brotherhood and sisterhood of people who refuse to be ordinary. We
            celebrate every milestone, support every struggle, and show up for
            each other every single day.
          </motion.p>

          <motion.div
            className={styles.communityPillars}
            variants={staggerItem}
          >
            {[
              "Member Success Stories",
              "Group Challenges",
              "24/7 Support",
              "Transformation Programs",
            ].map((pillar) => (
              <span key={pillar} className={styles.communityPillar}>
                <span
                  className={styles.communityPillarDot}
                  aria-hidden="true"
                />
                {pillar}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Community image grid */}
      <motion.div
        className={styles.communityImgGrid}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {communityImages.map((src, i) => (
          <motion.div
            key={i}
            className={styles.communityImgItem}
            variants={staggerItem}
            whileHover={{ scale: 1.03, transition: { duration: 0.4 } }}
          >
            <img
              src={src}
              alt={`APEX community moment ${i + 1}`}
              className={styles.communityImg}
              loading="lazy"
            />
            <div className={styles.communityImgOverlay} aria-hidden="true" />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

// ─── Final CTA ────────────────────────────────────────────────────────
const FinalCTA = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });
  const { setCursor, resetCursor } = useCursorVariant();

  const words = "YOUR TRANSFORMATION STARTS HERE.".split(" ");

  return (
    <section
      ref={sectionRef}
      className={styles.ctaSection}
      aria-labelledby="cta-heading"
    >
      <div className={styles.ctaBg} aria-hidden="true" />
      <div className={styles.ctaGlow} aria-hidden="true" />
      <div className={styles.ctaNoise} aria-hidden="true" />

      {/* Background word */}
      <div className={styles.ctaBgWord} aria-hidden="true">
        APEX
      </div>

      <div className={styles.sectionContainer}>
        <motion.div
          className={styles.ctaContent}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div variants={staggerItem}>
            <SectionLabel text="BEGIN YOUR JOURNEY" variant="light" />
          </motion.div>

          {/* Headline word by word */}
          <motion.h2
            id="cta-heading"
            className={styles.ctaHeading}
            variants={staggerContainer}
            aria-label="Your transformation starts here."
          >
            {words.map((word, i) => (
              <span
                key={i}
                className={styles.ctaWordWrapper}
                aria-hidden="true"
              >
                <motion.span
                  className={`${styles.ctaWord} ${
                    word === "TRANSFORMATION" ? styles.ctaWordAccent : ""
                  }`}
                  variants={{
                    hidden: { opacity: 0, y: 60 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.8,
                        delay: i * 0.08,
                        ease: [0.16, 1, 0.3, 1],
                      },
                    },
                  }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h2>

          <motion.p className={styles.ctaSubtext} variants={staggerItem}>
            Join over 5,000 members who chose excellence. Your first step starts
            today.
          </motion.p>

          <motion.div className={styles.ctaButtons} variants={staggerItem}>
            <MagneticButton strength={0.4}>
              <motion.button
                className={styles.ctaBtnPrimary}
                onMouseEnter={() => setCursor("hover")}
                onMouseLeave={resetCursor}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>Join Now</span>
                <FiArrowRight aria-hidden="true" />
                <span className={styles.btnShimmer} aria-hidden="true" />
              </motion.button>
            </MagneticButton>

            <MagneticButton strength={0.4}>
              <motion.button
                className={styles.ctaBtnSecondary}
                onMouseEnter={() => setCursor("hover")}
                onMouseLeave={resetCursor}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>Book Free Trial</span>
                <FiArrowUpRight aria-hidden="true" />
              </motion.button>
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// ─── Main About Page ──────────────────────────────────────────────────
const About = () => {
  return (
    <>
      <main className={styles.page}>
        <PageHeader />
        <OurStory />
        <MissionVision />
        <Stats />
        <Facilities />
        <Coaches />
        <Values />
        <Community />
        {/* <FinalCTA /> */}
      </main>
    </>
  );
};

export default About;
