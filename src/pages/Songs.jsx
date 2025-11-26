// src/pages/Songs.jsx
import React, { useState, useEffect } from "react";
import AdvancedPlayer from "../components/AdvancedPlayer";
import { initialSongs } from "../data/songsData";

export default function SongsPage() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("arc_songs_premium_v1");
    if (stored) setSongs(JSON.parse(stored));
    else setSongs(initialSongs);
  }, []);

  return (
    <div className="p-6 pb-40">
      <AdvancedPlayer songs={songs} />
    </div>
  );
}
