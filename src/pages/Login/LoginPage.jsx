import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCustomerAuth } from "../../context/CustomerAuthContext.jsx";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const { login } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login({ email: email.trim(), password });
      const destination = location.state?.from;
      navigate(typeof destination === "string" && destination.startsWith("/") ? destination : "/", { replace: true });
    } catch (err) {
      setError(err?.message || "Unable to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <form className={styles.card} onSubmit={submit} noValidate>
        <p className={styles.eyebrow}>CUSTOMER ACCOUNT</p>
        <h1>Welcome Back</h1>
        <p className={styles.copy}>Sign in to continue your Gymssy journey.</p>
        <label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></label>
        <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></label>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <button type="submit" disabled={loading}>{loading ? "Signing In…" : "Sign In"}</button>
        <p className={styles.footer}>New to Gymssy? <Link to="/sign-up">Create an account</Link></p>
      </form>
    </main>
  );
}
