import React from "react";
import { motion } from "framer-motion";
import art1 from "../../assets/a1.png";
import art2 from "../../assets/a2.png";
import art3 from "../../assets/a3.png";


export default function Hero() {
  const images = [art1, art2, art3];

  const handleExploreClick = () => {
    const el = document.getElementById("products");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // fallback: scroll down one viewport height
      window.scrollBy({ top: window.innerHeight, left: 0, behavior: "smooth" });
    }
  };
  const handleCustoClick = () => {
    const el = document.getElementById("footer");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // fallback: scroll down one viewport height
      window.scrollBy({ top: window.innerHeight, left: 0, behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-100 md:min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#fefaf6] to-[#f8f4ef]">
      {/* Background Grid */}
      <div className="absolute inset-0 grid grid-cols-2  md:grid-cols-3 gap-4 opacity-70">
        {images.slice(0, 2).map((src, i) => (
          <motion.img
            key={i}
            src={src}
            alt={`artwork-${i}`}
            className={`rounded-2xl object-cover w-full h-120 md:h-full  transform ${
              i % 2 === 0 ? "rotate-2" : "-rotate-2"
            }`}
            whileHover={{ scale: 1.05, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          />
        ))}
        {images[2] && (
            <motion.img
            src={images[2]}
            alt="artwork-2"
            className="hidden md:block rounded-2xl object-cover w-full h-full transform rotate-1"
            whileHover={{ scale: 1.05, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 100 }}
            />
        )}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#fefaf6] via-white/70 to-transparent pointer-events-none" />

      {/* Text Overlay */}
        <div className="relative z-10 text-center px-6 max-w-4xl">
        {/* Brand Title */}
        <motion.h1
            className="text-base text-sm md:text-lg tracking-[0.25em] uppercase text-gray-800 md:mb-6 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
        >
            <span className="text-[var(--brand-blue)]">[</span>
            Dheeraj Artworks
            <span className="text-[var(--brand-blue)]">]</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
            className="font-serif text-2xl md:text-5xl font-semibold leading-snug text-gray-900 md:mb-12 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            >
            Crafted with {" "}
            <span
            className="relative z-10 font-semibold transition-transform duration-500 group-hover:scale-105"
            style={{
                background: "linear-gradient(90deg, var(--brand-blue), #38bdf8, var(--brand-blue))",
                WebkitBackgroundClip: "text",
                color: "transparent",
            }}
            >
            soul
            </span>
            , color, and chaos
            </motion.p>



        {/* Button */}
        <div className="gap-5">
          <motion.button
              className="mr-5 bg-gradient-to-r from-[var(--blue-light)] to-sky-500 hover:opacity-100 text-white px-4 md:px-10 py-3 rounded-full text-sm md:text-lg shadow-sm transition-transform duration-300 hover:scale-105"
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 150 }}
              onClick={handleExploreClick}
          >
              Explore Gallery
          </motion.button>
          <motion.button
              className="bg-gradient-to-r from-[var(--blue-light)] to-sky-500 hover:opacity-100 text-white px-5 md:px-10 py-3 rounded-full text-sm md:text-lg shadow-sm transition-transform duration-300 hover:scale-105"
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 150 }}
              onClick={handleCustoClick}
          >
              Customize Art
          </motion.button>
        </div>
        </div>


    </section>
  );
}
