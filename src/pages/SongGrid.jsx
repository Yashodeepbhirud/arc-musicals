import React from "react";
import SongCard from "./SongCard";
import { motion } from "framer-motion";

export default function SongGrid({ songs = [] }) {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        
        <motion.h2
          className="text-3xl md:text-4xl font-extrabold text-white mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Latest Songs
        </motion.h2>

        {songs.length === 0 && (
          <p className="text-arc-muted text-center text-lg">
            No songs available yet.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {songs.map((song, i) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <SongCard song={song} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
