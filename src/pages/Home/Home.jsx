import About from "../../components/sections/home/About/About";
import Gallery from "../../components/sections/home/Gallery/Gallery";
import Hero from "../../components/sections/home/Hero/Hero";
import Membership from "../../components/sections/home/Membership/Membership";
import Programs from "../../components/sections/home/Programs/Programs";
import Testimonials from "../../components/sections/home/Testimonials/Testimonials";
import Trainers from "../../components/sections/home/Trainers/Trainers";
import Transformation from "../../components/sections/home/Transformation/Transformation";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <main className={styles.home}>
      <Hero />
      <About />
      <Programs />
      <Transformation />
      <Trainers />
      <Membership />
      <Testimonials />
      <Gallery />
      {/* Other sections follow below */}
    </main>
  );
};

export default Home;
