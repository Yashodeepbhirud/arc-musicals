// // src/components/NavbarMobile.jsx
// import React, { useState } from 'react'
// import { Link, useLocation } from 'react-router-dom'
// import logo from "../assets/arc-logo.png"

// export default function NavbarMobile(){
//   const { pathname } = useLocation()
//   const [open, setOpen] = useState(false)

//   const links = [
//     { to: '/', label: 'Home' },
//     { to: '/songs', label: 'Songs' },
//     { to: '/portfolio', label: 'About' },
//     { to: '/admin', label: 'Admin' },
//   ]

//   return (
//     <>
//       <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-sm bg-white/5 border-b border-white/6">
//         <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
//           <Link to="/" className="flex items-center gap-3">
//             <img src={logo} alt="logo" className="w-20 h-20 object-contain rounded-md" />
//             <div className="hidden sm:block">
//               <div className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-arcgold to-yellow-300">ARC Musicals</div>
//               <div className="text-xs text-white/60 -mt-0.5">by Vipul Rajput</div>
//             </div>
//           </Link>

//           {/* Desktop nav (visible md+) */}
//           <nav className="hidden md:flex items-center gap-6">
//             {links.slice(1).map(l=> (
//               <Link key={l.to} to={l.to} className={`text-sm font-medium ${pathname===l.to? 'text-arcgold' : 'text-white/80 hover:text-white'}`}>
//                 {l.label}
//               </Link>
//             ))}

//             <Link to="/admin" className="px-4 py-2 rounded-xl bg-gradient-to-r from-arcgold to-yellow-400 text-arcdark font-semibold shadow-lg">Admin</Link>
//           </nav>

//           {/* Mobile hamburger */}
//           <button aria-label="Open menu" onClick={()=>setOpen(true)} className="md:hidden p-2 rounded-lg bg-white/6">
//             <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white">
//               <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
//             </svg>
//           </button>
//         </div>
//       </header>

//       {/* Overlay: mixed drawer + fullscreen */}
//       <div className={`fixed inset-0 z-40 transition-opacity ${open? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} aria-hidden={!open}>
//         {/* dim background */}
//         <div onClick={()=>setOpen(false)} className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${open? 'opacity-100' : 'opacity-0'}`} />

//         {/* Right drawer panel */}
//         <aside className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-gradient-to-b from-[#0b1220]/80 to-[#071427]/90 arc-glass p-6 transform transition-transform ${open? 'translate-x-0' : 'translate-x-full'}`}>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <img src="/logo.png" alt="ARC" className="w-10 h-10 object-contain rounded-md" />
//               <div>
//                 <div className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-arcgold to-yellow-300">ARC Musicals</div>
//                 <div className="text-xs text-white/60">by Vipul Rajput</div>
//               </div>
//             </div>

//             <button onClick={()=>setOpen(false)} aria-label="Close menu" className="p-2 rounded bg-white/6">
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
//             </button>
//           </div>

//           <nav className="mt-8 space-y-4">
//             {/* Big centered links for a cinematic feel */}
//             {links.map(l => (
//               <Link key={l.to} to={l.to} onClick={()=>setOpen(false)} className="block">
//                 <div className={`text-lg font-semibold py-3 px-2 rounded hover:bg-white/5 transition ${pathname===l.to? 'text-arcgold' : 'text-white/90'}`}>
//                   {l.label}
//                 </div>
//               </Link>
//             ))}
//           </nav>

//           <div className="mt-6 border-t border-white/6 pt-4 text-sm text-white/60">
//             <p>Follow</p>
//             <div className="flex gap-3 mt-3">
//               <a href="#" aria-label="YouTube" className="p-2 rounded bg-white/6 inline-flex items-center justify-center">
//                 <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 7.2s-.2-1.6-.8-2.3c-.8-.9-1.7-.9-2.1-1-3-.2-7.5-.2-7.5-.2s-4.5 0-7.5.2c-.4.1-1.3.1-2.1 1-.6.7-.8 2.3-.8 2.3S2 9 2 10.8v2.4C2 15 2.2 16.6 2.2 16.6s.2 1.6.8 2.3c.8.9 1.9.9 2.4 1 1.7.1 7.1.2 7.1.2s4.5 0 7.5-.2c.4-.1 1.3-.1 2.1-1 .6-.7.8-2.3.8-2.3s.2-1.6.2-3.4v-2.4c0-1.8-.2-3.6-.2-3.6zM9.75 15.02V8.98l6.04 3.02-6.04 3.02z"/></svg>
//               </a>
//               <a href="#" aria-label="Instagram" className="p-2 rounded bg-white/6 inline-flex items-center justify-center">
//                 <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.2a4.8 4.8 0 100 9.6 4.8 4.8 0 000-9.6zM18.5 6.2a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0z"/></svg>
//               </a>
//               <a href="#" aria-label="WhatsApp" className="p-2 rounded bg-white/6 inline-flex items-center justify-center">
//                 <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.52 3.48A11.86 11.86 0 0012 0C5.37 0 .02 5.35.02 12c0 2.11.55 4.17 1.6 6l-1.72 6.22 6.36-1.68c1.8 1 3.85 1.56 5.76 1.56 6.63 0 12-5.35 12-12 0-3.19-1.24-6.07-3.5-8.22zM12 20.5c-1.57 0-3.06-.39-4.35-1.08l-.31-.18-3.77 1 1.04-3.77-.19-.31A8.5 8.5 0 013.5 12 8.5 8.5 0 0112 3.5 8.5 8.5 0 0120.5 12 8.5 8.5 0 0112 20.5zM16.6 14.1c-.26-.13-1.56-.77-1.8-.86-.24-.09-.42-.13-.6.13-.18.26-.72.86-.88 1.04-.16.18-.32.2-.58.07-.26-.13-1.1-.4-2.1-1.29-.78-.7-1.3-1.57-1.45-1.83-.15-.26-.02-.4.11-.53.11-.11.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.33-.02-.46-.06-.13-.6-1.44-.82-1.95-.22-.52-.45-.45-.62-.46l-.53-.01c-.18 0-.47.07-.72.33-.24.26-.92.9-.92 2.2s.94 2.56 1.07 2.73c.13.17 1.86 2.85 4.5 3.88 2.64 1.03 2.64.68 3.11.64.47-.04 1.56-.64 1.78-1.25.22-.61.22-1.13.15-1.25-.07-.12-.25-.17-.51-.3z"/></svg>
//               </a>
//             </div>
//           </div>

//         </aside>
//       </div>
//     </>
//   )
// }

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/arc-logo.png";

export default function NavbarMobile() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/songs", label: "Songs" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
    { to: "/admin", label: "Admin" },
    { to: "/youtubedashboard", label: "Dashboard" },
  ];

  return (
    <>
      {/* HEADER — FIXED */}
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-sm bg-white/5 border-b border-white/10 shadow-lg h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="logo"
              className="w-14 h-14 object-contain rounded-md"
            />
            <div className="hidden sm:block">
              <div className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-arcgold to-yellow-300">
                ARC Musicals
              </div>
              <div className="text-xs text-white/60 -mt-0.5">
                by Vipul Rajput
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search song..."
                className="px-4 py-1.5 w-48 rounded-lg bg-white/10 text-white placeholder-white/60 outline-none border border-white/10 focus:border-arcgold/60 transition"
              />
              <span className="absolute right-3 top-2.5 text-white/50 text-xs">
                ⌕
              </span>
            </div>

            {links.slice(1).map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`relative text-sm font-medium group 
                  ${
                    pathname === l.to
                      ? "text-arcgold"
                      : "text-white/80 hover:text-white"
                  }`}
              >
                {l.label}
                <span
                  className={`absolute left-0 -bottom-1 h-0.5 w-full bg-gradient-to-r from-arcgold to-yellow-300 
                  scale-x-0 group-hover:scale-x-100 transition-transform origin-left 
                  ${pathname === l.to ? "scale-x-100" : ""}`}
                />
              </Link>
            ))}

            <Link
              to="/admin"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-arcgold to-yellow-400 text-arcdark font-semibold shadow-lg hover:shadow-yellow-500/40 transition"
            >
              Admin
            </Link>
          </nav>

          {/* Mobile Hamburger */}
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="md:hidden p-2 rounded-lg bg-white/10"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white"
            >
              <path
                d="M3 6h18M3 12h18M3 18h18"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* MOBILE PANEL */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 
        ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Background */}
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 
            ${open ? "opacity-100" : "opacity-0"}`}
        />

        {/* Drawer */}
        <aside
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm 
          bg-gradient-to-b from-[#0b1220]/90 to-[#071427]/95 arc-glass p-6 
          transform transition-transform duration-300 
          ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          {/* Drawer Content */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="ARC"
                className="w-10 h-10 object-contain rounded-md"
              />
              <div>
                <div className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-arcgold to-yellow-300">
                  ARC Musicals
                </div>
                <div className="text-xs text-white/60">by Vipul Rajput</div>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="p-2 rounded bg-white/10"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6l12 12M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <nav className="mt-8 space-y-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`block py-3 text-lg font-semibold rounded transition 
                  ${
                    pathname === l.to
                      ? "text-arcgold"
                      : "text-white/90 hover:bg-white/5"
                  }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="mt-8 border-t border-white/10 pt-5 text-sm text-white/60">
            <p>Follow Us</p>
            <div className="flex gap-3 mt-3">
              <a className="p-2 bg-white/10 rounded">YT</a>
              <a className="p-2 bg-white/10 rounded">IG</a>
              <a className="p-2 bg-white/10 rounded">WA</a>
            </div>
          </div>
        </aside>
      </div>

      {/* Floating Music Button */}
      <button
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full 
        bg-gradient-to-r from-arcgold to-yellow-400 shadow-lg shadow-yellow-600/40 
        flex items-center justify-center text-arcdark font-bold text-xl 
        hover:scale-105 active:scale-95 transition"
      >
        ♫
      </button>
    </>
  );
}
