import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import {
  HiOutlineLocationMarker,
  HiOutlineSwitchHorizontal,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { RiShieldCheckLine } from "react-icons/ri";

import SignupForm from "../../components/SignUp/SignupForm/SignupForm";

import styles from "./SignUpPage.module.css";

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
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Create Your Account</h2>
              <p className={styles.cardSubtitle}>
                Start your fitness journey with Gymssy.
              </p>
            </div>

            <SignupForm accountType="enthusiast" />

            <div className={styles.providerInvite}>
              <p className={styles.providerInviteLabel}>Own a gym, studio, or offer fitness services?</p>
              <a
                className={styles.providerInviteLink}
                href="https://admin.gymssy.com/provider/register"
              >
                List your business with Gymssy <span aria-hidden="true">↗</span>
              </a>
            </div>

            <p className={styles.signinPrompt}>
              Already have an account?{" "}
              <Link to="/sign-in" className={styles.signinLink}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
