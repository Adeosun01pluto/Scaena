// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { ArrowRight } from "lucide-react";
// import { Link } from "react-router-dom";
// import { db } from "../lib/firebase";
// import { collection, onSnapshot } from "firebase/firestore";

// // Card Component
// function CollectionCard({ collection, index }) {
//   const isLarge = !collection.description; // large layout if has description
//   console.log(collection)
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6, delay: index * 0.1 }}
//       className={`group relative overflow-hidden ${isLarge ? "row-span-2" : ""}`}
//     >
//       {isLarge ? (
//         // Large text card (like Pulchrae)
//         <Link to={`/collections/${collection.id}`} className="block h-full">
//           <div className="flex h-full flex-col justify-end bg-neutral-600 p-8 text-white">
//             <h3 className="mb-4 text-2xl font-light tracking-wide">
//               {collection.name}
//             </h3>
//             <p className="mb-4 text-sm font-light leading-relaxed text-white/80">
//               {collection.description}
//             </p>
//             <span className="inline-flex items-center text-sm font-light tracking-wide transition hover:text-white/80">
//               <ArrowRight size={20} />
//             </span>
//           </div>
//         </Link>
//       ) : (
//         // Image card
//         <Link to={`/collections/${collection.id}`} className="block">
//           <div className="relative aspect-square overflow-hidden bg-neutral-200">
//             <motion.img
//               whileHover={{ scale: 1.05 }}
//               transition={{ duration: 0.4 }}
//               src={collection.image || "https://via.placeholder.com/600x600?text=No+Image"}
//               alt={collection.name}
//               className="h-full w-full object-cover"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
//             <div className="absolute bottom-0 left-0 right-0 p-6">
//               <h3 className="flex items-center text-xl font-light tracking-wide text-white">
//                 {collection.name}
//                 <ArrowRight
//                   size={20}
//                   className="ml-2 transition-transform group-hover:translate-x-1"
//                 />
//               </h3>
//             </div>
//           </div>
//         </Link>
//       )}
//     </motion.div>
//   );
// }

// export default function Collections() {
//   const [collections, setCollections] = useState([]);

//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "categories"), (snap) => {
//       const list = snap.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setCollections(list);
//     });
//     return unsub;
//   }, []);

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Hero Section */}
//       <section className="bg-neutral-600 py-8">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//           <motion.h1
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="text-4xl font-light tracking-wide text-white md:text-5xl"
//           >
//             Collections
//           </motion.h1>
//         </div>
//       </section>

//       {/* Collections Grid */}
//       <section className="py-12">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//           {collections.length === 0 ? (
//             <p className="text-center text-stone-500">Loading collections...</p>
//           ) : (
//             <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//               {collections.map((col, i) => (
//                 <CollectionCard key={col.id} collection={col} index={i} />
//               ))}
//             </div>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// }

















































import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { db } from "../lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

// Card Component
function CollectionCard({ collection, index }) {
  const isLarge = !collection.description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`group relative overflow-hidden ${isLarge ? "row-span-2" : ""}`}
    >
      {isLarge ? (
        <Link to={`/collections/${collection.id}`} className="block h-full">
          <div className="flex h-full flex-col justify-end bg-neutral-600 p-8 text-white">
            <h3 className="mb-4 text-2xl font-light tracking-wide">
              {collection.name}
            </h3>
            <p className="mb-4 text-sm font-light leading-relaxed text-white/80">
              {collection.description}
            </p>
            <ArrowRight size={20} />
          </div>
        </Link>
      ) : (
        <Link to={`/collections/${collection.id}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-neutral-200">
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
              src={
                collection.image ||
                "https://via.placeholder.com/600x600?text=No+Image"
              }
              alt={collection.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="flex items-center text-xl font-light tracking-wide text-white">
                {collection.name}
                <ArrowRight
                  size={20}
                  className="ml-2 transition-transform group-hover:translate-x-1"
                />
              </h3>
            </div>
          </div>
        </Link>
      )}
    </motion.div>
  );
}

export default function Collections() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true); // ← NEW
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false); // ← NEW

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "categories"),
      (snap) => {
        const list = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCollections(list);
        setLoading(false);
        setHasLoadedOnce(true);
      },
      (error) => {
        console.error("Firestore error:", error);
        setLoading(false);
        setHasLoadedOnce(true);
      }
    );

    return unsub;
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-neutral-600 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-light tracking-wide text-white md:text-5xl"
          >
            Collections
          </motion.h1>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* ⏳ LOADING */}
          {loading && (
          // 🔄 Loading state
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-neutral-900" />
                <p className="mt-4 text-neutral-600">
                  Loading Collection ...
                </p>
              </motion.div>
          )}

          {/* 🚫 EMPTY — No Data */}
          {!loading && hasLoadedOnce && collections.length === 0 && (
            <p className="text-center text-stone-500">
              No collections available yet.
            </p>
          )}

          {/* ✅ DATA */}
          {!loading && collections.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {collections.map((col, i) => (
                <CollectionCard key={col.id} collection={col} index={i} />
              ))}
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
