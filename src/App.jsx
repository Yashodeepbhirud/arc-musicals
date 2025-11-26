// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import Songs from "./pages/Songs";
import SongDetail from "./pages/SongDetail";
import Admin from "./pages/Admin";
import Portfolio from "./pages/Portfolio";
import { initialSongs } from "./data/songsData";
import YouTubeDashboard from "./pages/YouTubeDashboard";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Settings from "./pages/Settings";

export default function App() {
  const STORAGE_KEY = "arc_songs_premium_v1";

  const [songs, setSongs] = useState([]);

  // Load songs once
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSongs(JSON.parse(saved));
      } catch {
        setSongs(initialSongs);
      }
    } else {
      setSongs(initialSongs);
    }
  }, []);

  // Save all songs
  const saveAll = (updated) => {
    setSongs(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // Save one song
  const saveOne = (id, data) => {
    const updated = songs.map((s) =>
      s.id === id ? { ...s, ...data, updatedAt: new Date().toISOString() } : s
    );
    saveAll(updated);
  };

  return (
    <Router>
      <div className="flex min-h-screen bg-black text-white">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Area */}
        <div className="flex-1 overflow-x-hidden pt-20">
          <Navbar />

          <Routes>
            <Route path="/" element={<Home songs={songs} />} />
            <Route path="/songs" element={<Songs songs={songs} />} />
            <Route path="/songs/:id" element={<SongDetail songs={songs} />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/youtubedashboard" element={<YouTubeDashboard />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/settings" element={<Settings />} />

            <Route
              path="/admin"
              element={<Admin songs={songs} onSaveOne={saveOne} onSaveAll={saveAll} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
