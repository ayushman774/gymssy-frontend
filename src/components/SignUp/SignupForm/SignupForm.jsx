import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi";

import PasswordStrengthIndicator from "../PasswordStrengthIndicator/PasswordStrengthIndicator";
import SocialLoginButtons from "../SocialLoginButtons/SocialLoginButtons";

import styles from "./SignupForm.module.css";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ""));

const validatePassword = (password) => password.length >= 8;

// ─── Component ────────────────────────────────────────────────────────────────

const SignupForm = ({ accountType }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    agreePrivacy: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [focused, setFocused] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ── Floating label helper
  const isActive = (name) =>
    focused[name] || (formData[name] !== "" && formData[name] !== false);

  // ── Live validation on touched fields
  const getFieldError = (name, value) => {
    switch (name) {
      case "fullName":
        return !value.trim() ? "Full name is required" : "";
      case "email":
        if (!value.trim()) return "Email is required";
        if (!validateEmail(value)) return "Enter a valid email address";
        return "";
      case "phone":
        if (!value.trim()) return "Phone number is required";
        if (!validatePhone(value)) return "Enter a valid 10-digit number";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        return "";
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== formData.password) return "Passwords do not match";
        return "";
      case "agreeTerms":
        return !value ? "You must agree to the Terms & Conditions" : "";
      case "agreePrivacy":
        return !value ? "You must agree to the Privacy Policy" : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    // Revalidate if already touched
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: getFieldError(name, newValue),
      }));
    }

    // Revalidate confirmPassword when password changes
    if (name === "password" && touched.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          formData.confirmPassword !== newValue ? "Passwords do not match" : "",
      }));
    }
  };

  const handleFocus = (name) =>
    setFocused((prev) => ({ ...prev, [name]: true }));

  const handleBlur = (name) => {
    setFocused((prev) => ({ ...prev, [name]: false }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: getFieldError(name, formData[name]),
    }));
  };

  const validateAll = () => {
    const allErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = getFieldError(key, formData[key]);
      if (err) allErrors[key] = err;
    });
    return allErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allErrors = validateAll();
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setTouched(
        Object.keys(formData).reduce((acc, k) => ({ ...acc, [k]: true }), {}),
      );
      return;
    }
    setLoading(true);
    await new Promise((res) => setTimeout(res, 2000));
    setLoading(false);
    setSubmitted(true);
  };

  // ── Success state
  if (submitted) {
    return (
      <motion.div
        className={styles.successState}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className={styles.successIconWrapper}>
          <HiOutlineCheckCircle className={styles.successIcon} />
        </div>
        <h3 className={styles.successTitle}>Account Created!</h3>
        <p className={styles.successDesc}>
          Welcome to Gymssy. Your account has been created successfully.
        </p>
      </motion.div>
    );
  }

  // ── Field render helper
  const renderField = ({ name, label, type = "text", maxLength, rightEl }) => {
    const hasError = touched[name] && errors[name];
    const isSuccess = touched[name] && !errors[name] && formData[name];

    return (
      <div
        className={`${styles.fieldGroup}
          ${hasError ? styles.hasError : ""}
          ${isSuccess ? styles.hasSuccess : ""}
          ${isActive(name) ? styles.active : ""}
        `}
      >
        <input
          type={type}
          name={name}
          id={name}
          className={styles.input}
          value={formData[name]}
          onChange={handleChange}
          onFocus={() => handleFocus(name)}
          onBlur={() => handleBlur(name)}
          aria-invalid={!!hasError}
          aria-describedby={hasError ? `${name}-error` : undefined}
          maxLength={maxLength}
          autoComplete={
            name === "password" || name === "confirmPassword"
              ? "new-password"
              : "on"
          }
        />
        <label htmlFor={name} className={styles.label}>
          {label}
        </label>

        {/* Right element (show/hide or status icon) */}
        <div className={styles.inputRight}>
          {rightEl}
          {!rightEl && isSuccess && (
            <HiOutlineCheckCircle className={styles.successFieldIcon} />
          )}
          {!rightEl && hasError && (
            <HiOutlineExclamationCircle className={styles.errorFieldIcon} />
          )}
        </div>

        {hasError && (
          <span className={styles.errorMsg} id={`${name}-error`} role="alert">
            {errors[name]}
          </span>
        )}
      </div>
    );
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
      aria-label="Create Gymssy account"
    >
      {/* Social login at top */}
      <SocialLoginButtons />

      {/* Divider */}
      <div className={styles.divider}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerText}>or continue with email</span>
        <span className={styles.dividerLine} />
      </div>

      {/* ─── Fields ─── */}
      <div className={styles.fields}>
        {/* Full Name */}
        {renderField({ name: "fullName", label: "Full Name" })}

        {/* Email */}
        {renderField({ name: "email", label: "Email Address", type: "email" })}

        {/* Phone */}
        {renderField({
          name: "phone",
          label: "Phone Number",
          type: "tel",
          maxLength: 10,
        })}

        {/* Password */}
        <div>
          {renderField({
            name: "password",
            label: "Password",
            type: showPassword ? "text" : "password",
            rightEl: (
              <button
                type="button"
                className={styles.toggleBtn}
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
              </button>
            ),
          })}
          {/* Password strength */}
          {formData.password && (
            <PasswordStrengthIndicator password={formData.password} />
          )}
        </div>

        {/* Confirm Password */}
        {renderField({
          name: "confirmPassword",
          label: "Confirm Password",
          type: showConfirm ? "text" : "password",
          rightEl: (
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={() => setShowConfirm((p) => !p)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showConfirm ? <HiOutlineEyeOff /> : <HiOutlineEye />}
            </button>
          ),
        })}
      </div>

      {/* ─── Checkboxes ─── */}
      <div className={styles.checkboxes}>
        {/* Terms */}
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              onBlur={() => handleBlur("agreeTerms")}
              className={styles.checkboxInput}
            />
            <span className={styles.checkboxCustom} />
            <span className={styles.checkboxText}>
              I agree to Gymssy's{" "}
              <a href="/terms" className={styles.checkboxLink}>
                Terms & Conditions
              </a>
            </span>
          </label>
          {touched.agreeTerms && errors.agreeTerms && (
            <span className={styles.errorMsg} role="alert">
              {errors.agreeTerms}
            </span>
          )}
        </div>

        {/* Privacy */}
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="agreePrivacy"
              checked={formData.agreePrivacy}
              onChange={handleChange}
              onBlur={() => handleBlur("agreePrivacy")}
              className={styles.checkboxInput}
            />
            <span className={styles.checkboxCustom} />
            <span className={styles.checkboxText}>
              I agree to Gymssy's{" "}
              <a href="/privacy" className={styles.checkboxLink}>
                Privacy Policy
              </a>
            </span>
          </label>
          {touched.agreePrivacy && errors.agreePrivacy && (
            <span className={styles.errorMsg} role="alert">
              {errors.agreePrivacy}
            </span>
          )}
        </div>
      </div>

      {/* ─── Submit ─── */}
      <motion.button
        type="submit"
        className={styles.submitBtn}
        disabled={loading}
        whileHover={!loading ? { scale: 1.015 } : {}}
        whileTap={!loading ? { scale: 0.985 } : {}}
      >
        {loading ? <span className={styles.loader} /> : "Create Account"}
      </motion.button>
    </form>
  );
};

export default SignupForm;
