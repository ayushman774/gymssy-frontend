import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiSearch,
  FiBarChart2,
  FiCheckCircle,
  FiZap,
  FiShield,
  FiStar,
  FiMessageCircle,
  FiGift,
  FiLock,
  FiMapPin,
  FiUsers,
  FiTrendingUp,
  FiAward,
} from "react-icons/fi";
import SectionLabel from "../../components/ui/SectionLabel/SectionLabel";
import MagneticButton from "../../components/ui/MagneticButton/MagneticButton";
import { useCursorVariant } from "../../hooks/useCursorVariant";
import styles from "./About.module.css";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════
   ANIMATION VARIANTS
═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   STATIC DATA
═══════════════════════════════════════════ */
const stats = [
  {
    id: "gyms",
    value: 1000,
    suffix: "+",
    label: "Partner Gyms",
    desc: "Verified fitness centers",
  },
  {
    id: "trainers",
    value: 500,
    suffix: "+",
    label: "Certified Trainers",
    desc: "Expert professionals",
  },
  {
    id: "cities",
    value: 50,
    suffix: "+",
    label: "Cities Covered",
    desc: "And growing fast",
  },
  {
    id: "users",
    value: 25000,
    suffix: "+",
    label: "Happy Users",
    desc: "Active members",
  },
];

const howItWorks = [
  {
    step: "01",
    icon: FiSearch,
    title: "Search",
    desc: "Find gyms, trainers, studios, and wellness centers by location or category.",
  },
  {
    step: "02",
    icon: FiBarChart2,
    title: "Compare",
    desc: "Browse detailed profiles, pricing, reviews, and membership options side by side.",
  },
  {
    step: "03",
    icon: FiCheckCircle,
    title: "Choose",
    desc: "Select the perfect fitness partner that matches your goals and lifestyle.",
  },
  {
    step: "04",
    icon: FiZap,
    title: "Start",
    desc: "Begin your fitness journey with confidence, backed by our trusted platform.",
  },
];

/* CHANGE 7 — added ctaLabel to each audience */
const audiences = [
  {
    icon: "🏃",
    title: "Fitness Enthusiasts",
    desc: "Discover gyms, studios, and trainers perfectly matched to your goals, budget, and schedule.",
    color: "neon",
    ctaLabel: "Explore Gyms",
    ctaTo: "/explore",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
  },
  {
    icon: "🏢",
    title: "Gym Owners",
    desc: "List your facility, showcase your amenities, and reach thousands of potential members daily.",
    color: "blue",
    ctaLabel: "List Your Gym",
    ctaTo: "/list-gym",
    image:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80",
  },
  {
    icon: "💪",
    title: "Personal Trainers",
    desc: "Build a compelling profile, highlight your certifications, and attract new clients effortlessly.",
    color: "neon",
    ctaLabel: "Find Trainers",
    ctaTo: "/trainers",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80",
  },
  {
    icon: "🧘",
    title: "Fitness Studios",
    desc: "Showcase yoga, pilates, dance, and martial arts classes to a highly engaged fitness audience.",
    color: "blue",
    ctaLabel: "Explore Studios",
    ctaTo: "/studios",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
  },
];

const features = [
  {
    icon: FiShield,
    title: "Verified Partners",
    desc: "Every gym, trainer, and studio is thoroughly vetted and verified before listing.",
    color: "neon",
  },
  {
    icon: FiStar,
    title: "Trusted Reviews",
    desc: "Authentic reviews from real users help you make confident, informed decisions.",
    color: "blue",
  },
  {
    icon: FiBarChart2,
    title: "Easy Comparison",
    desc: "Compare facilities, pricing, and memberships side-by-side with zero hassle.",
    color: "neon",
  },
  {
    icon: FiMessageCircle,
    title: "Instant Enquiries",
    desc: "Connect directly with gyms and trainers through our built-in messaging system.",
    color: "blue",
  },
  {
    icon: FiGift,
    title: "Exclusive Deals",
    desc: "Access member-only discounts, offers, and promotional memberships.",
    color: "neon",
  },
  {
    icon: FiLock,
    title: "Secure Platform",
    desc: "Your data and transactions are protected with enterprise-grade security.",
    color: "blue",
  },
];

const partners = [
  { name: "FitZone Pro", abbr: "FZ" },
  { name: "EliteGym", abbr: "EG" },
  { name: "ZenFlow Yoga", abbr: "ZF" },
  { name: "CorePilates", abbr: "CP" },
  { name: "IronHouse", abbr: "IH" },
  { name: "SwimAcademy", abbr: "SA" },
  { name: "MartialEdge", abbr: "ME" },
  { name: "DanceBox", abbr: "DB" },
  { name: "PeakFitness", abbr: "PF" },
  { name: "WellnessHub", abbr: "WH" },
];

const communityImages = [
  {
    src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
    label: "Gym Training",
  },
  {
    src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
    label: "Yoga Sessions",
  },
  {
    src: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80",
    label: "Personal Training",
  },
  {
    src: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80",
    label: "Group Classes",
  },
];

const impactPoints = [
  {
    icon: FiMapPin,
    stat: "50+ Cities",
    desc: "Helping people discover fitness opportunities in their neighborhood.",
  },
  {
    icon: FiUsers,
    stat: "1000+ Partners",
    desc: "Supporting local gyms, studios, and trainers to grow their business.",
  },
  {
    icon: FiTrendingUp,
    stat: "25K+ Journeys",
    desc: "Empowering individuals to start and sustain their fitness journeys.",
  },
  {
    icon: FiAward,
    stat: "Verified Quality",
    desc: "Building stronger, healthier communities through trusted connections.",
  },
];

/* ═══════════════════════════════════════════
   PAGE HEADER
═══════════════════════════════════════════ */
const PageHeader = () => (
  <section className={styles.pageHeader} aria-label="About Us page header">
    <div className={styles.headerBg} aria-hidden="true" />
    <div className={styles.headerOverlay} aria-hidden="true" />
    {/* CHANGE 1 — headerGlow removed */}
    <div className={styles.headerNoise} aria-hidden="true" />

    <div className={styles.headerContainer}>
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
        Connecting people with the best fitness experiences, all in one place.
      </motion.p>

      {/* Neon line */}
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

/* ═══════════════════════════════════════════
   OUR STORY
═══════════════════════════════════════════ */
const OurStory = () => {
  const sectionRef = useRef(null);
  const imgRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

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
          {/* Left — image */}
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
                alt="Premium fitness marketplace experience"
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
              <span className={styles.storyBadgeNumber}>1K+</span>
              <span className={styles.storyBadgeText}>Partner Venues</span>
            </motion.div>

            {/* Decorative corner */}
            <div className={styles.storyImgCorner} aria-hidden="true" />
          </motion.div>

          {/* Right — content */}
          <motion.div
            className={styles.storyContent}
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.div variants={staggerItem}>
              <SectionLabel text="OUR STORY" variant="light" />
            </motion.div>

            {/* CHANGE 4 — updated heading */}
            <motion.div variants={staggerItem}>
              <p className={styles.storySupLabel}>
                TRANSFORMING THE WAY PEOPLE DISCOVER FITNESS
              </p>
              <h2 id="story-heading" className={styles.storyHeading}>
                India's Complete{" "}
                <span className={styles.accentText}>Fitness</span> Marketplace
              </h2>
            </motion.div>

            <motion.p className={styles.storyText} variants={staggerItem}>
              Finding the right gym, trainer, or fitness program has always been
              frustrating. Endless searching, unreliable information, and no
              easy way to compare your options — we knew there had to be a
              better way.
            </motion.p>

            <motion.p className={styles.storyText} variants={staggerItem}>
              So we built one. Our marketplace brings together thousands of
              gyms, certified personal trainers, yoga studios, pilates centres,
              dance academies, swimming centres, and wellness services — all on
              one trusted platform. Explore, compare, and choose your perfect
              fitness experience without the guesswork.
            </motion.p>

            {/* Highlights */}
            <motion.div
              className={styles.storyHighlights}
              variants={staggerItem}
            >
              {[
                "1,000+ verified fitness venues",
                "500+ certified personal trainers",
                "50+ cities and expanding",
                "One trusted platform for everything fitness",
              ].map((item) => (
                <div key={item} className={styles.storyHighlight}>
                  <FiCheckCircle
                    className={styles.storyHighlightIcon}
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </div>
              ))}
            </motion.div>

            <motion.div variants={staggerItem}>
              <MagneticButton strength={0.3}>
                <Link to="/explore" className={styles.storyBtn}>
                  <span>Explore Platform</span>
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

/* ═══════════════════════════════════════════
   MISSION & VISION
═══════════════════════════════════════════ */
const MissionVision = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  /* CHANGE 5 — "Why We Exist" → "Why We Built Gymssy"
     CHANGE 8 — updated mission card content            */
  const cards = [
    {
      type: "Mission",
      icon: "🎯",
      title: "OUR MISSION",
      subTitle: "Making Fitness Accessible for Everyone",
      text: "Our mission is to simplify the way people discover and book fitness experiences. Gymssy connects users with trusted gyms, yoga studios, dance academies, swimming classes, sports coaching, personal trainers, and wellness services—all on one platform. We also empower fitness businesses to grow by helping them reach more customers and increase bookings.",
      color: "neon",
    },
    {
      type: "Vision",
      icon: "🌍",
      title: "Our Vision",
      subTitle: null,
      text: "To become the most trusted fitness marketplace connecting people with quality fitness experiences across every city. A world where finding the perfect gym, trainer, or studio is as easy as a single search — empowering healthier, stronger communities everywhere.",
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
          {/* CHANGE 5 */}
          <h2 id="mission-heading" className={styles.sectionHeading}>
            Why We <span className={styles.accentText}>Built Gymssy</span>
          </h2>
        </motion.div>

        <motion.div
          className={styles.missionGrid}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {cards.map((card) => (
            <motion.div
              key={card.type}
              className={`${styles.missionCard} ${styles[`missionCard--${card.color}`]}`}
              variants={staggerItem}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <div className={styles.cardShine} aria-hidden="true" />
              {/* CHANGE 1 — cardGlow kept but opacity-on-hover only, no ambient blur */}
              <div className={styles.cardGlow} aria-hidden="true" />
              <span className={styles.missionIcon} aria-hidden="true">
                {card.icon}
              </span>
              {/* CHANGE 8 — mission card has subtitle */}
              <h3 className={styles.missionCardTitle}>{card.title}</h3>
              {card.subTitle && (
                <p className={styles.missionCardSubTitle}>{card.subTitle}</p>
              )}
              <p className={styles.missionCardText}>{card.text}</p>
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

/* ═══════════════════════════════════════════
   HOW IT WORKS — Timeline
═══════════════════════════════════════════ */
const HowItWorks = () => {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  useGSAP(
    () => {
      if (!isInView || !lineRef.current) return;
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.4,
          ease: "power2.out",
          delay: 0.3,
          transformOrigin: "left center",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        },
      );
    },
    { scope: sectionRef, dependencies: [isInView] },
  );

  return (
    <section
      ref={sectionRef}
      className={styles.howSection}
      aria-labelledby="how-heading"
    >
      <div className={styles.sectionContainer}>
        <motion.div
          className={styles.sectionHeader}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <SectionLabel text="HOW IT WORKS" variant="light" />
          <h2 id="how-heading" className={styles.sectionHeading}>
            Your Journey <span className={styles.accentText}>Starts Here</span>
          </h2>
          <p className={styles.sectionSubtext}>
            Four simple steps to finding your perfect fitness match.
          </p>
        </motion.div>

        <div className={styles.timelineWrapper}>
          {/* Connecting line */}
          <div className={styles.timelineLine} aria-hidden="true">
            <div ref={lineRef} className={styles.timelineLineFill} />
          </div>

          <motion.div
            className={styles.timelineGrid}
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {howItWorks.map((step) => (
              <motion.div
                key={step.step}
                className={styles.timelineStep}
                variants={staggerItem}
              >
                {/* Node */}
                <div className={styles.timelineNode}>
                  <div className={styles.timelineNodeInner}>
                    <step.icon
                      className={styles.timelineNodeIcon}
                      aria-hidden="true"
                    />
                  </div>
                  {/* CHANGE 1 — timelineNodeGlow kept as hover-only, no ambient */}
                  <div className={styles.timelineNodeGlow} aria-hidden="true" />
                </div>

                {/* Content */}
                <div className={styles.timelineContent}>
                  <span className={styles.timelineStepNum}>{step.step}</span>
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

/* ═══════════════════════════════════════════
   WHO WE SERVE
═══════════════════════════════════════════ */
const WhoWeServe = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });
  const { setCursor, resetCursor } = useCursorVariant();

  return (
    <section
      ref={sectionRef}
      className={styles.audienceSection}
      aria-labelledby="audience-heading"
    >
      <div className={styles.audienceBg} aria-hidden="true" />
      <div className={styles.audienceNoise} aria-hidden="true" />

      <div className={styles.sectionContainer}>
        <motion.div
          className={styles.sectionHeader}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <SectionLabel text="WHO WE SERVE" variant="light" />
          <h2 id="audience-heading" className={styles.sectionHeading}>
            Built for <span className={styles.accentText}>Everyone</span>
          </h2>
          <p className={styles.sectionSubtext}>
            Whether you're searching for fitness or offering it, our platform is
            designed to serve you.
          </p>
        </motion.div>

        <motion.div
          className={styles.audienceGrid}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {audiences.map((a) => (
            <motion.article
              key={a.title}
              className={`${styles.audienceCard} ${
                styles[`audienceCard--${a.color}`]
              }`}
              variants={staggerItem}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              onMouseEnter={() => setCursor("hover")}
              onMouseLeave={resetCursor}
            >
              {/* Background image */}
              <div className={styles.audienceImgWrapper}>
                <img
                  src={a.image}
                  alt={a.title}
                  className={styles.audienceImg}
                  loading="lazy"
                />
                <div className={styles.audienceImgOverlay} aria-hidden="true" />
              </div>

              {/* Content */}
              <div className={styles.audienceBody}>
                <span className={styles.audienceIcon} aria-hidden="true">
                  {a.icon}
                </span>
                <h3 className={styles.audienceTitle}>{a.title}</h3>
                <p className={styles.audienceDesc}>{a.desc}</p>

                {/* CHANGE 7 — CTA button per card */}
                <Link
                  to={a.ctaTo}
                  className={`${styles.audienceBtn} ${
                    styles[`audienceBtn--${a.color}`]
                  }`}
                >
                  <span>{a.ctaLabel}</span>
                  <FiArrowRight aria-hidden="true" />
                </Link>

                <div
                  className={`${styles.audienceAccent} ${
                    styles[`audienceAccent--${a.color}`]
                  }`}
                  aria-hidden="true"
                />
              </div>

              {/* CHANGE 1 — audienceGlow is hover-only, no ambient */}
              <div className={styles.audienceGlow} aria-hidden="true" />
            </motion.article>
          ))}
        </motion.div>

        {/* CHANGE 7 — bottom CTA row below the grid */}
        <motion.div
          className={styles.audienceCtaRow}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <MagneticButton strength={0.3}>
            <Link to="/explore" className={styles.audienceCtaBtnPrimary}>
              <span>Find Your Fitness Partner</span>
              <FiArrowRight aria-hidden="true" />
            </Link>
          </MagneticButton>

          <MagneticButton strength={0.3}>
            <Link
              to="/list-business"
              className={styles.audienceCtaBtnSecondary}
            >
              <span>List Your Business on Gymssy</span>
              <FiArrowRight aria-hidden="true" />
            </Link>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════
   WHY CHOOSE US — Feature Cards
═══════════════════════════════════════════ */
const WhyChooseUs = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  return (
    <section
      ref={sectionRef}
      className={styles.featuresSection}
      aria-labelledby="features-heading"
    >
      <div className={styles.sectionContainer}>
        <motion.div
          className={styles.sectionHeader}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <SectionLabel text="WHY US" variant="light" />
          <h2 id="features-heading" className={styles.sectionHeading}>
            The Platform <span className={styles.accentText}>Built Right</span>
          </h2>
          <p className={styles.sectionSubtext}>
            Everything you need to discover, compare, and connect with the best
            fitness experiences.
          </p>
        </motion.div>

        <motion.div
          className={styles.featuresGrid}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              className={`${styles.featureCard} ${
                styles[`featureCard--${f.color}`]
              }`}
              variants={staggerItem}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <div
                className={`${styles.featureIconWrap} ${
                  styles[`featureIconWrap--${f.color}`]
                }`}
              >
                <f.icon className={styles.featureIcon} aria-hidden="true" />
              </div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
              <div className={styles.featureCardShine} aria-hidden="true" />
              <div
                className={`${styles.featureCardGlow} ${
                  styles[`featureCardGlow--${f.color}`]
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

/* ═══════════════════════════════════════════
   STATISTICS
═══════════════════════════════════════════ */
const MarketplaceStats = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  useGSAP(
    () => {
      if (!isInView) return;
      stats.forEach((stat, i) => {
        const el = sectionRef.current?.querySelector(
          `[data-stat="${stat.id}"]`,
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
      className={styles.statsSection}
      aria-labelledby="stats-heading"
    >
      <div className={styles.statsBg} aria-hidden="true" />
      {/* CHANGE 1 — statsGlow removed */}

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
          {stats.map((stat) => (
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

/* ═══════════════════════════════════════════
   TRUSTED PARTNERS — Marquee logos
═══════════════════════════════════════════ */
const TrustedPartners = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  useGSAP(
    () => {
      if (!trackRef.current) return;
      const totalWidth = trackRef.current.scrollWidth / 2;
      gsap.to(trackRef.current, {
        x: -totalWidth,
        duration: 28,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
        },
      });
    },
    { scope: sectionRef },
  );

  const doubled = [...partners, ...partners];

  return (
    <section
      ref={sectionRef}
      className={styles.partnersSection}
      aria-labelledby="partners-heading"
    >
      <div className={styles.partnersBg} aria-hidden="true" />

      <div className={styles.sectionContainer}>
        <motion.div
          className={styles.sectionHeader}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <SectionLabel text="TRUSTED PARTNERS" variant="light" />
          <h2 id="partners-heading" className={styles.sectionHeading}>
            Powering <span className={styles.accentText}>Premium Fitness</span>
          </h2>
          <p className={styles.sectionSubtext}>
            Hundreds of quality fitness partners trust our platform to connect
            them with the right members.
          </p>
        </motion.div>
      </div>

      {/* Marquee */}
      <div className={styles.marqueeWrapper} aria-label="Partner logos">
        <div className={styles.marqueeTrackOuter}>
          <div ref={trackRef} className={styles.marqueeTrack}>
            {doubled.map((p, i) => (
              <div key={`${p.abbr}-${i}`} className={styles.partnerLogo}>
                <div className={styles.partnerLogoInner}>
                  <span className={styles.partnerAbbr}>{p.abbr}</span>
                  <span className={styles.partnerName}>{p.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.marqueeEdgeLeft} aria-hidden="true" />
        <div className={styles.marqueeEdgeRight} aria-hidden="true" />
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════
   COMMUNITY IMPACT
═══════════════════════════════════════════ */
const CommunityImpact = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  return (
    <section
      ref={sectionRef}
      className={styles.impactSection}
      aria-labelledby="impact-heading"
    >
      <div className={styles.impactBg} aria-hidden="true" />
      <div className={styles.impactNoise} aria-hidden="true" />

      <div className={styles.sectionContainer}>
        <div className={styles.impactGrid}>
          {/* Left — text content */}
          <motion.div
            className={styles.impactContent}
            variants={fadeLeft}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <SectionLabel text="COMMUNITY IMPACT" variant="light" />

            {/* CHANGE 9 — heading unchanged, only description updated */}
            <h2 id="impact-heading" className={styles.impactHeading}>
              Building Healthier{" "}
              <span className={styles.accentText}>Communities</span> Together.
            </h2>

            {/* CHANGE 9 — updated description */}
            <p className={styles.impactText}>
              Every search, every connection, and every booking made through
              Gymssy brings people one step closer to a healthier lifestyle
              while helping fitness businesses grow. We measure our success not
              just by bookings, but by the lives we help transform.
            </p>

            <div className={styles.impactPoints}>
              {impactPoints.map((p) => (
                <div key={p.stat} className={styles.impactPoint}>
                  <div className={styles.impactPointIcon}>
                    <p.icon aria-hidden="true" />
                  </div>
                  <div>
                    <p className={styles.impactPointStat}>{p.stat}</p>
                    <p className={styles.impactPointDesc}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — image mosaic */}
          <motion.div
            className={styles.impactImgGrid}
            variants={fadeRight}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {communityImages.map((img, i) => (
              <motion.div
                key={img.label}
                className={`${styles.impactImgItem} ${
                  i === 0 ? styles.impactImgItemLarge : ""
                }`}
                whileHover={{ scale: 1.03, transition: { duration: 0.4 } }}
              >
                <img
                  src={img.src}
                  alt={img.label}
                  className={styles.impactImg}
                  loading="lazy"
                />
                <div className={styles.impactImgOverlay} aria-hidden="true" />
                <span className={styles.impactImgLabel}>{img.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════ */
const About = () => (
  <main className={styles.page}>
    <PageHeader />
    <OurStory />
    <MissionVision />
    <HowItWorks />
    <WhoWeServe />
    <WhyChooseUs />
    <MarketplaceStats />
    <TrustedPartners />
    <CommunityImpact />
  </main>
);

export default About;
