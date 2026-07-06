import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiChevronRight, FiZap, FiArrowRight } from "react-icons/fi";
import {
  MdSupportAgent,
  MdEmail,
  MdHandshake,
  MdPhone,
  MdLocationOn,
  MdFitnessCenter,
  MdPeople,
  MdPayment,
  MdBuild,
  MdBusinessCenter,
  MdListAlt,
} from "react-icons/md";

import ContactCard from "../../components/ContactCard/ContactCard";
import ContactForm from "../../components/ContactForm/ContactForm";
import SupportCategoryCard from "../../components/SupportCategoryCard/SupportCategoryCard";
import PartnerCTA from "../../components/PartnerCTA/PartnerCTA";
import OfficeLocation from "../../components/OfficeLocation/OfficeLocation";
import ContactFAQ from "../../components/ContactFAQ/ContactFAQ";
import styles from "./ContactPage.module.css";
import { marketplaceContactImages } from "../../assets/data/contactPage";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ─────────────────────────────────────────────────────────────────────

const contactCards = [
  {
    id: "support",
    icon: <MdSupportAgent />,
    title: "Customer Support",
    info: "support@Gymssymarket.com",
    subInfo: "Mon–Fri · 8AM – 8PM",
    description:
      "Help with memberships, bookings and general platform queries.",
    href: "mailto:support@Gymssymarket.com",
    color: "green",
  },
  {
    id: "email",
    icon: <MdEmail />,
    title: "Email Support",
    info: "hello@Gymssymarket.com",
    subInfo: "Response within 24 hours",
    description:
      "Send us a message any time. We reply within one business day.",
    href: "mailto:hello@Gymssymarket.com",
    color: "blue",
  },
  {
    id: "partner",
    icon: <MdHandshake />,
    title: "Business Partnerships",
    info: "partners@Gymssymarket.com",
    subInfo: "Gym owners & trainers",
    description:
      "Interested in listing your gym or joining as a trainer partner?",
    href: "mailto:partners@Gymssymarket.com",
    color: "green",
  },
  {
    id: "phone",
    icon: <MdPhone />,
    title: "Phone Support",
    info: "+1 (555) 200-0000",
    subInfo: "Mon–Fri · 9AM – 6PM",
    description: "Speak directly with our team for urgent matters.",
    href: "tel:+15552000000",
    color: "blue",
  },
  {
    id: "office",
    icon: <MdLocationOn />,
    title: "Office Address",
    info: "88 Platform Way, Tech District",
    subInfo: "New York, NY 10001",
    description: "Visit us for enterprise partnerships and press enquiries.",
    href: "#office",
    color: "green",
  },
];

const supportCategories = [
  {
    id: "membership",
    icon: <MdFitnessCenter />,
    title: "Membership Support",
    description:
      "Help with membership plans, upgrades, cancellations and billing across all partner gyms.",
    link: "#form",
    color: "green",
  },
  {
    id: "listings",
    icon: <MdListAlt />,
    title: "Gym Listings",
    description:
      "Questions about gym profiles, photos, pricing, and keeping your listing accurate and up to date.",
    link: "#form",
    color: "blue",
  },
  {
    id: "trainer",
    icon: <MdPeople />,
    title: "Trainer Support",
    description:
      "Registering as a trainer, managing your profile, and connecting with members seeking coaching.",
    link: "#form",
    color: "green",
  },
  {
    id: "billing",
    icon: <MdPayment />,
    title: "Payments & Billing",
    description:
      "Invoices, refunds, payment methods and subscription management for members and businesses.",
    link: "#form",
    color: "blue",
  },
  {
    id: "tech",
    icon: <MdBuild />,
    title: "Technical Help",
    description:
      "Bugs, account access, app performance, and any technical issues on the platform.",
    link: "#form",
    color: "green",
  },
  {
    id: "business",
    icon: <MdBusinessCenter />,
    title: "Business Partnerships",
    description:
      "Enterprise deals, co-branding opportunities, and becoming an integrated platform partner.",
    link: "#form",
    color: "blue",
  },
];

const faqItems = [
  {
    id: 1,
    question: "How do I contact a gym listed on the platform?",
    answer:
      "Each gym listing includes direct contact details — phone, email, and a message form. Visit the gym's profile page and use the 'Contact Gym' button to reach them directly. You can also book a free trial or enquire about memberships from the same page.",
  },
  {
    id: 2,
    question: "How can I list my gym on the platform?",
    answer:
      "Listing your gym is straightforward. Click 'List Your Gym' from the navigation or contact page, complete the business registration form, and our partnerships team will review your submission within 2 business days. Once approved, you'll have full access to your gym dashboard.",
  },
  {
    id: 3,
    question: "Can I compare memberships across different gyms?",
    answer:
      "Yes — our comparison tool lets you view memberships from multiple gyms side by side. Search for gyms in your area, select up to 3 to compare, and view pricing, facilities, class schedules, and trainer availability in one clear view.",
  },
  {
    id: 4,
    question: "How do I register as a trainer on the platform?",
    answer:
      "Trainer registration is open to certified fitness professionals. Complete the trainer application form, upload your certifications and portfolio, and our team will verify your credentials. Approved trainers gain a public profile, client messaging tools, and booking management.",
  },
  {
    id: 5,
    question: "How quickly does support respond?",
    answer:
      "Our support team responds to all enquiries within 24 hours on business days. For urgent matters, phone support is available Monday to Friday, 9AM–6PM. Premium business partners receive priority support with a 4-hour response guarantee.",
  },
  {
    id: 6,
    question: "How do I update my gym listing?",
    answer:
      "Log in to your Gym Partner Dashboard, navigate to 'My Listing', and you can update your photos, description, pricing, facilities, opening hours, and trainer roster at any time. Changes go live within minutes after saving.",
  },
];

// ─── Particles ────────────────────────────────────────────────────────────────
const particles = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  style: {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    width: `${Math.random() * 3 + 1}px`,
    height: `${Math.random() * 3 + 1}px`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${Math.random() * 4 + 3}s`,
    opacity: Math.random() * 0.35 + 0.08,
  },
}));

// ─── Main Page ────────────────────────────────────────────────────────────────
const ContactPage = () => {
  const headerRef = useRef(null);
  const headerBgRef = useRef(null);
  const introImageRef = useRef(null);
  const introContentRef = useRef(null);
  const cardsRowRef = useRef([]);
  const supportCardsRef = useRef([]);

  // Header parallax
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!headerBgRef.current) return;
      gsap.to(headerBgRef.current, {
        yPercent: 25,
        ease: "none",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  // Intro image reveal
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (introImageRef.current) {
        gsap.fromTo(
          introImageRef.current,
          { clipPath: "inset(0 100% 0 0)", opacity: 0 },
          {
            clipPath: "inset(0 0% 0 0)",
            opacity: 1,
            duration: 1.4,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: introImageRef.current,
              start: "top 80%",
              once: true,
            },
          },
        );
      }
      if (introContentRef.current) {
        gsap.fromTo(
          Array.from(introContentRef.current.children),
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: introContentRef.current,
              start: "top 78%",
              once: true,
            },
          },
        );
      }
    });
    return () => ctx.revert();
  }, []);

  // Contact cards stagger
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRowRef.current.filter(Boolean);
      if (!cards.length) return;
      gsap.fromTo(
        cards,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cards[0],
            start: "top 82%",
            once: true,
          },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  // Support cards stagger
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = supportCardsRef.current.filter(Boolean);
      if (!cards.length) return;
      gsap.fromTo(
        cards,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.72,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cards[0],
            start: "top 83%",
            once: true,
          },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <main className={styles.page}>
      {/* ── PAGE BANNER ──────────────────────────────────────── */}
      <section ref={headerRef} className={styles.pageHeader}>
        <div ref={headerBgRef} className={styles.headerBg}>
          <img
            src={marketplaceContactImages.pageHeader}
            alt="Premium gym fitness"
            className={styles.headerBgImage}
            loading="eager"
          />
        </div>
        <div className={styles.headerOverlay} />
        <div className={styles.headerGlow} />

        <div className={styles.headerContent}>

          <motion.div
            className={styles.headerText}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
          >
            <motion.span
              className={styles.headerEyebrow}
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              animate={{ opacity: 1, letterSpacing: "0.4em" }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              WE'RE HERE TO HELP
            </motion.span>
            <h1 className={styles.headerTitle}>CONTACT US</h1>
            <p className={styles.headerSubtitle}>
              Have questions? Need support? Want to partner with us? We're here
              to help.
            </p>
          </motion.div>
        </div>

        <div className={styles.scrollIndicator}>
          <span className={styles.scrollLine} />
        </div>
      </section>

      {/* ── GET IN TOUCH ─────────────────────────────────────── */}
      <section className={styles.introSection}>
        <div className={styles.introContainer}>
          <div ref={introImageRef} className={styles.introImageWrapper}>
            <img
              src={marketplaceContactImages.introduction}
              alt="Fitness marketplace platform"
              className={styles.introImage}
              loading="lazy"
            />
            <div className={styles.introImageAccent} />
            <div className={styles.introImageBadge}>
              <span className={styles.badgeNumber}>500+</span>
              <span className={styles.badgeLabel}>Partner Gyms</span>
            </div>
            <div className={styles.introImageBadge2}>
              <span className={styles.badge2Number}>24h</span>
              <span className={styles.badge2Label}>Support Response</span>
            </div>
          </div>

          <div ref={introContentRef} className={styles.introContent}>
            <span className={styles.introEyebrow}>GET IN TOUCH</span>
            <h2 className={styles.introHeading}>
              Let's <span className={styles.accentText}>Connect</span>
            </h2>
            <p className={styles.introText}>
              Whether you're looking for help finding the perfect gym, have
              questions about memberships, need technical support, or want to
              partner with our platform — our team is ready to assist you every
              step of the way.
            </p>
            <p className={styles.introText}>
              We're more than a directory. Gymssy Market connects fitness seekers
              with world-class gyms, trainers, and programs across the country —
              and we take our responsibility to both members and partners
              seriously.
            </p>
            <div className={styles.pillars}>
              {[
                "Member Support",
                "Gym Partnerships",
                "Trainer Network",
                "Technical Help",
              ].map((p) => (
                <span key={p} className={styles.pillar}>
                  <FiZap className={styles.pillarIcon} />
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT INFORMATION ──────────────────────────────── */}
      <section className={styles.cardsSection}>
        <div className={styles.sectionContainer}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <span className={styles.sectionEyebrow}>REACH OUR TEAM</span>
            <h2 className={styles.sectionTitle}>
              Contact <span className={styles.accentText}>Information</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Multiple ways to get the help you need — choose what works best
              for you.
            </p>
          </motion.div>

          <div className={styles.cardsGrid}>
            {contactCards.map((card, index) => (
              <ContactCard
                key={card.id}
                card={card}
                ref={(el) => (cardsRowRef.current[index] = el)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM ─────────────────────────────────────── */}
      <section id="form" className={styles.formSection}>
        <div className={styles.formInner}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <span className={styles.sectionEyebrow}>SEND A MESSAGE</span>
            <h2 className={styles.sectionTitle}>
              How Can We <span className={styles.accentText}>Help You?</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Fill in the form below and a member of our team will respond
              within 24 hours.
            </p>
          </motion.div>

          <ContactForm />
        </div>
      </section>

      {/* ── SUPPORT CATEGORIES ───────────────────────────────── */}
      <section className={styles.supportSection}>
        <div className={styles.sectionContainer}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <span className={styles.sectionEyebrow}>HOW WE HELP</span>
            <h2 className={styles.sectionTitle}>
              Support <span className={styles.accentText}>Categories</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Find the right support channel for your specific need.
            </p>
          </motion.div>

          <div className={styles.supportGrid}>
            {supportCategories.map((cat, index) => (
              <SupportCategoryCard
                key={cat.id}
                category={cat}
                ref={(el) => (supportCardsRef.current[index] = el)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── BECOME A PARTNER ─────────────────────────────────── */}
      <PartnerCTA image={marketplaceContactImages.partnerBg} />

      {/* ── OFFICE LOCATION ──────────────────────────────────── */}
      <section id="office" className={styles.officeSection}>
        <div className={styles.sectionContainer}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <span className={styles.sectionEyebrow}>FIND US</span>
            <h2 className={styles.sectionTitle}>
              Our <span className={styles.accentText}>Office</span>
            </h2>
          </motion.div>
          <OfficeLocation />
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className={styles.faqSection}>
        <div className={styles.sectionContainer}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <span className={styles.sectionEyebrow}>QUICK ANSWERS</span>
            <h2 className={styles.sectionTitle}>
              Frequently Asked{" "}
              <span className={styles.accentText}>Questions</span>
            </h2>
          </motion.div>
          <ContactFAQ items={faqItems} />
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
