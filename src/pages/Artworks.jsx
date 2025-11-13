import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { db } from "../lib/firebase.js";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import ProductCard from "../components/ProductCard.jsx";
import { useStore } from "../context/Store.jsx";

export default function Artworks() {
  const [artworks, setArtworks] = useState([]);
  const [availability, setAvailability] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("best-selling");
  const [loading, setLoading] = useState(true);

  // 👇 pull search + setter from global store
  const { state, setSearch } = useStore();
  const searchTerm = state.search?.trim().toLowerCase();

  // 🔥 Live Firestore subscription for artworks
  useEffect(() => {
    const q = query(collection(db, "artworks"), orderBy("name"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((docSnap) => {
          const raw = docSnap.data() || {};

          // Ensure we keep the full images array
          const images = Array.isArray(raw.images) ? raw.images : [];

          // Prefer existing image/imageUrl, fall back to first images[] entry
          const primaryImage =
            raw.image ||
            raw.imageUrl ||
            (images.length > 0 ? images[0] : undefined);

          return {
            id: docSnap.id,
            kind: "art", // help downstream routing
            ...raw,
            images, // keep the array
            image: primaryImage, // make sure ProductCard has something to use
          };
        });

        setArtworks(data);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = [...artworks];

    // Availability filter
    if (availability === "available") {
      result = result.filter(
        (item) =>
          !item.availability || item.availability === "Available for Sale"
      );
    } else if (availability === "sold") {
      result = result.filter((item) => item.availability === "Sold");
    } else if (availability === "not-for-sale") {
      result = result.filter((item) => item.availability === "Not for Sale");
    }

    // Price filter
    if (priceFilter === "under-500") {
      result = result.filter((item) => Number(item.price) < 500);
    } else if (priceFilter === "500-and-up") {
      result = result.filter((item) => Number(item.price) >= 500);
    }

    // 🔍 Global search filter
    if (searchTerm) {
      result = result.filter((item) => {
        const haystack = [
          item.name,
          item.category,
          item.collectionId,
          item.description,
          item.subject,
          Array.isArray(item.tags) ? item.tags.join(" ") : "",
          Array.isArray(item.styles) ? item.styles.join(" ") : "",
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(searchTerm);
      });
    }

    // Sorting
    if (sortBy === "price-low-high") {
      result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortBy === "price-high-low") {
      result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (sortBy === "alphabetical") {
      result.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "", undefined, {
          sensitivity: "base",
        })
      );
    } else if (sortBy === "newest") {
      result.sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
    }

    return result;
  }, [artworks, availability, priceFilter, sortBy, searchTerm]);

  return (
    <div className="min-h-screen bg-neutral-600">
      {/* Hero Section */}
      <section className="bg-neutral-600 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-light tracking-wide text-white">
              Artworks
            </h1>
            <p className="mt-4 max-w-3xl text-sm font-light leading-relaxed text-white/80">
              Original works, limited editions, and collector pieces from the
              Scaena catalog. Filter by availability, price, and more to find
              the right piece.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 🔍 Page search bar */}
      <section className="bg-neutral-600 pb-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search artworks by name, style, subject..."
              value={state.search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-neutral-500 bg-neutral-700 px-3 py-2 text-sm text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-white/60"
            />
          </div>
        </div>
      </section>

      {/* Filter + Sort Bar */}
      <section className="border-b border-neutral-500 bg-neutral-600 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-white/70">Filter:</span>

              {/* Availability */}
              <div className="relative">
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="appearance-none rounded-sm border border-neutral-500 bg-neutral-700 px-3 py-1.5 pr-8 text-sm text-white focus:border-neutral-400 focus:outline-none"
                >
                  <option value="all">Availability</option>
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                  <option value="not-for-sale">Not for Sale</option>
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white/70"
                />
              </div>

              {/* Price */}
              <div className="relative">
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="appearance-none rounded-sm border border-neutral-500 bg-neutral-700 px-3 py-1.5 pr-8 text-sm text-white focus:border-neutral-400 focus:outline-none"
                >
                  <option value="all">Price</option>
                  <option value="under-500">Under $500</option>
                  <option value="500-and-up">$500 and Up</option>
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white/70"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/70">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none rounded-sm border border-neutral-500 bg-neutral-700 px-3 py-1.5 pr-8 text-sm text-white focus:border-neutral-400 focus:outline-none"
                >
                  <option value="best-selling">Best Selling</option>
                  <option value="newest">Newest</option>
                  <option value="price-low-high">Price: Low → High</option>
                  <option value="price-high-low">Price: High → Low</option>
                  <option value="alphabetical">Alphabetical (A–Z)</option>
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white/70"
                />
              </div>
              <span className="text-sm text-white/60">
                {filteredAndSorted.length} artworks
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <p className="text-center text-white/70 py-12">
              Loading artworks...
            </p>
          ) : filteredAndSorted.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {filteredAndSorted.map((item, index) => (
                <ProductCard key={item.id} item={item} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-lg bg-neutral-700 p-12 text-center"
            >
              <p className="text-white/70">
                No artworks match your filters. Try adjusting your selection or search.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
