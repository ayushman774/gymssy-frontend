/**
 * Home Page
 * Composes all home page sections.
 * Hero is rendered first — above the fold.
 */

import Hero from "../../components/sections/home/Hero/Hero";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <main className={styles.home}>
      <Hero />
      {/* Other sections follow below */}
    </main>
  );
};

export default Home;
