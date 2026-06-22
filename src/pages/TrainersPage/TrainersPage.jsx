import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FiChevronRight,
  FiAward,
  FiTarget,
  FiTrendingUp,
  FiUsers,
  FiShield,
  FiZap,
} from "react-icons/fi";

import TrainerCard from "../../components/TrainerCard/TrainerCard";
import FeaturedCoach from "../../components/FeaturedCoach/FeaturedCoach";
import SuccessStory from "../../components/SuccessStory/SuccessStory";
import styles from "./TrainersPage.module.css";
import { trainerImages } from "../../assets/data/traniersPage";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ─────────────────────────────────────────────────────────────────────

const headCoaches = [
  {
    id: "hc-1",
    name: "Marcus Reid",
    position: "Head Performance Coach",
    experience: 14,
    image: trainerImages.headCoach1,
    imageAlt: "Marcus Reid — Head Performance Coach",
    specializations: [
      "Strength & Conditioning",
      "Athletic Performance",
      "Body Recomposition",
    ],
    certifications: [
      "NSCA — Certified Strength & Conditioning Specialist",
      "USA Weightlifting Level 2",
      "Precision Nutrition Level 2",
    ],
    bio: "Marcus has spent over a decade training elite athletes and everyday individuals alike. With a background in professional sports conditioning, he brings a systematic, science-backed approach to every client — building programs that deliver consistent, measurable results. His philosophy: mastery is built through disciplined repetition, not shortcuts.",
    imageLeft: true,
    accentStat: { value: "500+", label: "Athletes Trained" },
  },
  {
    id: "hc-2",
    name: "Sophia Laurent",
    position: "Head of Functional Fitness",
    experience: 11,
    image: trainerImages.headCoach2,
    imageAlt: "Sophia Laurent — Head of Functional Fitness",
    specializations: [
      "Functional Movement",
      "Mobility & Recovery",
      "Women's Strength",
    ],
    certifications: [
      "FMS — Functional Movement Screen Certified",
      "NASM Certified Personal Trainer",
      "Yoga Alliance RYT-500",
    ],
    bio: "Sophia's coaching bridges the gap between high-performance training and mindful movement. Her holistic approach combines functional strength training with mobility work, ensuring clients not only transform their physique but move better in everyday life. She has helped hundreds of women discover strength they never knew they had.",
    imageLeft: false,
    accentStat: { value: "350+", label: "Transformations" },
  },
  {
    id: "hc-3",
    name: "Jordan Steele",
    position: "Head of Sports Performance",
    experience: 9,
    image: trainerImages.headCoach3,
    imageAlt: "Jordan Steele — Head of Sports Performance",
    specializations: [
      "HIIT & Metabolic Conditioning",
      "Speed & Agility",
      "Nutrition Integration",
    ],
    certifications: [
      "CSCS — Certified Strength & Conditioning Specialist",
      "ACE Certified Personal Trainer",
      "Sports Nutrition Specialist",
    ],
    bio: "Jordan's energy is infectious and his results are undeniable. Specializing in metabolic conditioning and sports-specific training, he pushes clients past perceived limits while keeping the process enjoyable. His programs combine cutting-edge exercise science with real-world practicality — because the best program is one you actually do.",
    imageLeft: true,
    accentStat: { value: "200+", label: "Competition Preps" },
  },
];

const trainers = [
  {
    id: "t-1",
    name: "Alex Carter",
    position: "Strength Coach",
    specialization: "Powerlifting",
    experience: 7,
    image: trainerImages.trainer1,
    social: { instagram: "#", twitter: "#" },
  },
  {
    id: "t-2",
    name: "Nina Walsh",
    position: "Yoga & Mobility",
    specialization: "Recovery & Flexibility",
    experience: 5,
    image: trainerImages.trainer2,
    social: { instagram: "#", twitter: "#" },
  },
  {
    id: "t-3",
    name: "Daniel Cruz",
    position: "HIIT Specialist",
    specialization: "Metabolic Training",
    experience: 6,
    image: trainerImages.trainer3,
    social: { instagram: "#", twitter: "#" },
  },
  {
    id: "t-4",
    name: "Priya Sharma",
    position: "Nutrition Coach",
    specialization: "Body Recomposition",
    experience: 8,
    image: trainerImages.trainer4,
    social: { instagram: "#", twitter: "#" },
  },
  {
    id: "t-5",
    name: "Leo Martinez",
    position: "Boxing Coach",
    specialization: "Combat Fitness",
    experience: 10,
    image: trainerImages.trainer5,
    social: { instagram: "#", twitter: "#" },
  },
  {
    id: "t-6",
    name: "Chloe Bennett",
    position: "Group Fitness",
    specialization: "Cardio & Endurance",
    experience: 4,
    image: trainerImages.trainer6,
    social: { instagram: "#", twitter: "#" },
  },
  {
    id: "t-7",
    name: "Ryan Okafor",
    position: "Athletic Trainer",
    specialization: "Sports Rehab",
    experience: 9,
    image: trainerImages.trainer7,
    social: { instagram: "#", twitter: "#" },
  },
  {
    id: "t-8",
    name: "Mia Chen",
    position: "Pilates Instructor",
    specialization: "Core & Posture",
    experience: 6,
    image: trainerImages.trainer8,
    social: { instagram: "#", twitter: "#" },
  },
];

const philosophyPrinciples = [
  {
    icon: <FiTarget />,
    title: "Discipline",
    description:
      "Every great transformation begins with consistent, intentional action — day after day, without exception.",
  },
  {
    icon: <FiTrendingUp />,
    title: "Consistency",
    description:
      "Progress isn't built in one session. It's built through relentless, purposeful repetition over time.",
  },
  {
    icon: <FiUsers />,
    title: "Accountability",
    description:
      "We hold you to a higher standard because we know what you're truly capable of achieving.",
  },
  {
    icon: <FiShield />,
    title: "Sustainable Progress",
    description:
      "We build bodies and habits that last a lifetime — not quick fixes that fade.",
  },
];

const certifications = [
  {
    icon: <FiAward />,
    title: "Certified Strength Coach",
    body: "NSCA · CSCS",
    description:
      "Nationally accredited strength and conditioning expertise for athletic and general populations.",
  },
  {
    icon: <FiTarget />,
    title: "Nutrition Specialist",
    body: "Precision Nutrition",
    description:
      "Evidence-based nutritional coaching to complement every training program.",
  },
  {
    icon: <FiZap />,
    title: "Functional Training Expert",
    body: "FMS Certified",
    description:
      "Movement screening and corrective exercise to build durability alongside performance.",
  },
  {
    icon: <FiShield />,
    title: "Sports Performance Coach",
    body: "NSCA · NASM",
    description:
      "Specialized programming for competitive athletes at every level of sport.",
  },
  {
    icon: <FiTrendingUp />,
    title: "Rehabilitation Specialist",
    body: "NASM CES",
    description:
      "Corrective exercise expertise to help clients recover, rebuild, and return stronger.",
  },
  {
    icon: <FiUsers />,
    title: "Group Fitness Leader",
    body: "ACE · Les Mills",
    description:
      "Certified to lead dynamic group sessions that motivate and produce results at scale.",
  },
];

const stats = [
  { value: 50, suffix: "+", label: "Certified Trainers" },
  { value: 1000, suffix: "+", label: "Transformations" },
  { value: 10, suffix: "+", label: "Years Experience" },
  { value: 5000, suffix: "+", label: "Members Trained" },
];

const successStories = [
  {
    id: "ss-1",
    memberName: "James Holloway",
    memberImage: trainerImages.member1,
    trainerName: "Marcus Reid",
    trainerImage: trainerImages.headCoach1,
    result: "Lost 28kg in 6 months",
    story:
      "Working with Marcus completely changed my relationship with fitness. His no-nonsense approach and genuine investment in my progress pushed me past every mental barrier I thought was permanent.",
    duration: "6 months",
    achievement: "28kg Lost",
  },
  {
    id: "ss-2",
    memberName: "Claire Fontaine",
    memberImage: trainerImages.member3,
    trainerName: "Sophia Laurent",
    trainerImage: trainerImages.headCoach2,
    result: "Competed in first triathlon",
    story:
      "Sophia transformed not just my body but my entire mindset around movement. I came in barely able to run 5k. Six months later I crossed my first triathlon finish line.",
    duration: "8 months",
    achievement: "First Triathlon",
  },
  {
    id: "ss-3",
    memberName: "Darius Webb",
    memberImage: trainerImages.member2,
    trainerName: "Jordan Steele",
    trainerImage: trainerImages.headCoach3,
    result: "Gained 12kg of lean muscle",
    story:
      "Jordan's programming is on another level. The precision in periodization and the way he coached my nutrition alongside training produced results I had chased for years but never achieved.",
    duration: "10 months",
    achievement: "12kg Muscle Gained",
  },
];

// ─── StatCounter ──────────────────────────────────────────────────────────────

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
      transition={{ duration: 0.7, delay: index * 0.15 }}
    >
      <span ref={counterRef} className={styles.statValue}>
        0{suffix}
      </span>
      <span className={styles.statLabel}>{label}</span>
    </motion.div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const TrainersPage = () => {
  const headerRef = useRef(null);
  const headerBgRef = useRef(null);
  const introImageRef = useRef(null);
  const introContentRef = useRef(null);
  const certCardsRef = useRef([]);
  const philosophyRef = useRef(null);

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

  // Intro image clip-path reveal
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
        const els =
          introContentRef.current.querySelectorAll("h2, p, span, div");
        gsap.fromTo(
          els,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: introContentRef.current,
              start: "top 78%",
              once: true,
            },
          },
        );
      }
    });
    return () => ctx.revert();
  }, []);

  // Philosophy text reveal
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!philosophyRef.current) return;
      const heading = philosophyRef.current.querySelector(
        `.${styles.philosophyHeading}`,
      );
      if (heading) {
        gsap.fromTo(
          heading,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 82%",
              once: true,
            },
          },
        );
      }
    });
    return () => ctx.revert();
  }, []);

  // Cert cards stagger
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = certCardsRef.current.filter(Boolean);
      if (!cards.length) return;
      gsap.fromTo(
        cards,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cards[0],
            start: "top 82%",
            once: true,
          },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <main className={styles.trainersPage}>
      {/* ── PAGE HEADER ──────────────────────────────────────── */}
      <section ref={headerRef} className={styles.pageHeader}>
        <div ref={headerBgRef} className={styles.headerBg}>
          <img
            src={trainerImages.pageHeader}
            alt="Elite trainers coaching"
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
            transition={{ duration: 0.8, delay: 0.35 }}
          >
            <motion.span
              className={styles.headerEyebrow}
              initial={{ opacity: 0, letterSpacing: "0.15em" }}
              animate={{ opacity: 1, letterSpacing: "0.4em" }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              ELITE COACHING TEAM
            </motion.span>
            <h1 className={styles.headerTitle}>TRAINERS</h1>
            <p className={styles.headerSubtitle}>
              Meet the experts who will guide your transformation.
            </p>
          </motion.div>
        </div>

        <div className={styles.headerScrollIndicator}>
          <span className={styles.scrollLine} />
        </div>
      </section>

      {/* ── INTRODUCTION ─────────────────────────────────────── */}
      <section className={styles.introSection}>
        <div className={styles.introContainer}>
          <div ref={introImageRef} className={styles.introImageWrapper}>
            <img
              src={trainerImages.introduction}
              alt="Elite trainer coaching session"
              className={styles.introImage}
              loading="lazy"
            />
            <div className={styles.introImageAccent} />
            <div className={styles.introFloatingCard}>
              <span className={styles.floatingCardNumber}>50+</span>
              <span className={styles.floatingCardText}>Certified Coaches</span>
            </div>
          </div>

          <div ref={introContentRef} className={styles.introContent}>
            <span className={styles.introEyebrow}>OUR COACHING TEAM</span>
            <h2 className={styles.introHeading}>
              World-Class Coaching.{" "}
              <span className={styles.accentText}>Real Results.</span>
            </h2>
            <p className={styles.introText}>
              Every coach on our team is handpicked for their expertise,
              passion, and proven ability to drive transformation. We don't just
              train bodies — we develop mindsets, build habits, and create
              lasting change.
            </p>
            <p className={styles.introText}>
              From beginner to advanced athlete, our trainers craft
              individualized programs rooted in science and refined through
              experience. Your success is our reputation — and we take that
              seriously.
            </p>
            <div className={styles.introPillars}>
              {[
                "Personalized Coaching",
                "Expert Guidance",
                "Accountability",
                "Transformation",
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

      {/* ── FEATURED HEAD COACHES ────────────────────────────── */}
      <section className={styles.featuredSection}>
        <div className={styles.featuredInner}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <span className={styles.sectionEyebrow}>HEAD COACHES</span>
            <h2 className={styles.sectionTitle}>
              Meet Our{" "}
              <span className={styles.accentText}>Featured Coaches</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              The driving force behind our members' greatest transformations.
            </p>
          </motion.div>

          <div className={styles.featuredCoachList}>
            {headCoaches.map((coach, index) => (
              <FeaturedCoach key={coach.id} coach={coach} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ALL TRAINERS GRID ────────────────────────────────── */}
      <section className={styles.gridSection}>
        <div className={styles.sectionContainer}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <span className={styles.sectionEyebrow}>THE FULL TEAM</span>
            <h2 className={styles.sectionTitle}>
              Our <span className={styles.accentText}>Trainers</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Specialists across every discipline of fitness.
            </p>
          </motion.div>

          <div className={styles.trainersGrid}>
            {trainers.map((trainer, index) => (
              <TrainerCard key={trainer.id} trainer={trainer} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TRAINING PHILOSOPHY ──────────────────────────────── */}
      <section ref={philosophyRef} className={styles.philosophySection}>
        <div className={styles.philosophyBg}>
          <img
            src={trainerImages.philosophyBg}
            alt="Training in action"
            className={styles.philosophyBgImage}
            loading="lazy"
          />
        </div>
        <div className={styles.philosophyOverlay} />
        <div className={styles.philosophyGlow} />

        <div className={styles.sectionContainer}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className={`${styles.sectionEyebrow} ${styles.eyebrowLight}`}>
              HOW WE COACH
            </span>
            <h2
              className={`${styles.philosophyHeading} ${styles.sectionTitle}`}
            >
              Our Training <span className={styles.accentText}>Philosophy</span>
            </h2>
          </motion.div>

          <div className={styles.philosophyGrid}>
            {philosophyPrinciples.map((principle, index) => (
              <motion.div
                key={principle.title}
                className={styles.philosophyCard}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.12,
                  ease: "easeOut",
                }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <div className={styles.philosophyIcon}>{principle.icon}</div>
                <h3 className={styles.philosophyCardTitle}>
                  {principle.title}
                </h3>
                <p className={styles.philosophyCardText}>
                  {principle.description}
                </p>
                <div className={styles.philosophyCardGlow} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS & EXPERTISE ───────────────────────── */}
      <section className={styles.certSection}>
        <div className={styles.sectionContainer}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <span className={styles.sectionEyebrow}>QUALIFICATIONS</span>
            <h2 className={styles.sectionTitle}>
              Certifications &{" "}
              <span className={styles.accentText}>Expertise</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Our trainers hold the industry's highest credentials.
            </p>
          </motion.div>

          <div className={styles.certGrid}>
            {certifications.map((cert, index) => (
              <div
                key={cert.title}
                ref={(el) => (certCardsRef.current[index] = el)}
                className={styles.certCard}
              >
                <div className={styles.certIconWrapper}>
                  <span className={styles.certIcon}>{cert.icon}</span>
                </div>
                <div className={styles.certContent}>
                  <span className={styles.certBody}>{cert.body}</span>
                  <h3 className={styles.certTitle}>{cert.title}</h3>
                  <p className={styles.certDescription}>{cert.description}</p>
                </div>
                <div className={styles.certCardAccent} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATISTICS ───────────────────────────────────────── */}
      <section className={styles.statsSection}>
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
              Proven <span className={styles.accentText}>Track Record</span>
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

      {/* ── SUCCESS STORIES ──────────────────────────────────── */}
      <section className={styles.storiesSection}>
        <div className={styles.sectionContainer}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <span className={styles.sectionEyebrow}>REAL RESULTS</span>
            <h2 className={styles.sectionTitle}>
              Member <span className={styles.accentText}>Success Stories</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              The proof is in the people — and their journeys.
            </p>
          </motion.div>

          <div className={styles.storiesGrid}>
            {successStories.map((story, index) => (
              <SuccessStory key={story.id} story={story} index={index} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default TrainersPage;
