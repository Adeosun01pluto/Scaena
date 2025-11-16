// // src/components/HeroSection.jsx
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";

// export default function HeroSection({
//   image,
//   title,
//   subtitle,
//   buttonText,
//   buttonTo,      // ← new: route path for button
//   delay = 0,
// }) {
//   const isSplit = Array.isArray(image) && image.length >= 2;
//   const imgLeft = isSplit ? image[0] : image;
//   const imgRight = isSplit ? image[1] : image;

//   return (
//     <motion.section
//       initial={{ opacity: 0, y: 30 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true, margin: "-100px" }}
//       transition={{ duration: 0.8, delay }}
//       className="relative h-[520px] w-full overflow-hidden bg-black"
//     >
//       {/* Background(s) */}
//       {isSplit ? (
//         <div className="grid h-full w-full grid-cols-1 md:grid-cols-2">
//           <div
//             className="relative h-full w-full bg-cover bg-center"
//             style={{ backgroundImage: `url(${imgLeft})` }}
//           >
//             <div className="absolute inset-0 bg-black/35" />
//           </div>
//           <div
//             className="relative hidden h-full w-full bg-cover bg-center md:block"
//             style={{ backgroundImage: `url(${imgRight})` }}
//           >
//             <div className="absolute inset-0 bg-black/35" />
//           </div>
//         </div>
//       ) : (
//         <div
//           className="absolute inset-0 bg-cover bg-center"
//           style={{ backgroundImage: `url(${imgLeft})` }}
//         >
//           <div className="absolute inset-0 bg-black/30" />
//         </div>
//       )}

//       {/* Content */}
//       <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
//         <div className="pointer-events-auto px-4 text-center text-white">
//           <motion.h2
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6, delay: delay + 0.2 }}
//             className="text-4xl md:text-5xl font-light tracking-wide"
//             style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
//           >
//             {title}
//           </motion.h2>

//           {subtitle && (
//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.6, delay: delay + 0.3 }}
//               className="mt-4 max-w-xl text-sm md:text-base font-light tracking-wide text-white/90 mx-auto"
//             >
//               {subtitle}
//             </motion.p>
//           )}

//           {buttonText && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.6, delay: delay + 0.4 }}
//               className="mt-6"
//             >
//               <Link
//                 to={buttonTo || "#"}
//                 className="inline-block bg-white px-8 py-2.5 text-xs md:text-sm font-normal tracking-wider text-neutral-900 transition hover:bg-white/95"
//               >
//                 {buttonText}
//               </Link>
//             </motion.div>
//           )}
//         </div>
//       </div>
//     </motion.section>
//   );
// }



































// src/components/HeroSection.jsx
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

export default function HeroSection({
  image,
  title,
  subtitle,
  buttonText,
  buttonTo,
  pillLabel = "Featured Collection",
  delay = 0,
}) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 120]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.85]);

  const isSplit = Array.isArray(image) && image.length >= 2;
  const imgLeft = isSplit ? image[0] : image;
  const imgRight = isSplit ? image[1] : image;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay }}
      className="relative h-[520px] md:h-[620px] w-full overflow-hidden bg-black"
    >
      {/* Background + parallax */}
      <motion.div style={{ y }} className="absolute inset-0">
        {isSplit ? (
          <div className="grid h-full w-full grid-cols-1 gap-px md:grid-cols-2">
            <motion.div
              initial={{ scale: 1.1, x: -80 }}
              animate={{ scale: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${imgLeft})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
            </motion.div>
            <motion.div
              initial={{ scale: 1.1, x: 80 }}
              animate={{ scale: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
              className="relative hidden h-full w-full bg-cover bg-center md:block"
              style={{ backgroundImage: `url(${imgRight})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/40 to-black/20" />
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${imgLeft})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/65" />
          </motion.div>
        )}
      </motion.div>

      {/* Subtle floating sparkles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.2, 0],
              scale: [0, 1, 0],
              y: [0, -80],
              x: Math.random() * 80 - 40,
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.7,
              ease: "easeOut",
            }}
            className="absolute"
            style={{
              left: `${10 + i * 15}%`,
              top: "78%",
              width: 4,
              height: 4,
              background: "white",
              borderRadius: "999px",
              filter: "blur(1px)",
            }}
          />
        ))}
      </div>

      {/* Foreground content */}
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="px-4 text-center text-white max-w-4xl mx-auto">
          {/* Small pill, like About-page styling */}
          {pillLabel && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: delay + 0.2 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 backdrop-blur-md"
            >
              <Sparkles size={16} className="text-yellow-300" />
              <span className="text-[11px] tracking-[0.2em] uppercase">
                {pillLabel}
              </span>
            </motion.div>
          )}

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: delay + 0.3 }}
            className="text-4xl md:text-6xl font-light tracking-tight"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            {title}
          </motion.h2>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: delay + 0.4 }}
              className="mt-4 max-w-xl mx-auto text-sm md:text-base font-light tracking-wide text-white/90"
            >
              {subtitle}
            </motion.p>
          )}

          {buttonText && (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: delay + 0.5 }}
              className="mt-7"
            >
              <Link to={buttonTo || "#"}>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative inline-flex items-center gap-3 overflow-hidden bg-white px-9 py-3 text-xs md:text-sm font-medium tracking-[0.18em] text-neutral-900 uppercase"
                >
                  <span className="relative z-10">{buttonText}</span>
                  <ArrowRight
                    size={18}
                    className="relative z-10 transition-transform group-hover:translate-x-1"
                  />
                  {/* sliding dark overlay on hover */}
                  <motion.div
                    className="absolute inset-0 bg-black"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="absolute inset-0 z-10 flex items-center justify-center gap-2 text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <span>{buttonText}</span>
                    <ArrowRight size={18} />
                  </span>
                </motion.button>
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.3, repeat: Infinity }}
          className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/50 p-2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.3, repeat: Infinity }}
            className="h-1.5 w-1.5 rounded-full bg-white"
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
