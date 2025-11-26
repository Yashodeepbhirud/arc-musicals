import React from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

import pintya from "../assets/pintya.jpg";
import pintya2 from "../assets/pintya2.jpg";
import adhir2 from "../assets/adhir2.jpg";
import img4 from "../assets/pintya3.jpg";
import img5 from "../assets/pintya4.jpg";
import img6 from "../assets/adhir.jpg";
import vardan from "../assets/vardan.jpg";  
import vardan1 from "../assets/vardan1.jpg";
import adhir from "../assets/adhir.jpg";
import dwg from "../assets/dwg.png";
import dwg0 from "../assets/dwg0.jpeg";
import dwg1 from "../assets/dwg1.jpg";

export default function HeroSection() {
  return (
    <section className="relative w-full h-[92vh] overflow-hidden 
        bg-gradient-to-br from-black via-[#080808] to-[#151515] flex items-center">

      {/* --- Floating Glow Lights --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[650px] h-[650px] bg-arcgold/25 blur-[200px] rounded-full -top-32 -left-20" />
        <div className="absolute w-[550px] h-[550px] bg-purple-600/25 blur-[180px] rounded-full bottom-0 right-0" />
      </div>

      {/* --- Decorative Music Lines SVG --- */}
      <svg className="absolute top-0 left-0 w-full opacity-10" height="300">
        <path d="M0 150 C 200 50, 400 250, 600 150 S 1000 50, 1200 150" 
          stroke="#FFD95A" strokeWidth="2" fill="none" />
      </svg>

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between w-full">

        {/* ------------------ LEFT TEXT AREA ------------------ */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="text-left z-10"
        >
          <h1 className="text-6xl md:text-7xl font-extrabold leading-tight text-white drop-shadow-2xl">
            ARC <span className="text-arcgold">Musicals</span>
            <br />
            Create. Inspire. Repeat.
          </h1>

          <p className="mt-4 text-lg text-gray-300 max-w-xl leading-relaxed">
            Premium soundtracks, cinematic scores, heart-touching melodies and 
            original music crafted by
            <span className="text-arcgold font-medium"> Mr. Vipul Rajput</span>.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="px-6 py-3 rounded-xl bg-arcgold text-black font-bold flex items-center gap-2 hover:bg-[#ffdd66] transition">
              <Play size={18} />
              Listen Now
            </button>

            <button className="px-6 py-3 rounded-xl border border-gray-600 text-white hover:bg-white/10 transition">
              Explore Portfolio
            </button>
          </div>
        </motion.div>

{/* ------------------ RIGHT FLOATING ANIMATIONS ------------------ */}
<motion.div
  initial={{ opacity: 0, scale: 0.85 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 1, delay: 0.2 }}
  className="relative mt-16 md:mt-0 w-[650px] h-[650px]"
>

  {/* CENTER MAIN IMAGE */}
  <motion.img
    src={dwg}
    className="absolute w-80 h-80 rounded-2xl shadow-xl border border-white/10 top-[160px] left-[160px]"
    animate={{ y: [0, -16, 0] }}
    transition={{ duration: 4, repeat: Infinity }}
  />

  {/* ---------------- TOP LAYER ---------------- */}
  <motion.img
    src={pintya2}
    className="absolute w-44 h-44 rounded-xl shadow-xl border border-white/10 -top-6 left-18 rotate-[-8deg]"
    animate={{ y: [0, -12, 0] }}
    transition={{ duration: 3.2, repeat: Infinity }}
  />

  <motion.img
    src={img4}
    className="absolute w-48 h-48 rounded-xl shadow-xl border border-white/10 top-2 -right-36 rotate-[12deg]"
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 3.4, repeat: Infinity }}
  />

  {/* ---------------- LEFT SIDE ---------------- */}
  <motion.img
    src={img5}
    className="absolute w-56 h-36 rounded-xl shadow-xl border border-white/10 top-[160px] -left-20 rotate-[-10deg]"
    animate={{ y: [0, -9, 0] }}
    transition={{ duration: 3.1, repeat: Infinity }}
  />

  <motion.img
    src={vardan1}
    className="absolute w-64 h-34 rounded-xl shadow-xl border border-white/10 bottom-[190px] -left-28 rotate-[-6deg]"
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 3.3, repeat: Infinity }}
  />

  {/* ---------------- RIGHT SIDE ---------------- */}
  <motion.img
    src={adhir}
    className="absolute w-70 h-48 rounded-xl shadow-xl border border-white/10 -bottom-[35px] right-[60px] rotate-[10deg]"
    animate={{ y: [0, -11, 0] }}
    transition={{ duration: 3.5, repeat: Infinity }}
  />

  <motion.img
    src={adhir2}
    className="absolute w-44 h-44 rounded-xl shadow-xl border border-white/10 top-[210px] -right-32 rotate-[8deg]"
    animate={{ y: [0, -12, 0] }}
    transition={{ duration: 3, repeat: Infinity }}
  />

  {/* ---------------- BOTTOM WIDE IMAGES ---------------- */}
  <motion.img
    src={vardan}
    className="absolute w-48 h-22 rounded-xl shadow-xl border border-white/10 bottom-4 left-[490px] rotate-[6deg]"
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 3.8, repeat: Infinity }}
  />

  <motion.img
    src={pintya}
    className="absolute w-48 h-50 rounded-xl shadow-xl border border-white/10 top-[470px] left-[-66px] rotate-[4deg]"
    animate={{ y: [0, -11, 0] }}
    transition={{ duration: 3.7, repeat: Infinity }}
  />

  <motion.img
    src={dwg0}
    className="absolute w-68 h-40 rounded-xl shadow-xl border border-white/10 -top-[8px] right-[60px] rotate-[-6deg]"
    animate={{ y: [0, -9, 0] }}
    transition={{ duration: 3.6, repeat: Infinity }}
  />

</motion.div>

</div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-arcgold/80 rounded-full"
            initial={{ opacity: 0, x: Math.random() * 1400, y: Math.random() * 800 }}
            animate={{ opacity: [0.5, 1, 0.5], y: "-40%" }}
            transition={{ duration: 3 + Math.random() * 4, repeat: Infinity }}
            style={{ left: `${Math.random() * 100}%` }}
          />
        ))}
      </div>
    </section>
  );
}
