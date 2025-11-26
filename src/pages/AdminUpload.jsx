// AdminUpload.jsx
import React, { useState } from "react";
import { initialSongs } from "../data/songsData"; // optional starter
import { useNavigate } from "react-router-dom";

export default function AdminUpload() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const navigate = useNavigate();

  const onUpload = async () => {
    if (!title || !artist || !audioFile) return alert("Please provide title, artist and audio file");
    // create object URLs (for demo). In production you'd upload to S3 and store URLs in DB.
    const coverUrl = coverFile ? URL.createObjectURL(coverFile) : "/src/assets/arc.png";
    const audioUrl = URL.createObjectURL(audioFile);

    // save to localStorage songs array
    const stored = JSON.parse(localStorage.getItem("arc_songs_premium_v1") || "[]");
    const id = Date.now();
    const newSong = { id, title, artist, url: audioUrl, cover: coverUrl, lyrics: "" };
    const updated = [newSong, ...stored];
    localStorage.setItem("arc_songs_premium_v1", JSON.stringify(updated));
    alert("Uploaded (local demo). Song added to library.");
    navigate("/songs");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-yellow-400 mb-4">Admin — Upload Song (Local Demo)</h1>

      <div className="grid gap-3">
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Song title" className="p-2 rounded bg-black/30" />
        <input value={artist} onChange={(e)=>setArtist(e.target.value)} placeholder="Artist" className="p-2 rounded bg-black/30" />
        <label className="text-sm text-gray-300">Cover image</label>
        <input type="file" accept="image/*" onChange={(e)=>setCoverFile(e.target.files[0])} />
        <label className="text-sm text-gray-300">Audio file (mp3, webm)</label>
        <input type="file" accept="audio/*" onChange={(e)=>setAudioFile(e.target.files[0])} />
        <button onClick={onUpload} className="px-4 py-2 bg-yellow-600 rounded text-black">Upload</button>
      </div>
    </div>
  );
}
