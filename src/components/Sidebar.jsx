// src/components/Sidebar.jsx
import React, { useRef, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Music2, ListMusic, Settings, Youtube } from "lucide-react";
import arcLogo from "../assets/arc-border.png"
const navItems = [
  { name: "Home", icon: <Home size={22} />, path: "/" },
  { name: "Songs", icon: <Music2 size={22} />, path: "/songs" },
  { name: "Admin", icon: <ListMusic size={22} />, path: "/admin" },
  { name: "Settings", icon: <Settings size={22} />, path: "/settings" },
  { name: "YouTube", icon: <Youtube size={22} />, path: "/youtubedashboard" },
];

const THEMES = {
  blackgold: {
    bg: "bg-gradient-to-b from-[#0A0A0A] via-[#1B1B1B] via-[#3A3A3A] to-[#B38728]",
    border: "border-[#FFC75F]/25",
    glow: "shadow-[0_0_40px_#B3872888]",
  },
};

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const hoverRef = useRef(null);
  const sidebarRef = useRef(null);
  const hideTimer = useRef(null);
  const ACTIVE_THEME = "blackgold";
  const T = THEMES[ACTIVE_THEME];

  // When pointer is near (tiny strip) or hovered over sidebar, open it.
  const openSidebar = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    setOpen(true);
  };

  // graceful close with small delay so users can move the mouse
  const closeSidebar = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setOpen(false), 260);
  };

  // keyboard toggle for accessibility (press / focus)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Keep small invisible discover strip on left edge; it opens sidebar on hover
  return (
    <>
      {/* invisible hover strip (to open when user moves pointer to left edge) */}
      <div
        ref={hoverRef}
        onMouseEnter={openSidebar}
        onFocus={openSidebar}
        onMouseLeave={closeSidebar}
        className="fixed left-0 top-40 h-[62%] w-4 z-50"
        aria-hidden="true"
      />

      {/* Sidebar container */}
      <motion.aside
        ref={sidebarRef}
        onMouseEnter={openSidebar}
        onMouseLeave={closeSidebar}
        onFocus={openSidebar}
        onBlur={closeSidebar}
        initial={false}
        animate={{ x: open ? 0 : "-78%" }} // translate when closed
        transition={{ type: "spring", stiffness: 220, damping: 28 }}
        className="fixed left-0 top-40 z-50 select-none"
        style={{ width: 280 }}
      >
        {/* Guitar-like curved panel: we use clip-path for a soft curved right edge */}
        <div
          className={`relative overflow-hidden rounded-r-3xl`}
          style={{
            width: 250,
            height: "62vh",
            minHeight: 420,
            background:
              "linear-gradient(180deg, rgba(22,22,22,0.82), rgba(6,6,6,0.82))",
            borderRight: "2px solid rgba(255,200,40,0.12)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            clipPath:
              "path('M0 0 H230 Q270 0 270 40 270 80 230 160 L230 520 Q270 560 230 600 H0 Z')",
            // if clip-path path doesn't render in some browsers, fallback to rounded-r
          }}
        >
          {/* GOLDEN SHEEN OVERLAY */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(120deg, rgba(255,200,40,0.03), rgba(255,200,40,0.02) 30%, transparent 55%)",
              mixBlendMode: "overlay",
            }}
          />

          {/* TOP: logo + brand */}
          <div className="relative z-20 px-6 pt-6 pb-4 flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,200,40,0.12), rgba(255,200,40,0.06))",
                border: "1px solid rgba(255,200,40,0.12)",
              }}
            >
              {/* your uploaded logo path */}
              <img
                src={arcLogo}
                alt="logo"
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  // fallback small text if asset path fails
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white/95 leading-tight">
                ARC Musicals
              </span>
              <span className="text-xs text-white/60">by Vipul Rajput</span>
            </div>
          </div>

          {/* soundwave reactive area (animated bars) */}
          <div className="px-4 mt-2 pointer-events-none">
            <SoundWave open={open} />
          </div>

          {/* nav items */}
          <nav className="mt-6 px-4 space-y-3 z-20">
            {navItems.map((it) => (
              <NavLink
                to={it.path}
                key={it.name}
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3 px-3 rounded-lg transition-all
                  ${
                    isActive
                      ? "bg-white/6 scale-100 shadow-md"
                      : "hover:bg-white/4"
                  }`
                }
                onClick={() => setOpen(false)}
              >
                <div className="text-white/90">{it.icon}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white/90">
                    {it.name}
                  </div>
                </div>
                <div className="text-xs text-white/60">
                  {/* optional badge */}
                </div>
              </NavLink>
            ))}
          </nav>

          {/* bottom decorative area */}
          <div className="absolute bottom-6 left-6 right-6 z-20">
            <div className="flex items-center justify-between gap-4">
              <div className="text-xs text-white/60">Made with ♫</div>
              <button
                onClick={() => setOpen((s) => !s)}
                aria-label="Toggle sidebar"
                className="inline-flex items-center justify-center px-3 py-1 rounded-md bg-gradient-to-r from-yellow-400/10 to-yellow-400/6 border border-yellow-400/10 text-sm text-white/90 hover:brightness-105"
              >
                {open ? "Hide" : "Open"}
              </button>
            </div>

            <div className="mt-3 text-xs text-white/50">
              Developed by Mr. Yashodeep Bhirud (YB)
            </div>
          </div>

          {/* subtle vignette / grain */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0.2))",
              mixBlendMode: "multiply",
            }}
          />
        </div>
      </motion.aside>
    </>
  );
}

function SoundWave({ open }) {
  const bars = 15;
  return (
    <div
      className="relative w-full h-16 rounded-md overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 opacity-7" />
      <div className="relative flex items-end justify-between h-full px-2">
        {[...Array(bars)].map((_, i) => {
          const delay = (i % 5) * 0.08;
          return (
            <motion.span
              key={i}
              animate={{
                height: open
                  ? [
                      "8%",
                      `${20 + (i % 5) * 6}%`,
                      `${8 + (i % 6) * 10}%`,
                      "10%",
                    ]
                  : ["6%", "10%", "6%"],
              }}
              transition={{
                repeat: Infinity,
                duration: open ? 1.6 + (i % 4) * 0.18 : 2.6,
                repeatType: "mirror",
                ease: "easeInOut",
                delay,
              }}
              style={{
                width: `${6}%`,
                borderRadius: 6,
                background:
                  "linear-gradient(180deg, rgba(255,200,40,0.95), rgba(255,140,20,0.8))",
                boxShadow: "0 4px 14px rgba(255,160,40,0.12)",
                display: "inline-block",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
