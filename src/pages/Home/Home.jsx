import styles from "./Home.module.css";
import Hero from "../../components/sections/home/Hero/Hero";
import ExploreCategories from "../../components/sections/home/ExploreCategories/ExploreCategories";
import GymsNearYou from "../../components/sections/home/GymsNearYou/GymsNearYou";
import FeaturedTrainers from "../../components/sections/home/FeaturedTrainers/FeaturedTrainers";
import TrendingExperiences from "../../components/sections/home/TrendingExperiences/TrendingExperiences";
import WhyChooseUs from "../../components/sections/home/WhyChooseUs/WhyChooseUs";
import PopularCities from "../../components/sections/home/PopularCities/PopularCities";

const Home = () => {
  return (
    <main className={styles.home}>
      <Hero />
      <ExploreCategories />
      <GymsNearYou />
      <FeaturedTrainers />
      <TrendingExperiences />
      <WhyChooseUs />
      <PopularCities />
    </main>
  );
};

export default Home;