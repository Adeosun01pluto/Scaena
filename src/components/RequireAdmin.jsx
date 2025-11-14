// src/components/RequireAdmin.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function RequireAdmin({ children }) {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      // Not logged in → send to login with redirect back to current page
      if (!user) {
        navigate(
          `/login?redirect=${encodeURIComponent(
            location.pathname + location.search
          )}`,
          { replace: true }
        );
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        const data = snap.exists() ? snap.data() : {};

        // Allow either role === "admin" or isAdmin === true
        const isAdmin = data.role === "admin" || data.isAdmin === true;

        if (!isAdmin) {
          // Logged in but not admin → kick out
          navigate("/", { replace: true });
          return;
        }

        setAllowed(true);
      } catch (err) {
        console.error("Error checking admin role:", err);
        navigate("/", { replace: true });
      } finally {
        setChecking(false);
      }
    });

    return () => unsubscribe();
  }, [navigate, location]);

  // While we’re checking, show a subtle loader
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-stone-900 border-b-transparent"></div>
      </div>
    );
  }

  if (!allowed) return null;

  return children;
}
