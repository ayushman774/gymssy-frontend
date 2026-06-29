import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiTag,
  FiMessageSquare,
  FiChevronDown,
  FiCheck,
  FiSend,
  FiAlertCircle,
} from "react-icons/fi";
import styles from "./ContactForm.module.css";

const reasonOptions = [
  "General Enquiry",
  "Membership Support",
  "Gym Partnership",
  "Trainer Registration",
  "Technical Support",
  "Billing Issue",
  "Feedback",
];

const init = {
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  reason: "",
  message: "",
  privacy: false,
};

const initErrors = {
  fullName: "",
  email: "",
  message: "",
  privacy: "",
};

/* ── Floating Input ───────────────────────────────────────── */
const FloatingInput = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  icon,
  error,
  required,
  placeholder,
}) => {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  return (
    <div className={styles.fieldWrap}>
      <div
        className={`${styles.inputBox}
        ${focused ? styles.inputFocused : ""}
        ${error ? styles.inputError : ""}`}
      >
        <span className={styles.inputIcon}>{icon}</span>
        <div className={styles.inputInner}>
          <label
            htmlFor={id}
            className={`${styles.label}
              ${floated ? styles.labelUp : ""}
              ${focused ? styles.labelFocused : ""}`}
          >
            {label}
            {required && <span className={styles.req}>*</span>}
          </label>
          <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={styles.input}
            placeholder={floated ? placeholder : ""}
            autoComplete="off"
          />
        </div>
        {focused && <div className={styles.focusBar} />}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            className={styles.errMsg}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <FiAlertCircle className={styles.errIcon} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Floating Textarea ────────────────────────────────────── */
const FloatingTextarea = ({ id, label, value, onChange, error, required }) => {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  return (
    <div className={styles.fieldWrap}>
      <div
        className={`${styles.inputBox} ${styles.taBox}
        ${focused ? styles.inputFocused : ""}
        ${error ? styles.inputError : ""}`}
      >
        <span className={`${styles.inputIcon} ${styles.taIcon}`}>
          <FiMessageSquare />
        </span>
        <div className={styles.inputInner}>
          <label
            htmlFor={id}
            className={`${styles.label} ${styles.taLabel}
              ${floated ? styles.taLabelUp : ""}
              ${focused ? styles.labelFocused : ""}`}
          >
            {label}
            {required && <span className={styles.req}>*</span>}
          </label>
          <textarea
            id={id}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`${styles.input} ${styles.textarea}`}
            rows={5}
          />
        </div>
        {focused && <div className={styles.focusBar} />}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            className={styles.errMsg}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <FiAlertCircle className={styles.errIcon} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Dropdown ─────────────────────────────────────────────── */
const Dropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.dropWrap}>
      <button
        type="button"
        className={`${styles.dropTrigger} ${open ? styles.dropOpen : ""}`}
        onClick={() => setOpen((p) => !p)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <FiTag className={styles.dropIcon} />
        <span
          className={`${styles.dropVal} ${!value ? styles.dropPlaceholder : ""}`}
        >
          {value || "Reason for Contact…"}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className={styles.dropChevron}
        >
          <FiChevronDown />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            className={styles.dropList}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            role="listbox"
          >
            {reasonOptions.map((opt) => (
              <li
                key={opt}
                className={`${styles.dropOption} ${value === opt ? styles.dropOptionActive : ""}`}
                onMouseDown={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                role="option"
                aria-selected={value === opt}
              >
                {opt}
                {value === opt && <FiCheck className={styles.dropCheck} />}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Main Form ────────────────────────────────────────────── */
const ContactForm = () => {
  const [form, setForm] = useState(init);
  const [errors, setErrors] = useState(initErrors);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const validate = () => {
    const e = { ...initErrors };
    let ok = true;
    if (!form.fullName.trim()) {
      e.fullName = "Full name is required.";
      ok = false;
    }
    if (!form.email.trim()) {
      e.email = "Email address is required.";
      ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Please enter a valid email.";
      ok = false;
    }
    if (!form.message.trim()) {
      e.message = "Please enter your message.";
      ok = false;
    }
    if (!form.privacy) {
      e.privacy = "You must agree to the Privacy Policy.";
      ok = false;
    }
    setErrors(e);
    return ok;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1800));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        className={styles.successState}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.successIcon}>
          <FiCheck />
        </div>
        <h3 className={styles.successTitle}>Message Sent!</h3>
        <p className={styles.successText}>
          Thank you for reaching out. A member of our team will respond within
          24 hours.
        </p>
        <motion.button
          className={styles.successBtn}
          onClick={() => {
            setSubmitted(false);
            setForm(init);
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          Send Another Message
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.form
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
    >
      <div className={styles.grid}>
        <FloatingInput
          id="fullName"
          label="Full Name"
          value={form.fullName}
          onChange={set("fullName")}
          icon={<FiUser />}
          error={errors.fullName}
          required
          placeholder="John Smith"
        />
        <FloatingInput
          id="email"
          label="Email Address"
          type="email"
          value={form.email}
          onChange={set("email")}
          icon={<FiMail />}
          error={errors.email}
          required
          placeholder="john@example.com"
        />
        <FloatingInput
          id="phone"
          label="Phone Number"
          type="tel"
          value={form.phone}
          onChange={set("phone")}
          icon={<FiPhone />}
          placeholder="+1 (555) 000-0000"
        />
        <FloatingInput
          id="subject"
          label="Subject"
          value={form.subject}
          onChange={set("subject")}
          icon={<FiTag />}
          placeholder="How can we help?"
        />
      </div>

      <Dropdown
        value={form.reason}
        onChange={(val) => setForm((p) => ({ ...p, reason: val }))}
      />

      <FloatingTextarea
        id="message"
        label="Your Message"
        value={form.message}
        onChange={set("message")}
        error={errors.message}
        required
      />

      {/* Privacy */}
      <div className={styles.privacyRow}>
        <div
          className={`${styles.checkbox}
            ${form.privacy ? styles.checkboxOn : ""}
            ${errors.privacy ? styles.checkboxErr : ""}`}
          onClick={() => setForm((p) => ({ ...p, privacy: !p.privacy }))}
          role="checkbox"
          aria-checked={form.privacy}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter")
              setForm((p) => ({ ...p, privacy: !p.privacy }));
          }}
        >
          <AnimatePresence>
            {form.privacy && (
              <motion.span
                className={styles.checkTick}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FiCheck />
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <span className={styles.privacyText}>
          I agree to the{" "}
          <a href="/privacy" className={styles.privacyLink}>
            Privacy Policy
          </a>{" "}
          and consent to being contacted by the APEX Market team.
        </span>
      </div>
      <AnimatePresence>
        {errors.privacy && (
          <motion.p
            className={styles.errMsg}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FiAlertCircle className={styles.errIcon} />
            {errors.privacy}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className={styles.actions}>
        <motion.button
          type="submit"
          className={`${styles.submitBtn} ${submitting ? styles.submitLoading : ""}`}
          whileHover={!submitting ? { scale: 1.03 } : {}}
          whileTap={!submitting ? { scale: 0.97 } : {}}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span className={styles.spinner} />
              Sending…
            </>
          ) : (
            <>
              <FiSend className={styles.sendIcon} />
              Send Message
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  );
};

export default ContactForm;
