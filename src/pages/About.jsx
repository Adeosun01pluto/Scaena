import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen bg-white text-neutral-800 overflow-x-hidden">
      {/* Hero */}
      <section className="bg-neutral-800 py-16 sm:py-20 text-white">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-light sm:text-4xl md:text-5xl"
          >
            About Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-4 max-w-3xl text-base sm:text-lg font-light text-white/80"
          >
            Where art meets innovation — curating timeless works and building a
            creative ecosystem for artists, collectors, and dreamers.
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-900">
                Our Story
              </h2>
              <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed">
                Founded with the belief that art should transcend trends, our
                mission is to bridge classical beauty and modern expression.
                What began as a small curation of works evolved into a growing
                movement — a platform celebrating individuality, craftsmanship,
                and creative risk-taking.
              </p>
              <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed">
                We collaborate with emerging and established artists to bring
                stories to life — from digital innovation to traditional
                canvases. Our collections aim to connect emotion, intellect, and
                imagination across cultures and generations.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full"
            >
              <img
                src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1000"
                alt="Studio workspace"
                className="h-64 sm:h-80 md:h-[400px] w-full rounded-2xl shadow-lg object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-neutral-50 py-12 sm:py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-900 text-center">
            Our Core Values
          </h2>
          <div className="mt-10 sm:mt-12 grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Authenticity",
                desc: "We believe in truth over trends — every creation must come from a place of genuine vision and craft.",
              },
              {
                title: "Innovation",
                desc: "From digital art to emerging mediums, we push boundaries while honoring timeless traditions.",
              },
              {
                title: "Community",
                desc: "Art is a shared language. We foster connection and collaboration among creators worldwide.",
              },
            ].map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="rounded-xl bg-white p-5 sm:p-6 shadow"
              >
                <h3 className="text-base sm:text-lg font-semibold text-neutral-900">
                  {v.title}
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
