// src/pages/PartnerWithUs/PartnerWithUsPage.jsx

import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HiHome, HiChevronRight } from "react-icons/hi";
import { FiUsers, FiTrendingUp, FiMapPin, FiStar } from "react-icons/fi";

import PartnerCategoryCard from "../../components/PartnerWithUs/PartnerCategoryCard/PartnerCategoryCard";
import BenefitCard from "../../components/PartnerWithUs/BenefitCard/BenefitCard";
import PartnerTimeline from "../../components/PartnerWithUs/PartnerTimeline/PartnerTimeline";
import PartnerForm from "../../components/PartnerWithUs/PartnerForm/PartnerForm";
import SuccessStoryCard from "../../components/PartnerWithUs/SuccessStoryCard/SuccessStoryCard";
import PartnerFAQ from "../../components/PartnerWithUs/PartnerFAQ/PartnerFAQ";

import styles from "./PartnerWithUsPage.module.css";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ────────────────────────────────────────────────────────────────────

const categories = [
  {
    id: 1,
    icon: "🏋️",
    title: "Gyms",
    description:
      "List your gym and attract serious fitness enthusiasts looking for their perfect workout space.",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
  },
  {
    id: 2,
    icon: "🧘",
    title: "Yoga Studios",
    description:
      "Connect with yoga seekers across India and grow your studio community.",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
  },
  {
    id: 3,
    icon: "💪",
    title: "Personal Trainers",
    description:
      "Build your client base and manage bookings with ease on the Gymssy platform.",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
  },
  {
    id: 4,
    icon: "🤸",
    title: "Pilates Studios",
    description:
      "Showcase your classes, instructors, and facilities to a targeted audience.",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
  },
  {
    id: 5,
    icon: "🏊",
    title: "Swimming Academies",
    description:
      "Reach families and athletes looking for professional swimming instruction.",
    image:
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&q=80",
  },
  {
    id: 6,
    icon: "🥊",
    title: "Martial Arts",
    description:
      "Attract students passionate about discipline, fitness, and self-defense.",
    image:
      "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=600&q=80",
  },
  {
    id: 7,
    icon: "💃",
    title: "Dance Studios",
    description:
      "Promote your dance programs and fill your classes with passionate dancers.",
    image:
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80",
  },
  {
    id: 8,
    icon: "🏸",
    title: "Sports Academies",
    description:
      "Connect young athletes and sports enthusiasts with your professional coaching.",
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80",
  },
  {
    id: 9,
    icon: "🌿",
    title: "Wellness Centers",
    description:
      "Reach wellness-conscious individuals seeking holistic health experiences.",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80",
  },
];

const benefits = [
  {
    id: 1,
    icon: <FiTrendingUp />,
    title: "More Visibility",
    description:
      "Get discovered by thousands of fitness seekers actively searching in your city every single day.",
  },
  {
    id: 2,
    icon: <FiStar />,
    title: "Verified Business Profile",
    description:
      "Build trust with a premium verified listing that sets you apart from competitors.",
  },
  {
    id: 3,
    icon: <FiUsers />,
    title: "Direct Enquiries",
    description:
      "Receive qualified customer enquiries directly to your dashboard and phone in real time.",
  },
  {
    id: 4,
    icon: <FiMapPin />,
    title: "Membership Promotion",
    description:
      "Showcase your membership plans and attract the right customers ready to commit.",
  },
  {
    id: 5,
    icon: <FiTrendingUp />,
    title: "Lead Management",
    description:
      "Manage all your leads, bookings, and enquiries from one powerful business dashboard.",
  },
  {
    id: 6,
    icon: <FiStar />,
    title: "Business Analytics",
    description:
      "Get deep insights into profile views, enquiry trends, and customer behaviour.",
  },
  {
    id: 7,
    icon: <FiUsers />,
    title: "Marketing Support",
    description:
      "Benefit from Gymssy promotional campaigns, featured placements, and digital marketing.",
  },
  {
    id: 8,
    icon: <FiMapPin />,
    title: "Easy Listing Management",
    description:
      "Update your profile, photos, timings, and offers anytime with our intuitive partner dashboard.",
  },
];

const stats = [
  { value: 1000, suffix: "+", label: "Partner Businesses" },
  { value: 50000, suffix: "+", label: "Monthly Visitors" },
  { value: 100000, suffix: "+", label: "Leads Generated" },
  { value: 50, suffix: "+", label: "Cities" },
];

const successStories = [
  {
    id: 1,
    businessName: "Iron Republic Gym",
    ownerName: "Arjun Mehta",
    businessType: "Premium Gym",
    city: "Mumbai",
    testimonial:
      "Listing on Gymssy was the single best decision I made for my gym. Within 3 months, our monthly enquiries doubled and we signed on 80 new members directly through the platform.",
    growth: "40% increase in monthly enquiries",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    rating: 5,
  },
  {
    id: 2,
    businessName: "Serenity Yoga Studio",
    ownerName: "Priya Nair",
    businessType: "Yoga Studio",
    city: "Bangalore",
    testimonial:
      "Gymssy helped us reach people who were genuinely looking for yoga classes near them. Our studio went from 30% capacity to fully booked within two months of joining.",
    growth: "65% increase in class bookings",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    rating: 5,
  },
  {
    id: 3,
    businessName: "Champion Martial Arts",
    ownerName: "Ravi Shankar",
    businessType: "Martial Arts Academy",
    city: "Delhi",
    testimonial:
      "The verified profile gave our academy instant credibility. Parents trust Gymssy and that trust transfers directly to our business. Enrolments are up 50% year on year.",
    growth: "50% growth in annual enrolments",
    image:
      "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400&q=80",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    rating: 5,
  },
];

const faqs = [
  {
    id: 1,
    question: "How do I list my business on Gymssy?",
    answer:
      "Simply fill out the Partner Registration Form on this page with your business details. Our team will review your application and reach out within 48 hours to guide you through the onboarding process.",
  },
  {
    id: 2,
    question: "Is there any registration fee?",
    answer:
      "Getting started on Gymssy is free. We offer a free basic listing to help you get discovered. Premium plans with advanced features and priority placement are available at competitive rates tailored for Indian fitness businesses.",
  },
  {
    id: 3,
    question: "How long does the verification process take?",
    answer:
      "Our standard verification process takes 2 to 3 business days. Once your documents are reviewed and approved, your verified badge goes live immediately on your profile.",
  },
  {
    id: 4,
    question: "Can I manage and update my listing myself?",
    answer:
      "Absolutely. Every partner gets access to a dedicated business dashboard where you can update your photos, timings, membership plans, offers, and business information anytime you choose.",
  },
  {
    id: 5,
    question: "How do I receive customer enquiries?",
    answer:
      "Enquiries are delivered to you in real time via your Gymssy dashboard, email notifications, and optional SMS alerts. You can respond directly to potential customers from the dashboard.",
  },
  {
    id: 6,
    question: "Can I update my business profile after going live?",
    answer:
      "Yes. Your profile is fully editable at any time. We encourage partners to keep their profiles fresh with updated photos, seasonal offers, and current membership pricing to maximize enquiries.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const PartnerWithUsPage = () => {
  const bannerRef = useRef(null);
  const bannerTitleRef = useRef(null);
  const bannerSubRef = useRef(null);
  const whyLeftRef = useRef(null);
  const whyRightRef = useRef(null);
  const statsRef = useRef(null);
  const statsItemsRef = useRef([]);
  const ctaRef = useRef(null);

  // ── Banner parallax
  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;

    gsap.to(banner.querySelector(`.${styles.bannerBg}`), {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: banner,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // Title reveal
    gsap.fromTo(
      bannerTitleRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 },
    );
    gsap.fromTo(
      bannerSubRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.45 },
    );

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  // ── Why section reveals
  useEffect(() => {
    if (!whyLeftRef.current || !whyRightRef.current) return;

    gsap.fromTo(
      whyLeftRef.current,
      { opacity: 0, x: -60 },
      {
        opacity: 1,
        x: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: whyLeftRef.current,
          start: "top 80%",
        },
      },
    );

    gsap.fromTo(
      whyRightRef.current,
      { opacity: 0, x: 60 },
      {
        opacity: 1,
        x: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: whyRightRef.current,
          start: "top 80%",
        },
      },
    );
  }, []);

  // ── Counter animations
  useEffect(() => {
    if (!statsRef.current) return;

    statsItemsRef.current.forEach((el, i) => {
      if (!el) return;
      const target = stats[i].value;
      const obj = { val: 0 };

      gsap.to(obj, {
        val: target,
        duration: 2.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 75%",
          once: true,
        },
        onUpdate: () => {
          const countEl = el.querySelector(`.${styles.statNumber}`);
          if (countEl) {
            countEl.textContent =
              obj.val >= 1000
                ? Math.floor(obj.val / 1000) + "k"
                : Math.floor(obj.val).toString();
          }
        },
      });
    });
  }, []);

  // ── Final CTA reveal
  useEffect(() => {
    if (!ctaRef.current) return;
    gsap.fromTo(
      ctaRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 80%",
        },
      },
    );
  }, []);

  return (
    <main className={styles.page}>
      {/* ═══════════════════════════════════════════
          SECTION: PAGE BANNER
      ═══════════════════════════════════════════ */}
      <section className={styles.banner} ref={bannerRef}>
        <div className={styles.bannerBg}>
          <img
            src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1600&q=80"
            alt="Partner With Gymssy"
            className={styles.bannerImg}
            loading="eager"
          />
        </div>
        <div className={styles.bannerOverlay} />

        <div className={styles.bannerContent}>
         
          <p className={styles.bannerEyebrow}>For Business Owners</p>
          <h1 className={styles.bannerTitle} ref={bannerTitleRef}>
            Partner With <span className={styles.accent}>Gymssy</span>
          </h1>
          <p className={styles.bannerSub} ref={bannerSubRef}>
            Grow your fitness business, reach more customers, and increase
            bookings with India's Complete Fitness Marketplace.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION: WHY PARTNER WITH GYMSSY
      ═══════════════════════════════════════════ */}
      <section className={styles.whySection}>
        <div className={styles.container}>
          <div className={styles.whyGrid}>
            {/* Left: Image */}
            <div className={styles.whyImageCol} ref={whyLeftRef}>
              <div className={styles.whyImageWrapper}>
                <img
                  src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80"
                  alt="Fitness business owners"
                  className={styles.whyImage}
                  loading="lazy"
                />
                <div className={styles.whyImageAccent} />
                {/* Floating badge */}
                <div className={styles.whyBadge}>
                  <span className={styles.whyBadgeNum}>1000+</span>
                  <span className={styles.whyBadgeText}>Active Partners</span>
                </div>
              </div>
            </div>

            {/* Right: Content */}
            <div className={styles.whyContent} ref={whyRightRef}>
              <p className={styles.sectionEyebrow}>Why Choose Gymssy</p>
              <h2 className={styles.sectionTitle}>
                Grow Your Fitness Business with{" "}
                <span className={styles.accent}>Gymssy</span>
              </h2>
              <p className={styles.whyDesc}>
                Gymssy is India's fastest-growing fitness marketplace,
                connecting fitness businesses with thousands of motivated
                customers searching for their perfect fitness solution every
                single day.
              </p>

              <ul className={styles.whyList}>
                {[
                  "Reach verified customers actively searching for fitness services in your city",
                  "Increase your visibility across 50+ cities in India",
                  "Receive qualified leads directly to your dashboard in real time",
                  "Improve your bookings with Gymssy-powered promotions",
                  "Build long-term customer trust through verified business listings",
                ].map((item, i) => (
                  <li key={i} className={styles.whyListItem}>
                    <span className={styles.whyListDot} />
                    {item}
                  </li>
                ))}
              </ul>

              <div className={styles.whyActions}>
                <Link to="#partner-form" className={styles.btnPrimary}>
                  List Your Business
                </Link>
                <Link to="#how-it-works" className={styles.btnOutline}>
                  See How It Works
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION: WHO CAN JOIN
      ═══════════════════════════════════════════ */}
      <section className={styles.categoriesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>Open To Everyone</p>
            <h2 className={styles.sectionTitle}>
              Who Can <span className={styles.accent}>Join</span>
            </h2>
            <p className={styles.sectionDesc}>
              Whether you run a gym, teach yoga, or coach athletes — Gymssy
              welcomes all fitness professionals and businesses.
            </p>
          </div>

          <div className={styles.categoriesGrid}>
            {categories.map((cat, i) => (
              <PartnerCategoryCard key={cat.id} data={cat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION: BENEFITS
      ═══════════════════════════════════════════ */}
      <section className={styles.benefitsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>What You Get</p>
            <h2 className={styles.sectionTitle}>
              Benefits of <span className={styles.accent}>Partnering</span>
            </h2>
            <p className={styles.sectionDesc}>
              Everything your fitness business needs to grow, attract customers,
              and stay ahead of the competition.
            </p>
          </div>

          <div className={styles.benefitsGrid}>
            {benefits.map((benefit, i) => (
              <BenefitCard key={benefit.id} data={benefit} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION: HOW IT WORKS
      ═══════════════════════════════════════════ */}
      <section className={styles.timelineSection} id="how-it-works">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>Simple Process</p>
            <h2 className={styles.sectionTitle}>
              How It <span className={styles.accent}>Works</span>
            </h2>
            <p className={styles.sectionDesc}>
              Getting listed on Gymssy is fast, simple, and completely
              hassle-free.
            </p>
          </div>

          <PartnerTimeline />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION: STATISTICS
      ═══════════════════════════════════════════ */}
      <section className={styles.statsSection} ref={statsRef}>
        <div className={styles.statsOverlay} />
        <div className={styles.statsBg}>
          <img
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&q=80"
            alt="Fitness statistics background"
            className={styles.statsBgImg}
            loading="lazy"
          />
        </div>

        <div className={styles.container}>
          <div className={styles.statsGrid}>
            {stats.map((stat, i) => (
              <div
                key={i}
                className={styles.statItem}
                ref={(el) => (statsItemsRef.current[i] = el)}
              >
                <div className={styles.statNumberWrapper}>
                  <span className={styles.statNumber}>0</span>
                  <span className={styles.statSuffix}>{stat.suffix}</span>
                </div>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION: SUCCESS STORIES
      ═══════════════════════════════════════════ */}
      <section className={styles.storiesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>Partner Success</p>
            <h2 className={styles.sectionTitle}>
              Success <span className={styles.accent}>Stories</span>
            </h2>
            <p className={styles.sectionDesc}>
              Real businesses. Real growth. Hear from partners already thriving
              on Gymssy.
            </p>
          </div>

          <div className={styles.storiesGrid}>
            {successStories.map((story, i) => (
              <SuccessStoryCard key={story.id} data={story} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION: PARTNER REGISTRATION FORM
      ═══════════════════════════════════════════ */}
      <section className={styles.formSection} id="partner-form">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>Get Started Today</p>
            <h2 className={styles.sectionTitle}>
              Register as a <span className={styles.accent}>Partner</span>
            </h2>
            <p className={styles.sectionDesc}>
              Fill in your business details and our team will get back to you
              within 48 hours.
            </p>
          </div>

          <PartnerForm />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION: FAQ
      ═══════════════════════════════════════════ */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>Got Questions?</p>
            <h2 className={styles.sectionTitle}>
              Frequently Asked <span className={styles.accent}>Questions</span>
            </h2>
          </div>

          <PartnerFAQ faqs={faqs} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION: FINAL CTA
      ═══════════════════════════════════════════ */}
      <section className={styles.ctaSection} ref={ctaRef}>
        <div className={styles.ctaBg}>
          <img
            src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1600&q=80"
            alt="Join Gymssy"
            className={styles.ctaBgImg}
            loading="lazy"
          />
        </div>
        <div className={styles.ctaOverlay} />

        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <p className={styles.sectionEyebrow}>Take The Next Step</p>
            <h2 className={styles.ctaTitle}>
              Join India's Fastest Growing{" "}
              <span className={styles.accent}>Fitness Marketplace</span>
            </h2>
            <p className={styles.ctaDesc}>
              Partner with Gymssy today and connect with thousands of people
              searching for fitness services every day.
            </p>
            <div className={styles.ctaActions}>
              <Link to="#partner-form" className={styles.btnPrimary}>
                List Your Business
              </Link>
              <Link to="/contact" className={styles.btnOutline}>
                Talk to Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PartnerWithUsPage;
