import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import styles from "./App.module.css";
import Navbar from "./components/layout/Navbar/Navbar";
import Footer from "./components/layout/Footer/Footer";
import About from "./pages/About/About";
import Programs from "./pages/Programs/Programs";

const App = () => {
  const ComingSoon = lazy(() => import("./pages/ComingSoon/ComingSoon"));

  return (
    <div className={styles.app}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<ComingSoon />} />
        <Route path="/about"    element={<About />}    />
        <Route path="/programs" element={<Programs />} />
        {/* Add more routes as pages are built */}
        {/* <Route path="/trainers" element={<Trainers />} /> */}
        {/* <Route path="/pricing"  element={<Pricing />}  /> */}
        {/* <Route path="/contact"  element={<Contact />}  /> */}
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
