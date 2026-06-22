import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FiCheck, FiMinus } from "react-icons/fi";
import styles from "./ComparisonTable.module.css";

const features = [
  {
    category: "Access",
    label: "Full Gym Access",
    starter: true,
    pro: true,
    elite: true,
  },
  {
    category: "Access",
    label: "Locker & Shower",
    starter: true,
    pro: true,
    elite: true,
  },
  {
    category: "Access",
    label: "Mobile App",
    starter: true,
    pro: true,
    elite: true,
  },
  {
    category: "Training",
    label: "Basic Assessment",
    starter: true,
    pro: true,
    elite: true,
  },
  {
    category: "Training",
    label: "Personalized Workout Plan",
    starter: false,
    pro: true,
    elite: true,
  },
  {
    category: "Training",
    label: "Group Classes",
    starter: false,
    pro: true,
    elite: true,
  },
  {
    category: "Training",
    label: "Personal Coach",
    starter: false,
    pro: false,
    elite: true,
  },
  {
    category: "Training",
    label: "VIP Training Sessions",
    starter: false,
    pro: false,
    elite: true,
  },
  {
    category: "Tracking",
    label: "Progress Dashboard",
    starter: false,
    pro: true,
    elite: true,
  },
  {
    category: "Tracking",
    label: "Advanced Body Analytics",
    starter: false,
    pro: false,
    elite: true,
  },
  {
    category: "Nutrition",
    label: "Nutrition Guidance",
    starter: false,
    pro: true,
    elite: true,
  },
  {
    category: "Nutrition",
    label: "Custom Meal Planning",
    starter: false,
    pro: false,
    elite: true,
  },
  {
    category: "Support",
    label: "Community Access",
    starter: true,
    pro: true,
    elite: true,
  },
  {
    category: "Support",
    label: "Priority Support 24/7",
    starter: false,
    pro: false,
    elite: true,
  },
  {
    category: "Support",
    label: "Exclusive Member Events",
    starter: false,
    pro: false,
    elite: true,
  },
  {
    category: "Support",
    label: "Monthly Check-ins",
    starter: false,
    pro: true,
    elite: true,
  },
];

const plans = ["Starter", "Professional", "Elite"];

const CheckCell = ({ value, isHighlighted }) => (
  <td
    className={`${styles.cell} ${isHighlighted ? styles.cellHighlighted : ""}`}
  >
    {value ? (
      <span
        className={`${styles.check} ${isHighlighted ? styles.checkGreen : styles.checkDefault}`}
      >
        <FiCheck />
      </span>
    ) : (
      <span className={styles.minus}>
        <FiMinus />
      </span>
    )}
  </td>
);

const ComparisonTable = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  // Group rows by category
  let lastCategory = null;

  return (
    <motion.div
      ref={ref}
      className={styles.tableWrapper}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.featureHeader}>Features</th>
              {plans.map((plan, i) => (
                <th
                  key={plan}
                  className={`${styles.planHeader} ${
                    i === 1 ? styles.planHeaderHighlighted : ""
                  }`}
                >
                  {i === 1 && (
                    <span className={styles.popularBadge}>Most Popular</span>
                  )}
                  <span className={styles.planHeaderName}>{plan}</span>
                  <span className={styles.planHeaderPrice}>
                    {i === 0 ? "$49" : i === 1 ? "$89" : "$149"}
                    <span className={styles.planHeaderPer}>/mo</span>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((row, index) => {
              const showCategory = row.category !== lastCategory;
              lastCategory = row.category;

              return (
                <React.Fragment key={row.label}>
                  {showCategory && (
                    <tr className={styles.categoryRow}>
                      <td colSpan={4} className={styles.categoryLabel}>
                        {row.category}
                      </td>
                    </tr>
                  )}
                  <motion.tr
                    className={`${styles.featureRow} ${
                      index % 2 === 0 ? styles.featureRowEven : ""
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.1 + index * 0.04 }}
                  >
                    <td className={styles.featureLabel}>{row.label}</td>
                    <CheckCell value={row.starter} isHighlighted={false} />
                    <CheckCell value={row.pro} isHighlighted={true} />
                    <CheckCell value={row.elite} isHighlighted={false} />
                  </motion.tr>
                </React.Fragment>
              );
            })}
          </tbody>
          <tfoot>
            <tr className={styles.footerRow}>
              <td className={styles.footerLabel}>Get Started</td>
              {plans.map((plan, i) => (
                <td
                  key={plan}
                  className={`${styles.footerCell} ${
                    i === 1 ? styles.footerCellHighlighted : ""
                  }`}
                >
                  <motion.button
                    className={`${styles.tableBtn} ${
                      i === 1
                        ? styles.tableBtnPrimary
                        : styles.tableBtnSecondary
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {i === 0 ? "Start" : i === 1 ? "Go Pro" : "Go Elite"}
                  </motion.button>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </motion.div>
  );
};

export default ComparisonTable;
