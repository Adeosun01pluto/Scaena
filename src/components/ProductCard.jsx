// // src/components/ProductCard.jsx
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import { ShoppingCart, ArrowRight } from "lucide-react";
// import { useState } from "react";
// import { useStore } from "../context/Store.jsx";

// export default function ProductCard({ item, index = 0 }) {
//   const { addToCart } = useStore();
//   const [hovered, setHovered] = useState(false);

//   const typeSlug =
//     item.kind === "supply" ||
//     item.type === "Supply" ||
//     item.type === "supply"
//       ? "supply"
//       : "art";

//   const detailPath = `/products/${typeSlug}/${item.id}`;

//   const images = Array.isArray(item.images) ? item.images : [];
//   const img =
//     item.image ||
//     item.imageUrl ||
//     (images[0] ??
//       "https://via.placeholder.com/600x600?text=No+Image");

//   const price = Number(item.price ?? 0).toFixed(2);
//   const typeLabel = typeSlug === "art" ? "Artwork" : "Supply";

//   // 🔒 match ProductDetail logic: sold or out of stock = cannot buy
//   const availability = (item.availability || "").toLowerCase();
//   const isSold = availability === "sold";
//   const isOutOfStock = item.inStock === false;
//   const canBuy = !isSold && !isOutOfStock;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 30 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true, margin: "-50px" }}
//       transition={{ duration: 0.5, delay: index * 0.08 }}
//       className="group cursor-pointer"
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//     >
//       <Link to={detailPath} className="block">
//         <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-neutral-100 rounded-lg">
//           <motion.img
//             animate={{ scale: hovered ? 1.07 : 1 }}
//             transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
//             src={img}
//             alt={item.name}
//             className="h-full w-full object-cover"
//           />

//           {/* Dark gradient overlay on hover (desktop) */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: hovered ? 1 : 0 }}
//             transition={{ duration: 0.3 }}
//             className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
//           />

//           {/* Type badge */}
//           <div className="absolute top-3 left-3">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.85 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: index * 0.08 + 0.15 }}
//               className="bg-black/70 backdrop-blur-sm px-2.5 py-0.5 text-[9px] uppercase tracking-[0.18em] text-white rounded"
//             >
//               {typeLabel}
//             </motion.div>
//           </div>

//           {/* Availability badge on image (optional but nice) */}
//           {(isSold || isOutOfStock) && (
//             <div className="absolute top-3 right-3">
//               <span className="rounded-full bg-red-600/80 px-2 py-0.5 text-[10px] font-medium text-white uppercase tracking-wide">
//                 {isSold ? "Sold" : "Out of stock"}
//               </span>
//             </div>
//           )}

//           {/* Quick Add to Cart button (only if can buy) */}
//           {canBuy && (
//             <motion.button
//               type="button"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{
//                 opacity: hovered ? 1 : 0,
//                 y: hovered ? 0 : 20,
//               }}
//               transition={{ duration: 0.25 }}
//               className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 rounded-md bg-white px-3 py-2 text-[11px] font-medium tracking-wide text-neutral-900 hover:bg-neutral-900 hover:text-white"
//               onClick={(e) => {
//                 e.preventDefault();
//                 e.stopPropagation();
//                 if (!canBuy) return; // extra safety
//                 addToCart(item);
//               }}
//             >
//               <ShoppingCart size={14} />
//               <span>Add to cart</span>
//             </motion.button>
//           )}
//         </div>
//       </Link>

//       {/* Text content */}
//       <motion.div
//         className="mt-3 space-y-1"
//         animate={{ y: hovered ? -3 : 0 }}
//         transition={{ duration: 0.25 }}
//       >
//         <Link to={detailPath} className="block">
//           <h3 className="text-sm sm:text-base font-normal text-neutral-900 tracking-wide line-clamp-2">
//             {item.name || "Untitled"}
//           </h3>
//           <p className="text-[10px] sm:text-xs text-neutral-500 tracking-[0.16em] uppercase">
//             {item.category || item.collectionId || item.type || ""}
//           </p>
//         </Link>

//         <div className="flex items-center justify-between pt-1">
//           <p className="text-sm sm:text-lg font-light text-neutral-900">
//             ${price}{" "}
//             <span className="text-[10px] sm:text-xs text-neutral-500">
//               USD
//             </span>
//           </p>
//           <motion.div
//             animate={{ x: hovered ? 4 : 0 }}
//             transition={{ duration: 0.25 }}
//           >
//             <ArrowRight size={16} className="text-neutral-400" />
//           </motion.div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }
















































import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useStore } from "../context/Store.jsx";

export default function ProductCard({ item, index = 0 }) {
  const { addToCart } = useStore();
  const [hovered, setHovered] = useState(false);

  const typeSlug =
    item.kind === "supply" ||
    item.type === "Supply" ||
    item.type === "supply"
      ? "supply"
      : "art";

  const detailPath = `/products/${typeSlug}/${item.id}`;

  const images = Array.isArray(item.images) ? item.images : [];
  const img =
    item.image ||
    item.imageUrl ||
    (images[0] ??
      "https://via.placeholder.com/600x600?text=No+Image");

  const price = Number(item.price ?? 0).toFixed(2);
  const typeLabel = typeSlug === "art" ? "Artwork" : "Supply";

  // Availability logic
  const availability = (item.availability || "").toLowerCase();
  const isSold = availability === "sold";
  const isOnHold = availability === "on hold";
  const isOutOfStock = item.inStock === false;

  const canBuy = !(isSold || isOnHold || isOutOfStock);

  const unavailableLabel = isSold
    ? "Sold out"
    : isOutOfStock
    ? "Out of stock"
    : isOnHold
    ? "On hold"
    : "Unavailable";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={detailPath} className="block">
        <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-neutral-100 rounded-lg">
          <motion.img
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            src={img}
            alt={item.name}
            className="h-full w-full object-cover"
          />

          {/* Dark gradient overlay on hover (desktop) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
          />

          {/* Type badge (left) */}
          <div className="absolute top-3 left-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08 + 0.15 }}
              className="bg-black/70 backdrop-blur-sm px-2.5 py-0.5 text-[9px] uppercase tracking-[0.18em] text-white rounded"
            >
              {typeLabel}
            </motion.div>
          </div>

          {/* Availability badge (right) */}
          {item.availability && (
            <div className="absolute top-3 right-3">
              <span
                className={
                  "rounded-full px-2 py-0.5 text-[10px] font-medium " +
                  (isSold || isOutOfStock
                    ? "bg-red-100 text-red-800"
                    : isOnHold
                    ? "bg-amber-100 text-amber-800"
                    : "bg-emerald-100 text-emerald-800")
                }
              >
                {item.availability}
              </span>
            </div>
          )}

          {/* Quick Add to Cart button (desktop hover) */}
          {canBuy ? (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: hovered ? 1 : 0,
                y: hovered ? 0 : 20,
              }}
              transition={{ duration: 0.25 }}
              className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 rounded-md bg-white px-3 py-2 text-[11px] font-medium tracking-wide text-neutral-900 hover:bg-neutral-900 hover:text-white"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(item);
              }}
            >
              <ShoppingCart size={14} />
              <span>Add to cart</span>
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: hovered ? 1 : 0,
                y: hovered ? 0 : 20,
              }}
              transition={{ duration: 0.25 }}
              className="absolute bottom-3 left-3 right-3 flex items-center justify-center rounded-md bg-black/80 px-3 py-2 text-[11px] font-medium tracking-wide text-white"
            >
              {unavailableLabel}
            </motion.div>
          )}
        </div>
      </Link>

      {/* Text content */}
      <motion.div
        className="mt-3 space-y-1"
        animate={{ y: hovered ? -3 : 0 }}
        transition={{ duration: 0.25 }}
      >
        <Link to={detailPath} className="block">
          <h3 className="text-sm sm:text-base font-normal text-neutral-900 tracking-wide line-clamp-2">
            {item.name || "Untitled"}
          </h3>
          <p className="text-[10px] sm:text-xs text-neutral-500 tracking-[0.16em] uppercase">
            {item.category || item.collectionId || item.type || ""}
          </p>
        </Link>

        <div className="flex items-center justify-between pt-1">
          <p className="text-sm sm:text-lg font-light text-neutral-900">
            ${price}{" "}
            <span className="text-[10px] sm:text-xs text-neutral-500">
              USD
            </span>
          </p>
          <motion.div
            animate={{ x: hovered ? 4 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <ArrowRight size={16} className="text-neutral-400" />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
