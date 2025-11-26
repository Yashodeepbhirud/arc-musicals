// src/pages/Home.jsx
import React from "react";
import HeroSection from "../pages/Hero";
import ArtistPortfolio from "../pages/Portfolio";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import TimelineCard from "../components/TimelineCard";
import arcshadow from "../assets/arc-shadow.png";

// ------------------------------------------------------------
// PREMIUM DECORATIVE BACKGROUND
// ------------------------------------------------------------
const BgGlow = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="absolute w-[600px] h-[600px] bg-arcgold/20 blur-[180px] rounded-full -top-40 -left-32 opacity-40" />
    <div className="absolute w-[500px] h-[500px] bg-purple-600/20 blur-[180px] rounded-full top-20 right-0 opacity-30" />
  </div>
);

export default function Home({ songs = [] }) {
  const published = (songs || []).filter((s) => s.published).slice(0, 8);
  const recent = (songs || []).slice(0, 12);

  return (
    <div className="relative">
      <BgGlow />

      {/* HERO SECTION (UNCHANGED) */}
      <HeroSection />

      {/* ------------------------------------------------------------
          NEW PREMIUM FEATURED RELEASES SECTION
      ------------------------------------------------------------ */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 mt-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-semibold tracking-wide">
            Featured Releases
          </h2>
          <Link
            to="/songs"
            className="text-sm text-white/80 hover:text-arcgold"
          >
            View all →
          </Link>
        </div>

        <div className="relative">
          <div className="flex overflow-x-auto gap-6 no-scrollbar py-4">
            {published.map((s) => (
              <div
                key={s.id}
                className="min-w-[260px] max-w-[260px] bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl overflow-hidden hover:scale-105 transition-all duration-300"
              >
                <img
                  src={s.thumbnail || "/thumbs/placeholder.jpg"}
                  alt={s.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-lg">{s.title}</h4>
                  <p className="text-sm text-arc-muted">{s.singer}</p>

                  {s.youtube && (
                    <a
                      href={`https://youtube.com/watch?v=${s.youtube}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-arcgold mt-2 inline-block hover:underline"
                    >
                      Watch on YouTube →
                    </a>
                  )}
                </div>
              </div>
            ))}

            {published.length === 0 && (
              <p className="text-arc-muted">No published songs.</p>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------
          ARTIST PORTFOLIO (REMAINS SAME)
      ------------------------------------------------------------ */}
      <section className="mx-auto px-6 md:px-10 mt-20">
        <ArtistPortfolio />
      </section>

     {/* ------------------------------------------------------------
      ARTIST JOURNEY — PREMIUM GOLDEN TIMELINE (NEW SECTION)
------------------------------------------------------------ */}
<section className="max-w-6xl mx-auto px-6 md:px-10 mt-24 relative">

  {/* Glow behind section */}
  <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-arcgold/10 blur-[180px] rounded-full opacity-40 pointer-events-none"></div>

  <motion.h3
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="text-4xl md:text-5xl font-bold text-center text-arcgold drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]"
  >
    Artistic Journey
  </motion.h3>

  <p className="text-center text-arc-muted mt-4 max-w-2xl mx-auto">
    A timeless path of creativity, storytelling and soulful musical excellence.
  </p>

  {/* TIMELINE */}
  <div className="relative mt-16">

    {/* Vertical Line */}
    <div className="absolute left-1/2 top-0 h-full w-[3px] bg-gradient-to-b from-arcgold/40 to-transparent"></div>

    <div className="space-y-14">

      {/* Step 1 */}
      <TimelineCard
        year="2016"
        title="Journey Begins"
        description="Started shaping ideas into soulful lyrics inspired by daily life and emotions."
        side="left"
      />

      {/* Step 2 */}
      <TimelineCard
        year="2018"
        title="First Lyrics Milestone"
        description="Completed the first official set of written lyrics and original compositions."
        side="right"
      />

      {/* Step 3 */}
      <TimelineCard
        year="2022"
        title="ARC Musicals Creation"
        description="Founded ARC Musicals — a brand designed to blend cinematic visuals with powerful music."
        side="left"
      />

      {/* Step 4 */}
      <TimelineCard
        year="2023"
        title="Professional Song Direction"
        description="Started directing professional music videos with a signature cinematic touch."
        side="right"
      />

      {/* Step 5 */}
      <TimelineCard
        year="2024"
        title="Expanding Creative Vision"
        description="Wrote 60+ lyrics, directed multiple songs, and built a modern storytelling identity."
        side="left"
      />

    </div>
  </div>
</section>

      {/* ------------------------------------------------------------
          NEW PREMIUM CALL-TO-ACTION BOX
      ------------------------------------------------------------ */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 mt-24">
        <div className="rounded-3xl p-10 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-2xl border border-white/10 shadow-2xl">
          <h3 className="text-3xl font-bold">Work With ARC Musicals</h3>
          <p className="text-arc-muted mt-2">
            Collaborate with Vipul Rajput and the ARC Musicals team for
            direction, score composition, lyrical writing, or full production.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href="/contact"
              className="px-5 py-3 rounded-xl bg-arcgold text-black font-semibold shadow-lg hover:brightness-110"
            >
              Contact Now
            </a>
            <a
              href="/admin"
              className="px-5 py-3 rounded-xl border border-white/10 hover:bg-white/10"
            >
              Manage Songs
            </a>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------
          NEW CINEMATIC FOOTER
      ------------------------------------------------------------ */}
      <footer className="mt-28 pt-20 pb-12 bg-black/40 border-t border-white/10 backdrop-blur-xl relative">
        <BgGlow />

        <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
          <img
            src={arcshadow}
            alt="ARC Musicals"
            className="mx-auto w-64 h-120 mb-4 opacity-90"
          />

          <p className="text-xl font-semibold tracking-wide text-white/80">
            ARC Musicals • Film • Music • Production
          </p>

          <p className="text-arc-muted mt-3">
            Crafting cinematic music experiences with heart and vision.
          </p>

          <div className="mt-6 flex justify-center gap-6 text-white/70 text-sm">
            <a href="/about" className="hover:text-arcgold">About</a>
            <a href="/songs" className="hover:text-arcgold">Songs</a>
            <a href="/contact" className="hover:text-arcgold">Contact</a>
          </div>

          <p className="text-arc-muted mt-10 text-sm">
            © {new Date().getFullYear()} ARC Musicals – All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}


// 1.Implement global Multi-battery SOC aggregation engine.
// 2.Integrate interactive SOC tooltip with Real-time battery breakdown.
// 3.Apply dynamic SOC threshold logic with Adaptive color mapping.
// 4.Refactor motor module to remove legacy and non-functional parameters.
// 5.Enable real-time telemetry rendering for individual battery modules.
// 6.Stabilize data pipeline for accurate WebSocket to UI state synchronization.
// 7.Validate Native WebSocket transport layer and end-to-end data flow.
// 8.Develop unified average battery SOC UI component with live binding.
// 9.Conduct full-system QA: UI, WebSocket stream, data consistency and performance.