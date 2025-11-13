import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db, auth } from "../lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, Edit2 } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  // Load current Firebase user and profile data
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        navigate("/login?redirect=/profile");
        return;
      }
      setUser(u);

      const ref = doc(db, "users", u.uid, "data", "profile");
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setForm((prev) => ({ ...prev, ...snap.data() }));
      } else {
        // prefill with auth info
        setForm((f) => ({
          ...f,
          fullName: u.displayName || "",
          email: u.email || "",
        }));
      }
      setLoading(false);
    });
    return unsub;
  }, [navigate]);

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const ref = doc(db, "users", user.uid, "data", "profile");
      await setDoc(ref, { ...form, updatedAt: serverTimestamp() }, { merge: true });
      setSaved(true);
      setEditMode(false);
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert("Error saving profile. Try again.");
    } finally {
      setSaving(false);
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
              My Profile
            </motion.h1>
            <p className="mt-2 text-white/80">
              Manage your contact and shipping information.
            </p>
          </div>

          <button
            onClick={() => setEditMode((e) => !e)}
            className="mt-6 sm:mt-0 flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2 text-sm text-white hover:bg-white hover:text-neutral-800 transition"
          >
            <Edit2 size={16} />
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </section>

      {/* Form */}
      <section className="py-12">
        <motion.form
          onSubmit={handleSave}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow"
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
