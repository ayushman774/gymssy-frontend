import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiPlus, HiMinus } from "react-icons/hi";
import styles from "./PartnerFAQ.module.css";

const FAQItem = ({ faq, isOpen, onToggle }) => {
  const contentRef = useRef(null);

  return (
    <motion.div
      className={`${styles.item} ${isOpen ? styles.open : ""}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true, margin: "-30px" }}
    >
      <button
        className={styles.trigger}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className={styles.question}>{faq.question}</span>
        <span className={styles.iconWrapper}>
          {isOpen ? (
            <HiMinus className={styles.icon} />
          ) : (
            <HiPlus className={styles.icon} />
          )}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ overflow: "hidden" }}
          >
            <div className={styles.answer}>
              <p className={styles.answerText}>{faq.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const PartnerFAQ = ({ faqs }) => {
  const [openId, setOpenId] = useState(faqs[0]?.id ?? null);

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.faqList}>
        {faqs.map((faq) => (
          <FAQItem
            key={faq.id}
            faq={faq}
            isOpen={openId === faq.id}
            onToggle={() => toggle(faq.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default PartnerFAQ;
