// src/components/SongCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";

export default function SongCard({ song }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      transition={{ type: "spring", stiffness: 150 }}
      className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl
                 border border-white/10 shadow-xl rounded-xl overflow-hidden relative"
    >
      {/* Thumbnail */}
      <Link to={`/songs/${song.id}`}>
        <div className="relative">
          <img
            src={song.thumbnail || "/placeholder_thumb.jpg"}
            alt={song.title}
            className="w-full h-48 object-cover"
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
            <PlayCircle className="text-arcgold" size={60} />
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-white group-hover:text-arcgold transition">
          {song.title}
        </h3>

        <p className="text-xs text-arc-muted mt-1">
          {song.singer || "Unknown Singer"}
        </p>

        {song.published && (
          <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full bg-arcgold text-arcdark font-semibold">
            Published
          </span>
        )}
      </div>
    </motion.div>
  );
}
