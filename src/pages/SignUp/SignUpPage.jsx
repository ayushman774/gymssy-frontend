import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import {
  HiOutlineLocationMarker,
  HiOutlineSwitchHorizontal,
  HiOutlineUserGroup,
  HiCheckCircle,
} from "react-icons/hi";
import { RiShieldCheckLine } from "react-icons/ri";

import AccountTypeCard from "../../components/SignUp/AccountTypeCard/AccountTypeCard";
import SignupForm from "../../components/SignUp/SignupForm/SignupForm";

import styles from "./SignUpPage.module.css";

// ─── Account Types ────────────────────────────────────────────────────────────

const accountTypes = [
  {
    id: "enthusiast",
    icon: "🏃",
    title: "Fitness Enthusiast",
    description: "Discover and book fitness experiences near you.",
  },
  {
    id: "gym-owner",
    icon: "🏋️",
    title: "Gym Owner",
    description: "List your gym and attract more members.",
  },
  {
    id: "trainer",
    icon: "💪",
    title: "Personal Trainer",
    description: "Build your profile and connect with clients.",
  },
  {
    id: "studio",
    icon: "🧘",
    title: "Fitness Studio",
    description: "Showcase your classes and grow your business.",
  },
];

// ─── Left panel feature highlights ───────────────────────────────────────────

const features = [
  {
    icon: <HiOutlineLocationMarker />,
    text: "Discover Nearby Fitness Centers",
  },
  {
    icon: <HiOutlineSwitchHorizontal />,
    text: "Compare Memberships & Plans",
  },
  {
    icon: <HiOutlineUserGroup />,
    text: "Connect with Trusted Trainers",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const SignUpPage = () => {
  const [selectedType, setSelectedType] = useState("enthusiast");
  const [step, setStep] = useState(1); // 1 = type select, 2 = form

  // Refs for GSAP
  const leftPanelRef = useRef(null);
  const headlineRef = useRef(null);
  const featuresRef = useRef(null);
  const floatRef1 = useRef(null);
  const floatRef2 = useRef(null);
  const floatRef3 = useRef(null);
  const rightPanelRef = useRef(null);
  const badgeRef = useRef(null);

  // ── Left panel entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline
      gsap.fromTo(
        headlineRef.current,
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 1.1, ease: "power3.out", delay: 0.2 },
      );

      // Feature items stagger
      gsap.fromTo(
        featuresRef.current?.querySelectorAll(`.${styles.featureItem}`),
        { opacity: 0, x: -28 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          delay: 0.55,
        },
      );

      // Floating shapes
      gsap.to(floatRef1.current, {
        y: -18,
        duration: 3.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      gsap.to(floatRef2.current, {
        y: 14,
        duration: 4.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 0.8,
      });
      gsap.to(floatRef3.current, {
        y: -10,
        duration: 2.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1.4,
      });

      // Right panel
      gsap.fromTo(
        rightPanelRef.current,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 1, ease: "power3.out", delay: 0.3 },
      );

      // Trust badge
      gsap.fromTo(
        badgeRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 1.1 },
      );
    }, leftPanelRef);

    return () => ctx.revert();
  }, []);

  const handleContinue = () => {
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <div className={styles.page}>
      {/* ══════════════════════════════════════════
          LEFT PANEL — Brand storytelling
      ══════════════════════════════════════════ */}
      <div className={styles.leftPanel} ref={leftPanelRef}>
        {/* Background image */}
        <div className={styles.leftBg}>
          <img
            src="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=1200&q=80"
            alt="Fitness lifestyle"
            className={styles.leftBgImg}
            loading="eager"
          />
          <div className={styles.leftOverlay} />
        </div>

        {/* Floating decorative shapes */}
        <div
          className={`${styles.floatShape} ${styles.floatShape1}`}
          ref={floatRef1}
        />
        <div
          className={`${styles.floatShape} ${styles.floatShape2}`}
          ref={floatRef2}
        />
        <div
          className={`${styles.floatShape} ${styles.floatShape3}`}
          ref={floatRef3}
        />

        {/* Content */}
        <div className={styles.leftContent}>
          {/* Logo */}
          <Link to="/" className={styles.logo}>
            <span className={styles.logoText}>
              GYM<span className={styles.logoAccent}>SSY</span>
            </span>
          </Link>

          {/* Headline block */}
          <div className={styles.leftHeadlineBlock} ref={headlineRef}>
            <p className={styles.eyebrow}>India's Fitness Marketplace</p>
            <h1 className={styles.leftHeadline}>
              Welcome to <span className={styles.accentText}>Gymssy</span>
            </h1>
            <p className={styles.leftSubheading}>
              Join India's Complete Fitness Marketplace and discover gyms,
              trainers, studios, and fitness experiences tailored to your goals.
            </p>
          </div>

          {/* Feature highlights */}
          <div className={styles.featureList} ref={featuresRef}>
            {features.map((f, i) => (
              <div key={i} className={styles.featureItem}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <span className={styles.featureText}>{f.text}</span>
              </div>
            ))}
          </div>

          {/* Trust badge */}
          <div className={styles.trustBadge} ref={badgeRef}>
            <RiShieldCheckLine className={styles.trustIcon} />
            <span>
              Trusted by <strong>50,000+</strong> fitness seekers across India
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT PANEL — Registration card
      ══════════════════════════════════════════ */}
      <div className={styles.rightPanel} ref={rightPanelRef}>
        <div className={styles.cardWrapper}>
          {/* Card */}
          <div className={styles.card}>
            {/* Progress indicator */}
            <div className={styles.progress}>
              <div className={styles.progressTrack}>
                <motion.div
                  className={styles.progressFill}
                  animate={{ width: step === 1 ? "50%" : "100%" }}
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              </div>
              <span className={styles.progressLabel}>Step {step} of 2</span>
            </div>

            {/* ── STEP 1: Account type ── */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{
                    duration: 0.45,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>Create Your Account</h2>
                    <p className={styles.cardSubtitle}>
                      Start your fitness journey in just a few steps.
                    </p>
                  </div>

                  <div className={styles.typeSection}>
                    <p className={styles.typeLabel}>
                      I am joining Gymssy as a...
                    </p>
                    <div className={styles.typeGrid}>
                      {accountTypes.map((type) => (
                        <AccountTypeCard
                          key={type.id}
                          data={type}
                          isSelected={selectedType === type.id}
                          onSelect={() => setSelectedType(type.id)}
                        />
                      ))}
                    </div>
                  </div>

                  <motion.button
                    className={styles.continueBtn}
                    onClick={handleContinue}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                  >
                    Continue
                    <span className={styles.continueBtnArrow}>→</span>
                  </motion.button>

                  <p className={styles.signinPrompt}>
                    Already have an account?{" "}
                    <Link to="/sign-in" className={styles.signinLink}>
                      Sign In
                    </Link>
                  </p>
                </motion.div>
              )}

              {/* ── STEP 2: Registration form ── */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{
                    duration: 0.45,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {/* Selected type pill */}
                  <div className={styles.selectedTypePill}>
                    <span className={styles.selectedTypeEmoji}>
                      {accountTypes.find((t) => t.id === selectedType)?.icon}
                    </span>
                    <span className={styles.selectedTypeText}>
                      {accountTypes.find((t) => t.id === selectedType)?.title}
                    </span>
                    <button
                      className={styles.changeTypeBtn}
                      onClick={handleBack}
                    >
                      Change
                    </button>
                  </div>

                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>Your Details</h2>
                    <p className={styles.cardSubtitle}>
                      Fill in your information to get started.
                    </p>
                  </div>

                  <SignupForm accountType={selectedType} />

                  <p className={styles.signinPrompt}>
                    Already have an account?{" "}
                    <Link to="/sign-in" className={styles.signinLink}>
                      Sign In
                    </Link>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
