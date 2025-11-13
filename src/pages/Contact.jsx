import { useState } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message)
      return setStatus("Please fill in all fields.");

    try {
      await addDoc(collection(db, "messages"), {
        ...form,
        createdAt: serverTimestamp(),
      });
      setForm({ name: "", email: "", message: "" });
      setStatus("Message sent successfully!");
    } catch (err) {
      console.error(err);
      setStatus("Error sending message. Try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800">
      {/* Hero */}
      <section className="bg-neutral-800 py-20 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-light md:text-5xl"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-4 max-w-2xl text-lg font-light text-white/80"
          >
            We'd love to hear from you — whether you're an artist, collector, or
            curious visitor.
          </motion.p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="rounded-2xl bg-white p-8 shadow"
          >
            <h2 className="text-2xl font-semibold mb-6 text-neutral-900">
              Send a Message
            </h2>

            <label className="block mb-4">
              <span className="text-sm text-neutral-700">Full Name</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-lg border px-3 py-2 focus:border-neutral-500 focus:outline-none"
              />
            </label>

            <label className="block mb-4">
              <span className="text-sm text-neutral-700">Email Address</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full rounded-lg border px-3 py-2 focus:border-neutral-500 focus:outline-none"
              />
            </label>

            <label className="block mb-6">
              <span className="text-sm text-neutral-700">Message</span>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-1 w-full rounded-lg border px-3 py-2 focus:border-neutral-500 focus:outline-none"
              />
            </label>

            <button
              type="submit"
              className="rounded-lg bg-neutral-900 px-6 py-2 text-white hover:bg-neutral-700 transition"
            >
              Send Message
            </button>

            {status && (
              <p className="mt-4 text-sm text-neutral-600">{status}</p>
            )}
          </motion.form>

          <div className="mt-12 text-center text-neutral-700">
            <p className="mb-2">Or reach us directly:</p>
            <p>
              📧{" "}
              <a
                href="mailto:contact@archearchives.com"
                className="text-neutral-900 underline hover:text-neutral-600"
              >
                contact@archearchives.com
              </a>
            </p>
            <p>📍 Lagos, Nigeria</p>
          </div>
        </div>
      </section>
    </div>
  );
}
