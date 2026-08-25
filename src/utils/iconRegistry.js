// src/utils/iconRegistry.js

/**
 * iconRegistry.js
 *
 * Maps Lucide icon name strings (as sent by the backend) → Lucide React components.
 *
 * Backend sends PascalCase names that match Lucide's export names exactly:
 *   "Dumbbell"      → Dumbbell
 *   "HeartPulse"    → HeartPulse
 *   "Trophy"        → Trophy
 *   etc.
 *
 * HOW TO ADD MORE:
 *   1. Find the icon at https://lucide.dev/icons/
 *   2. Import it below
 *   3. Add it to ICON_REGISTRY with its exact PascalCase name as the key
 */

import {
  /* ── Fitness ── */
  Dumbbell,
  Flame,
  Zap,
  Target,
  HeartPulse,
  PersonStanding,
  Timer,
  Bike,
  Weight,
  Footprints,

  /* ── Wellness ── */
  Flower2,
  Leaf,
  Sparkles,
  Salad,
  House,
  Wind,
  Moon,
  Sun,
  Brain,
  HandHeart,
  Droplets,

  /* ── Sports ── */
  Trophy,
  Waves,
  Swords,
  CircleDot,
  Volleyball,
  Medal,
  Flag,
  Timer as Stopwatch,
  Mountain,
  Bike as Bicycle,

  /* ── People / Coaching ── */
  UserRound,
  Users,
  User,
  GraduationCap,
  Star,

  /* ── Movement ── */
  Move,
  ArrowRight,
  Activity,
  TrendingUp,
  RotateCcw,
  Repeat,

  /* ── General UI ── */
  Grid,
  LayoutGrid,
  MapPin,
  Clock,
  Calendar,
  Search,
  Shield,
  Award,
  Heart,
  Smile,
  ChevronRight,
} from "lucide-react";

import {
  FaDumbbell,
  FaRunning,
  FaUsers,
  FaUserTie,
  FaShower,
  FaLock,
  FaCar,
  FaWifi,
  FaSnowflake,
  FaTint,
  FaAppleAlt,
  FaHeartbeat,
  FaClock,
  FaFire,
  FaGlobe,
} from "react-icons/fa";

/* ══════════════════════════════════════════════════════
   REGISTRY
   Key   → exactly what the backend sends in the `icon` field
   Value → Lucide React component reference
══════════════════════════════════════════════════════ */
const ICON_REGISTRY = {
  /* ── Fitness ── */
  Dumbbell,
  Flame,
  Zap,
  Target,
  HeartPulse,
  PersonStanding,
  Timer,
  Bike,
  Weight,
  Footprints,

  /* ── Wellness ── */
  Flower2,
  Leaf,
  Sparkles,
  Salad,
  House,
  Wind,
  Moon,
  Sun,
  Brain,
  HandHeart,
  Droplets,

  /* ── Sports ── */
  Trophy,
  Waves,
  Swords,
  CircleDot,
  Volleyball,
  Medal,
  Flag,
  Mountain,
  Bicycle,

  /* ── People / Coaching ── */
  UserRound,
  Users,
  User,
  GraduationCap,
  Star,

  /* ── Movement ── */
  Move,
  ArrowRight,
  Activity,
  TrendingUp,
  RotateCcw,
  Repeat,

  /* ── General UI ── */
  Grid,
  LayoutGrid,
  MapPin,
  Clock,
  Calendar,
  Search,
  Shield,
  Award,
  Heart,
  Smile,
  ChevronRight,

  /* ── Facility icons (react-icons/fa — backend uses these names) ── */
  FaDumbbell,
  FaRunning,
  FaUsers,
  FaUserTie,
  FaShower,
  FaLock,
  FaCar,
  FaWifi,
  FaSnowflake,
  FaTint,
  FaAppleAlt,
  FaHeartbeat,
  FaClock,
  FaFire,
  FaGlobe,
};

export default ICON_REGISTRY;
