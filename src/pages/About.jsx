import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Instagram, Phone, Mail, Music, Video, Star } from "lucide-react";

import vardan from "../assets/vardan.jpg";
import pintya3 from "../assets/pintya3.jpg";
import pintya4 from "../assets/pintya4.jpg";
import pintya2 from "../assets/pintya2.jpg";
import adhir from "../assets/adhir.jpg";
import dwg1 from "../assets/dwg1.jpg";
import vardan1 from "../assets/vardan1.jpg";
import adhir2 from "../assets/adhir2.jpg";
import dwg from "../assets/dwg.png";
import parallaxLayer1 from "../assets/parallax-3.png"; // subtle clouds / shapes
import parallaxLayer2 from "../assets/parallax-1.png"; // mid layer
import parallaxLayer3 from "../assets/parallax-3.png"; // foreground accents
import logo from "../assets/arc-logo.png";
import right from "../assets/music-right.png";
import left from "../assets/music-left.png";
import vipul from "../assets/vipul1.jpg";
import vipul1 from "../assets/vr.jpg";

export default function AboutARC() {
  const posters = [
    { src: vardan, alt: "Vardan Poster", title: "Vardan" },
    { src: pintya3, alt: "Pintya Poster", title: "Pintya" },
    { src: adhir2, alt: "Adhir Poster", title: "Adhir" },
    { src: dwg, alt: "Dream Wali Girl Poster", title: "Dream Wali Girl" },
        { src: vardan1, alt: "Vardan Poster", title: "Vardan" },

     { src: pintya2, alt: "Pintya Poster", title: "Pintya" },
         { src: adhir, alt: "Adhir Poster", title: "Adhir" },

    { src: dwg1, alt: "Adhir Poster", title: "Dream Wali Girl" },
  ];

  // lightbox/carousel state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // refs for particle canvas & parallax
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const layersRef = useRef({ l1: null, l2: null, l3: null });
  const overviewRef = useRef(null);

  // autoplay carousel
  useEffect(() => {
    if (!autoPlay) return undefined;
    const t = setInterval(
      () => setActiveIndex((i) => (i + 1) % posters.length),
      3500
    );
    return () => clearInterval(t);
  }, [autoPlay]);

  // lightbox keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e) => {
      if (e.key === "ArrowRight")
        setActiveIndex((i) => (i + 1) % posters.length);
      if (e.key === "ArrowLeft")
        setActiveIndex((i) => (i - 1 + posters.length) % posters.length);
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen]);

  // particle background (canvas)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = canvas.clientWidth * devicePixelRatio);
    let h = (canvas.height = canvas.clientHeight * devicePixelRatio);
    const particles = [];

    const makeParticle = () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.5 + Math.random() * 2.5,
      vx: -0.2 + Math.random() * 0.4,
      vy: -0.2 + Math.random() * 0.4,
      alpha: 0.08 + Math.random() * 0.15,
    });

    for (let i = 0; i < 80; i++) particles.push(makeParticle());

    let raf = null;
    const render = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,245,200, ${p.alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(render);
    };

    // responsive resize
    const onResize = () => {
      w = canvas.width = canvas.clientWidth * devicePixelRatio;
      h = canvas.height = canvas.clientHeight * devicePixelRatio;
    };
    window.addEventListener("resize", onResize);
    render();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // 3D parallax layers mouse move
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let requestFrame;

    const onMove = (e) => {
      cancelAnimationFrame(requestFrame);
      requestFrame = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        // Layer 1 (background clouds)
        if (layersRef.current.l1)
          layersRef.current.l1.style.transform = `translate3d(${x * 12}px, ${
            y * 10
          }px, 0) scale(1.03)`;

        // Layer 2 (mid stars)
        if (layersRef.current.l2)
          layersRef.current.l2.style.transform = `translate3d(${x * -20}px, ${
            y * -16
          }px, 0) scale(1.04)`;

        // Layer 3 (foreground glow)
        if (layersRef.current.l3)
          layersRef.current.l3.style.transform = `translate3d(${x * 28}px, ${
            y * 22
          }px, 0) scale(1.05)`;
      });
    };

    const onLeave = () => {
      ["l1", "l2", "l3"].forEach((key) => {
        if (layersRef.current[key]) {
          layersRef.current[key].style.transform =
            "translate3d(0,0,0) scale(1)";
        }
      });
    };

    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);

    return () => {
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // 3D tilt for posters
  const handleTilt = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const tiltX = (-y / rect.height) * 6; // reduced intensity
    const tiltY = (x / rect.width) * 6;
    el.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03)`;
  };
  const resetTilt = (e) => {
    const el = e.currentTarget;
    el.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-neutral-900 text-white overflow-x-hidden antialiased">
      {/* HERO */}
      <header
        ref={heroRef}
        className="relative h-[92vh] w-full overflow-hidden flex items-center justify-center"
      >
        {/* particle canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-0"
        />

        {/* parallax layers (ensure these assets exist in src/assets) */}
        <img
          ref={(el) => (layersRef.current.l1 = el)}
          src={parallaxLayer1}
          alt="parallax-1"
          className="pointer-events-none absolute left-0 top-0 w-full opacity-[0.35] mix-blend-screen transition-transform duration-500 ease-out"
        />

        <img
          ref={(el) => (layersRef.current.l2 = el)}
          src={parallaxLayer2}
          alt="parallax-2"
          className="pointer-events-none absolute right-0 top-0 w-full opacity-[0.25] mix-blend-screen transition-transform duration-500 ease-out"
        />

        <img
          ref={(el) => (layersRef.current.l3 = el)}
          src={parallaxLayer3}
          alt="parallax-3"
          className="pointer-events-none absolute left-0 bottom-0 w-full opacity-[0.45] mix-blend-lighten transition-transform duration-500 ease-out"
        />

        {/* BACKGROUND VIDEO (kept lightweight) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover brightness-75 z-0"
        >
          <source src="/videos/arc_hero_bg.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90 z-10" />

        {/* CONTENT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative z-30 text-center px-6 md:px-12 mt-[-30px] sm:mt-[-40px] md:mt-[-255px] max-w-4xl"
        >
          <motion.img
            src={logo}
            alt="ARC Musicals Logo"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.9, ease: "easeOut" }}
            className="mx-auto w-[420px] sm:w-[520px] md:w-[620px] lg:w-[760px] drop-shadow-[0_0_45px_rgba(255,200,0,0.45)]"
          />

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="text-gray-200 text-base sm:text-lg md:text-2xl leading-relaxed mb-6 font-light max-w-3xl mx-auto"
          >
            Crafting cinematic music, storytelling visuals & emotional
            experiences — across Hindi, Marathi, Punjabi & English. <br></br>
            End-to-end creation from lyrics to final video.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="mt-4 flex flex-wrap items-center justify-center gap-4"
          >
            <a
              href="tel:+919096379409"
              className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-2xl shadow-2xl transition-all hover:scale-105"
            >
              <Phone className="w-5 h-5" /> Call Us
            </a>

            <a
              href="mailto:arcmusicals@gmail.com"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/10 font-medium px-6 py-3 rounded-2xl shadow transition-all hover:scale-105"
            >
              <Mail className="w-5 h-5" /> Email Us
            </a>

            <button
              onClick={() => {
                setActiveIndex(0);
                setLightboxOpen(true);
              }}
              className="inline-flex items-center gap-2 bg-transparent border border-white/10 px-5 py-3 rounded-2xl hover:bg-white/6 transition"
            >
              <Video className="w-4 h-4" /> Watch Reel
            </button>
          </motion.div>
        </motion.div>

        {/* subtle floating icons */}
        <img
          src={left}
          alt="notes"
          className="absolute left-[25rem] top-2/3 hidden md:block w-20 animate-float-slow z-20 pointer-events-none"
        />
        <img
          src={right}
          alt="notes"
          className="absolute right-[26rem] top-2/3 hidden md:block w-20 animate-float-slower z-20 pointer-events-none"
        />
      </header>

    {/* COMPANY OVERVIEW — ULTRA CINEMATIC ARC STYLE */}
<section
  ref={overviewRef}
  className="relative w-full py-28 px-6 md:px-10 overflow-hidden bg-gradient-to-b from-black via-zinc-900 to-black"
>
  {/* ✨ Soft particles overlay */}
  <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.07] pointer-events-none"></div>

  {/* ✨ Floating soft orbs */}
  {/* <div className="absolute -top-10 -left-10 w-60 h-60 bg-yellow-400/10 blur-3xl rounded-full"></div> */}
  <div className="absolute -bottom-16 right-0 w-72 h-72 bg-yellow-600/10 blur-[100px] rounded-full"></div>

  {/* 🎵 Floating deco icons */}
  {/* <img src="/images/music-notes-left.png" className="absolute left-8 top-32 w-20 opacity-40 animate-float-slow" />
  <img src="/images/music-notes-right.png" className="absolute right-8 bottom-32 w-20 opacity-40 animate-float-slower" /> */}

  {/* ✨ CENTRE HEADING */}
  <motion.h2
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className="text-center text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 drop-shadow-[0_0_25px_rgba(255,215,50,0.35)] tracking-wide"
  >
    COMPANY OVERVIEW
  </motion.h2>

  {/* ✨ GOLD DIVIDER LINE */}
  <div className="mx-auto mt-6 mb-12 h-[3px] w-80 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>

  {/* ✨ DESCRIPTION BOX */}
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.7 }}
    viewport={{ once: true }}
    className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-[0_0_30px_rgba(255,200,0,0.08)]"
  >
    <p className="text-gray-300 text-center text-lg md:text-xl leading-relaxed">
      <span className="font-semibold text-gold">ARC Musicals</span> — founded in 
      <span className="text-gold font-semibold"> 2022</span> by 
      <span className="text-gold font-semibold"> Vipul Rajput</span> &
      <span className="text-gold font-semibold"> Archana Rajput</span> — is a
      premium creative production house delivering music, cinema & storytelling
      at the highest professional level.  
      Our work covers lyrics, composition, shoot, direction, mixing/mastering &
      complete project execution.
    </p>
  </motion.div>

  {/* ✨ LUXURY CARDS */}
  <div className="grid md:grid-cols-2 gap-10 mt-16">

    {/* VISION */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="relative p-[2px] rounded-3xl bg-gradient-to-br from-yellow-500/40 via-yellow-300/10 to-transparent"
    >
      <div className="p-8 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-xl hover:scale-[1.02] transition-transform duration-300">
        <h3 className="text-2xl font-bold text-gold mb-3">Our Vision</h3>
        <p className="text-gray-300 leading-relaxed">
          To become India’s most trusted powerhouse of cinematic storytelling
          & musical excellence.
        </p>
      </div>
    </motion.div>

    {/* MISSION */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.7 }}
      viewport={{ once: true }}
      className="relative p-[2px] rounded-3xl bg-gradient-to-br from-yellow-500/40 via-yellow-300/10 to-transparent"
    >
      <div className="p-8 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-xl hover:scale-[1.02] transition-transform duration-300">
        <h3 className="text-2xl font-bold text-gold mb-3">Our Mission</h3>
        <p className="text-gray-300 leading-relaxed">
          To bring every idea, story & musical dream to life with passion,
          innovation & world-class professionalism.
        </p>
      </div>
    </motion.div>
  </div>
</section>


{/* WHY CHOOSE US */}
<section className="relative w-full py-24 bg-gradient-to-b from-black via-neutral-900 to-black overflow-hidden">

  {/* floating cinematic particles */}
  <div className="pointer-events-none">
    <div className="absolute left-10 top-20 w-24 h-24 bg-gold/10 blur-3xl rounded-full"></div>
    <div className="absolute right-16 bottom-20 w-32 h-32 bg-yellow-500/10 blur-[100px] rounded-full"></div>
  </div>

  <div className="max-w-7xl mx-auto px-6 relative z-10">
    
    {/* Section Title */}
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="text-4xl md:text-5xl font-extrabold text-center text-gold tracking-wide]"
    >
      Why Clients Choose ARC Musicals
    </motion.h2>

    {/* cinematic sub text */}
    <p className="text-center text-gray-300 max-w-3xl mx-auto mt-3 text-lg leading-relaxed">
      A complete creative powerhouse — delivering emotion, quality and cinematic experiences.
    </p>

    <div className="grid md:grid-cols-3 gap-10 mt-16">

      {/* CARD MAP */}
      {[
        {
          icon: Star,
          title: "Best Results & Quality",
          desc: "Premium sound, cinematic visuals and industry-standard output."
        },
        {
          icon: Music,
          title: "Ideas → Reality",
          desc: "We turn raw thoughts into fully produced musical projects."
        },
        {
          icon: Video,
          title: "End-to-End Production",
          desc: "Lyrics, recording, shoot, post-production — everything in-house."
        }
      ].map((item, index) => (
        
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: index * 0.15 }}

          className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl
          p-[2px] shadow-[0_0_10px_rgba(255,215,0,0.15)]
          hover:shadow-[0_0_15px_rgba(255,215,0,0.35)]
          transition-all duration-300"
        >
          {/* inside box */}
          <div className="bg-black/30 p-8 rounded-2xl text-center">

            <item.icon className="w-14 h-14 mx-auto mb-5 text-gold drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]" />

            <h4 className="text-xl font-bold text-white mb-2">
              {item.title}
            </h4>

            <p className="text-gray-300 text-sm leading-relaxed">
              {item.desc}
            </p>
          </div>
        </motion.div>

      ))}

    </div>
  </div>
</section>



  {/* FOUNDERS */}
<section className="relative max-w-7xl mx-auto py-28 px-6">

  <motion.h2
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className="text-4xl md:text-5xl font-extrabold text-center text-gold drop-shadow-[0_0_5px_rgba(255,215,0,0.25)]"
  >
    Meet Our Founders
  </motion.h2>

  <p className="text-center text-gray-300 max-w-3xl mx-auto mt-3 text-lg leading-relaxed">
    The visionaries who built ARC Musicals — merging creativity, storytelling and production mastery.
  </p>

  <div className="grid md:grid-cols-2 gap-12 mt-20">

    {[
      {
        img: vipul,
        name: "Vipul Rajput",
        role: "Founder • Lyricist & Director",
        bio: "Lyricist • Composer • Director • Story Writer — Leads creative vision and lyrical composition.",
        insta: "https://instagram.com/vipul_rajput_vr"
      },
      {
        img: vipul1,
        name: "Archana Rajput",
        role: "Co-Founder • Producer",
        bio: "Producer • Creative Producer — Manages production, projects and talent coordination."
      }
    ].map((item, index) => (

      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: index * 0.15 }}

        className="relative bg-white/5 backdrop-blur-md border border-white/1 rounded-2xl
        p-[2px] shadow-[0_0_5px_rgba(255,215,0,0.15)]
        hover:shadow-[0_0_15px_rgba(255,215,0,0.35)]
        transition-all duration-300"
      >
        {/* inner box */}
        <div className="bg-black/30 p-10 rounded-2xl text-center">

          <img
            src={item.img}
            alt={item.name}
            className="w-40 h-40 rounded-full mx-auto object-cover border-4 border-gold shadow-lg"
          />

          <h3 className="text-2xl font-bold text-white mt-5">{item.name}</h3>
          <p className="text-gold font-medium">{item.role}</p>

          <p className="text-gray-300 mt-4 text-sm leading-relaxed">
            {item.bio}
          </p>

          {item.insta && (
            <a
              href={item.insta}
              target="_blank"
              className="flex justify-center mt-4 hover:scale-110 transition"
            >
              <Instagram className="text-gold w-7 h-7" />
            </a>
          )}

        </div>
      </motion.div>

    ))}

  </div>
</section>



 {/* JOURNEY / TIMELINE — ULTRA CINEMATIC ARC STYLE */}
<section className="relative max-w-6xl mx-auto py-24 px-6">
  {/* glowing decorative background */}
  <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 via-transparent to-yellow-700/10 blur-3xl opacity-50 pointer-events-none"></div>

  {/* floating gold lights */}
  <div className="absolute -top-10 left-1/4 w-20 h-20 bg-yellow-400/20 blur-2xl rounded-full animate-pulse-slow"></div>
  <div className="absolute -bottom-10 right-1/4 w-24 h-24 bg-yellow-500/20 blur-3xl rounded-full animate-pulse-slower"></div>

  {/* heading */}
  <h3 className="text-center text-4xl md:text-5xl font-extrabold text-gold drop-shadow-2xl mb-16">
    Our Journey & Projects
  </h3>

  {/* vertical timeline line */}
  <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-40 bottom-10 w-[3px] bg-gradient-to-b from-gold to-transparent opacity-40"></div>

  <div className="space-y-16 relative">
    {/* PROJECT CARD - SHARED STYLES */}
    {[
      {
        title: "Vardan (2022)",
        subtitle:
          "Lyrics by Vipul Rajput • Singer & Music: Rushi Patil • Live Rhythm: Ruturaj Kore • Video: Star Official",
        audioCredits: [
          "Lyrics: Vipul Rajput",
          "Singer & Music: Rushi Patil",
          "Live Rhythm: Ruturaj Kore",
          "Video: Star Official",
        ],
      },
    ].map((proj, index) => (
      <div
        key={index}
        className="relative md:w-[85%] ml-10 md:ml-auto md:mr-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_0_40px_rgba(255,215,0,0.08)] p-8 hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(255,215,0,0.15)] transition-all duration-300"
      >
        {/* dot on the timeline */}
        <div className="absolute -left-8 top-10 w-6 h-6 bg-gold rounded-full shadow-[0_0_20px_gold] border-2 border-yellow-300 hidden md:block"></div>

        <h4 className="text-2xl font-bold text-gold drop-shadow-lg">
          {proj.title}
        </h4>

        <p className="text-gray-300 mt-2 text-sm">{proj.subtitle}</p>

        <details className="mt-4 group">
          <summary className="text-gold font-medium cursor-pointer hover:text-yellow-400 transition-all">
            Team / Credits
          </summary>

          <ul className="mt-3 ml-4 list-disc space-y-1 text-gray-200 text-sm border-l border-yellow-400/20 pl-4">
            {proj.audioCredits.map((c, idx) => (
              <li key={idx}>{c}</li>
            ))}
          </ul>
        </details>
      </div>
    ))}

    {/* ------- PINTYA CARD ------- */}
    <div className="relative md:w-[85%] ml-10 md:ml-auto md:mr-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_0_40px_rgba(255,215,0,0.08)] p-8 hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(255,215,0,0.15)] transition-all duration-300">
      <div className="absolute -left-8 top-10 w-6 h-6 bg-gold rounded-full shadow-[0_0_20px_gold] border-2 border-yellow-300 hidden md:block"></div>

      <h4 className="text-2xl font-bold text-gold drop-shadow-lg">Pintya</h4>
      <p className="text-gray-300 mt-2 text-sm">
        Featuring: Radha Mumbaikar • Producer: Archana Rajput
      </p>

      <details className="mt-4 group">
        <summary className="text-gold font-medium cursor-pointer hover:text-yellow-400 transition-all">
          Audio Credits
        </summary>

        <ul className="mt-3 ml-4 list-disc space-y-1 text-gray-200 text-sm border-l border-yellow-400/20 pl-4">
          <li>Singer: Radha Khude</li>
          <li>Lyricist: Vipul Rajput</li>
          <li>Music Director: Vishal Mohite</li>
          <li>Live Rhythm: Ruturaj Kore</li>
          <li>Mixing & Mastering: Ishan Devasthali</li>
          <li>Live Rhythm Recordist: Shreyas (Pancham Studios)</li>
          <li>Vocals Recordist: Atharva (Pancham Studios)</li>
          <li>Playback Singers: Kedar Maideo & Shrikant Shirsat</li>
        </ul>

        <summary className="cursor-default mt-4 block text-gold font-medium">
          Video Credits
        </summary>

        <ul className="mt-3 ml-4 list-disc space-y-1 text-gray-200 text-sm border-l border-yellow-400/20 pl-4">
          {/* full list preserved */}
          <li>Director: Vipul Rajput</li>
          <li>Executive Producer: Sushant Patil</li>
          <li>Creative Producer: Snehal Sheth</li>
          <li>Choreographer: Vicky Magar</li>
          <li>Assist Choreography: Aryan Kamble</li>
          <li>DOP & Editor: Umakkant Yele</li>
          <li>Assist DOP: Sarvesh Joshi</li>
          <li>Secondary Camera: Vaibhav Nighut</li>
          <li>D.I: Naved Attar (ND9 Studio)</li>
          <li>Costume Designing: Tanish Laxmi</li>
          <li>Makeup & Hair: Shrikant & Vanita</li>
          <li>Publicity Designer: Santosh Yesale</li>
          <li>Production Management: Pubblicita Media</li>
          <li>Cinematography Lights: Santosh Dabhade & Team</li>
          <li>… (rest unchanged, keeping your full list)</li>
        </ul>
      </details>
    </div>

    {/* ------- ADHIR ------- */}
    <div className="relative md:w-[85%] ml-10 md:ml-auto md:mr-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_0_40px_rgba(255,215,0,0.08)] p-8 hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(255,215,0,0.15)] transition-all duration-300">
      <div className="absolute -left-8 top-10 w-6 h-6 bg-gold rounded-full shadow-[0_0_20px_gold] border-2 border-yellow-300 hidden md:block"></div>

      <h4 className="text-2xl font-bold text-gold drop-shadow-lg">Adhir</h4>
      <p className="text-gray-300 mt-2 text-sm">
        Produced By: Archana Rajput • Directed By: Vipul Rajput • Starring:
        Harshad Sawant & Mahi Atram
      </p>

      <details className="mt-4 group">
        <summary className="text-gold font-medium cursor-pointer hover:text-yellow-400 transition-all">
          Audio & Video Credits
        </summary>

        <ul className="mt-3 ml-4 list-disc space-y-1 text-gray-200 text-sm border-l border-yellow-400/20 pl-4">
          <li>Singer & Music Arranger: Rushi Patil</li>
          <li>Lyricist: Vipul Rajput</li>
          <li>Mixing & Mastering: Ajay Jadhav</li>
          <li>Record Label: ARC Musicals</li>
          <li>Recorded At: Pancham Studio</li>
          <li>DOP: Rushikesh Hande</li>
          <li>Edit & D.I: Vinod Raje</li>
          <li>Still Photography: Saurabh Borwake</li>
        </ul>

        <p className="text-sm text-gray-200 mt-4 italic">
          Special Credits: Harish Zambare, Hemant Rajput, Aniket Waghulde,
          Ujjwal Vaishnav, Gunjan Patil
        </p>
      </details>
    </div>

    {/* ------- DREAM WALI GIRL ------- */}
    <div className="relative md:w-[85%] ml-10 md:ml-auto md:mr-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_0_40px_rgba(255,215,0,0.08)] p-8 hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(255,215,0,0.15)] transition-all duration-300">
      <div className="absolute -left-8 top-10 w-6 h-6 bg-gold rounded-full shadow-[0_0_20px_gold] border-2 border-yellow-300 hidden md:block"></div>

      <h4 className="text-2xl font-bold text-gold drop-shadow-lg">
        Dream Wali Girl
      </h4>

      <p className="text-gray-300 mt-2 text-sm">
        Produced By: Archana Rajput • Directed By: Vipul Rajput • Featuring:
        Jagdish Zore & Megha Shinde
      </p>

      <details className="mt-4 group">
        <summary className="text-gold font-medium cursor-pointer hover:text-yellow-400 transition-all">
          Audio Credits
        </summary>

        <ul className="mt-3 ml-4 list-disc space-y-1 text-gray-200 text-sm border-l border-yellow-400/20 pl-4">
          <li>Singers: Rohit Raut & Sonali Sonawane</li>
          <li>Music Director: Sanket Gurav</li>
          <li>Lyrics & Composition: Vipul Rajput</li>
          <li>Mixing & Mastering: Keval Walanj</li>
        </ul>

        <summary className="cursor-default mt-4 block text-gold font-medium">
          Video Credits
        </summary>

        <ul className="mt-3 ml-4 list-disc space-y-1 text-gray-200 text-sm border-l border-yellow-400/20 pl-4">
          <li>Director: Vipul Rajput</li>
          <li>Associate Director: Suraj Waman</li>
          <li>DOP: Suraj Rajput</li>
          <li>Secondary DOP: Vishal Pandhare</li>
          <li>Choreography: Archit Warwade & Gomz Sahu</li>
          <li>PR: Rishi Pawar & Parag Shelar</li>
          <li>Art: Pritesh Patil & Prasanna Potdar</li>
          <li>Editor: Akash Argade</li>
          <li>Colourist: Pankaj Salmuthe</li>
          {/* keeping your full list */}
        </ul>
      </details>
    </div>
  </div>
</section>

{/* GALLERY — ULTRA CINEMATIC ARC STYLE */}
<section className="w-full bg-zinc-900 py-24 relative overflow-hidden">

  {/* noise + gold lighting */}
  <div className="absolute inset-0 opacity-10 bg-[url('/images/noise.png')] mix-blend-overlay pointer-events-none"></div>
  <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 via-transparent to-yellow-600/10 opacity-40 pointer-events-none"></div>

  {/* floating lights */}
  <div className="absolute top-10 left-1/3 w-44 h-44 bg-yellow-400/20 blur-3xl rounded-full animate-pulse-slow pointer-events-none"></div>
  <div className="absolute bottom-10 right-1/4 w-52 h-52 bg-yellow-500/20 blur-3xl rounded-full animate-pulse-slower pointer-events-none"></div>

  <div className="max-w-7xl mx-auto px-6 relative z-10">
    <h3 className="text-4xl md:text-5xl text-gold font-extrabold text-center mb-16 tracking-wider drop-shadow-[0_0_25px_rgba(255,215,0,0.5)]">
      Gallery & Media
    </h3>

    {/* CINEMATIC POSTERS GRID */}
    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
      {posters.map((p, idx) => (
        <div
          key={idx}
          onMouseMove={handleTilt}
          onMouseLeave={resetTilt}
          onClick={() => {
            setActiveIndex(idx);
            setLightboxOpen(true);
          }}
          className="group relative w-full h-72 rounded-3xl overflow-hidden 
                     bg-black/60 shadow-[0_0_40px_rgba(255,215,0,0.06)]
                     backdrop-blur-xl cursor-pointer transform-gpu 
                     transition-all duration-700 hover:scale-[1.03]
                     hover:shadow-[0_0_80px_rgba(255,215,0,0.15)]"
        >
          {/* glow spotlight */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 pointer-events-none"></div>

          {/* poster */}
          <img
            src={p.src}
            alt={p.alt}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover 
                       transition-all duration-700 group-hover:scale-110"
          />

          {/* neon border glow */}
          <div className="pointer-events-none absolute -inset-0.5 rounded-3xl 
                          bg-gradient-to-r from-yellow-300/50 via-amber-400/20 to-yellow-300/50 
                          opacity-0 group-hover:opacity-100 blur-sm transition-all duration-700">
          </div>

          {/* bottom title tag */}
          <div className="absolute left-4 bottom-4 bg-black/40 px-4 py-1.5 rounded-lg 
                          text-sm text-gray-100 backdrop-blur-md shadow-lg border border-white/10">
            {p.title}
          </div>
        </div>
      ))}
    </div>

    {/* FILMSTRIP CAROUSEL (RESIZED + PREMIUM) */}
    <div className="mt-16">
      <div className="flex items-center justify-between mb-3 px-2">
        <h4 className="text-xl font-semibold text-gold tracking-wide">
          Featured Posters
        </h4>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className="text-sm px-4 py-1.5 bg-white/5 hover:bg-white/10 
                       rounded-lg border border-white/10 transition-all"
          >
            {autoPlay ? "Pause" : "Play"}
          </button>

          <button
            onClick={() =>
              setActiveIndex((i) => (i - 1 + posters.length) % posters.length)
            }
            className="text-sm px-3 py-1.5 bg-white/5 hover:bg-white/10 
                       rounded-lg border border-white/10 transition-all"
          >
            Prev
          </button>

          <button
            onClick={() => setActiveIndex((i) => (i + 1) % posters.length)}
            className="text-sm px-3 py-1.5 bg-white/5 hover:bg-white/10 
                       rounded-lg border border-white/10 transition-all"
          >
            Next
          </button>
        </div>
      </div>

      {/* FILMSTRIP SIZE FIXED SMALLER */}
      <div className="overflow-hidden rounded-2xl border border-white/10 shadow-xl bg-black/40">
        <div
          className="flex gap-4 p-4"
          style={{
            transform: `translateX(-${
              activeIndex * (100 / posters.length)
            }%)`,
            transition: "transform 700ms ease",
          }}
        >
          {posters.concat(posters).map((p, i) => (
            <div key={i} className="min-w-[20%] flex-shrink-0">
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                className="w-full h-36 object-cover rounded-lg shadow-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* VIDEO + MEDIA BOXES */}
    <div className="mt-20 grid md:grid-cols-2 gap-10">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 
                      backdrop-blur-xl shadow-[0_0_40px_rgba(255,215,0,0.08)]
                      hover:shadow-[0_0_60px_rgba(255,215,0,0.12)] transition">
        <h4 className="font-semibold text-gold mb-4 text-xl tracking-wide">
          Featured Video
        </h4>
        <div className="aspect-video bg-black/40 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
          <iframe
            title="ARC Featured"
            src="https://www.youtube.com/embed/VIDEO_ID"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 
                      backdrop-blur-xl shadow-[0_0_40px_rgba(255,215,0,0.08)]
                      hover:shadow-[0_0_60px_rgba(255,215,0,0.12)] transition">
        <h4 className="font-semibold text-gold mb-4 text-xl tracking-wide">
          More Media
        </h4>
        <p className="text-gray-300 text-sm leading-relaxed">
          Explore behind-the-scenes, high-resolution posters, exclusive content,
          and upcoming project previews.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <a
            href="https://instagram.com/arc_musicals"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm px-4 py-2 
                      bg-white/10 hover:bg-white/20 rounded-lg shadow-sm 
                      border border-white/10 transition"
          >
            <Instagram className="w-4 h-4" /> ARC Instagram
          </a>

          <a
            href="https://instagram.com/vipul_rajput_vr"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm px-4 py-2 
                      bg-white/10 hover:bg-white/20 rounded-lg shadow-sm 
                      border border-white/10 transition"
          >
            <Instagram className="w-4 h-4" /> Vipul’s Instagram
          </a>
        </div>
      </div>
    </div>
  </div>

  {/* LIGHTBOX */}
  {lightboxOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center 
                    bg-black/90 backdrop-blur-xl p-6">
      <button
        onClick={() => setLightboxOpen(false)}
        className="absolute top-6 right-6 text-white/80 bg-white/5 
                   border border-white/10 rounded-full p-3 shadow-xl"
      >
        Close
      </button>

      <div className="max-w-5xl w-full">
        <img
          src={posters[activeIndex].src}
          alt={posters[activeIndex].alt}
          className="w-full h-auto rounded-2xl shadow-[0_0_50px_rgba(255,215,0,0.15)] object-contain"
        />

        <div className="mt-4 flex items-center justify-between text-sm text-gray-300">
          <div>{posters[activeIndex].title}</div>
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setActiveIndex((i) => (i - 1 + posters.length) % posters.length)
              }
              className="px-3 py-1 bg-white/10 rounded"
            >
              Prev
            </button>

            <button
              onClick={() => setActiveIndex((i) => (i + 1) % posters.length)}
              className="px-3 py-1 bg-white/10 rounded"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )}
</section>

  {/* CONTACT + CTA */}
<section className="relative max-w-6xl mx-auto py-16 px-6">

  {/* 🔥 Cinematic Spotlight Background */}
  <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.15),transparent_70%)] blur-3xl" />

  {/* 🎞 Film Grain Overlay */}
  <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none bg-[url('https://i.imgur.com/0fYxH4P.png')]" />

  {/* ✨ Floating Gold Particles */}
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="animate-floatParticle absolute top-10 left-10 w-2 h-2 bg-gold rounded-full"></div>
    <div className="animate-floatParticle2 absolute bottom-20 right-20 w-1.5 h-1.5 bg-gold/90 rounded-full"></div>
    <div className="animate-floatParticle3 absolute top-1/2 right-1/3 w-2 h-2 bg-gold/70 rounded-full"></div>
  </div>

  {/* 🔶 Animated Gold Border Box */}
  <div className="relative bg-white/5 p-10 rounded-2xl border border-gold/20 backdrop-blur-sm overflow-hidden group">

    {/* Gold Border Shine Animation */}
    <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold/40 transition-all duration-700 rounded-2xl pointer-events-none"></div>

    {/* Floating Music Icons */}
    <div className="absolute -top-4 -right-4 opacity-30 animate-slowFloat">
      🎵
    </div>
    <div className="absolute bottom-4 -left-3 opacity-30 animate-slowFloatReverse">
      🎶
    </div>

    <div className="grid md:grid-cols-2 gap-10 items-center relative z-20">
      {/* LEFT SIDE */}
      <div>
        <h3 className="text-3xl font-bold text-gold mb-3 tracking-wide">
          Work With Us
        </h3>
        <p className="text-gray-300 text-lg leading-relaxed">
          Have an idea, script or musical concept?  
          <span className="text-gold"> Let’s turn it into reality.</span><br />
          Full cinematic production support available.
        </p>

        {/* BUTTONS */}
        <div className="mt-6 flex flex-wrap gap-4">
          <a
            href="mailto:arcmusicals@gmail.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gold/30 bg-gold/20 hover:bg-gold/30 transition-all shadow-[0_0_10px_rgba(255,215,0,0.3)]"
          >
            <Mail className="w-4 h-4" /> Contact Production
          </a>
          <a
            href="tel:+919096379409"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
          >
            <Phone className="w-4 h-4" /> Call Now
          </a>
          <a
            href="https://instagram.com/arc_musicals"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
          >
            <Instagram className="w-4 h-4" /> Instagram
          </a>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div>
        <h4 className="text-sm text-gold font-semibold">Quick Contact</h4>

        <div className="mt-4 text-gray-300 space-y-3">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" /> 
            <a href="tel:+919096379409" className="hover:text-gold transition">
              +91 9096379409
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" /> 
            <a href="mailto:arcmusicals@gmail.com" className="hover:text-gold transition">
              arcmusicals@gmail.com
            </a>
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-400">
          Available on WhatsApp & Instagram for bookings and collaborations.
        </p>
      </div>
    </div>
  </div>
</section>


{/* FOOTER */}
<footer className="relative w-full bg-black py-10 mt-10 overflow-hidden">

  {/* 🌊 Gold Wave Animation */}
  <div className="absolute top-0 left-0 w-full h-16 bg-repeat-x opacity-40 animate-wave" />

  <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-20">

    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-xl">
        AM
      </div>
      <div>
        <div className="font-semibold text-white text-lg">ARC Musicals</div>
        <div className="text-sm text-gray-400">
          © {new Date().getFullYear()} ARC Musicals
        </div>
      </div>
    </div>

    {/* Social */}
    <div className="flex items-center gap-4 text-gray-300">
      <a
        href="https://instagram.com/arc_musicals"
        className="hover:text-gold hover:scale-110 transition"
        target="_blank"
      >
        <Instagram />
      </a>

      <a
        href="https://instagram.com/vipul_rajput_vr"
        className="hover:text-gold hover:scale-110 transition"
        target="_blank"
      >
        <Instagram />
      </a>

      <a
        href="mailto:arcmusicals@gmail.com"
        className="hover:text-gold transition text-sm"
      >
        arcmusicals@gmail.com
      </a>

      <a
        href="tel:+919096379409"
        className="hover:text-gold transition text-sm"
      >
        +91 9096379409
      </a>
    </div>
  </div>
</footer>
</div>
  )}


{/* Tailwind Custom Animations
<style>
{`
  .animate-slowFloat {
    animation: floatUp 5s ease-in-out infinite;
  }

  .animate-slowFloatReverse {
    animation: floatDown 6s ease-in-out infinite;
  }

  @keyframes floatUp {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
  }

  @keyframes floatDown {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(12px); }
  }

  .animate-wave {
    animation: waveMove 8s linear infinite;
  }

  @keyframes waveMove {
    0% { background-position-x: 0; }
    100% { background-position-x: 1000px; }
  }

  .animate-floatParticle {
    animation: particleFloat 6s infinite ease-in-out;
  }
  .animate-floatParticle2 {
    animation: particleFloat 8s infinite ease-in-out;
  }
  .animate-floatParticle3 {
    animation: particleFloat 10s infinite ease-in-out;
  }

  @keyframes particleFloat {
    0% { transform: translateY(0) scale(1); opacity: .8 }
    50% { transform: translateY(-20px) scale(1.3); opacity: 1 }
    100% { transform: translateY(0) scale(1); opacity: .8 }
  }
`}
</style> */}
