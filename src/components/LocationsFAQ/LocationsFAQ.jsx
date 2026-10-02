import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiMinus } from "react-icons/fi";
import styles from "./LocationsFAQ.module.css";

const faqs = [
  {
    id: 1,
    question: "How do I find the nearest gym to me?",
    answer:
      "Choose a City and use the search and taxonomy filters to browse physical venues listed on Gymssy. Customer-relative GPS distance is not calculated yet.",
  },
  {
    id: 2,
    question: "Can I contact or visit a venue before joining?",
    answer:
      "Open the venue detail page to review the information supplied by that business. Trial visits and contact options depend on the individual venue.",
  },
  {
    id: 3,
    question: "Do all locations offer personal training?",
    answer:
      "Services vary by business. Review the venue detail page for the information currently provided by that listing.",
  },
  {
    id: 4,
    question: "Are memberships shared between venues?",
    answer:
      "Gymssy lists independent marketplace businesses, so membership access and terms are controlled by each venue unless its detail page states otherwise.",
  },
  {
    id: 5,
    question: "What facilities are available at each location?",
    answer:
      "Facilities vary by venue. Check the individual detail page for the information currently supplied by the business.",
  },
];

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
          key="answer"
          className={styles.answer}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{
            height: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
            opacity: { duration: 0.25, delay: isOpen ? 0.1 : 0 },
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

const LocationsFAQ = () => {
  const [openId, setOpenId] = useState(1);

  return (
    <div className={styles.faqWrapper}>
      <div className={styles.faqList}>
        {faqs.map((item, index) => (
          <FAQItem
            key={item.id}
            item={item}
            isOpen={openId === item.id}
            onToggle={(id) => setOpenId((prev) => (prev === id ? null : id))}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default LocationsFAQ;
