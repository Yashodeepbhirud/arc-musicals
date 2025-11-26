// src/pages/SongDetail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function SongDetail({ songs = [] }) {
  const { id } = useParams();
  const song = songs.find((s) => s.id === id);

  if (!song)
    return (
      <div className="pt-32 text-center text-arc-muted text-xl">
        Song not found.
      </div>
    );

  return (
    <section className="pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Back button */}
        <Link
          to="/songs"
          className="inline-flex items-center gap-2 text-arcgold hover:underline"
        >
          <ArrowLeft size={18} /> Back to Songs
        </Link>

        {/* Title */}
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-white mt-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {song.title}
        </motion.h1>

        <p className="text-arc-muted text-sm mt-2">{song.singer}</p>

        {/* YouTube Video */}
        {song.youtube && (
          <motion.div
            className="mt-8 rounded-xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <iframe
              className="w-full h-64 md:h-96"
              src={`https://www.youtube.com/embed/${song.youtube}`}
              title={song.title}
              allowFullScreen
            />
          </motion.div>
        )}

        {/* Credits */}
        <motion.div
          className="mt-10 arc-glass rounded-xl p-6 shadow-lg border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl text-arcgold font-bold mb-4">Song Credits</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white/90">
            <Credit label="Lyricist" value={song.lyricist} />
            <Credit label="Director" value={song.director} />
            <Credit label="Singer" value={song.singer} />
            <Credit label="Music" value={song.music} />
            <Credit label="Production Team" value={song.production} />
            <Credit label="Camera & Photography" value={song.camera} />
            <Credit label="Costume Designer" value={song.costume} />
            <Credit label="BTS Videographer" value={song.bts} />
          </div>
        </motion.div>

        {/* Lyrics */}
        <motion.div
          className="mt-10 p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl font-bold text-arcgold mb-4">Lyrics</h2>
          
          {song.lyrics ? (
            <pre className="whitespace-pre-wrap text-white leading-relaxed text-sm md:text-base">
              {song.lyrics}
            </pre>
          ) : (
            <p className="text-arc-muted italic">Lyrics will be added soon.</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function Credit({ label, value }) {
  return (
    <div>
      <div className="text-arc-muted text-xs">{label}</div>
      <div className="font-semibold">{value || "—"}</div>
    </div>
  );
}
