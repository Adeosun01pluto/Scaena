// import { useEffect, useState, useMemo } from "react";
// import { useParams, Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { db } from "../lib/firebase";
// import { doc, getDoc } from "firebase/firestore";
// import { useStore } from "../context/Store.jsx";

// // small helpers
// const money = (n, c = "USD") =>
//   `${c} ${Number(n ?? 0).toFixed(2)}`;

// const fmtDims = (d) =>
//   d?.h && d?.w
//     ? `${d.h} × ${d.w}${d?.d ? ` × ${d.d}` : ""} ${d?.unit || ""}`
//     : null;

// export default function ProductDetail() {
//   const { type = "art", id } = useParams(); // /products/:type/:id
//   const [item, setItem] = useState(null);
//   const [notFound, setNotFound] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const { addToCart } = useStore();

//   useEffect(() => {
//     let active = true;
//     (async () => {
//       try {
//         setLoading(true);
//         const col = type === "supply" ? "supplies" : "artworks";
//         const ref = doc(db, col, id);
//         const snap = await getDoc(ref);
//         if (!active) return;
//         if (snap.exists()) {
//           setItem({
//             id: snap.id,
//             type: type === "supply" ? "Supply" : "Art",
//             ...snap.data(),
//           });
//         } else setNotFound(true);
//       } catch {
//         setNotFound(true);
//       } finally {
//         if (active) setLoading(false);
//       }
//     })();
//     return () => {
//       active = false;
//     };
//   }, [type, id]);

//   const canBuy = useMemo(() => {
//     if (!item) return false;
//     const sold = (item.availability || "").toLowerCase() === "sold";
//     const oos = item.inStock === false;
//     return !sold && !oos;
//   }, [item]);
//   console.log(item)
//   if (notFound) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <p className="rounded-lg bg-neutral-100 p-4 text-sm text-neutral-600">
//           Product not found.
//         </p>
//       </div>
//     );
//   }

//   if (loading || !item) {
//     return (
//       <div className="min-h-screen bg-white">
//         <section className="py-10">
//           <div className="mx-auto max-w-6xl px-4 grid gap-8 md:grid-cols-2">
//             <div className="h-[520px] rounded-xl bg-neutral-100 animate-pulse" />
//             <div className="space-y-3">
//               <div className="h-8 w-2/3 rounded bg-neutral-100 animate-pulse" />
//               <div className="h-4 w-1/3 rounded bg-neutral-100 animate-pulse" />
//               <div className="h-7 w-40 rounded bg-neutral-100 animate-pulse" />
//               <div className="h-10 w-48 rounded bg-neutral-100 animate-pulse" />
//               <div className="h-32 w-full rounded bg-neutral-100 animate-pulse" />
//             </div>
//           </div>
//         </section>
//       </div>
//     );
//   }

//   const {
//     name,
//     image,
//     imageUrl,
//     category,
//     collectionId,
//     price,
//     currency = "USD",
//     description,
//     year,
//     rarity,
//     availability,
//     medium,
//     materials,
//     subject,
//     styles,
//     tags,
//     dimensions,
//   } = item;

//   const dimsText = fmtDims(dimensions);

//   return (
//     <div className="min-h-screen bg-white">
//       {/* breadcrumb-ish header */}
//       <div className="border-b bg-neutral-50">
//         <div className="mx-auto max-w-6xl px-4 py-3 text-xs text-neutral-600">
//           <Link to="/collections" className="hover:underline">
//             Collections
//           </Link>
//           <span className="mx-1">/</span>
//           {collectionId ? (
//             <Link to={`/collections/${collectionId}`} className="hover:underline">
//               {collectionId}
//             </Link>
//           ) : category ? (
//             <span>{category}</span>
//           ) : (
//             <span>{item.type}</span>
//           )}
//           <span className="mx-1">/</span>
//           <span className="text-neutral-800">{name}</span>
//         </div>
//       </div>

//       <section className="py-10">
//         <div className="mx-auto max-w-6xl px-4 grid gap-10 md:grid-cols-2">
//           {/* Image */}
//           <motion.div
//             initial={{ opacity: 0, y: 16 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="rounded-xl overflow-hidden bg-neutral-100"
//           >
//             <img
//               src={image || imageUrl || "https://via.placeholder.com/900x900?text=No+Image"}
//               alt={name}
//               className="h-full w-full object-cover"
//             />
//           </motion.div>

//           {/* Info */}
//           <div>
//             <h1 className="text-3xl font-light text-neutral-900">{name}</h1>

//             {(category || collectionId) && (
//               <p className="mt-1 text-sm text-neutral-500">
//                 {(category || collectionId) ?? ""}
//               </p>
//             )}

//             {/* Price + availability */}
//             <div className="mt-4 flex items-center gap-3">
//               <p className="text-2xl font-light">
//                 {money(price, currency)}
//               </p>
//               {availability && (
//                 <span
//                   className={
//                     "rounded-full px-2 py-0.5 text-xs " +
//                     ((availability || "").toLowerCase() === "sold"
//                       ? "bg-red-100 text-red-700"
//                       : (availability || "").toLowerCase() === "on hold"
//                       ? "bg-amber-100 text-amber-700"
//                       : "bg-emerald-100 text-emerald-700")
//                   }
//                 >
//                   {availability}
//                 </span>
//               )}
//               {item.inStock === false && (
//                 <span className="rounded-full bg-stone-200 px-2 py-0.5 text-xs text-stone-700">
//                   Out of stock
//                 </span>
//               )}
//             </div>

//             {/* CTA */}
//             <button
//               onClick={() => canBuy && addToCart(item)}
//               disabled={!canBuy}
//               className="mt-6 rounded-lg bg-neutral-900 px-6 py-3 text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {canBuy ? "Add to cart" : "Unavailable"}
//             </button>

//             {/* Description */}
//             {description && (
//               <div className="mt-8">
//                 <h3 className="text-sm font-semibold text-neutral-900">Description</h3>
//                 <p className="mt-2 text-sm text-neutral-700 leading-relaxed">
//                   {description}
//                 </p>
//               </div>
//             )}

//             {/* Specs */}
//             <div className="mt-8">
//               <h3 className="text-sm font-semibold text-neutral-900">Details</h3>
//               <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
//                 {year ? (
//                   <Spec label="Year" value={year} />
//                 ) : null}
//                 {rarity ? (
//                   <Spec label="Rarity" value={rarity} />
//                 ) : null}
//                 {medium && item.type === "Art" ? (
//                   <Spec label="Medium" value={medium} />
//                 ) : null}
//                 {materials ? (
//                   <Spec label="Materials" value={materials} />
//                 ) : null}
//                 {subject ? (
//                   <Spec label="Subject" value={subject} />
//                 ) : null}
//                 {dimsText ? (
//                   <Spec label="Dimensions" value={dimsText} />
//                 ) : null}
//                 {(collectionId || category) ? (
//                   <Spec
//                     label="Collection"
//                     value={
//                       collectionId ? (
//                         <Link
//                           to={`/collections/${collectionId}`}
//                           className="underline underline-offset-2 hover:text-neutral-900"
//                         >
//                           {collectionId}
//                         </Link>
//                       ) : (
//                         category
//                       )
//                     }
//                   />
//                 ) : null}
//                 {/* Price again in specs for quick scan */}
//                 {price != null ? (
//                   <Spec label="Price" value={money(price, currency)} />
//                 ) : null}
//               </div>
//             </div>

//             {/* Styles / Tags */}
//             {(Array.isArray(styles) && styles.length > 0) ||
//             (Array.isArray(tags) && tags.length > 0) ? (
//               <div className="mt-8 grid gap-6 sm:grid-cols-2">
//                 {Array.isArray(styles) && styles.length > 0 && (
//                   <ChipGroup title="Styles" items={styles} />
//                 )}
//                 {Array.isArray(tags) && tags.length > 0 && (
//                   <ChipGroup title="Tags" items={tags} />
//                 )}
//               </div>
//             ) : null}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// /* ---------- tiny sub-components ---------- */
// function Spec({ label, value }) {
//   if (value == null || value === "" || value === false) return null;
//   return (
//     <div className="rounded-lg border p-3">
//       <div className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">
//         {label}
//       </div>
//       <div className="mt-1 text-neutral-800">{value}</div>
//     </div>
//   );
// }

// function ChipGroup({ title, items = [] }) {
//   return (
//     <div>
//       <div className="text-sm font-semibold text-neutral-900">{title}</div>
//       <div className="mt-2 flex flex-wrap gap-2">
//         {items.map((v) => (
//           <span
//             key={v}
//             className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700"
//           >
//             {v}
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// }













import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useStore } from "../context/Store.jsx";

// small helpers
const money = (n, c = "USD") => `${c} ${Number(n ?? 0).toFixed(2)}`;

const fmtDims = (d) =>
  d?.h && d?.w
    ? `${d.h} × ${d.w}${d?.d ? ` × ${d.d}` : ""} ${d?.unit || ""}`
    : null;

export default function ProductDetail() {
  const { type = "art", id } = useParams(); // /products/:type/:id

  // hooks in a fixed order:
  const [item, setItem] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useStore();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const col = type === "supply" ? "supplies" : "artworks";
        const ref = doc(db, col, id);
        const snap = await getDoc(ref);
        if (!active) return;
        if (snap.exists()) {
          setItem({
            id: snap.id,
            type: type === "supply" ? "Supply" : "Art",
            ...snap.data(),
          });
          setSelectedIndex(0); // reset gallery selection when product changes
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [type, id]);

  const canBuy = useMemo(() => {
    if (!item) return false;
    const sold = (item.availability || "").toLowerCase() === "sold";
    const oos = item.inStock === false;
    return !sold && !oos;
  }, [item]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="rounded-lg bg-neutral-100 p-4 text-sm text-neutral-600">
          Product not found.
        </p>
      </div>
    );
  }

  if (loading || !item) {
    return (
      <div className="min-h-screen bg-white">
        <section className="py-10">
          <div className="mx-auto max-w-6xl px-4 grid gap-8 md:grid-cols-2">
            <div className="h-[520px] rounded-xl bg-neutral-100 animate-pulse" />
            <div className="space-y-3">
              <div className="h-8 w-2/3 rounded bg-neutral-100 animate-pulse" />
              <div className="h-4 w-1/3 rounded bg-neutral-100 animate-pulse" />
              <div className="h-7 w-40 rounded bg-neutral-100 animate-pulse" />
              <div className="h-10 w-48 rounded bg-neutral-100 animate-pulse" />
              <div className="h-32 w-full rounded bg-neutral-100 animate-pulse" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  const {
    name,
    image,
    imageUrl,
    images, // optional array
    category,
    collectionId,
    price,
    currency = "USD",
    description,
    year,
    rarity,
    availability,
    medium,
    materials,
    subject,
    styles,
    tags,
    dimensions,
  } = item;

  const dimsText = fmtDims(dimensions);

  // ✅ gallery computed as a normal const (no hook)
  let gallery = [];
  if (Array.isArray(images)) {
    gallery = images.filter(Boolean);
  }
  if (gallery.length === 0) {
    const fallback = image || imageUrl;
    if (fallback) gallery = [fallback];
  }

  const displaySrc =
    gallery[selectedIndex] ||
    gallery[0] ||
    image ||
    imageUrl ||
    "https://via.placeholder.com/900x900?text=No+Image";

  return (
    <div className="min-h-screen bg-white">
      {/* breadcrumb-ish header */}
      <div className="border-b bg-neutral-50">
        <div className="mx-auto max-w-6xl px-4 py-3 text-xs text-neutral-600">
          <Link to="/collections" className="hover:underline">
            Collections
          </Link>
          <span className="mx-1">/</span>
          {collectionId ? (
            <Link
              to={`/collections/${collectionId}`}
              className="hover:underline"
            >
              {collectionId}
            </Link>
          ) : category ? (
            <span>{category}</span>
          ) : (
            <span>{item.type}</span>
          )}
          <span className="mx-1">/</span>
          <span className="text-neutral-800">{name}</span>
        </div>
      </div>

      <section className="py-10">
        <div className="mx-auto max-w-6xl px-4 grid gap-10 md:grid-cols-2">
          {/* Image + gallery */}
          <div className="space-y-4">
            <motion.div
              key={displaySrc}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl overflow-hidden bg-neutral-100"
            >
              <img
                src={displaySrc}
                alt={name}
                className="h-full w-full object-cover"
              />
            </motion.div>

            {gallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {gallery.map((src, idx) => (
                  <button
                    key={src + idx}
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded border ${
                      idx === selectedIndex
                        ? "border-neutral-900"
                        : "border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    <img
                      src={src}
                      alt={`${name} ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                        Primary
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-3xl font-light text-neutral-900">{name}</h1>

            {(category || collectionId) && (
              <p className="mt-1 text-sm text-neutral-500">
                {(category || collectionId) ?? ""}
              </p>
            )}

            {/* Price + availability */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <p className="text-2xl font-light">{money(price, currency)}</p>
              {availability && (
                <span
                  className={
                    "rounded-full px-2 py-0.5 text-xs " +
                    ((availability || "").toLowerCase() === "sold"
                      ? "bg-red-100 text-red-700"
                      : (availability || "").toLowerCase() === "on hold"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700")
                  }
                >
                  {availability}
                </span>
              )}
              {item.inStock === false && (
                <span className="rounded-full bg-stone-200 px-2 py-0.5 text-xs text-stone-700">
                  Out of stock
                </span>
              )}
            </div>

            {/* CTA */}
            <button
              onClick={() => canBuy && addToCart(item)}
              disabled={!canBuy}
              className="mt-6 rounded-lg bg-neutral-900 px-6 py-3 text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {canBuy ? "Add to cart" : "Unavailable"}
            </button>

            {/* Description */}
            {description && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-neutral-900">
                  Description
                </h3>
                <p className="mt-2 text-sm text-neutral-700 leading-relaxed">
                  {description}
                </p>
              </div>
            )}

            {/* Specs */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-neutral-900">Details</h3>
              <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                {year ? <Spec label="Year" value={year} /> : null}
                {rarity ? <Spec label="Rarity" value={rarity} /> : null}
                {medium && item.type === "Art" ? (
                  <Spec label="Medium" value={medium} />
                ) : null}
                {materials ? <Spec label="Materials" value={materials} /> : null}
                {subject ? <Spec label="Subject" value={subject} /> : null}
                {dimsText ? (
                  <Spec label="Dimensions" value={dimsText} />
                ) : null}
                {collectionId || category ? (
                  <Spec
                    label="Collection"
                    value={
                      collectionId ? (
                        <Link
                          to={`/collections/${collectionId}`}
                          className="underline underline-offset-2 hover:text-neutral-900"
                        >
                          {collectionId}
                        </Link>
                      ) : (
                        category
                      )
                    }
                  />
                ) : null}
                {price != null ? (
                  <Spec label="Price" value={money(price, currency)} />
                ) : null}
              </div>
            </div>

            {/* Styles / Tags */}
            {(Array.isArray(styles) && styles.length > 0) ||
            (Array.isArray(tags) && tags.length > 0) ? (
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {Array.isArray(styles) && styles.length > 0 && (
                  <ChipGroup title="Styles" items={styles} />
                )}
                {Array.isArray(tags) && tags.length > 0 && (
                  <ChipGroup title="Tags" items={tags} />
                )}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- tiny sub-components ---------- */
function Spec({ label, value }) {
  if (value == null || value === "" || value === false) return null;
  return (
    <div className="rounded-lg border p-3">
      <div className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">
        {label}
      </div>
      <div className="mt-1 text-neutral-800">{value}</div>
    </div>
  );
}

function ChipGroup({ title, items = [] }) {
  return (
    <div>
      <div className="text-sm font-semibold text-neutral-900">{title}</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((v) => (
          <span
            key={v}
            className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700"
          >
            {v}
          </span>
        ))}
      </div>
    </div>
  );
}
