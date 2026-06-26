import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiMinus } from "react-icons/fi";
import styles from "./LocationsFAQ.module.css";

const faqs = [
  {
    id: 1,
    question: "How do I find the nearest gym to me?",
    answer:
      "Use the search bar at the top of this page to search by city, area, or gym name. You can also use the interactive map to visually explore all our locations and click on any marker to see branch details.",
  },
  {
    id: 2,
    question: "Can I visit a location before joining?",
    answer:
      "Absolutely. We offer free trial visits at every branch so you can experience the facility, meet our trainers, and make an informed decision. Book your free trial through the website or call your nearest branch directly.",
  },
  {
    id: 3,
    question: "Do all locations offer personal training?",
    answer:
      "Personal training is available at the majority of our locations. Each branch page shows the specific services and trainer team available. Our Elite membership includes dedicated personal coaching at all participating branches.",
  },
  {
    id: 4,
    question: "Are memberships valid across all branches?",
    answer:
      "Professional and Elite memberships include multi-branch access, allowing you to train at any APEX location. Starter memberships are single-branch by default but can be upgraded to include network-wide access at any time.",
  },
  {
    id: 5,
    question: "What facilities are available at each location?",
    answer:
      "Every APEX branch features premium strength and cardio equipment, locker rooms, and group class studios. Additional facilities like sauna, cryotherapy, swimming pools, and rooftop areas vary by branch. Check each location's detail page for a full list.",
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
