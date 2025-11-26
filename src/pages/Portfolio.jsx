import React from "react";
import { motion } from "framer-motion";
import { PenTool, Video, Music, Sparkles, Feather } from "lucide-react";
import arcshadow from "../assets/arc-shadow.png";
export default function Portfolio() {
  return (
    <section className="relative bg-[#050505] py-28 overflow-hidden">
      {/* Neon Rings Background */}
      <FloatingRings />

      <div className="max-w-6xl mx-auto px-6 relative z-20">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <h2
            className="text-6xl md:text-7xl font-extrabold tracking-wider 
            bg-gradient-to-r from-arcgold to-white text-transparent bg-clip-text drop-shadow-[0_0_5px_rgba(255,215,0,0.4)]"
          >
            Artist Portfolio
          </h2>

          <p className="text-arc-muted text-xl mt-4">
            A cinematic journey of creative direction & soulful artistry
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl p-12
          bg-gradient-to-br from-white/10 via-white/5 to-transparent
          border border-white/10 backdrop-blur-
          shadow-[0_0_60px_rgb(0, 0, 0)]
          max-w-5xl mx-auto"
        >
          <GlowHalo />

          <div className="flex flex-col md:flex-row items-center gap-14">
            {/* Image Frame – Holographic */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="relative"
            >
              <div
                className="w-60 h-60 rounded-3xl bg-[#111]/70 
                border border-white/10 backdrop-blur-xl flex items-center justify-center
                text-gray-300"
              >
                Upload Your Photo
              </div>

              {/* Holographic Edge */}
              <div
                className="absolute inset-0 rounded-3xl 
                bg-gradient-to-br from-[#A855F7]/20 via-[#EC4899]/10 to-transparent blur-xl"
              ></div>
            </motion.div>

            {/* Text */}
            <div className="flex-1 space-y-5">
              <h3
                className="text-4xl font-extrabold tracking-wider 
            bg-gradient-to-r from-arcgold to-white text-transparent bg-clip-text drop-shadow-[0_0_5px_rgba(255,215,0,0.4)]"
              >
                Mr. Vipul Rajput
              </h3>

              <p className="text-gray-400 text-lg leading-relaxed">
                Lyricist • Song Director • Visionary Creative Artist
              </p>

              {/* Neon Feature Badges */}
              <div className="grid grid-cols-2 gap-5 pt-4">
                <Badge
                  icon={<PenTool size={18} />}
                  title="60+ Lyrics"
                  subtitle="Original work"
                />
                <Badge
                  icon={<Video size={18} />}
                  title="4+ Directed Songs"
                  subtitle="Cinematic visuals"
                />
                <Badge
                  icon={<Music size={18} />}
                  title="Musical Vision"
                  subtitle="Unique style"
                />
                <Badge
                  icon={<Sparkles size={18} />}
                  title="ARC Musicals"
                  subtitle="Creative Label"
                />
              </div>

              {/* Signature Box */}
              <div className="pt-7">
                <p className="text-gray-400 text-sm mb-2">
                  Official Signature:
                </p>

                <div
                  className="w-44 h-20 rounded-xl border border-white/10 
                  bg-white/5 text-gray-500 text-xs flex items-center justify-center"
                >
                  Upload Signature
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Brand Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mt-32"
        >
          <h3 className="text-4xl font-semibold text- drop-shadow">
            ARC Musicals
          </h3>

          <p className="text-gray-400 text-lg mt-2">
            Creating timeless musical stories.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* BADGE */
function Badge({ icon, title, subtitle }) {
  return (
    <motion.div
      whileHover={{ scale: 1.07 }}
      className="p-4 rounded-xl bg-gradient-to-br from-[#1f1f1f] to-[#121212]
      border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)] 
      flex items-center gap-3"
    >
      <div className="text-[#8B5CF6]">{icon}</div>
      <div>
        <div className="text-white font-semibold">{title}</div>
        <div className="text-gray-500 text-xs">{subtitle}</div>
      </div>
    </motion.div>
  );
}

/* RINGS BG */
function FloatingRings() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-white/5"
          style={{
            width: 500 + i * 350,
            height: 500 + i * 350,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20 + i * 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

/* CENTER GLOW */
function GlowHalo() {
  return (
    <div
      className="absolute -inset-20 rounded-[40px] bg-gradient-to-br 
      from-[#8B5CF6]/10 via-[#F43F5E]/10 to-transparent blur-3xl"
    ></div>
  );
}
