// import { useEffect, useState, useMemo } from "react";
// import { motion } from "framer-motion";
// import { ChevronDown } from "lucide-react";
// import { db } from "../lib/firebase";
// import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
// import { useStore } from "../context/Store.jsx";

// function ProductCard({ item, index }) {
//   const src =
//     item.image ||
//     item.imageUrl ||
//     (Array.isArray(item.images) && item.images.length > 0
//       ? item.images[0]
//       : "https://via.placeholder.com/400x400?text=No+Image");

//   const price = Number(item.price ?? 0).toFixed(2);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5, delay: index * 0.1 }}
//       className="group flex flex-col"
//     >
//       <div className="relative aspect-square overflow-hidden bg-white">
//         <motion.img
//           whileHover={{ scale: 1.05 }}
//           transition={{ duration: 0.4 }}
//           src={src}
//           alt={item.name}
//           className="h-full w-full object-cover"
//         />
//       </div>

//       <div className="mt-3 flex-1">
//         <h3 className="text-sm font-normal leading-snug text-neutral-900">
//           {item.name || "Untitled Product"}
//         </h3>
//         <p className="mt-2 text-sm text-neutral-600">
//           ${price} USD
//         </p>
//       </div>
//     </motion.div>
//   );
// }

// export default function Supplies() {
//   const [supplies, setSupplies] = useState([]);
//   const [availability, setAvailability] = useState("all");
//   const [priceFilter, setPriceFilter] = useState("all");
//   const [sortBy, setSortBy] = useState("best-selling");
//   const [loading, setLoading] = useState(true);
//     const { state } = useStore();
//   const searchTerm = state.search?.trim().toLowerCase();
//   // 🔥 Fetch supplies from Firestore in real time
//   useEffect(() => {
//     const q = query(collection(db, "supplies"), orderBy("name"));
//     const unsub = onSnapshot(
//       q,
//       (snap) => {
//         const data = snap.docs.map((docSnap) => {
//           const raw = docSnap.data() || {};

//           // keep the full images array if present
//           const images = Array.isArray(raw.images) ? raw.images : [];

//           // choose a primary image
//           const primaryImage =
//             raw.image ||
//             raw.imageUrl ||
//             (images.length > 0 ? images[0] : undefined);

//           return {
//             id: docSnap.id,
//             kind: "supply",
//             ...raw,
//             images,          // full array
//             image: primaryImage, // what the card will use
//           };
//         });
//         setSupplies(data);
//         setLoading(false);
//       },
//       () => setLoading(false)
//     );
//     return unsub;
//   }, []);

//   const filteredAndSorted = useMemo(() => {
//     let result = [...supplies];

//     // Availability
//     if (availability === "in-stock") {
//       result = result.filter((item) => item.inStock);
//     } else if (availability === "out-of-stock") {
//       result = result.filter((item) => !item.inStock);
//     }

//     // Price
//     if (priceFilter === "under-10") {
//       result = result.filter((item) => Number(item.price) < 10);
//     } else if (priceFilter === "10-and-up") {
//       result = result.filter((item) => Number(item.price) >= 10);
//     }

//     // 🔍 Global search
//     if (searchTerm) {
//       result = result.filter((item) => {
//         const haystack = [
//           item.name,
//           item.category,
//           item.collectionId,
//           item.description,
//           item.type,
//         ]
//           .filter(Boolean)
//           .join(" ")
//           .toLowerCase();

//         return haystack.includes(searchTerm);
//       });
//     }

//     // Sort
//     if (sortBy === "price-low-high") {
//       result.sort((a, b) => Number(a.price) - Number(b.price));
//     } else if (sortBy === "price-high-low") {
//       result.sort((a, b) => Number(b.price) - Number(a.price));
//     } else if (sortBy === "alphabetical") {
//       result.sort((a, b) =>
//         (a.name || "").localeCompare(b.name || "", undefined, {
//           sensitivity: "base",
//         })
//       );
//     }

//     return result;
//   }, [availability, priceFilter, sortBy, supplies, searchTerm]);

//   return (
//     <div className="min-h-screen bg-neutral-600">
//       {/* Hero Section */}
//       <section className="bg-neutral-600 py-12">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//           >
//             <h1 className="text-4xl font-light tracking-wide text-white">
//               Supplies
//             </h1>
//             <p className="mt-4 max-w-3xl text-sm font-light leading-relaxed text-white/80">
//               A curated selection of everyday essentials to fuel creativity.
//               Whether sketching, painting, or experimenting, these tools provide
//               quality and versatility for artists at any level.
//             </p>
//           </motion.div>
//         </div>
//       </section>

//       {/* Filter + Sort */}
//       <section className="border-b border-neutral-500 bg-neutral-600 py-4">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
//             {/* Filters */}
//             <div className="flex flex-wrap items-center gap-3">
//               <span className="text-sm text-white/70">Filter:</span>

//               {/* Availability */}
//               <div className="relative">
//                 <select
//                   value={availability}
//                   onChange={(e) => setAvailability(e.target.value)}
//                   className="appearance-none rounded-sm border border-neutral-500 bg-neutral-700 px-3 py-1.5 pr-8 text-sm text-white focus:border-neutral-400 focus:outline-none"
//                 >
//                   <option value="all">Availability</option>
//                   <option value="in-stock">In Stock</option>
//                   <option value="out-of-stock">Out of Stock</option>
//                 </select>
//                 <ChevronDown
//                   size={14}
//                   className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white/70"
//                 />
//               </div>

//               {/* Price */}
//               <div className="relative">
//                 <select
//                   value={priceFilter}
//                   onChange={(e) => setPriceFilter(e.target.value)}
//                   className="appearance-none rounded-sm border border-neutral-500 bg-neutral-700 px-3 py-1.5 pr-8 text-sm text-white focus:border-neutral-400 focus:outline-none"
//                 >
//                   <option value="all">Price</option>
//                   <option value="under-10">Under $10</option>
//                   <option value="10-and-up">$10 and Up</option>
//                 </select>
//                 <ChevronDown
//                   size={14}
//                   className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white/70"
//                 />
//               </div>
//             </div>

//             {/* Sort */}
//             <div className="flex items-center gap-3">
//               <span className="text-sm text-white/70">Sort by:</span>
//               <div className="relative">
//                 <select
//                   value={sortBy}
//                   onChange={(e) => setSortBy(e.target.value)}
//                   className="appearance-none rounded-sm border border-neutral-500 bg-neutral-700 px-3 py-1.5 pr-8 text-sm text-white focus:border-neutral-400 focus:outline-none"
//                 >
//                   <option value="best-selling">Best Selling</option>
//                   <option value="price-low-high">Price: Low → High</option>
//                   <option value="price-high-low">Price: High → Low</option>
//                   <option value="alphabetical">Alphabetical (A–Z)</option>
//                 </select>
//                 <ChevronDown
//                   size={14}
//                   className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white/70"
//                 />
//               </div>
//               <span className="text-sm text-white/60">
//                 {filteredAndSorted.length} products
//               </span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Products Grid */}
//       <section className="py-12">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//           {loading ? (
//             <p className="text-center text-white/70 py-12">
//               Loading supplies...
//             </p>
//           ) : filteredAndSorted.length > 0 ? (
//             <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
//               {filteredAndSorted.map((item, index) => (
//                 <ProductCard key={item.id} item={item} index={index} />
//               ))}
//             </div>
//           ) : (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="rounded-lg bg-neutral-700 p-12 text-center"
//             >
//               <p className="text-white/70">
//                 No products match your filters. Try adjusting your selection.
//               </p>
//             </motion.div>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// }


















import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { db } from "../lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useStore } from "../context/Store.jsx";

function ProductCard({ item, index }) {
  const src =
    item.image ||
    item.imageUrl ||
    (Array.isArray(item.images) && item.images.length > 0
      ? item.images[0]
      : "https://via.placeholder.com/400x400?text=No+Image");

  const price = Number(item.price ?? 0).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group flex flex-col"
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          src={src}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="mt-3 flex-1">
        <h3 className="text-sm font-normal leading-snug text-neutral-900">
          {item.name || "Untitled Product"}
        </h3>
        <p className="mt-2 text-sm text-neutral-600">
          ${price} USD
        </p>
      </div>
    </motion.div>
  );
}

export default function Supplies() {
  const [supplies, setSupplies] = useState([]);
  const [availability, setAvailability] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("best-selling");
  const [loading, setLoading] = useState(true);

  // 👇 pull global search + setter
  const { state, setSearch } = useStore();
  const searchTerm = state.search?.trim().toLowerCase();

  // 🔥 Fetch supplies from Firestore in real time
  useEffect(() => {
    const q = query(collection(db, "supplies"), orderBy("name"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((docSnap) => {
          const raw = docSnap.data() || {};

          const images = Array.isArray(raw.images) ? raw.images : [];

          const primaryImage =
            raw.image ||
            raw.imageUrl ||
            (images.length > 0 ? images[0] : undefined);

          return {
            id: docSnap.id,
            kind: "supply",
            ...raw,
            images,
            image: primaryImage,
          };
        });
        setSupplies(data);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = [...supplies];

    // Availability
    if (availability === "in-stock") {
      result = result.filter((item) => item.inStock);
    } else if (availability === "out-of-stock") {
      result = result.filter((item) => !item.inStock);
    }

    // Price
    if (priceFilter === "under-10") {
      result = result.filter((item) => Number(item.price) < 10);
    } else if (priceFilter === "10-and-up") {
      result = result.filter((item) => Number(item.price) >= 10);
    }

    // 🔍 Global search
    if (searchTerm) {
      result = result.filter((item) => {
        const haystack = [
          item.name,
          item.category,
          item.collectionId,
          item.description,
          item.type,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(searchTerm);
      });
    }

    // Sort
    if (sortBy === "price-low-high") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-high-low") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "alphabetical") {
      result.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "", undefined, {
          sensitivity: "base",
        })
      );
    }

    return result;
  }, [availability, priceFilter, sortBy, supplies, searchTerm]);

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
              Supplies
            </h1>
            <p className="mt-4 max-w-3xl text-sm font-light leading-relaxed text-white/80">
              A curated selection of everyday essentials to fuel creativity.
              Whether sketching, painting, or experimenting, these tools provide
              quality and versatility for artists at any level.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 🔍 Page Search Bar */}
      <section className="bg-neutral-600 pb-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search supplies by name, category, description..."
              value={state.search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-neutral-500 bg-neutral-700 px-3 py-2 text-sm text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-white/60"
            />
          </div>
        </div>
      </section>

      {/* Filter + Sort */}
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
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
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
                  <option value="under-10">Under $10</option>
                  <option value="10-and-up">$10 and Up</option>
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
                {filteredAndSorted.length} products
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <p className="text-center text-white/70 py-12">
              Loading supplies...
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
                No products match your filters or search. Try adjusting your selection.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
