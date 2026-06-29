import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiMinus } from "react-icons/fi";
import styles from "./ContactFAQ.module.css";

const FAQItem = ({ item, isOpen, onToggle, index }) => (
  <motion.div
    className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.5, delay: index * 0.07 }}
  >
    <button
      className={styles.question}
      onClick={() => onToggle(item.id)}
      aria-expanded={isOpen}
    >
      <span className={styles.questionText}>{item.question}</span>
      <motion.span
        className={`${styles.icon} ${isOpen ? styles.iconOpen : ""}`}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isOpen ? <FiMinus /> : <FiPlus />}
      </motion.span>
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="ans"
          className={styles.answer}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{
            height: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
            opacity: { duration: 0.25, delay: 0.08 },
          }}
        >
          <div className={styles.answerInner}>
            <p className={styles.answerText}>{item.answer}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

const ContactFAQ = ({ items }) => {
  const [openId, setOpenId] = useState(items[0]?.id ?? null);

  return (
    <div className={styles.wrapper}>
      <div className={styles.list}>
        {items.map((item, i) => (
          <FAQItem
            key={item.id}
            item={item}
            isOpen={openId === item.id}
            onToggle={(id) => setOpenId((p) => (p === id ? null : id))}
            index={i}
          />
        ))}
      </div>

      <motion.div
        className={styles.footer}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <p className={styles.footerText}>
          Can't find what you're looking for?{" "}
          <a href="mailto:support@apexmarket.com" className={styles.footerLink}>
            Contact our support team
          </a>
          .
        </p>
      </motion.div>
    </div>
  );
};

export default ContactFAQ;
