import { Menu, Search, ShoppingCart, User, LogOut, X } from "lucide-react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../context/Store.jsx";
import Container from "./UI/Container.jsx";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import logo from "../assets/logo.jpg";

export default function Header() {
  const { state, setSearch } = useStore();
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const panelRef = useRef(null);
  const searchRef = useRef(null); // 👈 ref for the search bar

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return unsubscribe;
  }, []);

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev);
    }
  }, [open]);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setShowSearch(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 🔻 Close search when clicking outside it
  useEffect(() => {
    const handleClickOutsideSearch = (e) => {
      if (!showSearch) return;
      if (!searchRef.current) return;
      if (!searchRef.current.contains(e.target)) {
        setShowSearch(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutsideSearch);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideSearch);
    };
  }, [showSearch, setSearch]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getInitials = (user) => {
    if (!user) return "";
    if (user.displayName) {
      const parts = user.displayName.trim().split(" ");
      if (parts.length === 1) return parts[0][0].toUpperCase();
      return (parts[0][0] + parts[1][0]).toUpperCase();
    } else if (user.email) {
      const name = user.email.split("@")[0];
      return name[0]?.toUpperCase();
    }
    return "?";
  };

  // Close when clicking outside the drawer panel
  const handleOverlayClick = (e) => {
    if (!panelRef.current) return;
    if (!panelRef.current.contains(e.target)) setOpen(false);
  };

  // 🔍 When user presses Enter in search
  const handleSearchKeyDown = (e) => {
    if (e.key !== "Enter") return;

    const term = (state.search || "").trim();
    if (!term) return;

    e.preventDefault();

    const lower = term.toLowerCase();

    // 1) Try to match a collection (category) by id or name -> go to collection detail
    const match = state.categories.find((c) => {
      const idMatch = c.id?.toLowerCase() === lower;
      const nameMatch = (c.name || "").toLowerCase() === lower;
      return idMatch || nameMatch;
    });

    if (match) {
      navigate(`/collections/${match.id}`);
      return;
    }

    // 2) If current page is supplies, go to supplies results
    if (location.pathname.startsWith("/supplies")) {
      navigate("/supplies");
      return;
    }

    // 3) If current page is collections list, stay in collections list
    if (location.pathname.startsWith("/collections")) {
      navigate("/collections");
      return;
    }

    // 4) Default: go to artworks list (search will filter there)
    navigate("/artworks");
  };

  return (
    <header className="sticky top-[40px] w-full border-b border-stone-300 bg-white z-[1000] backdrop-blur">
      <Container className="relative flex h-20 md:h-24 items-center justify-between">

        {/* Left side */}
        <div className="flex items-center gap-4 z-10">
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden p-2"
            aria-label="open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <Menu />
          </button>
          <nav className="hidden lg:flex items-center gap-6 text-sm md:text-md">
            <NavLink to="/" className="hover:underline">Home</NavLink>
            <NavLink to="/collections" className="hover:underline">Collection</NavLink>
            <NavLink to="/artworks" className="hover:underline">Artworks</NavLink>
            <NavLink to="/about" className="hover:underline">About Us</NavLink>
            <NavLink to="/contact" className="hover:underline">Contact</NavLink>
          </nav>
        </div>

        {/* CENTERED LOGO — always middle */}
        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2 text-3xl md:text-5xl font-semibold tracking-widest"
        >
          <img src={logo} className="w-20 md:w-24 h-auto object-contain" alt="Scaena Logo" />
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-3 z-10">
          <button
            onClick={() =>
              setShowSearch((prev) => {
                const next = !prev;
                if (!next) setSearch("");
                return next;
              })
            }
            className="p-1 md:p-2"
            aria-label="search"
          >
            <Search />
          </button>

          {user ? (
            <>
              <button
                onClick={() => navigate("/profile")}
                className="flex md:h-8 md:w-8 h-6 w-6 items-center justify-center rounded-full bg-stone-800 text-xs font-medium text-white hover:bg-stone-700"
                aria-label="profile"
              >
                {getInitials(user)}
              </button>
              <button
                onClick={handleLogout}
                className="hidden lg:inline p-1 md:p-2 text-red-600"
                aria-label="logout"
              >
                <LogOut />
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="hidden lg:inline p-2"
              aria-label="profile"
            >
              <User />
            </button>
          )}

          <button
            onClick={() => navigate("/cart")}
            className="relative p-2"
            aria-label="cart"
          >
            <ShoppingCart />
            {state.cart.length > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-stone-900 px-1.5 text-[10px] text-white">
                {state.cart.reduce((a, c) => a + (c.quantity || 0), 0)}
              </span>
            )}
          </button>
        </div>
      </Container>


      {/* Search bar */}
      {showSearch && (
        <div
          ref={searchRef} // 👈 outside-click detection zone
          className="border-t border-stone-300 bg-white slide-down"
        >
          <Container>
            <input
              type="text"
              placeholder="Search artworks & supplies..."
              value={state.search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="my-3 w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2 outline-none focus:ring-2 focus:ring-stone-700"
            />
          </Container>
        </div>
      )}

      {/* Mobile Drawer + Overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onMouseDown={handleOverlayClick}
            />

            {/* Drawer panel */}
            <motion.aside
              id="mobile-menu"
              ref={panelRef}
              className="fixed left-0 top-0 z-50 h-full w-80 max-w-[80vw] bg-white shadow-xl ring-1 ring-black/5"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "tween", duration: 0.28 }}
            >
              <div className="flex items-center justify-between border-b px-4 py-4">
                <Link
                  to="/"
                  className="text-2xl font-semibold tracking-widest"
                  onClick={() => setOpen(false)}
                >
                  세나
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="close menu"
                  className="p-2 text-stone-700 hover:text-stone-900"
                >
                  <X />
                </button>
              </div>

              <nav className="flex bg-stone-300 flex-col px-4 py-3 text-base">
                <NavLink to="/" onClick={() => setOpen(false)} className="py-3 border-b">
                  Home
                </NavLink>
                <NavLink to="/collections" onClick={() => setOpen(false)} className="py-3 border-b">
                  Collection
                </NavLink>
                <NavLink to="/artworks" onClick={() => setOpen(false)} className="py-3 border-b">
                  Artworks
                </NavLink>
                <NavLink to="/about" onClick={() => setOpen(false)} className="py-3 border-b">
                  About Us
                </NavLink>
                <NavLink to="/contact" onClick={() => setOpen(false)} className="py-3 border-b">
                  Contact
                </NavLink>

                {user ? (
                  <>
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setOpen(false);
                      }}
                      className="py-3 text-left border-b"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setOpen(false);
                      }}
                      className="py-3 text-left text-red-600"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      navigate("/login");
                      setOpen(false);
                    }}
                    className="py-3 text-left"
                  >
                    Login
                  </button>
                )}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
