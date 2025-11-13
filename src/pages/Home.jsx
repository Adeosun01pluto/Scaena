// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import HeroSection from "../components/HeroSection";
import ProductCard from "../components/ProductCard";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Contact from "./Contact";
import About from "./About";

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const artsSnap = await getDocs(collection(db, "artworks"));
        const suppliesSnap = await getDocs(collection(db, "supplies"));

        const arts = artsSnap.docs.map((d) => {
          const raw = d.data() || {};
          const images = Array.isArray(raw.images) ? raw.images : [];
          const primaryImage =
            raw.image || raw.imageUrl || (images[0] ?? undefined);

          return {
            id: d.id,
            kind: "art",
            ...raw,
            images,
            image: primaryImage,
          };
        });

        const supplies = suppliesSnap.docs.map((d) => {
          const raw = d.data() || {};
          const images = Array.isArray(raw.images) ? raw.images : [];
          const primaryImage =
            raw.image || raw.imageUrl || (images[0] ?? undefined);

          return {
            id: d.id,
            kind: "supply",
            ...raw,
            images,
            image: primaryImage,
          };
        });

        const all = [...arts, ...supplies];

        const groups = {};
        for (const item of all) {
          const key = item.category || item.type || item.kind || "Other";
          if (!groups[key]) groups[key] = [];
          groups[key].push(item);
        }

        const shuffledKeys = Object.keys(groups).sort(() => 0.5 - Math.random());
        const picks = shuffledKeys.slice(0, 4).map((k) => {
          const arr = groups[k];
          return arr[Math.floor(Math.random() * arr.length)];
        });

        setFeatured(picks.filter(Boolean));
      } catch (err) {
        console.error("❌ Failed to load products", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Hero 1 – split images with richer animation */}
        <HeroSection
          image={[
            "https://scaenastudio.com/cdn/shop/files/IMG_3585.jpg?v=1756883814&width=1100",
            "https://scaenastudio.com/cdn/shop/files/IMG_3584.jpg?v=1756883129&width=1100",
          ]}
          title="Future Collections"
          subtitle="An invitation to what is taking shape beyond the canvas."
          buttonText="Discover What's Next"
          buttonTo="/collections" // route to collections
          pillLabel="Featured Collection"
          delay={0}
        />

        {/* Featured Section – About-style section header + subtle background */}
        <section className="relative bg-white py-24 overflow-hidden">
          {/* Soft dot pattern background */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-16 text-center"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, type: "spring" }}
                className="inline-flex items-center gap-2 mb-4 text-neutral-400"
              >
                <span className="h-px w-12 bg-neutral-300" />
                <Sparkles size={16} />
                <span className="h-px w-12 bg-neutral-300" />
              </motion.div>

              <h2 className="text-4xl md:text-6xl font-light tracking-tight text-neutral-900 mb-4">
                Curated Selection
              </h2>
              <p className="text-lg md:text-xl font-light text-neutral-600 max-w-3xl mx-auto leading-relaxed">
                Our unique creations blend tradition with modernity for the
                discerning connoisseur.
              </p>
            </motion.div>

            {/* Products grid */}
            {featured.length > 0 ? (
              <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
                {featured.map((item, index) => (
                  <ProductCard key={item.id} item={item} index={index} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-neutral-900" />
                <p className="mt-4 text-neutral-600">
                  Loading featured artworks...
                </p>
              </motion.div>
            )}
          </div>
        </section>

        {/* Hero 2 – single-image hero with same styling */}
        <HeroSection
          image="https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=1600&h=900&fit=crop"
          title="Artistic Innovation"
          subtitle="Explore premium tools crafted for visionaries."
          buttonText="EXPLORE"
          buttonTo="/supplies" // route to supplies
          delay={0.15}
        />

        {/* About Section */}
        <About />

        {/* Contact Section */}
        <Contact />
      </main>
    </div>
  );
}
