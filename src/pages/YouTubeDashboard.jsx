// src/pages/YouTubeDashboard.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  YAxis,
  Legend,
} from "recharts";
import {
  Users,
  ThumbsUp,
  Eye,
  MessageCircle,
  Radio,
  TrendingUp,
  Clock,
  Play,
} from "lucide-react";
import { motion } from "framer-motion";
import arcLogo from "../assets/arc.png"; // ensure this path matches your project

export default function YouTubeDashboard() {
  // === config - replace with your keys if you want live data ===
  const API_KEY = "AIzaSyDVY_MDFb78188NXwEuxMrb1y1spukiGqU"; // <- Replace
  const CHANNEL_ID = "UC3CqeqcD1yGLi9q5j73ro5Q"; // <- Replace

  // === state ===
  const [loading, setLoading] = useState(true); // intro loader
  const [stats, setStats] = useState(null);
  const [videoStats, setVideoStats] = useState([]);
  const [liveSubs, setLiveSubs] = useState([]); // for realtime subscriber graph
  const liveSubsRef = useRef([]);
  const [uploads, setUploads] = useState([]);
  const [error, setError] = useState(null);

  // === helper format ===
  const formatNumber = (n) =>
    typeof n === "number" ? n.toLocaleString() : n;

  /* -------------------- FETCH CHANNEL STATS ---------------------- */
  const fetchChannelStats = async () => {
    try {
      const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${CHANNEL_ID}&key=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!data.items || data.items.length === 0) {
        throw new Error("No channel data returned");
      }
      const ch = data.items[0];
      const s = ch.statistics;

      const subs = Number(s.subscriberCount || 0);
      setStats({
        subscribers: subs,
        views: Number(s.viewCount || 0),
        videos: Number(s.videoCount || 0),
        title: ch.snippet?.title || "ARC Musicals",
      });

      // seed live subs array with recent points
      const seed = Array.from({ length: 12 }).map((_, i) => ({
        t: Date.now() - (11 - i) * 5000,
        subs: Math.max(0, subs - (11 - i) * Math.floor(Math.random() * 5)),
      }));
      liveSubsRef.current = seed;
      setLiveSubs([...seed]);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch channel stats");
      // seed fallback values
      const subs = 12000;
      setStats({
        subscribers: subs,
        views: 5000000,
        videos: 60,
        title: "ARC Musicals (offline seed)",
      });
      const seed = Array.from({ length: 12 }).map((_, i) => ({
        t: Date.now() - (11 - i) * 5000,
        subs: subs - (11 - i) * Math.floor(Math.random() * 8),
      }));
      liveSubsRef.current = seed;
      setLiveSubs([...seed]);
    }
  };

  /* -------------------- FETCH LAST 10 VIDEO STATS ---------------------- */
  const fetchVideoStats = async () => {
    try {
      const searchURL = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&maxResults=10&order=date&type=video`;
      const res1 = await fetch(searchURL);
      const data1 = await res1.json();

      const ids = (data1.items || [])
        .map((v) => v.id?.videoId)
        .filter(Boolean)
        .join(",");

      if (!ids) {
        setVideoStats([]);
        setUploads([]);
        return;
      }

      const statsURL = `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${ids}&key=${API_KEY}`;
      const res2 = await fetch(statsURL);
      const data2 = await res2.json();

      const arr = (data2.items || []).map((v) => ({
        id: v.id,
        name:
          v.snippet?.title?.length > 24
            ? v.snippet.title.slice(0, 22) + "…"
            : v.snippet?.title || "Untitled",
        likes: Number(v.statistics?.likeCount || 0),
        comments: Number(v.statistics?.commentCount || 0),
        views: Number(v.statistics?.viewCount || 0),
        publishedAt: v.snippet?.publishedAt,
      }));

      setVideoStats(arr.reverse()); // show newest first (or whichever)
      setUploads(
        arr.slice(0, 5).map((x) => ({
          title: x.name,
          date: new Date(x.publishedAt).toLocaleDateString(),
        }))
      );
    } catch (err) {
      console.error("Video stats fetch error", err);
      // fallback dummy
      const fallback = [
        { name: "Video A", views: 12000, likes: 340, comments: 12 },
        { name: "Video B", views: 43000, likes: 1200, comments: 90 },
        { name: "Video C", views: 9000, likes: 140, comments: 4 },
      ];
      setVideoStats(fallback);
      setUploads([
        { title: "Fallback Upload 1", date: "2025-10-01" },
        { title: "Fallback Upload 2", date: "2025-09-18" },
      ]);
    }
  };

  // initial fetch
  useEffect(() => {
    let mounted = true;
    Promise.all([fetchChannelStats(), fetchVideoStats()]).finally(() => {
      // wait a little to show intro loader
      setTimeout(() => {
        if (mounted) setLoading(false);
      }, 900);
    });
    return () => (mounted = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Simulate real-time live subscriber updates (and allow later to connect to a socket)
  useEffect(() => {
    const interval = setInterval(() => {
      // small random delta to simulate live changes
      const last = liveSubsRef.current[liveSubsRef.current.length - 1];
      const base = last ? last.subs : stats?.subscribers || 1000;
      const delta = Math.floor(Math.random() * 20) - 6; // small variations
      const newPoint = { t: Date.now(), subs: Math.max(0, base + delta) };
      liveSubsRef.current = [...liveSubsRef.current.slice(-50), newPoint]; // keep length limited
      setLiveSubs([...liveSubsRef.current]);
    }, 3500);
    return () => clearInterval(interval);
  }, [stats]);

  // derived totals
  const totalLikes = videoStats.reduce((s, v) => s + (v.likes || 0), 0);
  const totalComments = videoStats.reduce((s, v) => s + (v.comments || 0), 0);

  // monthly growth sample (decorate with subtle animation)
  const growthData = [
    { month: "Jan", views: 2000000 },
    { month: "Feb", views: 3200000 },
    { month: "Mar", views: 4500000 },
    { month: "Apr", views: 5100000 },
    { month: "May", views: 6100000 },
    { month: "Jun", views: 7200000 },
  ];

  // Animated intro loader (simple)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-neutral-900 text-white">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: [0.9, 1.08, 1], opacity: 1 }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="flex flex-col items-center gap-6"
        >
          <img src={arcLogo} alt="ARC" className="w-28 h-28 object-contain drop-shadow-[0_0_30px_rgba(255,140,30,0.25)]" />
          <div className="text-center">
            <h2 className="text-2xl font-bold">ARC Musicals</h2>
            <p className="text-sm text-gray-300 mt-1">Loading analytics — preparing the cinematic view</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // format liveSubs for chart (convert timestamp to hh:mm)
  const liveSubsForChart = liveSubs.map((p, i) => ({
    name: new Date(p.t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    subs: p.subs,
  }));

  return (
    <div className="min-h-screen p-6 md:p-10 bg-gradient-to-b from-neutral-900 to-black text-white">
      {/* Decorative top glow + grain */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute left-0 top-0 w-[500px] h-[500px] bg-amber-600/6 blur-[160px] rounded-full" />
        <div className="absolute right-0 top-10 w-[400px] h-[400px] bg-purple-700/6 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/assets/film-grain.png')] opacity-10 mix-blend-overlay" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <img src={arcLogo} alt="ARC" className="w-14 h-14 object-contain rounded-md drop-shadow-[0_8px_40px_rgba(255,140,30,0.18)]" />
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">YouTube Analytics</h1>
            <div className="text-sm text-arc-muted">{stats?.title}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-arc-muted">Last updated</div>
            <div className="text-sm">{new Date().toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: "Subscribers",
            value: formatNumber(stats.subscribers),
            icon: <Users size={36} />,
            bg: "bg-gradient-to-br from-red-700/20 to-red-900/10",
          },
          {
            title: "Total Views",
            value: formatNumber(stats.views),
            icon: <Eye size={36} />,
            bg: "bg-gradient-to-br from-blue-700/10 to-blue-900/5",
          },
          {
            title: "Likes (latest)",
            value: formatNumber(totalLikes),
            icon: <ThumbsUp size={36} />,
            bg: "bg-gradient-to-br from-green-700/10 to-green-900/5",
          },
          {
            title: "Comments (latest)",
            value: formatNumber(totalComments),
            icon: <MessageCircle size={36} />,
            bg: "bg-gradient-to-br from-yellow-600/10 to-yellow-900/5",
          },
        ].map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`rounded-2xl p-5 backdrop-blur-md border border-white/8 shadow-xl ${c.bg}`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-white/6">{c.icon}</div>
                <div>
                  <div className="text-sm text-arc-muted">{c.title}</div>
                  <div className="text-2xl font-bold mt-1">{c.value}</div>
                </div>
              </div>
              <div className="text-sm text-arc-muted">live</div>
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs text-arc-muted">
              <TrendingUp size={14} /> <span>Growth stable</span>
              <div className="ml-auto flex items-center gap-1">
                <Clock size={12} /> <span>Auto-refresh</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Two-column layout: Left charts / Right live & uploads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: main charts (span 2 on lg) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Video Performance (bar) */}
          <motion.div
            className="bg-black/40 p-6 rounded-2xl border border-white/8 shadow-2xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Play /> Recent Video Performance
              </h3>
              <div className="text-sm text-arc-muted">Showing last uploads</div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={videoStats}>
                  <defs>
                    <linearGradient id="grad1" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#ff7a59" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#7a1f1f" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff11" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)} />
                  <Tooltip wrapperStyle={{ background: "#0b0b0b", borderRadius: 8 }} />
                  <Bar dataKey="views" fill="url(#grad1)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Monthly growth */}
          <motion.div
            className="bg-zinc-900/60 p-6 rounded-2xl border border-zinc-400 shadow-xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Monthly Views Trend</h3>
              <div className="text-xs text-arc-muted">6 months</div>
            </div>

            <div className="h-56">
              <ResponsiveContainer>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff11" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="views" stroke="#ff6b6b" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Right column: live subscriber graph + uploads + live feed */}
        <div className="space-y-6">
          {/* Live subscriber graph */}
          <motion.div
            className="bg-black/50 p-6 rounded-2xl border border-white/8 shadow-xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users /> Live Subscribers
              </h3>
              <div className="text-sm text-arc-muted">{formatNumber(liveSubsForChart[liveSubsForChart.length - 1]?.subs || stats.subscribers)}</div>
            </div>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={liveSubsForChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={(n) => (n >= 1000 ? `${Math.round(n / 1000)}k` : n)} />
                  <Tooltip />
                  <Line type="monotone" dataKey="subs" stroke="#ffd166" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 text-xs text-arc-muted flex items-center gap-3">
              <Clock size={12} /> Live (simulated) — connect a websocket to push real updates.
            </div>
          </motion.div>

          {/* Recent uploads */}
          <motion.div
            className="bg-zinc-900/50 p-5 rounded-2xl border border-zinc-400 shadow-xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Recent Uploads</h3>
              <div className="text-xs text-arc-muted">Latest</div>
            </div>

            <div className="space-y-3">
              {uploads.length === 0 && <div className="text-arc-muted text-sm">No uploads found.</div>}
              {uploads.map((u, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/3 border border-white/6">
                  <div>
                    <div className="font-medium">{u.title}</div>
                    <div className="text-xs text-arc-muted">{u.date}</div>
                  </div>
                  <button className="px-3 py-2 rounded-md bg-arcgold text-black font-semibold text-sm">Watch</button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Live activity feed */}
          <motion.div
            className="bg-black/40 p-4 rounded-2xl border border-white/8 shadow-md"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h4 className="text-sm font-semibold mb-3">Live Activity</h4>
            <div className="space-y-2 text-xs text-arc-muted">
              <div className="flex items-center justify-between">
                <div>New comment on "Dream Wali Girl"</div>
                <div className="text-arcgold">2m</div>
              </div>
              <div className="flex items-center justify-between">
                <div>Upload processed: "Studio BTS"</div>
                <div className="text-arcgold">5h</div>
              </div>
              <div className="flex items-center justify-between">
                <div>New like spike on "Vardan"</div>
                <div className="text-arcgold">1d</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-arc-muted">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={arcLogo} alt="ARC" className="w-10 h-10 object-contain" />
            <div>
              <div className="font-semibold">ARC Musicals</div>
              <div className="text-xs">Crafting cinematic music since 2022</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-6 mb-2">
            <a href="/about" className="hover:text-arcgold">About</a>
            <a href="/songs" className="hover:text-arcgold">Songs</a>
            <a href="/contact" className="hover:text-arcgold">Contact</a>
          </div>
          <div className="text-xs text-gray-500">
            © {new Date().getFullYear()} ARC Musicals — Developed by Mr. Yashodeep Bhirud (YB)
          </div>
        </div>
      </footer>
    </div>
  );
}
