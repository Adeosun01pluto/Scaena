// src/context/Store.jsx
import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../lib/firebase";
import {
  doc, setDoc,
  collection, onSnapshot,
  addDoc, updateDoc, deleteDoc,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const auth = getAuth();

  // ---- Auth / session ----
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ---- UI ----
  const [search, setSearch] = useState("");

  // ---- Cart (ALWAYS localStorage) ----
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // ---- Toast ----
  const [toast, setToast] = useState(null); // { message }

  const showToast = (message) => {
    setToast({ message });
  };

  // auto-hide toast
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(id);
  }, [toast]);

  // ---- Firestore entities for Admin + Storefront ----
  const [categories, setCategories] = useState([]);
  const [artworks, setArtworks]   = useState([]);
  const [supplies, setSupplies]   = useState([]);
  const [usersCol, setUsersCol]   = useState([]); // avoid shadowing auth "user"

  // Auth state (NO cart sync/merge anymore)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    });
    return unsub;
  }, [auth]);

  // Persist cart to localStorage (for both guests + logged-in users)
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Live Firestore subscriptions (admin dashboards & storefront)
  useEffect(() => {
    const unsubs = [
      onSnapshot(collection(db, "categories"), (s) =>
        setCategories(s.docs.map((d) => ({ id: d.id, ...d.data() })))
      ),
      onSnapshot(collection(db, "artworks"), (s) =>
        setArtworks(s.docs.map((d) => ({ id: d.id, ...d.data() })))
      ),
      onSnapshot(collection(db, "supplies"), (s) =>
        setSupplies(s.docs.map((d) => ({ id: d.id, ...d.data() })))
      ),
      onSnapshot(collection(db, "users"), (s) =>
        setUsersCol(s.docs.map((d) => ({ id: d.id, ...d.data() })))
      ),
    ];
    return () => unsubs.forEach((u) => u());
  }, []);

  // --- cart actions (local only + toast) ---
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((x) => x.id === item.id);
      let next;
      if (existing) {
        next = prev.map((x) =>
          x.id === item.id ? { ...x, quantity: (x.quantity || 0) + 1 } : x
        );
      } else {
        next = [
          ...prev,
          {
            id: item.id,
            name: item.name,
            price: Number(item.price || 0),
            image: item.image || item.imageUrl || "",
            // keep images array if you want it in cart too:
            images: Array.isArray(item.images) ? item.images : undefined,
            quantity: 1,
            // keep type/kind for routing from cart if needed
            type: item.type,
            kind: item.kind,
          },
        ];
      }

      // toast after state calculation, so message reflects reality
      const label = item.name || "Item";
      showToast(`"${label}" added to cart`);

      return next;
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((x) => x.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    setCart((prev) =>
      prev.map((x) =>
        x.id === id ? { ...x, quantity: Math.max(1, quantity) } : x
      )
    );
  };

  // --- helper: normalize product before save ---
  function normalizeProduct(p) {
    // core required-ish fields
    const base = {
      id: p.id || "",
      name: p.name || "",
      price: Number(p.price || 0),
      category: p.category || "",
      type: p.type === "Supply" ? "Supply" : "Art",
      inStock: typeof p.inStock === "boolean" ? p.inStock : true,
    };

    // optional fields from the ProductForm
    const optionalKeys = [
      "images",
      "collectionId",
      "categoryId",
      "currency",
      "year",
      "rarity",
      "availability",
      "medium",
      "materials",
      "subject",
      "styles",
      "tags",
      "dimensions",
      "description",
      "createdAt",
      "updatedAt",
    ];

    const extra = {};
    for (const key of optionalKeys) {
      const val = p[key];

      // treat these as "not provided" → don't save
      if (
        val === undefined ||
        val === null ||
        (typeof val === "string" && val.trim() === "") ||
        (Array.isArray(val) && val.length === 0)
      ) {
        continue;
      }

      extra[key] = val;
    }

    return { ...base, ...extra };
  }

  function normalizeCategory(c) {
    const now = new Date().toISOString();
    return {
      id: c.id || "",
      name: c.name || "",
      image: c.image || "",
      description: c.description || "",
      featured: !!c.featured,
      createdAt: c.createdAt || now,
      updatedAt: now,
    };
  }

  // --- CRUD: CATEGORIES ---
  async function createCategory(category) {
    const data = normalizeCategory(category);
    if (data.id) {
      await setDoc(doc(db, "categories", data.id), data);
      return data.id;
    } else {
      const ref = await addDoc(collection(db, "categories"), data);
      return ref.id;
    }
  }

  async function updateCategory(category) {
    const data = normalizeCategory(category);
    if (!data.id) throw new Error("updateCategory: missing category.id");
    await setDoc(doc(db, "categories", data.id), data, { merge: true });
    return data.id;
  }

  async function deleteCategory(id) {
    if (!id) throw new Error("deleteCategory: missing id");
    await deleteDoc(doc(db, "categories", id));
  }

  // --- CRUD: ARTWORKS ---
  async function createArtwork(product) {
    const data = normalizeProduct({ ...product, type: "Art" });
    if (data.id) {
      await setDoc(doc(db, "artworks", data.id), data);
      return data.id;
    } else {
      const ref = await addDoc(collection(db, "artworks"), data);
      return ref.id;
    }
  }

  async function updateArtwork(product) {
    const data = normalizeProduct({ ...product, type: "Art" });
    if (!data.id) throw new Error("updateArtwork: missing product.id");
    await setDoc(doc(db, "artworks", data.id), data, { merge: true });
    return data.id;
  }

  async function deleteArtwork(id) {
    await deleteDoc(doc(db, "artworks", id));
  }

  // --- CRUD: SUPPLIES ---
  async function createSupply(product) {
    const data = normalizeProduct({ ...product, type: "Supply" });
    if (data.id) {
      await setDoc(doc(db, "supplies", data.id), data);
      return data.id;
    } else {
      const ref = await addDoc(collection(db, "supplies"), data);
      return ref.id;
    }
  }

  async function updateSupply(product) {
    const data = normalizeProduct({ ...product, type: "Supply" });
    if (!data.id) throw new Error("updateSupply: missing product.id");
    await setDoc(doc(db, "supplies", data.id), data, { merge: true });
    return data.id;
  }

  async function deleteSupply(id) {
    await deleteDoc(doc(db, "supplies", id));
  }

  const value = useMemo(
    () => ({
      state: {
        cart,
        isLoggedIn,
        user,
        search,
        categories,
        artworks,
        supplies,
        users: usersCol,
      },
      setSearch,

      // cart
      addToCart,
      removeFromCart,
      updateQuantity,

      // products
      createArtwork,
      updateArtwork,
      deleteArtwork,
      createSupply,
      updateSupply,
      deleteSupply,

      // categories
      createCategory,
      updateCategory,
      deleteCategory,
    }),
    [cart, isLoggedIn, user, search, categories, artworks, supplies, usersCol]
  );

  return (
    <StoreContext.Provider value={value}>
      {children}

      {/* Toast UI */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed bottom-6 right-6 z-[9999]"
          >
            <motion.div
              initial={{ backdropFilter: "blur(0px)" }}
              animate={{ backdropFilter: "blur(8px)" }}
              exit={{ backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.4 }}
              className="rounded-lg bg-neutral-900/80 backdrop-blur-xl text-white px-5 py-4 shadow-2xl border border-white/10 text-sm"
            >
              {toast.message}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
