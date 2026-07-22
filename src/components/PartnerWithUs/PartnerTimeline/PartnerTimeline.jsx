import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  HiOutlineDocumentText,
  HiOutlineBadgeCheck,
  HiOutlineUserCircle,
  HiOutlineSparkles,
} from "react-icons/hi";
import styles from "./PartnerTimeline.module.css";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    icon: <HiOutlineDocumentText />,
    title: "Submit Your Details",
    description:
      "Fill out our simple partner registration form with your business information. It takes less than 5 minutes.",
  },
  {
    number: "02",
    icon: <HiOutlineBadgeCheck />,
    title: "Verification",
    description:
      "Our team reviews your application and verifies your business credentials within 2 to 3 business days.",
  },
  {
    number: "03",
    icon: <HiOutlineUserCircle />,
    title: "Profile Setup",
    description:
      "Set up your premium business profile with photos, facilities, membership plans, and timings.",
  },
  {
    number: "04",
    icon: <HiOutlineSparkles />,
    title: "Start Receiving Customers",
    description:
      "Go live and start receiving enquiries, bookings, and leads from thousands of fitness seekers.",
  },
];

const PartnerTimeline = () => {
  const lineRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!lineRef.current || !wrapperRef.current) return;

    gsap.fromTo(
      lineRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top 72%",
        },
      },
    );

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      {/* Connecting line */}
      <div className={styles.lineTrack}>
        <div className={styles.line} ref={lineRef} />
      </div>

      {/* Steps */}
      <div className={styles.stepsGrid}>
        {steps.map((step, i) => (
          <motion.div
            key={i}
            className={styles.step}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: i * 0.15,
            }}
            viewport={{ once: true, margin: "-40px" }}
          >
            {/* Dot on line */}
            <div className={styles.dotWrapper}>
              <div className={styles.dot}>
                <div className={styles.dotInner} />
              </div>
            </div>

            {/* Card */}
            <div className={styles.card}>
              <div className={styles.stepIconWrapper}>
                <span className={styles.stepIcon}>{step.icon}</span>
              </div>
              <span className={styles.stepNumber}>{step.number}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PartnerTimeline;
