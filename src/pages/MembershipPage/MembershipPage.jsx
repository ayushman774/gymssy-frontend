import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FiChevronRight,
  FiZap,
  FiUsers,
  FiTrendingUp,
  FiShield,
  FiHeart,
  FiStar,
} from "react-icons/fi";
import {
  MdFitnessCenter,
  MdSportsGymnastics,
  MdOutlineTrackChanges,
  MdRestaurantMenu,
  MdGroups,
  MdEventAvailable,
} from "react-icons/md";

import PricingCard from "../../components/PricingCard/PricingCard";
import ComparisonTable from "../../components/ComparisonTable/ComparisonTable";
import MembershipFAQ from "../../components/MembershipFAQ/MembershipFAQ";
import styles from "./MembershipPage.module.css";
import { membershipImages } from "../../assets/data/membershipPage";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ────────────────────────────────────────────────────────────────────

const plans = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Ideal for Beginners",
    price: 49,
    period: "month",
    badge: null,
    features: [
      "Full Gym Access",
      "Locker & Shower Access",
      "Basic Fitness Assessment",
      "Community Access",
      "Mobile App Access",
      "Standard Equipment Use",
    ],
    cta: "Get Started",
    highlighted: false,
    accentColor: "#3B82F6",
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "Most Popular Choice",
    price: 89,
    period: "month",
    badge: "MOST POPULAR",
    features: [
      "Everything in Starter",
      "Personalized Workout Plan",
      "Progress Tracking Dashboard",
      "Unlimited Group Classes",
      "Nutrition Guidance",
      "Monthly Check-ins",
    ],
    cta: "Go Professional",
    highlighted: true,
    accentColor: "#39FF14",
  },
  {
    id: "elite",
    name: "Elite",
    tagline: "Premium Experience",
    price: 149,
    period: "month",
    badge: "PREMIUM",
    features: [
      "Everything in Professional",
      "Dedicated Personal Coach",
      "Priority Support 24/7",
      "VIP Training Sessions",
      "Advanced Body Analytics",
      "Exclusive Member Events",
    ],
    cta: "Go Elite",
    highlighted: false,
    accentColor: "#39FF14",
  },
];

const includedFeatures = [
  {
    icon: <MdFitnessCenter />,
    title: "Premium Equipment",
    description:
      "State-of-the-art machines and free weights sourced from the world's top fitness brands.",
    image: membershipImages.equipment,
  },
  {
    icon: <FiStar />,
    title: "Expert Trainers",
    description:
      "Certified coaches with decades of combined experience in elite athletic performance.",
    image: membershipImages.trainers,
  },
  {
    icon: <MdSportsGymnastics />,
    title: "Group Classes",
    description:
      "50+ weekly classes spanning HIIT, yoga, strength, and functional fitness formats.",
    image: membershipImages.classes,
  },
  {
    icon: <MdOutlineTrackChanges />,
    title: "Progress Tracking",
    description:
      "Advanced analytics dashboard to monitor every aspect of your fitness journey.",
    image: null,
  },
  {
    icon: <MdRestaurantMenu />,
    title: "Nutrition Support",
    description:
      "Personalized nutritional plans crafted by certified dietitians to fuel your goals.",
    image: null,
  },
  {
    icon: <MdGroups />,
    title: "Community Events",
    description:
      "Exclusive member events, challenges, and competitions to keep you motivated.",
    image: membershipImages.community,
  },
];

const benefits = [
  {
    icon: <FiZap />,
    title: "Flexible Options",
    description:
      "No rigid contracts. Choose the plan that fits your schedule and scale up anytime.",
  },
  {
    icon: <FiStar />,
    title: "Personalized Guidance",
    description:
      "Every member receives a tailored approach — because no two fitness journeys are identical.",
  },
  {
    icon: <FiHeart />,
    title: "Motivation & Accountability",
    description:
      "Our coaches and community ensure you stay consistent, focused, and energized.",
  },
  {
    icon: <FiShield />,
    title: "Modern Facilities",
    description:
      "Luxury changing rooms, recovery zones, and world-class training floors designed for performance.",
  },
  {
    icon: <FiTrendingUp />,
    title: "Transformation Support",
    description:
      "Structured programs with measurable milestones to take you from where you are to where you want to be.",
  },
  {
    icon: <FiUsers />,
    title: "Supportive Community",
    description:
      "Join thousands of like-minded individuals who push each other to new heights every single day.",
  },
];

const stats = [
  { value: 5000, suffix: "+", label: "Active Members" },
  { value: 1000, suffix: "+", label: "Transformations" },
  { value: 95, suffix: "%", label: "Member Retention" },
  { value: 10, suffix: "+", label: "Years of Excellence" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCounter = ({ value, suffix, label, index }) => {
  const ref = useRef(null);
  const counterRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView || !counterRef.current) return;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: value,
      duration: 2.5,
      delay: index * 0.2,
      ease: "power2.out",
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent =
            Math.round(obj.val).toLocaleString() + suffix;
        }
      },
    });
  }, [isInView, value, suffix, index]);

  return (
    <motion.div
      ref={ref}
      className={styles.statItem}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }}
    >
      <span ref={counterRef} className={styles.statValue}>
        0{suffix}
      </span>
      <span className={styles.statLabel}>{label}</span>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const MembershipPage = () => {
  const headerRef = useRef(null);
  const headerBgRef = useRef(null);
  const introImageRef = useRef(null);
  const introContentRef = useRef(null);
  const benefitCardsRef = useRef([]);
  const includedRef = useRef(null);

  // Header parallax
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!headerBgRef.current) return;
      gsap.to(headerBgRef.current, {
        yPercent: 25,
        ease: "none",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  // Intro section scroll-triggered reveal
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (introImageRef.current) {
        gsap.fromTo(
          introImageRef.current,
          { clipPath: "inset(0 100% 0 0)", opacity: 0 },
          {
            clipPath: "inset(0 0% 0 0)",
            opacity: 1,
            duration: 1.4,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: introImageRef.current,
              start: "top 80%",
              once: true,
            },
          },
        );
      }

      if (introContentRef.current) {
        const children =
          introContentRef.current.querySelectorAll("h2, p, .intro-tag");
        gsap.fromTo(
          children,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: introContentRef.current,
              start: "top 75%",
              once: true,
            },
          },
        );
      }
    });
    return () => ctx.revert();
  }, []);

  // Benefits stagger
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = benefitCardsRef.current.filter(Boolean);
      if (!cards.length) return;

      gsap.fromTo(
        cards,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cards[0],
            start: "top 80%",
            once: true,
          },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  // Included features parallax icons
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!includedRef.current) return;
      const icons = includedRef.current.querySelectorAll(
        `.${styles.featureIcon}`,
      );
      icons.forEach((icon) => {
        gsap.fromTo(
          icon,
          { scale: 0.5, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: icon,
              start: "top 85%",
              once: true,
            },
          },
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <main className={styles.membershipPage}>
      {/* ── PAGE HEADER ─────────────────────────────────────── */}
      <section ref={headerRef} className={styles.pageHeader}>
        <div ref={headerBgRef} className={styles.headerBg}>
          <img
            src={membershipImages.pageHeader}
            alt="Premium gym interior"
            className={styles.headerBgImage}
            loading="eager"
          />
        </div>
        <div className={styles.headerOverlay} />
        <div className={styles.headerGlow} />

        <div className={styles.headerContent}>
          <motion.div
            className={styles.headerText}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
          >
            <motion.span
              className={styles.headerEyebrow}
              initial={{ opacity: 0, letterSpacing: "0.2em" }}
              animate={{ opacity: 1, letterSpacing: "0.4em" }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              FORGE YOUR PATH
            </motion.span>
            <h1 className={styles.headerTitle}>MEMBERSHIPS</h1>
            <p className={styles.headerSubtitle}>
              Choose the membership that matches your fitness goals and
              lifestyle.
            </p>
          </motion.div>
        </div>

        <div className={styles.headerScrollIndicator}>
          <span className={styles.scrollLine} />
        </div>
      </section>

      {/* ── SECTION 1: INTRODUCTION ─────────────────────────── */}
      <section className={styles.introSection}>
        <div className={styles.introContainer}>
          <div ref={introImageRef} className={styles.introImageWrapper}>
            <img
              src={membershipImages.introduction}
              alt="Member training with coach"
              className={styles.introImage}
              loading="lazy"
            />
            <div className={styles.introImageAccent} />
            <div className={styles.introImageBadge}>
              <span className={styles.introBadgeNumber}>10+</span>
              <span className={styles.introBadgeText}>Years of Excellence</span>
            </div>
          </div>

          <div ref={introContentRef} className={styles.introContent}>
            <span className={`${styles.introTag} intro-tag`}>
              WHY CHOOSE US
            </span>
            <h2 className={styles.introHeading}>
              Memberships Built Around{" "}
              <span className={styles.accentText}>Your Goals</span>
            </h2>
            <p className={styles.introText}>
              We believe fitness is not one-size-fits-all. Every membership at
              our facility is crafted with flexibility, personalized support,
              and world-class coaching at its core — so you can train on your
              terms and achieve results that last.
            </p>
            <p className={styles.introText}>
              From your first day on the floor to your most transformative
              milestone, our team is with you every step of the way. More than a
              gym — this is a community built on ambition, accountability, and
              excellence.
            </p>
            <div className={styles.introPillars}>
              {[
                "Flexible Plans",
                "Expert Coaching",
                "Real Results",
                "Community",
              ].map((pillar) => (
                <span key={pillar} className={styles.introPillar}>
                  <FiZap className={styles.pillarIcon} />
                  {pillar}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: PRICING PLANS ────────────────────────── */}
      <section className={styles.plansSection}>
        <div className={styles.sectionContainer}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className={styles.sectionEyebrow}>PRICING PLANS</span>
            <h2 className={styles.sectionTitle}>
              Select Your <span className={styles.accentText}>Membership</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Transparent pricing. No hidden fees. Cancel or upgrade anytime.
            </p>
          </motion.div>

          <div className={styles.plansGrid}>
            {plans.map((plan, index) => (
              <PricingCard key={plan.id} plan={plan} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: WHAT'S INCLUDED ──────────────────────── */}
      <section ref={includedRef} className={styles.includedSection}>
        <div className={styles.sectionContainer}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <span className={styles.sectionEyebrow}>EVERY PLAN INCLUDES</span>
            <h2 className={styles.sectionTitle}>
              What's <span className={styles.accentText}>Included</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Every membership unlocks access to our premium facility ecosystem.
            </p>
          </motion.div>

          <div className={styles.featuresGrid}>
            {includedFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                className={styles.featureCard}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>
                  {feature.description}
                </p>
                <div className={styles.featureCardGlow} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: BENEFITS ─────────────────────────────── */}
      <section className={styles.benefitsSection}>
        <div className={styles.sectionContainer}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <span className={styles.sectionEyebrow}>WHY WE'RE DIFFERENT</span>
            <h2 className={styles.sectionTitle}>
              Membership <span className={styles.accentText}>Benefits</span>
            </h2>
          </motion.div>

          <div className={styles.benefitsGrid}>
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                ref={(el) => (benefitCardsRef.current[index] = el)}
                className={styles.benefitCard}
              >
                <div className={styles.benefitIconWrapper}>
                  <span className={styles.benefitIcon}>{benefit.icon}</span>
                </div>
                <div className={styles.benefitContent}>
                  <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                  <p className={styles.benefitDescription}>
                    {benefit.description}
                  </p>
                </div>
                <div className={styles.benefitCardAccent} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: COMPARISON TABLE ─────────────────────── */}
      <section className={styles.comparisonSection}>
        <div className={styles.sectionContainer}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <span className={styles.sectionEyebrow}>COMPARE PLANS</span>
            <h2 className={styles.sectionTitle}>
              Find the Perfect <span className={styles.accentText}>Fit</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              See exactly what each plan offers — side by side.
            </p>
          </motion.div>

          <ComparisonTable />
        </div>
      </section>

      {/* ── SECTION 6: STATISTICS ───────────────────────────── */}
      <section className={styles.statsSection}>
        <div className={styles.statsBg} />
        <div className={styles.statsGlow} />
        <div className={styles.sectionContainer}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className={styles.sectionEyebrow}>BY THE NUMBERS</span>
            <h2 className={styles.sectionTitle}>
              Our <span className={styles.accentText}>Success</span> Story
            </h2>
          </motion.div>

          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <StatCounter
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: FAQ ──────────────────────────────────── */}
      <section className={styles.faqSection}>
        <div className={styles.sectionContainer}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <span className={styles.sectionEyebrow}>COMMON QUESTIONS</span>
            <h2 className={styles.sectionTitle}>
              Frequently Asked{" "}
              <span className={styles.accentText}>Questions</span>
            </h2>
          </motion.div>

          <MembershipFAQ />
        </div>
      </section>
    </main>
  );
};

export default MembershipPage;
