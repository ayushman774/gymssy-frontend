import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiMinus } from "react-icons/fi";
import styles from "./MembershipFAQ.module.css";

const faqs = [
  {
    id: 1,
    question: "Which membership should I choose?",
    answer:
      "If you're new to fitness or prefer training independently, the Starter plan gives you full gym access and everything you need to begin. The Professional plan is our most popular — it adds personalized programming, group classes, and nutrition support. If you want the absolute best experience with dedicated coaching and VIP access, the Elite plan is your match.",
  },
  {
    id: 2,
    question: "Can I upgrade or downgrade my membership later?",
    answer:
      "Absolutely. We believe your membership should grow with you. You can upgrade to a higher tier at any time and only pay the difference. Downgrades can be made at the end of your current billing cycle. Our team will guide you through the process with zero hassle.",
  },
  {
    id: 3,
    question: "Is personal training included in my plan?",
    answer:
      "Personal coaching is exclusively included in our Elite membership. Professional members receive structured workout plans built by our coaches, while Starter members can purchase individual coaching sessions as add-ons. We have a world-class training team ready to work with every level.",
  },
  {
    id: 4,
    question: "Are group classes included in all plans?",
    answer:
      "Group classes are included in the Professional and Elite plans, covering 50+ weekly sessions including HIIT, yoga, strength training, boxing, and more. Starter members can purchase class bundles separately or upgrade to access the full schedule.",
  },
  {
    id: 5,
    question: "Is there a joining fee or long-term contract?",
    answer:
      "There are no hidden fees. We believe in complete transparency — your monthly membership price is exactly what you pay. We offer month-to-month flexibility with no lock-in contracts. You can pause or cancel with 30 days notice at any time.",
  },
  {
    id: 6,
    question: "How do I get started?",
    answer:
      "Simply choose your plan and click 'Join Now' or book a free trial session to experience our facility first-hand. Our onboarding team will handle everything — from your fitness assessment to setting up your app access — within 24 hours of signing up.",
  },
];

const FAQItem = ({ item, isOpen, onToggle, index }) => {
  const contentRef = useRef(null);

  return (
    <motion.div
      className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ""}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
    >
      <button
        className={styles.faqQuestion}
        onClick={() => onToggle(item.id)}
        aria-expanded={isOpen}
      >
        <span className={styles.faqQuestionText}>{item.question}</span>
        <motion.span
          className={`${styles.faqIcon} ${isOpen ? styles.faqIconOpen : ""}`}
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {isOpen ? <FiMinus /> : <FiPlus />}
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            className={styles.faqAnswer}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
              opacity: { duration: 0.3, delay: isOpen ? 0.1 : 0 },
            }}
          >
            <div className={styles.faqAnswerInner} ref={contentRef}>
              <p className={styles.faqAnswerText}>{item.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const MembershipFAQ = () => {
  const [openId, setOpenId] = useState(1);

  const handleToggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={styles.faqWrapper}>
      <div className={styles.faqList}>
        {faqs.map((item, index) => (
          <FAQItem
            key={item.id}
            item={item}
            isOpen={openId === item.id}
            onToggle={handleToggle}
            index={index}
          />
        ))}
      </div>

      <motion.div
        className={styles.faqCta}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <p className={styles.faqCtaText}>
          Still have questions?{" "}
          <a href="/contact" className={styles.faqCtaLink}>
            Contact our team
          </a>{" "}
          — we're always here to help.
        </p>
      </motion.div>
    </div>
  );
};

export default MembershipFAQ;
