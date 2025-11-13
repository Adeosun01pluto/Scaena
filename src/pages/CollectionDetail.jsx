import { useEffect, useMemo, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { db } from "../lib/firebase";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import ProductCard from "../components/ProductCard.jsx";
import { useStore } from "../context/Store.jsx";

export default function CollectionDetail() {
  const { name = "" } = useParams(); // category doc id (slug)
  const slug = String(name).toLowerCase();
  const { state } = useStore();
  const searchTerm = state.search?.trim().toLowerCase();

  const [category, setCategory] = useState(null); // {id, name, ...}
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]); // artworks + supplies

  // 1) Load category doc
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const ref = doc(db, "categories", slug);
        const snap = await getDoc(ref);
        if (active)
          setCategory(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  // 2) Subscribe products from both collections
  useEffect(() => {
    if (!category) return;

    // Prefer categoryId == slug; fallback to category == category.name
    const qArtA = query(
      collection(db, "artworks"),
      where("categoryId", "==", slug)
    );
    const qArtB = category.name
      ? query(collection(db, "artworks"), where("category", "==", category.name))
      : null;

    const qSupA = query(
      collection(db, "supplies"),
      where("categoryId", "==", slug)
    );
    const qSupB = category.name
      ? query(collection(db, "supplies"), where("category", "==", category.name))
      : null;

    const unsubs = [];

    const push = (docs, type) =>
      docs.map((d) => {
        const raw = d.data() || {};
        const kind = type === "art" ? "art" : "supply";
        return {
          id: d.id,
          type: type === "art" ? "Art" : "Supply",
          kind,          // ✅ for ProductCard
          ...raw,
        };
      });

    // Artworks – categoryId == slug
    unsubs.push(
      onSnapshot(qArtA, (s) =>
        setItems((prev) => {
          const others = prev.filter(
            (x) => !(x.type === "Art" && x._q === "A")
          );
          return [
            ...others,
            ...push(s.docs, "art").map((x) => ({ ...x, _q: "A" })),
          ];
        })
      )
    );

    // Artworks – category name fallback
    if (qArtB) {
      unsubs.push(
        onSnapshot(qArtB, (s) =>
          setItems((prev) => {
            const others = prev.filter(
              (x) => !(x.type === "Art" && x._q === "B")
            );
            return [
              ...others,
              ...push(s.docs, "art").map((x) => ({ ...x, _q: "B" })),
            ];
          })
        )
      );
    }

    // Supplies – categoryId == slug
    unsubs.push(
      onSnapshot(qSupA, (s) =>
        setItems((prev) => {
          const others = prev.filter(
            (x) => !(x.type === "Supply" && x._q === "A")
          );
          return [
            ...others,
            ...push(s.docs, "supply").map((x) => ({ ...x, _q: "A" })),
          ];
        })
      )
    );

    // Supplies – category name fallback
    if (qSupB) {
      unsubs.push(
        onSnapshot(qSupB, (s) =>
          setItems((prev) => {
            const others = prev.filter(
              (x) => !(x.type === "Supply" && x._q === "B")
            );
            return [
              ...others,
              ...push(s.docs, "supply").map((x) => ({ ...x, _q: "B" })),
            ];
          })
        )
      );
    }

    return () => unsubs.forEach((u) => u && u());
  }, [slug, category]);

  const uniqueItems = useMemo(() => {
    const map = new Map();
    for (const it of items) map.set(`${it.type}:${it.id}`, it);
    let arr = Array.from(map.values());

    if (searchTerm) {
      arr = arr.filter((item) => {
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

    return arr;
  }, [items, searchTerm]);

  // 🔁 Keep hooks consistent, then redirect if needed
  if (slug === "supplies") {
    return <Navigate to="/supplies" replace />;
  }

  if (!loading && !category) {
    return (
      <div className="min-h-screen bg-white">
        <section className="bg-neutral-600 py-16">
          <div className="mx-auto max-w-7xl px-4">
            <h1 className="text-4xl md:text-5xl font-light text-white">
              Collection not found
            </h1>
          </div>
        </section>
        <div className="mx-auto max-w-7xl px-4 py-10">
          <p className="rounded-lg bg-neutral-100 p-4 text-sm text-neutral-600">
            The collection you requested doesn’t exist. Try another one from{" "}
            <Link to="/collections" className="underline">
              Collections
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero / Header */}
      <section className="bg-neutral-600 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-4xl md:text-5xl font-light text-white">
            {category?.name || "Loading..."}
          </h1>
          {category?.description && (
            <p className="mt-3 max-w-2xl text-white/80">
              {category.description}
            </p>
          )}
        </div>
      </section>

      {/* Grid */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4">
          {uniqueItems.length === 0 ? (
            <p className="rounded-lg bg-neutral-100 p-4 text-sm text-neutral-600">
              No products available in this collection yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {uniqueItems.map((item, i) => (
                <ProductCard
                  key={`${item.type}:${item.id}`}
                  item={item}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
