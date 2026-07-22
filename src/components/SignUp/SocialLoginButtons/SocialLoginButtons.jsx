import React, { useState } from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { BsApple } from "react-icons/bs";
import styles from "./SocialLoginButtons.module.css";

const SocialLoginButtons = () => {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const handleGoogle = async () => {
    setGoogleLoading(true);
    // Integrate Google OAuth in real app
    await new Promise((res) => setTimeout(res, 1200));
    setGoogleLoading(false);
  };

  const handleApple = async () => {
    setAppleLoading(true);
    // Integrate Apple OAuth in real app
    await new Promise((res) => setTimeout(res, 1200));
    setAppleLoading(false);
  };

  return (
    <div className={styles.wrapper}>
      {/* Google */}
      <motion.button
        type="button"
        className={styles.socialBtn}
        onClick={handleGoogle}
        disabled={googleLoading || appleLoading}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.98 }}
      >
        {googleLoading ? (
          <span className={styles.loader} />
        ) : (
          <>
            <FcGoogle className={styles.socialIcon} />
            <span>Continue with Google</span>
          </>
        )}
      </motion.button>

      {/* Apple */}
      <motion.button
        type="button"
        className={`${styles.socialBtn} ${styles.appleBtn}`}
        onClick={handleApple}
        disabled={googleLoading || appleLoading}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.98 }}
      >
        {appleLoading ? (
          <span className={`${styles.loader} ${styles.loaderDark}`} />
        ) : (
          <>
            <BsApple className={styles.socialIcon} />
            <span>Continue with Apple</span>
          </>
        )}
      </motion.button>
    </div>
  );
};

export default SocialLoginButtons;
