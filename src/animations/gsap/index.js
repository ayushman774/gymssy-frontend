import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";

// Register all plugins once at app level
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Global GSAP defaults
gsap.defaults({
  ease: "power3.out",
  duration: 0.8,
});

// ScrollTrigger global settings
ScrollTrigger.config({
  ignoreMobileResize: true,
  autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
});

export default gsap;
