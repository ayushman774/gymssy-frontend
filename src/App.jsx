import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import styles from "./App.module.css";

const App = () => {
  return (
    <div className={styles.app}>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add more routes as pages are built */}
        {/* <Route path="/about"    element={<About />}    /> */}
        {/* <Route path="/programs" element={<Programs />} /> */}
        {/* <Route path="/trainers" element={<Trainers />} /> */}
        {/* <Route path="/pricing"  element={<Pricing />}  /> */}
        {/* <Route path="/contact"  element={<Contact />}  /> */}
      </Routes>
    </div>
  );
};

export default App;