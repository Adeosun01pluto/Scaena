import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const announcements = [
  "EXPLORE CURRENT COLLECTION →",
  "FREE SHIPPING OVER $100",
  "NEW: PULCHRAE SERIES DROPS SOON",
  "JOIN OUR NEWSLETTER FOR EXCLUSIVE OFFERS",
  "SIGN UP FOR 10% OFF YOUR FIRST PURCHASE"
];

export default function AnnouncementBar() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % announcements.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="sticky top-0 z-50 h-10 w-full overflow-hidden bg-neutral-800 text-white">
      <Link to={"/supplies"} className="relative flex h-full items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ x: 40, opacity: 0 }}   // enter from right
            animate={{ x: 0, opacity: 1 }}   // center
            exit={{ x: -40, opacity: 0 }}    // leave to left
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute text-sm md:text-md hover:underline tracking-wider"
          >
            {announcements[current]}
          </motion.div>
        </AnimatePresence>
      </Link>

      <button
        onClick={() =>
          setCurrent((prev) => (prev - 1 + announcements.length) % announcements.length)
        }
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={() =>
          setCurrent((prev) => (prev + 1) % announcements.length)
        }
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
