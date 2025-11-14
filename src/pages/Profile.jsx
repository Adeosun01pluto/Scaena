// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, Edit2 } from "lucide-react";
import { db, auth } from "../lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { getUserOrders } from "../services/stripeService";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // profile form
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // orders
  const [orders, setOrders] = useState([]);

  // ui state
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  // helper: format Firestore/Stripe-ish timestamps safely
  const formatOrderDate = (createdAt) => {
    const options = { year: "numeric", month: "long", day: "numeric" };

    if (!createdAt) return "Date unavailable";

    // Firestore Timestamp via SDK (if ever comes that way)
    if (createdAt.toDate) {
      return createdAt.toDate().toLocaleDateString("en-US", options);
    }

    // Serialized Timestamp from Functions: { _seconds, _nanoseconds }
    if (createdAt._seconds) {
      return new Date(createdAt._seconds * 1000).toLocaleDateString(
        "en-US",
        options
      );
    }

    // ISO string
    if (typeof createdAt === "string") {
      return new Date(createdAt).toLocaleDateString("en-US", options);
    }

    return "Date unavailable";
  };

  // Load user, profile and orders
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate("/login?redirect=/profile");
        return;
      }

      setUser(currentUser);

      (async () => {
        setLoading(true);
        try {
          // --- Profile data from Firestore ---
          const profileRef = doc(db, "users", currentUser.uid, "data", "profile");
          const snap = await getDoc(profileRef);

          if (snap.exists()) {
            setForm((prev) => ({
              ...prev,
              ...snap.data(),
            }));
          } else {
            // Prefill from auth
            setForm((prev) => ({
              ...prev,
              fullName: currentUser.displayName || "",
              email: currentUser.email || "",
            }));
          }

          // --- Orders from Cloud Function ---
          const userOrders = await getUserOrders(currentUser.uid);
          console.log(userOrders)
          setOrders(userOrders || []);
        } catch (err) {
          console.error("Error loading profile or orders:", err);
        } finally {
          setLoading(false);
        }
      })();
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setSaved(false);

    try {
      const ref = doc(db, "users", user.uid, "data", "profile");
      await setDoc(
        ref,
        { ...form, updatedAt: serverTimestamp() },
        { merge: true }
      );
      setSaved(true);
      setEditMode(false);
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert("Error saving profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
        <Loader2 className="animate-spin text-neutral-600" size={36} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800">
      {/* Hero */}
      <section className="bg-neutral-800 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-end sm:justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-light md:text-5xl"
            >
              My Account
            </motion.h1>
            <p className="mt-2 text-white/80">
              Manage your profile and view your orders.
            </p>
          </div>

          <div className="mt-6 sm:mt-0 flex items-center gap-3">
            <button
              onClick={() => setEditMode((e) => !e)}
              className="flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2 text-sm text-white hover:bg-white hover:text-neutral-800 transition"
            >
              <Edit2 size={16} />
              {editMode ? "Cancel Edit" : "Edit Profile"}
            </button>
            <button
              onClick={handleSignOut}
              className="rounded-lg border border-red-400 bg-red-500/10 px-4 py-2 text-sm text-red-100 hover:bg-red-500 hover:text-white transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 border-t border-neutral-700/60">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex gap-4">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === "profile"
                  ? "border-white text-white"
                  : "border-transparent text-white/60 hover:text-white"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === "orders"
                  ? "border-white text-white"
                  : "border-transparent text-white/60 hover:text-white"
              }`}
            >
              Orders ({orders.length})
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {activeTab === "profile" && (
            <motion.form
              onSubmit={handleSave}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl bg-white p-8 shadow"
            >
              <div className="grid gap-6 md:grid-cols-2">
                <Input
                  label="Full Name"
                  value={form.fullName}
                  onChange={(v) => handleChange("fullName", v)}
                  disabled={!editMode}
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={(v) => handleChange("email", v)}
                  disabled
                />
                <Input
                  label="Phone Number"
                  value={form.phone}
                  onChange={(v) => handleChange("phone", v)}
                  disabled={!editMode}
                />
                <Input
                  label="Address"
                  value={form.address}
                  onChange={(v) => handleChange("address", v)}
                  disabled={!editMode}
                />
                <Input
                  label="City"
                  value={form.city}
                  onChange={(v) => handleChange("city", v)}
                  disabled={!editMode}
                />
                <Input
                  label="Country"
                  value={form.country}
                  onChange={(v) => handleChange("country", v)}
                  disabled={!editMode}
                />
                <Input
                  label="Postal Code"
                  value={form.postalCode}
                  onChange={(v) => handleChange("postalCode", v)}
                  disabled={!editMode}
                />
              </div>

              {/* Basic auth metadata display */}
              <div className="mt-8 grid gap-6 md:grid-cols-2 text-sm text-neutral-600">
                <div>
                  <div className="font-medium mb-1">User ID</div>
                  <div className="break-all text-neutral-500 text-xs">
                    {user?.uid}
                  </div>
                </div>
                <div>
                  <div className="font-medium mb-1">Account Created</div>
                  <div>
                    {user?.metadata?.creationTime
                      ? new Date(
                          user.metadata.creationTime
                        ).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
              </div>

              {editMode && (
                <div className="mt-8 flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 rounded-lg bg-neutral-900 px-6 py-2 text-white hover:bg-neutral-700 transition disabled:opacity-60"
                  >
                    {saving && <Loader2 className="animate-spin" size={16} />}
                    Save Changes
                  </button>
                  {saved && (
                    <span className="flex items-center text-sm text-green-600">
                      <CheckCircle size={16} className="mr-1" /> Saved!
                    </span>
                  )}
                </div>
              )}
            </motion.form>
          )}

          {activeTab === "orders" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              {orders.length === 0 ? (
                <div className="bg-white rounded-2xl shadow p-12 text-center">
                  <p className="text-xl text-neutral-600 mb-4">
                    You haven't placed any orders yet.
                  </p>
                  <button
                    onClick={() => navigate("/supplies")}
                    className="bg-neutral-900 text-white px-6 py-3 rounded hover:bg-neutral-700 transition"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl shadow p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">
                          Order #{order.sessionId?.slice(-8) || order.id}
                        </h3>
                        <p className="text-sm text-neutral-500">
                          {formatOrderDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          ${Number(order.amount || 0).toFixed(2)}
                        </p>
                        <span
                          className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {order.customerEmail && (
                      <p className="text-sm text-neutral-600 mb-2">
                        Email: {order.customerEmail}
                      </p>
                    )}

                    {order.shippingAddress && (
                      <div className="mt-3 p-4 bg-neutral-50 rounded">
                        <p className="text-sm font-semibold mb-2">
                          Shipping Address
                        </p>
                        <p className="text-sm text-neutral-700">
                          {order.shippingAddress.line1}
                          {order.shippingAddress.line2 && (
                            <> , {order.shippingAddress.line2}</>
                          )}
                        </p>
                        <p className="text-sm text-neutral-700">
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state}{" "}
                          {order.shippingAddress.postal_code}
                        </p>
                        <p className="text-sm text-neutral-700">
                          {order.shippingAddress.country}
                        </p>
                      </div>
                    )}

                    {order.items && order.items.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold mb-2">Items</p>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between text-sm"
                            >
                              <span>
                                {item.description || item.price?.product || ""}{" "}
                                × {item.quantity}
                              </span>
                              <span className="font-medium">
                                ${((item.amount_total || 0) / 100).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", disabled }) {
  return (
    <label className="text-sm">
      <div className="mb-1 text-neutral-600 font-medium">{label}</div>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border px-3 py-2 ${
          disabled
            ? "bg-neutral-100 text-neutral-500"
            : "bg-white focus:border-neutral-600 focus:outline-none"
        }`}
      />
    </label>
  );
}
