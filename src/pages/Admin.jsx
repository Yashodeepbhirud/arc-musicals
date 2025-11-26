// src/pages/Admin.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Plus,
  Music4,
  FileAudio,
  ImagePlus,
  Save,
  Trash2,
  Download,
  FolderOpen,
  Settings,
  Mic2,
  Volume2,
  Sliders,
  Waves,
  Palette,
} from "lucide-react";

export default function Admin({ songs, onSaveOne, onSaveAll }) {
  const [tab, setTab] = useState("songs");
  const [selectedSong, setSelectedSong] = useState(null);
  const [form, setForm] = useState({
    title: "",
    artist: "",
    audio: "",
    cover: "",
    lyrics: "",
    bpm: "",
  });

  const fileAudioRef = useRef();
  const fileCoverRef = useRef();

  // Auto-fill form when selecting a song
  useEffect(() => {
    if (!selectedSong) return;
    const s = songs.find((x) => x.id === selectedSong);
    if (!s) return;

    setForm({
      title: s.title || "",
      artist: s.artist || "",
      audio: s.audio || "",
      cover: s.cover || "",
      lyrics: s.lyrics || "",
      bpm: s.bpm || "",
    });
  }, [selectedSong]);

  // Save song
  const saveSong = () => {
    if (!selectedSong) {
      alert("Select a song to update!");
      return;
    }
    onSaveOne(selectedSong, form);
    alert("Song updated successfully!");
  };

  const addSong = () => {
    const id = "song-" + Date.now();
    const newSong = {
      id,
      title: form.title,
      artist: form.artist,
      audio: form.audio,
      cover: form.cover,
      lyrics: form.lyrics,
      bpm: form.bpm,
      createdAt: new Date().toISOString(),
    };
    onSaveAll([...songs, newSong]);
    alert("Song added!");
  };

  const deleteSong = () => {
    if (!selectedSong) return;
    if (!window.confirm("Delete this song?")) return;

    const updated = songs.filter((s) => s.id !== selectedSong);
    onSaveAll(updated);
    setSelectedSong(null);
  };

  const importJSON = () => {
    const txt = prompt("Paste JSON database:");
    if (!txt) return;

    try {
      const parsed = JSON.parse(txt);
      onSaveAll(parsed);
      alert("Imported successfully!");
    } catch {
      alert("Invalid JSON format.");
    }
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(songs, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "arc_musicals_database.json";
    a.click();
  };

  return (
    <div className="pt-24 pb-16 px-5 bg-black min-h-screen text-white">

      {/* ---------------------- HEADER ---------------------- */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold mb-8 text-arcgold"
      >
        ARC MUSICALS — Admin Control Studio ⚡
      </motion.h1>

      {/* ---------------------- NAV TABS ---------------------- */}
      <div className="flex gap-4 mb-10">
        {[
          ["songs", "Song Manager"],
          ["lyrics", "Lyrics Studio"],
          ["audio", "Audio FX"],
          ["database", "Database"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-5 py-2 rounded-lg transition font-semibold ${
              tab === id
                ? "bg-arcgold text-black shadow-lg shadow-arcgold/40"
                : "bg-white/10 text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ---------------------- SONG MANAGER ---------------------- */}
      {tab === "songs" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">

          {/* Song List */}
          <div className="bg-white/5 p-5 rounded-xl border border-white/10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Music4 /> Songs List
            </h2>

            <ul className="space-y-3 max-h-[450px] overflow-y-auto">
              {songs.map((s) => (
                <li
                  key={s.id}
                  onClick={() => setSelectedSong(s.id)}
                  className={`p-3 rounded cursor-pointer transition ${
                    selectedSong === s.id
                      ? "bg-arcgold text-black"
                      : "bg-white/10"
                  }`}
                >
                  {s.title}
                </li>
              ))}
            </ul>
          </div>

          {/* Song Form */}
          <div className="md:col-span-2 bg-white/5 p-5 rounded-xl border border-white/10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileAudio /> Edit Song
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Title" value={form.title} set={(v) => setForm({ ...form, title: v })} />
              <Input label="Artist" value={form.artist} set={(v) => setForm({ ...form, artist: v })} />
              <Input label="Audio URL" value={form.audio} set={(v) => setForm({ ...form, audio: v })} />
              <Input label="Cover URL" value={form.cover} set={(v) => setForm({ ...form, cover: v })} />
            </div>

            <div className="mt-4 flex gap-4">
              <button
                className="px-6 py-2 bg-arcgold text-black font-bold rounded-lg"
                onClick={saveSong}
              >
                Save Changes <Save className="inline ml-2" size={18} />
              </button>

              <button
                className="px-6 py-2 bg-red-600 text-white rounded-lg"
                onClick={deleteSong}
              >
                Delete <Trash2 className="inline ml-2" size={18} />
              </button>

              <button
                className="px-6 py-2 bg-green-600 text-white rounded-lg"
                onClick={addSong}
              >
                Add New <Plus className="inline ml-2" size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------- LYRICS STUDIO ---------------------- */}
      {tab === "lyrics" && (
        <LyricsStudio
          selectedSong={selectedSong}
          setSelectedSong={setSelectedSong}
          songs={songs}
          form={form}
          setForm={setForm}
          saveSong={saveSong}
        />
      )}

      {/* ---------------------- AUDIO FX PANEL ---------------------- */}
      {tab === "audio" && <AudioFXPanel />}

      {/* ---------------------- DATABASE PANEL ---------------------- */}
      {tab === "database" && (
        <DatabasePanel
          importJSON={importJSON}
          exportJSON={exportJSON}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
  SMALL COMPONENTS
------------------------------------------------------------------ */

function Input({ label, value, set }) {
  return (
    <div>
      <p className="mb-1 text-sm text-arcgold">{label}</p>
      <input
        className="w-full px-3 py-2 rounded bg-black border border-white/10 text-white"
        value={value}
        onChange={(e) => set(e.target.value)}
      />
    </div>
  );
}

/* ------------------------------------------------------------------
  LYRICS STUDIO COMPONENT
------------------------------------------------------------------ */
function LyricsStudio({ selectedSong, setSelectedSong, songs, form, setForm, saveSong }) {
  return (
    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
      <h2 className="text-2xl font-bold mb-5 flex items-center gap-2 text-arcgold">
        <Mic2 /> Lyrics Studio
      </h2>

      {/* Song Selector */}
      <select
        value={selectedSong}
        onChange={(e) => setSelectedSong(e.target.value)}
        className="w-full p-3 bg-black border border-white/10 rounded-lg mb-5"
      >
        <option value="">-- Select Song --</option>
        {songs.map((s) => (
          <option key={s.id} value={s.id}>
            {s.title}
          </option>
        ))}
      </select>

      {/* Editor */}
      <textarea
        value={form.lyrics}
        onChange={(e) => setForm({ ...form, lyrics: e.target.value })}
        className="w-full h-64 p-4 bg-black border border-white/10 rounded-lg"
        placeholder="Write lyrics here..."
      />

      <button
        onClick={saveSong}
        className="mt-4 px-6 py-2 bg-arcgold text-black font-bold rounded-lg"
      >
        Save Lyrics
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------
  AUDIO FX PANEL
------------------------------------------------------------------ */
function AudioFXPanel() {
  return (
    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-arcgold">
        <Sliders /> Audio Effects & Equalizer
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {["Bass", "Treble", "Vocals", "Echo", "Reverb", "8D"].map((s) => (
          <div key={s}>
            <p className="mb-2">{s}</p>
            <input
              type="range"
              min="0"
              max="100"
              className="w-full accent-arcgold"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
  DATABASE PANEL
------------------------------------------------------------------ */
function DatabasePanel({ importJSON, exportJSON }) {
  return (
    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-arcgold">
        <FolderOpen /> Database Tools
      </h2>

      <div className="flex gap-4">
        <button
          className="px-6 py-2 bg-arcgold text-black rounded-lg font-bold"
          onClick={exportJSON}
        >
          Export Database <Download className="inline ml-2" />
        </button>

        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold"
          onClick={importJSON}
        >
          Import Database <Upload className="inline ml-2" />
        </button>
      </div>
    </div>
  );
}
