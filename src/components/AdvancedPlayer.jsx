// AdvancedPlayer.jsx
// All-in-one Advanced Player: visualizer, equalizer, effects, queue, waveform seek, clip generator, karaoke UI, fullscreen.
// Drop into src/components and import into your Songs page.
// Dependencies: react, lucide-react, framer-motion (optional). No external audio libs required.

import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  Play, Pause, SkipBack, SkipForward, Volume2, Music, Mic, ListMusic, Maximize2, Repeat, Shuffle, DownloadCloud
} from "lucide-react";
import { motion } from "framer-motion";

/* ---------- Helpers ---------- */

async function extractDominantColor(imageSrc) {
  if (!imageSrc) return "rgba(245,197,66,0.12)";
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const w = (canvas.width = Math.min(150, img.width));
      const h = (canvas.height = Math.min(150, img.height));
      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;
      let r = 0, g = 0, b = 0, count = 0;
      for (let i = 0; i < data.length; i += 4 * 6) {
        r += data[i]; g += data[i + 1]; b += data[i + 2]; count++;
      }
      if (!count) return resolve("rgba(245,197,66,0.12)");
      r = Math.round(r / count); g = Math.round(g / count); b = Math.round(b / count);
      resolve(`rgba(${r},${g},${b},0.12)`);
    };
    img.onerror = () => resolve("rgba(245,197,66,0.12)");
  });
}

// Simple BPM estimate (lightweight) and pitch autocorrelation (approx)
function estimateBPM(timeData, sampleRate) {
  // Very approximate: compute energy envelope autocorrelation
  const hop = 512;
  const energies = [];
  for (let i = 0; i + hop < timeData.length; i += hop) {
    let s = 0;
    for (let j = 0; j < hop; j++) s += Math.abs(timeData[i + j]);
    energies.push(s / hop);
  }
  if (energies.length < 4) return 0;
  const ac = [];
  for (let lag = 1; lag < Math.min(240, energies.length); lag++) {
    let sum = 0;
    for (let i = 0; i < energies.length - lag; i++) sum += energies[i] * energies[i + lag];
    ac.push(sum);
  }
  let best = 0, bestLag = 1;
  ac.forEach((v, i) => { if (v > best) { best = v; bestLag = i + 1; } });
  const secondsPerBeat = (hop * bestLag) / sampleRate;
  if (!secondsPerBeat) return 0;
  let bpm = Math.round(60 / secondsPerBeat);
  if (bpm < 40) bpm *= 2;
  if (bpm > 220) bpm = Math.round(bpm / 2);
  return bpm;
}
function autoCorrelate(buf, sampleRate) {
  // lightweight autocorrelation pitch detection (not studio-grade)
  const SIZE = buf.length;
  let rms = 0;
  for (let i = 0; i < SIZE; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) return -1;
  let bestOffset = -1;
  let bestCorr = 0;
  const maxOffset = Math.floor(SIZE / 2);
  for (let offset = 2; offset < maxOffset; offset++) {
    let corr = 0;
    for (let i = 0; i < maxOffset; i++) corr += Math.abs(buf[i] - buf[i + offset]);
    corr = 1 - corr / maxOffset;
    if (corr > bestCorr) { bestCorr = corr; bestOffset = offset; }
  }
  if (bestOffset === -1) return -1;
  return sampleRate / bestOffset;
}

/* ---------- Component ---------- */

export default function AdvancedPlayer({
  songs = [],                 // array of song objects { id, title, artist, url, cover, lyrics? }
  startIndex = 0,             // optional starting index
  onUploadRedirect = "/admin-upload" // admin upload path
}) {
  // Core state
  const [index, setIndex] = useState(startIndex);
  const [current, setCurrent] = useState(songs[startIndex] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.9);
  const [showAll, setShowAll] = useState(false);
  const [dominantBg, setDominantBg] = useState("rgba(245,197,66,0.08)");
  const [mode, setMode] = useState("bars"); // visual modes: bars | waveform | circle
  const [freqData, setFreqData] = useState(new Uint8Array(64));
  const [timeData, setTimeData] = useState(new Float32Array(2048));
  const [bpm, setBpm] = useState(0);
  const [pitchHz, setPitchHz] = useState(null);
  const [visualizerRunning, setVisualizerRunning] = useState(false);
  const [queue, setQueue] = useState([]); // extra queue
  const [loop, setLoop] = useState("off"); // off | one | all
  const [shuffle, setShuffle] = useState(false);
  const [crossfadeMs, setCrossfadeMs] = useState(600); // crossfade duration
  const [showFull, setShowFull] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [clipUrl, setClipUrl] = useState(null);

  // WebAudio refs
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);
  const srcRef = useRef(null);
  const analyserRef = useRef(null);
  const gainRef = useRef(null);
  const eqRef = useRef({ low: null, mid: null, high: null });
  const convolverRef = useRef(null);
  const delayRef = useRef(null);
  const pannerRef = useRef(null);
  const rafRef = useRef(null);
  const recorderRef = useRef(null);
  const mediaStreamDestRef = useRef(null);

  // when songs prop changes, update current if needed
  useEffect(() => {
    if (!songs || songs.length === 0) { setCurrent(null); return; }
    if (!current || !songs.find(s => s.id === current.id)) {
      setIndex(0);
      setCurrent(songs[0]);
    } else {
      setCurrent(songs[index]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songs]);

  // extract color for theme
  useEffect(() => {
    (async () => {
      if (current?.cover) {
        const c = await extractDominantColor(current.cover);
        setDominantBg(c);
      } else setDominantBg("rgba(245,197,66,0.08)");
    })();
  }, [current]);

  // init WebAudio graph lazily
  useEffect(() => {
    if (audioCtxRef.current) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      gainRef.current = audioCtxRef.current.createGain();
      gainRef.current.gain.value = volume;

      const low = audioCtxRef.current.createBiquadFilter();
      low.type = "lowshelf"; low.frequency.value = 120;
      const mid = audioCtxRef.current.createBiquadFilter();
      mid.type = "peaking"; mid.frequency.value = 1000; mid.Q.value = 1;
      const high = audioCtxRef.current.createBiquadFilter();
      high.type = "highshelf"; high.frequency.value = 4000;
      eqRef.current = { low, mid, high };

      convolverRef.current = audioCtxRef.current.createConvolver();
      convolverRef.current.buffer = createImpulse(1.2, 2, audioCtxRef.current);

      delayRef.current = audioCtxRef.current.createDelay(5.0);
      delayRef.current.delayTime.value = 0;

      pannerRef.current = audioCtxRef.current.createStereoPanner();

      // create node chain: source -> low -> mid -> high -> analyser -> gain -> convolver -> delay -> panner -> destination
      mediaStreamDestRef.current = audioCtxRef.current.createMediaStreamDestination(); // for recording output
    } catch (e) {
      console.warn("WebAudio init failed:", e);
    }
  }, []);

  // attach audio to graph whenever audio element changes
  useEffect(() => {
    if (!audioRef.current || !audioCtxRef.current) return;
    // connect source node to graph
    try {
      if (srcRef.current) { try { srcRef.current.disconnect(); } catch {} }
      srcRef.current = audioCtxRef.current.createMediaElementSource(audioRef.current);
      const { low, mid, high } = eqRef.current;
      srcRef.current.connect(low);
      low.connect(mid); mid.connect(high);
      high.connect(analyserRef.current);
      analyserRef.current.connect(gainRef.current);
      gainRef.current.connect(convolverRef.current);
      convolverRef.current.connect(delayRef.current);
      delayRef.current.connect(pannerRef.current);
      pannerRef.current.connect(audioCtxRef.current.destination);
      // also connect to mediaStreamDestination for recording/clipping
      pannerRef.current.connect(mediaStreamDestRef.current);
    } catch (e) {
      console.warn("attach audio failed", e);
    }
  }, [audioRef.current, audioCtxRef.current]);

  // visualizer loop
  useEffect(() => {
    if (!analyserRef.current || !canvasRef.current) return;
    const analyser = analyserRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function draw() {
      rafRef.current = requestAnimationFrame(draw);
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);
      const timeArray = new Float32Array(analyser.fftSize);
      analyser.getFloatTimeDomainData(timeArray);
      setFreqData(dataArray.slice(0, 64));
      setTimeData(timeArray);

      // clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (mode === "bars") {
        const barWidth = (canvas.width / 64) * 0.9;
        let x = 0;
        for (let i = 0; i < 64; i++) {
          const v = dataArray[i];
          const h = (v / 255) * canvas.height;
          // gradient gold
          ctx.fillStyle = `linear-gradient(180deg, #F5C542, rgba(245,197,66,0.6))`;
          ctx.fillStyle = "#F5C542";
          ctx.fillRect(x, canvas.height - h, barWidth, h);
          x += barWidth + 1;
        }
      } else if (mode === "waveform") {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#F5C542";
        const step = Math.floor(timeArray.length / canvas.width);
        let x = 0;
        for (let i = 0; i < canvas.width; i++) {
          const v = timeArray[i * step] || 0;
          const y = (v + 1) / 2 * canvas.height;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          x++;
        }
        ctx.stroke();
      } else if (mode === "circle") {
        // circular pulse
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        const radius = Math.max(10, (avg / 255) * Math.min(canvas.width, canvas.height) / 4);
        ctx.beginPath();
        ctx.fillStyle = "rgba(245,197,66,0.18)";
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // resize canvas to device pixel ratio
    function resize() {
      const ratio = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    }
    resize();
    window.addEventListener("resize", resize);
    if (!rafRef.current) draw();

    setVisualizerRunning(true);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      setVisualizerRunning(false);
    };
  }, [mode]);

  // update volume
  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = volume;
  }, [volume]);

  // EQ update hooks
  function setEQ(band, db) {
    if (!eqRef.current) return;
    if (band === "bass") eqRef.current.low.gain.value = db;
    if (band === "mid") eqRef.current.mid.gain.value = db;
    if (band === "treble") eqRef.current.high.gain.value = db;
  }

  // play / pause / next / prev / auto-next / crossfade
  async function playIndex(i, opts = {}) {
    if (!songs || songs.length === 0) return;
    const idx = ((i % songs.length) + songs.length) % songs.length;
    const nextSong = songs[idx];
    if (!audioRef.current) return;
    try { await audioCtxRef.current.resume(); } catch {}
    if (opts.crossfade && audioRef.current && !audioRef.current.paused) {
      // crossfade: ramp down gain, change src, ramp up
      const g = gainRef.current;
      const now = audioCtxRef.current.currentTime;
      g.gain.cancelScheduledValues(now);
      g.gain.setValueAtTime(g.gain.value, now);
      g.gain.linearRampToValueAtTime(0.0001, now + crossfadeMs / 1000);
      setTimeout(async () => {
        audioRef.current.src = nextSong.url;
        audioRef.current.crossOrigin = "anonymous";
        audioRef.current.play().catch(() => {});
        const now2 = audioCtxRef.current.currentTime;
        g.gain.setValueAtTime(0.0001, now2);
        g.gain.linearRampToValueAtTime(volume, now2 + crossfadeMs / 1000);
      }, crossfadeMs);
    } else {
      audioRef.current.src = nextSong.url;
      audioRef.current.crossOrigin = "anonymous";
      await audioRef.current.play().catch(() => {});
    }
    setIndex(idx);
    setCurrent(nextSong);
    setIsPlaying(true);
    // start analyzer metrics
    setTimeout(() => updateBpmAndPitch(), 500);
  }

  function nextTrack() {
    if (shuffle) {
      const r = Math.floor(Math.random() * songs.length);
      playIndex(r, { crossfade: true });
      return;
    }
    const next = index + 1;
    if (next >= songs.length) {
      if (loop === "all") playIndex(0, { crossfade: true });
      else if (loop === "one") playIndex(index, { crossfade: true });
      else { setIsPlaying(false); }
    } else {
      playIndex(next, { crossfade: true });
    }
  }
  function prevTrack() {
    const prev = index - 1;
    playIndex(prev, { crossfade: true });
  }

  // attach ended handler
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    function onEnded() { nextTrack(); }
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, shuffle, loop, songs]);

  // toggle play/pause
  async function togglePlay() {
    if (!audioRef.current) return;
    try { await audioCtxRef.current.resume(); } catch {}
    if (audioRef.current.paused) {
      await audioRef.current.play().catch((e) => console.warn("play prevented", e));
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }

  // waveform seek (click canvas)
  function handleSeek(e) {
    if (!audioRef.current || !canvasRef.current || !analyserRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    audioRef.current.currentTime = audioRef.current.duration * pct;
  }

  // update BPM + pitch from analyser time domain
  function updateBpmAndPitch() {
    if (!analyserRef.current || !audioCtxRef.current) return;
    const time = new Float32Array(analyserRef.current.fftSize);
    analyserRef.current.getFloatTimeDomainData(time);
    const bpmEst = estimateBPM(time, audioCtxRef.current.sampleRate);
    const pitch = autoCorrelate(time, audioCtxRef.current.sampleRate);
    if (bpmEst) setBpm(bpmEst);
    if (pitch > 0) setPitchHz(Math.round(pitch));
  }

  // basic recording / clip generator from audio output (records a portion)
  async function startClipRecording(durationSec = 6) {
    if (!mediaStreamDestRef.current) return alert("Recording not available in this browser");
    setClipUrl(null);
    const stream = mediaStreamDestRef.current.stream;
    const mr = new MediaRecorder(stream);
    const chunks = [];
    mr.ondataavailable = (e) => chunks.push(e.data);
    mr.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      setClipUrl(url);
      setIsRecording(false);
    };
    mr.start();
    setIsRecording(true);
    setTimeout(() => { mr.stop(); }, durationSec * 1000);
  }

  // simple vocal reduction: invert right channel and mix with left (works if stereo)
  function toggleVocalRemove(on) {
    if (!audioCtxRef.current) return;
    // naive approach: change panner and phase — best is to use stereo separation & subtract channels (complicated)
    // We'll approximate by reducing center frequencies using EQ
    if (on) {
      eqRef.current.mid.gain.value = -8;
    } else {
      eqRef.current.mid.gain.value = 0;
    }
  }

  // helper: add current to queue
  function addToQueue(song) {
    setQueue(prev => [...prev, song]);
  }
  function playQueueNext() {
    if (queue.length === 0) return;
    const next = queue[0];
    setQueue(prev => prev.slice(1));
    const idx = songs.findIndex(s => s.id === next.id);
    if (idx >= 0) playIndex(idx, { crossfade: true });
  }

  // show 6 songs with "See All" toggle
  const visibleSongs = useMemo(() => (showAll ? songs : songs.slice(0, 6)), [songs, showAll]);

  // expose keyboard space play/pause
  useEffect(() => {
    function onKey(e) { if (e.code === "Space") { e.preventDefault(); togglePlay(); } }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [audioRef.current, isPlaying]);

  // when index changes externally, load song
  useEffect(() => {
    if (!songs || songs.length === 0) return;
    playIndex(index, { crossfade: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, songs]);

  /* ---------- Render ---------- */
  return (
    <>
      <div className="w-full p-4 gap-4">
        {/* Songs grid (6 visible) */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Music className="text-yellow-400" /> Songs
          </h2>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAll(s => !s)}
              className="px-3 py-1 rounded bg-black/30 border border-yellow-700 text-yellow-300"
            >
              {showAll ? "Show Top 6" : `Show All (${songs.length})`}
            </button>

            <button
              onClick={() => window.location.href = onUploadRedirect}
              className="px-3 py-1 rounded bg-yellow-600 text-black font-semibold"
            >
              Upload
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {visibleSongs.map((s, i) => (
            <div
              key={s.id}
              onClick={() => setIndex(songs.findIndex(x => x.id === s.id))}
              className={`cursor-pointer rounded-xl overflow-hidden border ${current?.id === s.id ? "border-yellow-500" : "border-white/10"} bg-black/30 hover:scale-[1.01] transition p-2`}
            >
              <img src={s.cover || "/src/assets/arc.png"} alt={s.title} className="w-full h-40 object-cover rounded-md mb-2" />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-yellow-300">{s.title}</div>
                  <div className="text-sm text-gray-300 opacity-70">{s.artist}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="p-2 rounded bg-yellow-500 text-black" onClick={(e) => { e.stopPropagation(); const idx = songs.findIndex(x => x.id === s.id); playIndex(idx, { crossfade: true }); }}>
                    <Play size={16} />
                  </button>
                  <button className="p-2 rounded bg-black/20 border border-yellow-600 text-yellow-300" onClick={(e) => { e.stopPropagation(); addToQueue(s); }}>
                    +Q
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Player (fixed at bottom) */}
        <motion.div initial={{ y: 160 }} animate={{ y: 0 }} className="fixed bottom-0 left-0 right-0 z-50">
          <div
            className="mx-auto max-w-6xl p-3 rounded-t-2xl"
            style={{ backdropFilter: "blur(10px)", background: `linear-gradient(90deg, rgba(0,0,0,0.6), ${dominantBg})`, borderTop: "1px solid rgba(245,197,66,0.08)" }}
          >
            {/* Top row: info & basic controls */}
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden border border-yellow-600">
                  <img src={current?.cover || "/src/assets/arc.png"} alt="cover" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-semibold text-yellow-300">{current?.title || "Nothing playing"}</div>
                  <div className="text-sm text-gray-300 opacity-70">{current?.artist || "—"}</div>
                  <div className="text-xs text-gray-400 mt-1">BPM: {bpm || "—"} • Pitch: {pitchHz ? `${Math.round(pitchHz)} Hz` : "—"}</div>
                </div>
              </div>

              <div className="flex-1 px-2">
                <div className="flex items-center justify-center gap-4">
                  <button onClick={prevTrack} className="text-yellow-400"><SkipBack /></button>
                  <button onClick={togglePlay} className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-black">{isPlaying ? <Pause /> : <Play />}</button>
                  <button onClick={nextTrack} className="text-yellow-400"><SkipForward /></button>
                </div>

                {/* Waveform / visual canvas */}
                <div className="mt-2" style={{ height: 64 }}>
                  <canvas ref={canvasRef} onClick={handleSeek} style={{ width: "100%", height: 64, borderRadius: 6, cursor: "pointer", display: "block" }} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 p-2 bg-black/30 rounded border border-yellow-700">
                  <Volume2 />
                  <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} />
                </div>

                <button title="Visualizer Mode" onClick={() => setMode(m => m === "bars" ? "waveform" : m === "waveform" ? "circle" : "bars")} className="p-2 rounded bg-black/20 border border-yellow-600 text-yellow-300">Viz</button>

                <button title="Shuffle" onClick={() => setShuffle(s => !s)} className={`p-2 rounded ${shuffle ? "bg-yellow-500 text-black" : "bg-black/20 border border-yellow-600 text-yellow-300"}`}><Shuffle /></button>

                <button title="Loop" onClick={() => setLoop(l => l === "off" ? "one" : l === "one" ? "all" : "off")} className={`p-2 rounded ${loop !== "off" ? "bg-yellow-500 text-black" : "bg-black/20 border border-yellow-600 text-yellow-300"}`}><Repeat /></button>

                <button title="Fullscreen Player" onClick={() => setShowFull(s => !s)} className="p-2 rounded bg-black/20 border border-yellow-600 text-yellow-300"><Maximize2 /></button>
              </div>
            </div>

            {/* bottom row: EQ + effects + queue */}
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* EQ */}
              <div className="p-3 bg-black/30 rounded-md border border-yellow-700">
                <div className="text-sm text-yellow-300 mb-2">Equalizer</div>
                <label className="text-xs text-gray-300">Bass</label>
                <input type="range" min="-12" max="12" step="0.5" defaultValue="0" onChange={(e) => setEQ("bass", parseFloat(e.target.value))} />
                <label className="text-xs text-gray-300">Mid</label>
                <input type="range" min="-12" max="12" step="0.5" defaultValue="0" onChange={(e) => setEQ("mid", parseFloat(e.target.value))} />
                <label className="text-xs text-gray-300">Treble</label>
                <input type="range" min="-12" max="12" step="0.5" defaultValue="0" onChange={(e) => setEQ("treble", parseFloat(e.target.value))} />
              </div>

              {/* Effects */}
              <div className="p-3 bg-black/30 rounded-md border border-yellow-700">
                <div className="text-sm text-yellow-300 mb-2">Effects</div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-xs text-gray-300">Reverb</label>
                  <input type="checkbox" onChange={(e) => { if (e.target.checked) convolverRef.current.buffer = createImpulse(1.6, 2, audioCtxRef.current); else convolverRef.current.buffer = audioCtxRef.current.createBuffer(2, 1, audioCtxRef.current.sampleRate); }} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-xs text-gray-300">Echo (ms)</label>
                  <input type="range" min="0" max="800" defaultValue="0" onChange={(e) => { if (delayRef.current) delayRef.current.delayTime.value = parseInt(e.target.value) / 1000; }} />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-300">8D</label>
                  <input type="checkbox" onChange={(e) => { if (e.target.checked) set8d(true); else set8d(false); }} />
                </div>
              </div>

              {/* Recorder / Queue */}
              <div className="p-3 bg-black/30 rounded-md border border-yellow-700 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-yellow-300">Recorder & Queue</div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded bg-black/20 border border-yellow-600" onClick={() => playQueueNext()}>Play Q</button>
                    <button className={`p-2 rounded ${isRecording ? "bg-red-600" : "bg-yellow-600 text-black"}`} onClick={() => { if (isRecording) { /* stop handled automatically by startClipRecording */ } else { startClipRecording(5); } }}>{isRecording ? "Recording..." : "Create Clip"}</button>
                    {clipUrl && <a href={clipUrl} download className="p-2 rounded bg-black/20 border border-yellow-600"><DownloadCloud /></a>}
                  </div>
                </div>
                <div className="text-xs text-gray-300">Queue ({queue.length})</div>
                <div className="flex-1 overflow-auto max-h-28">
                  {queue.map((q, i) => (
                    <div key={i} className="flex items-center justify-between gap-2 py-1">
                      <div className="text-sm">{q.title}</div>
                      <div className="flex gap-2">
                        <button className="text-xs px-2 py-1 bg-black/20 rounded" onClick={() => { setQueue(prev => prev.filter((_, idx) => idx !== i)); }}>remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} style={{ display: "none" }} />

      {/* Fullscreen immersive player modal */}
      {showFull && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-6" style={{ background: "rgba(0,0,0,0.85)" }}>
          <div className="w-full max-w-4xl bg-black/80 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-yellow-300">{current?.title}</h3>
                <p className="text-gray-300">{current?.artist}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowFull(false)} className="px-3 py-1 bg-black/20 rounded">Close</button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <img src={current?.cover || "/src/assets/arc.png"} alt="cover" className="w-full h-80 object-cover rounded-lg mb-4" />
                <div className="p-3 bg-black/30 rounded-md border border-yellow-700">
                  <h4 className="text-yellow-300 font-semibold mb-2">Lyrics</h4>
                  <div className="text-gray-300 text-sm max-h-44 overflow-auto">
                    {current?.lyrics ? current.lyrics.split("\n").map((l,i) => <p key={i} className="mb-1">{l}</p>) : <p className="italic">No lyrics available. Use AI generator.</p>}
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-3">
                  <canvas ref={canvasRef} style={{ width: "100%", height: 220, borderRadius: 8, background: "rgba(0,0,0,0.25)" }} />
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={() => prevTrack()} className="px-3 py-2 rounded bg-black/20">Prev</button>
                  <button onClick={() => togglePlay()} className="px-4 py-2 rounded bg-yellow-500 text-black">{isPlaying ? "Pause" : "Play"}</button>
                  <button onClick={() => nextTrack()} className="px-3 py-2 rounded bg-black/20">Next</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- Utility functions below ---------- */

// create impulse for reverb
function createImpulse(durationSec = 2, decay = 2, audioCtx) {
  const rate = audioCtx.sampleRate;
  const length = rate * durationSec;
  const impulse = audioCtx.createBuffer(2, length, rate);
  for (let c = 0; c < 2; c++) {
    let channel = impulse.getChannelData(c);
    for (let i = 0; i < length; i++) {
      channel[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return impulse;
}

// 8d toggle helper (simple oscillator controlling pan)
function set8dGenerator(enabled, pannerRef, audioCtxRef) {
  if (!pannerRef || !audioCtxRef) return;
  if (enabled) {
    const osc = audioCtxRef.createOscillator();
    const gain = audioCtxRef.createGain();
    gain.gain.value = 1.0;
    osc.type = "sine";
    osc.frequency.value = 0.08; // slow sweep
    osc.connect(gain);
    gain.connect(pannerRef.pan || pannerRef);
    osc.start();
    pannerRef._osc = osc;
  } else {
    if (pannerRef._osc) {
      try { pannerRef._osc.stop(); } catch {}
      pannerRef._osc.disconnect();
      pannerRef._osc = null;
    }
    if (pannerRef.pan) pannerRef.pan.value = 0;
  }
}

/* -----------------------
  Notes:
  - Place this file in src/components and import where you want.
  - To show only 6 songs: the UI shows first 6 and "Show All" toggles full list.
  - Many audio features require user gesture to start AudioContext on some browsers.
  - For AI lyrics, wire the UI to your backend endpoint.
  - Vocal removal is approximate; production use needs sophisticated vocal isolation libs.
  - Recording/clip generation uses MediaStreamDestination—works on modern browsers.
------------------------*/
