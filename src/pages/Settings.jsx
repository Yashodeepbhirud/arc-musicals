import React, { useEffect, useState } from "react";
import {
  Moon,
  Sun,
  Bell,
  Lock,
  Globe,
  Cpu,
  Palette,
  Radio,
  Shield,
  Smartphone,
} from "lucide-react";
import arcLogo from "../assets/arc.png";

export default function Settings() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [accent, setAccent] = useState(
    localStorage.getItem("accent") || "#F5C542"
  ); // GOLD
  const [sidebarStyle, setSidebarStyle] = useState(
    localStorage.getItem("sidebar") || "guitar"
  );
  const [performance, setPerformance] = useState(
    localStorage.getItem("performance") || "balanced"
  );

  const [notifications, setNotifications] = useState(
    JSON.parse(localStorage.getItem("notifications")) || {
      subs: false,
      comments: false,
      analytics: false,
      glow: false,
    }
  );

  const [language, setLanguage] = useState(
    localStorage.getItem("lang") || "English"
  );

  /* GLOBAL APPLY */
  useEffect(() => {
    document.body.className = theme === "dark" ? "dark" : "light";
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty("--arc-accent", accent);
    localStorage.setItem("accent", accent);
  }, [accent]);

  useEffect(
    () => localStorage.setItem("sidebar", sidebarStyle),
    [sidebarStyle]
  );
  useEffect(
    () => localStorage.setItem("performance", performance),
    [performance]
  );
  useEffect(() => localStorage.setItem("lang", language), [language]);
  useEffect(
    () => localStorage.setItem("notifications", JSON.stringify(notifications)),
    [notifications]
  );

  /* RESET APP */
  const clearAllData = () => {
    localStorage.clear();
    window.location.reload();
  };

  /* BACKUP SETTINGS */
  const downloadBackup = () => {
    const settings = {
      theme,
      accent,
      sidebarStyle,
      performance,
      notifications,
      language,
    };

    const blob = new Blob([JSON.stringify(settings, null, 2)], {
      type: "application/json",
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "arc-blackgold-settings.json";
    a.click();
  };

  return (
    <div className="min-h-screen px-6 py-8 bg-gradient-to-br from-black via-[#0A0A0A] to-black text-white">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-10">
        <img
          src={arcLogo}
          className="h-12 w-12 object-contain drop-shadow-[0_0_12px_#F5C542]"
        />
        <h1 className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-[#F5C542] to-white text-transparent bg-clip-text">
          ARC Musicals – Settings
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* THEME MODE */}
        <SettingCard title="Theme & Appearance" icon={<Palette size={22} />}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm">Theme Mode</span>
            <div className="flex gap-3">
              <button
                onClick={() => setTheme("light")}
                className={`px-3 py-1 rounded-lg flex items-center gap-1 border ${
                  theme === "light"
                    ? "bg-white text-black border-yellow-400"
                    : "border-gray-600 bg-black/50"
                }`}
              >
                <Sun size={16} /> Light
              </button>

              <button
                onClick={() => setTheme("dark")}
                className={`px-3 py-1 rounded-lg flex items-center gap-1 border ${
                  theme === "dark"
                    ? "bg-[#F5C542] text-black border-yellow-400"
                    : "border-gray-600 bg-black/50"
                }`}
              >
                <Moon size={16} /> Dark
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm mb-2">Accent Color</p>
            <input
              type="color"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
              className="h-10 w-20 rounded-md cursor-pointer"
            />
          </div>
        </SettingCard>

        {/* SIDEBAR STYLE */}
        <SettingCard title="Sidebar Style" icon={<Radio size={22} />}>
          <Option
            checked={sidebarStyle === "guitar"}
            onClick={() => setSidebarStyle("guitar")}
            title="Guitar Curve Sidebar"
            desc="Premium ARC themed curved shape"
          />

          <Option
            checked={sidebarStyle === "glass"}
            onClick={() => setSidebarStyle("glass")}
            title="Glass Gold Sidebar"
            desc="Smooth reflective glass surface"
          />

          <Option
            checked={sidebarStyle === "soundwave"}
            onClick={() => setSidebarStyle("soundwave")}
            title="Soundwave Pulse Sidebar"
            desc="Live reactive glow effect"
          />
        </SettingCard>

        {/* NOTIFICATIONS */}
        <SettingCard title="Notifications" icon={<Bell size={22} />}>
          <Toggle
            label="Live Subscriber Alerts"
            checked={notifications.subs}
            onChange={(v) => setNotifications({ ...notifications, subs: v })}
          />
          <Toggle
            label="New Comments Alert"
            checked={notifications.comments}
            onChange={(v) =>
              setNotifications({ ...notifications, comments: v })
            }
          />
          <Toggle
            label="Analytics Pulse"
            checked={notifications.analytics}
            onChange={(v) =>
              setNotifications({ ...notifications, analytics: v })
            }
          />
          <Toggle
            label="Gold Reactive Glow"
            checked={notifications.glow}
            onChange={(v) => setNotifications({ ...notifications, glow: v })}
          />
        </SettingCard>

        {/* LANGUAGE */}
        <SettingCard title="Language" icon={<Globe size={22} />}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-3 py-2 bg-black/40 border border-yellow-600 rounded-lg"
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Marathi</option>
            <option>Gujarati</option>
          </select>
        </SettingCard>

        {/* PERFORMANCE */}
        <SettingCard title="Performance Mode" icon={<Cpu size={22} />}>
          <Option
            checked={performance === "battery"}
            onClick={() => setPerformance("battery")}
            title="Battery Saver"
            desc="Minimal animations, low refresh rate"
          />

          <Option
            checked={performance === "balanced"}
            onClick={() => setPerformance("balanced")}
            title="Balanced"
            desc="Best balance of speed & visuals"
          />

          <Option
            checked={performance === "ultra"}
            onClick={() => setPerformance("ultra")}
            title="Ultra Performance"
            desc="High refresh + full gold animations"
          />
        </SettingCard>

        {/* DATA CONTROLS */}
        <SettingCard title="Data Management" icon={<Shield size={22} />}>
          <button
            onClick={clearAllData}
            className="w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
          >
            Clear App Data
          </button>

          <button
            onClick={downloadBackup}
            className="w-full py-2 mt-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition"
          >
            Backup Settings
          </button>
        </SettingCard>
      </div>
    </div>
  );
}

/* COMPONENTS */

function SettingCard({ title, icon, children }) {
  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-600 shadow-[0_0_18px_#F5C54255] hover:shadow-[0_0_28px_#F5C54299] transition">
      <div className="flex items-center gap-3 mb-4">
        <span className="p-2 bg-yellow-600/20 rounded-lg">{icon}</span>
        <h2 className="text-xl font-bold text-yellow-300">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 accent-yellow-500"
      />
    </div>
  );
}

function Option({ checked, onClick, title, desc }) {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-xl w-full text-left border transition ${
        checked
          ? "bg-yellow-600/30 border-yellow-500"
          : "bg-black/30 border-gray-700"
      }`}
    >
      <p className="font-semibold text-yellow-300">{title}</p>
      <p className="text-xs opacity-70">{desc}</p>
    </button>
  );
}
