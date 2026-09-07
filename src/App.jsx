import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import styles from "./App.module.css";
import Navbar from "./components/layout/Navbar/Navbar";
import Footer from "./components/layout/Footer/Footer";
import About from "./pages/About/About";
import Programs from "./pages/Programs/Programs";
import Membership from "./pages/MembershipPage/MembershipPage";
import TrainersPage from "./pages/TrainersPage/TrainersPage";
import GymsNearYouPage from "./pages/GymsNearYouPage/GymsNearYouPage";
import ContactPage from "./pages/ContactPage/ContactPage";
import DiscoverPage from "./pages/Discover/DiscoverPage";
import PartnerWithUsPage from "./pages/PartnerWithUs/PartnerWithUsPage";
import SignUpPage from "./pages/SignUp/SignUpPage";
import GymDetailsPage from "./pages/GymDetailsPage/GymDetailsPage";
import Fitness from "./pages/Fitness/Fitness";
import Wellness from "./pages/Wellness/Wellness";
import Sports from "./pages/Sports/Sports";
import TrainerDetail from "./pages/TrainerDetail/TrainerDetail";
import CategoryListingPage from "./pages/CategoryListingPage/CategoryListingPage";
import CityListingsPage from "./pages/CityListingsPage/CityListingsPage";
import NutritionistsPage from "./pages/Nutritionists/NutritionistsPage";
import NutritionistDetailsPage from "./pages/Nutritionists/NutritionistDetailsPage";

const App = () => {
  const ComingSoon = lazy(() => import("./pages/ComingSoon/ComingSoon"));

  return (
    <div className={styles.app}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<ComingSoon />} />
        <Route path="/about" element={<About />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/trainers" element={<TrainersPage />} />
        <Route path="/gyms-near-you" element={<GymsNearYouPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/partner-with-us" element={<PartnerWithUsPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/gym-detail/:slug" element={<GymDetailsPage />} />
        <Route path="/fitness" element={<Fitness />} />
        <Route path="/wellness" element={<Wellness />} />
        <Route path="/sports" element={<Sports />} />
        <Route path="/trainers/:slug" element={<TrainerDetail />} />
        <Route path="/category/:slug" element={<CategoryListingPage />} />
        <Route path="/gyms/:citySlug" element={<CityListingsPage />} />
        <Route path="/nutritionists" element={<NutritionistsPage />} />
        <Route
          path="/nutritionists/:slug"
          element={<NutritionistDetailsPage />}
        />

        {/* Add more routes as pages are built */}
        {/* <Route path="/pricing"  element={<Pricing />}  /> */}
        {/* <Route path="/contact"  element={<Contact />}  /> */}
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
