import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { HiOutlineCheckCircle } from "react-icons/hi";
import styles from "./PartnerForm.module.css";

const businessTypes = [
  "Gym",
  "Yoga Studio",
  "Personal Trainer",
  "Dance Studio",
  "Pilates Studio",
  "Swimming Academy",
  "Martial Arts",
  "Sports Academy",
  "Wellness Center",
  "CrossFit Box",
  "Other",
];

const initialState = {
  businessName: "",
  ownerName: "",
  email: "",
  phone: "",
  businessType: "",
  city: "",
  address: "",
  website: "",
  message: "",
  agreed: false,
};

const PartnerForm = () => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.businessName.trim())
      errs.businessName = "Business name is required";
    if (!formData.ownerName.trim()) errs.ownerName = "Owner name is required";
    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Enter a valid email address";
    }
    if (!formData.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\s/g, ""))) {
      errs.phone = "Enter a valid 10-digit Indian mobile number";
    }
    if (!formData.businessType)
      errs.businessType = "Please select a business type";
    if (!formData.city.trim()) errs.city = "City is required";
    if (!formData.address.trim()) errs.address = "Address is required";
    if (!formData.agreed)
      errs.agreed = "You must agree to the Terms & Privacy Policy";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFocus = (name) =>
    setFocused((prev) => ({ ...prev, [name]: true }));
  const handleBlur = (name) =>
    setFocused((prev) => ({ ...prev, [name]: false }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    // Simulate API call
    await new Promise((res) => setTimeout(res, 1800));
    setLoading(false);
    setSubmitted(true);
  };

  const handleDemo = (e) => {
    e.preventDefault();
    // Navigate to contact or open a modal in a real app
    window.location.href = "/contact";
  };

  // ── Floating label helper
  const isActive = (name) =>
    focused[name] || (formData[name] !== "" && formData[name] !== false);

  if (submitted) {
    return (
      <motion.div
        className={styles.successWrapper}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <HiOutlineCheckCircle className={styles.successIcon} />
        <h3 className={styles.successTitle}>Application Submitted!</h3>
        <p className={styles.successDesc}>
          Thank you for applying to join Gymssy. Our team will review your
          details and reach out within 48 hours.
        </p>
        <button
          className={styles.btnPrimary}
          onClick={() => setSubmitted(false)}
        >
          Submit Another Application
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={styles.formWrapper}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true, margin: "-60px" }}
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* Row 1 */}
        <div className={styles.row}>
          <div
            className={`${styles.fieldGroup} ${errors.businessName ? styles.hasError : ""} ${isActive("businessName") ? styles.active : ""}`}
          >
            <input
              type="text"
              name="businessName"
              id="businessName"
              className={styles.input}
              value={formData.businessName}
              onChange={handleChange}
              onFocus={() => handleFocus("businessName")}
              onBlur={() => handleBlur("businessName")}
              aria-invalid={!!errors.businessName}
            />
            <label htmlFor="businessName" className={styles.label}>
              Business Name <span className={styles.req}>*</span>
            </label>
            {errors.businessName && (
              <span className={styles.errorMsg}>{errors.businessName}</span>
            )}
          </div>

          <div
            className={`${styles.fieldGroup} ${errors.ownerName ? styles.hasError : ""} ${isActive("ownerName") ? styles.active : ""}`}
          >
            <input
              type="text"
              name="ownerName"
              id="ownerName"
              className={styles.input}
              value={formData.ownerName}
              onChange={handleChange}
              onFocus={() => handleFocus("ownerName")}
              onBlur={() => handleBlur("ownerName")}
              aria-invalid={!!errors.ownerName}
            />
            <label htmlFor="ownerName" className={styles.label}>
              Owner Name <span className={styles.req}>*</span>
            </label>
            {errors.ownerName && (
              <span className={styles.errorMsg}>{errors.ownerName}</span>
            )}
          </div>
        </div>

        {/* Row 2 */}
        <div className={styles.row}>
          <div
            className={`${styles.fieldGroup} ${errors.email ? styles.hasError : ""} ${isActive("email") ? styles.active : ""}`}
          >
            <input
              type="email"
              name="email"
              id="email"
              className={styles.input}
              value={formData.email}
              onChange={handleChange}
              onFocus={() => handleFocus("email")}
              onBlur={() => handleBlur("email")}
              aria-invalid={!!errors.email}
            />
            <label htmlFor="email" className={styles.label}>
              Email Address <span className={styles.req}>*</span>
            </label>
            {errors.email && (
              <span className={styles.errorMsg}>{errors.email}</span>
            )}
          </div>

          <div
            className={`${styles.fieldGroup} ${errors.phone ? styles.hasError : ""} ${isActive("phone") ? styles.active : ""}`}
          >
            <input
              type="tel"
              name="phone"
              id="phone"
              className={styles.input}
              value={formData.phone}
              onChange={handleChange}
              onFocus={() => handleFocus("phone")}
              onBlur={() => handleBlur("phone")}
              aria-invalid={!!errors.phone}
              maxLength={10}
            />
            <label htmlFor="phone" className={styles.label}>
              Phone Number <span className={styles.req}>*</span>
            </label>
            {errors.phone && (
              <span className={styles.errorMsg}>{errors.phone}</span>
            )}
          </div>
        </div>

        {/* Row 3 */}
        <div className={styles.row}>
          <div
            className={`${styles.fieldGroup} ${styles.selectGroup} ${errors.businessType ? styles.hasError : ""} ${isActive("businessType") ? styles.active : ""}`}
          >
            <select
              name="businessType"
              id="businessType"
              className={`${styles.input} ${styles.select}`}
              value={formData.businessType}
              onChange={handleChange}
              onFocus={() => handleFocus("businessType")}
              onBlur={() => handleBlur("businessType")}
              aria-invalid={!!errors.businessType}
            >
              <option value="" disabled />
              {businessTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <label
              htmlFor="businessType"
              className={`${styles.label} ${formData.businessType ? styles.labelFloated : ""}`}
            >
              Business Type <span className={styles.req}>*</span>
            </label>
            {errors.businessType && (
              <span className={styles.errorMsg}>{errors.businessType}</span>
            )}
          </div>

          <div
            className={`${styles.fieldGroup} ${errors.city ? styles.hasError : ""} ${isActive("city") ? styles.active : ""}`}
          >
            <input
              type="text"
              name="city"
              id="city"
              className={styles.input}
              value={formData.city}
              onChange={handleChange}
              onFocus={() => handleFocus("city")}
              onBlur={() => handleBlur("city")}
              aria-invalid={!!errors.city}
            />
            <label htmlFor="city" className={styles.label}>
              City <span className={styles.req}>*</span>
            </label>
            {errors.city && (
              <span className={styles.errorMsg}>{errors.city}</span>
            )}
          </div>
        </div>

        {/* Address */}
        <div
          className={`${styles.fieldGroup} ${errors.address ? styles.hasError : ""} ${isActive("address") ? styles.active : ""}`}
        >
          <input
            type="text"
            name="address"
            id="address"
            className={styles.input}
            value={formData.address}
            onChange={handleChange}
            onFocus={() => handleFocus("address")}
            onBlur={() => handleBlur("address")}
            aria-invalid={!!errors.address}
          />
          <label htmlFor="address" className={styles.label}>
            Business Address <span className={styles.req}>*</span>
          </label>
          {errors.address && (
            <span className={styles.errorMsg}>{errors.address}</span>
          )}
        </div>

        {/* Website */}
        <div
          className={`${styles.fieldGroup} ${isActive("website") ? styles.active : ""}`}
        >
          <input
            type="url"
            name="website"
            id="website"
            className={styles.input}
            value={formData.website}
            onChange={handleChange}
            onFocus={() => handleFocus("website")}
            onBlur={() => handleBlur("website")}
          />
          <label htmlFor="website" className={styles.label}>
            Website <span className={styles.optional}>(Optional)</span>
          </label>
        </div>

        {/* Message */}
        <div
          className={`${styles.fieldGroup} ${styles.textareaGroup} ${isActive("message") ? styles.active : ""}`}
        >
          <textarea
            name="message"
            id="message"
            rows={4}
            className={`${styles.input} ${styles.textarea}`}
            value={formData.message}
            onChange={handleChange}
            onFocus={() => handleFocus("message")}
            onBlur={() => handleBlur("message")}
          />
          <label htmlFor="message" className={styles.label}>
            Tell Us About Your Business
          </label>
        </div>

        {/* Checkbox */}
        <div
          className={`${styles.checkboxGroup} ${errors.agreed ? styles.hasError : ""}`}
        >
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="agreed"
              checked={formData.agreed}
              onChange={handleChange}
              className={styles.checkbox}
            />
            <span className={styles.checkboxCustom} />
            <span className={styles.checkboxText}>
              I agree to Gymssy's{" "}
              <a href="/terms" className={styles.checkboxLink}>
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className={styles.checkboxLink}>
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.agreed && (
            <span className={styles.errorMsg}>{errors.agreed}</span>
          )}
        </div>

        {/* Buttons */}
        <div className={styles.formActions}>
          <button
            type="submit"
            className={styles.btnPrimary}
            disabled={loading}
          >
            {loading ? (
              <span className={styles.loader} />
            ) : (
              "Submit Application"
            )}
          </button>
          <button
            type="button"
            className={styles.btnOutline}
            onClick={handleDemo}
          >
            Schedule a Demo
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default PartnerForm;
