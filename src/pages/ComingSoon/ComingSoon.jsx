import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FiInstagram,
  FiYoutube,
  FiLinkedin,
  FiFacebook,
  FiArrowRight,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";
import styles from "./ComingSoon.module.css";

gsap.registerPlugin(ScrollTrigger);

// ─── Launch Date ──────────────────────────────────────────────────────
// Set your actual launch date here
const LAUNCH_DATE = new Date("2026-01-01T00:00:00");

// ─── Social Links ─────────────────────────────────────────────────────
const socials = [
  {
    icon: <FiInstagram />,
    label: "Instagram",
    href: "https://instagram.com",
    color: "#e1306c",
  },
  {
    icon: <FiFacebook />,
    label: "Facebook",
    href: "https://facebook.com",
    color: "#1877f2",
  },
  {
    icon: <FiYoutube />,
    label: "YouTube",
    href: "https://youtube.com",
    color: "#ff0000",
  },
  {
    icon: <FiLinkedin />,
    label: "LinkedIn",
    href: "https://linkedin.com",
    color: "#0a66c2",
  },
];

// ─── Countdown Hook ───────────────────────────────────────────────────
const useCountdown = (targetDate) => {
  const calculate = useCallback(() => {
    const now = new Date().getTime();
    const diff = targetDate.getTime() - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
      expired: false,
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(calculate);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculate());
    }, 1000);
    return () => clearInterval(timer);
  }, [calculate]);

  return timeLeft;
};

// ─── Countdown Card ───────────────────────────────────────────────────
const CountdownCard = ({ value, label, index }) => {
  const [prevValue, setPrevValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== prevValue) {
      setIsFlipping(true);
      const t = setTimeout(() => {
        setPrevValue(value);
        setIsFlipping(false);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [value, prevValue]);

  const formatted = String(value).padStart(2, "0");

  return (
    <motion.div
      className={styles.countCard}
      initial={{ opacity: 0, y: 40, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.7,
        delay: 0.8 + index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* Glassmorphism card */}
      <div className={styles.countCardInner}>
        {/* Top shine */}
        <div className={styles.countCardShine} aria-hidden="true" />

        {/* Number */}
        <AnimatePresence mode="popLayout">
          <motion.span
            key={formatted}
            className={styles.countNumber}
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {formatted}
          </motion.span>
        </AnimatePresence>

        {/* Neon bottom accent */}
        <div className={styles.countCardAccent} aria-hidden="true" />
      </div>

      {/* Label */}
      <span className={styles.countLabel}>{label}</span>
    </motion.div>
  );
};

// ─── Email Form ───────────────────────────────────────────────────────
const EmailForm = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));

    setStatus("success");
    setMessage("You're on the list! We'll notify you at launch.");
    setEmail("");
  };

  const handleFocus = () => {
    gsap.to(inputRef.current, {
      boxShadow: "0 0 0 2px rgba(57,255,20,0.4), 0 0 20px rgba(57,255,20,0.1)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleBlur = () => {
    gsap.to(inputRef.current, {
      boxShadow: "none",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <motion.div
      className={styles.emailSection}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <h3 className={styles.emailHeading}>
        Be The First To <span className={styles.emailHeadingAccent}>Know</span>
      </h3>

      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            className={styles.successState}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.successIcon}>
              <FiCheck />
            </div>
            <p className={styles.successMessage}>{message}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            className={styles.emailForm}
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            noValidate
          >
            <div className={styles.inputWrapper}>
              <input
                ref={inputRef}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Enter your email address"
                className={`${styles.emailInput} ${
                  status === "error" ? styles.emailInputError : ""
                }`}
                aria-label="Email address"
                aria-describedby={
                  status === "error" ? "email-error" : undefined
                }
                disabled={status === "loading"}
                autoComplete="email"
              />

              <motion.button
                type="submit"
                className={styles.emailBtn}
                disabled={status === "loading"}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                aria-label="Subscribe for launch notification"
              >
                {status === "loading" ? (
                  <span className={styles.emailBtnSpinner} aria-hidden="true" />
                ) : (
                  <>
                    <span>Notify Me</span>
                    <FiArrowRight aria-hidden="true" />
                  </>
                )}
              </motion.button>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {status === "error" && (
                <motion.p
                  id="email-error"
                  role="alert"
                  className={styles.errorMsg}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <FiAlertCircle aria-hidden="true" />
                  {message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>
        )}
      </AnimatePresence>

      <p className={styles.emailDisclaimer}>
        No spam. Ever. Unsubscribe anytime.
      </p>
    </motion.div>
  );
};

// ─── Particles ────────────────────────────────────────────────────────
const Particles = () => {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const particles = containerRef.current?.querySelectorAll(
        `.${styles.particle}`,
      );
      if (!particles?.length) return;

      particles.forEach((p) => {
        gsap.to(p, {
          y: `random(-40, 40)`,
          x: `random(-25, 25)`,
          opacity: `random(0.1, 0.5)`,
          scale: `random(0.8, 1.4)`,
          duration: `random(4, 9)`,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: `random(0, 4)`,
        });
      });
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className={styles.particles} aria-hidden="true">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className={styles.particle}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            opacity: Math.random() * 0.3 + 0.05,
          }}
        />
      ))}
    </div>
  );
};

// ─── Mouse Glow ───────────────────────────────────────────────────────
const MouseGlow = () => {
  const glowRef = useRef(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    let rafId = null;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currX = mouseX;
    let currY = mouseY;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const tick = () => {
      currX += (mouseX - currX) * 0.06;
      currY += (mouseY - currY) * 0.06;
      gsap.set(glow, { x: currX, y: currY });
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <div ref={glowRef} className={styles.mouseGlow} aria-hidden="true" />;
};

// ─── Main Component ───────────────────────────────────────────────────
const ComingSoon = () => {
  const pageRef = useRef(null);
  const beamRef = useRef(null);
  const timeLeft = useCountdown(LAUNCH_DATE);

  // ── GSAP entrance + beam animation ──────────────────────────
  useGSAP(
    () => {
      // Light beam animation
      if (beamRef.current) {
        gsap.to(beamRef.current, {
          opacity: 0.06,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    },
    { scope: pageRef },
  );

  // ── Stagger variants ─────────────────────────────────────────
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const headline = "SOMETHING POWERFUL";
  const headlineWords = headline.split(" ");

  return (
    <div
      ref={pageRef}
      className={styles.page}
    >
      {/* ── Background Layers ── */}

      {/* Athlete image */}
      <div className={styles.bgImage} aria-hidden="true" />

      {/* Multi-layer overlay */}
      <div className={styles.bgOverlay} aria-hidden="true" />
      <div className={styles.bgGradientRadial} aria-hidden="true" />
      <div className={styles.bgGradientBottom} aria-hidden="true" />
      <div className={styles.bgNoise} aria-hidden="true" />

      {/* Light beams */}
      <div ref={beamRef} className={styles.lightBeam} aria-hidden="true" />
      <div className={styles.lightBeam2} aria-hidden="true" />

      {/* Grid lines */}
      <div className={styles.gridLines} aria-hidden="true" />

      {/* Particles */}
      <Particles />

      {/* Mouse-following glow */}
      <MouseGlow />

      {/* ── Background Word ── */}
      <div className={styles.bgWord} aria-hidden="true">
        TRANSFORMATION
      </div>

      {/* ── Main Content ── */}
      <main className={styles.main} role="main">
        <motion.div
          className={styles.content}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

          {/* Overline */}
          <motion.div className={styles.overline} variants={itemVariants}>
            <span className={styles.overlineLine} aria-hidden="true" />
            <span>Coming Soon</span>
            <span className={styles.overlineLine} aria-hidden="true" />
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            className={styles.headline}
            variants={containerVariants}
            aria-label={`${headline} IS COMING.`}
          >
            {headlineWords.map((word, i) => (
              <span
                key={i}
                className={styles.headlineWordWrapper}
                aria-hidden="true"
              >
                <motion.span
                  className={`${styles.headlineWord} ${
                    word === "POWERFUL" ? styles.headlineWordAccent : ""
                  }`}
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 80,
                      rotateX: -40,
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      rotateX: 0,
                      transition: {
                        duration: 0.9,
                        delay: 0.4 + i * 0.12,
                        ease: [0.16, 1, 0.3, 1],
                      },
                    },
                  }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
            {/* IS COMING. on second line */}
            <span className={styles.headlineSecondLine} aria-hidden="true">
              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 60 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.9,
                      delay: 0.7,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  },
                }}
              >
                IS COMING.
              </motion.span>
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p className={styles.subheadline} variants={itemVariants}>
            We're building the ultimate fitness experience.
            <br className={styles.brDesktop} />
            Get ready for a new era of{" "}
            <span className={styles.subAccent}>strength</span>,{" "}
            <span className={styles.subAccent}>performance</span>, and{" "}
            <span className={styles.subAccent}>transformation</span>.
          </motion.p>

          {/* Divider */}
          <motion.div
            className={styles.divider}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden="true"
          />

          {/* Email Form */}
          <EmailForm />

          {/* Social Links */}
          <motion.div
            className={styles.socialSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className={styles.socialLabel}>Follow Our Journey</p>
            <div
              className={styles.socials}
              role="list"
              aria-label="Social media links"
            >
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${s.label}`}
                  role="listitem"
                  className={styles.socialBtn}
                  style={{ "--hover-color": s.color }}
                  whileHover={{ scale: 1.15, y: -4 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                  }}
                >
                  <span className={styles.socialIcon}>{s.icon}</span>
                  <span
                    className={styles.socialGlow}
                    style={{
                      background: `radial-gradient(circle, ${s.color}33, transparent 70%)`,
                    }}
                    aria-hidden="true"
                  />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Bottom tagline */}
          <motion.p
            className={styles.tagline}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
          >
            © {new Date().getFullYear()} APEX FITNESS. &nbsp;Forging Champions
            Since 2009.
          </motion.p>
        </motion.div>
      </main>
    </div>
  );
};

export default ComingSoon;
