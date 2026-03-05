import { useState, useEffect, useRef } from "react";

// \u2500\u2500 Storage \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const store = {
      async get(k) { try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : null; } catch { return null; } },
        async set(k, v) { try { await window.storage.set(k, JSON.stringify(v)); } catch {} },
          async del(k) { try { await window.storage.delete(k); } catch {} },
};
async function hashPassword(pw) {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pw + "nexushub_salt_2025"));
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

// \u2500\u2500 Responsive hook \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function useBreakpoint() {
      const [w, setW] = useState(window.innerWidth);
        useEffect(() => {
                const fn = () => setW(window.innerWidth);
                    window.addEventListener("resize", fn);
                        return () => window.removeEventListener("resize", fn);
        }, []);
          return { w, isMobile: w < 640, isTablet: w >= 640 && w < 1024, isDesktop: w >= 1024 };
}

// \u2500\u2500 Themes \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const THEMES = {
      obsidian: { name:"Obsidian",  bg:"#080d13", surface:"#0d1520", border:"#1e2d3d", text:"#e2e8f0", muted:"#475569", dim:"#334155", accent:"#f59e0b" },
        aurora:   { name:"Aurora",    bg:"#020710", surface:"#080f1a", border:"#0d2040", text:"#d4f1ff", muted:"#4a7fa5", dim:"#1e3d5c", accent:"#38bdf8" },
          forest:   { name:"Forest",    bg:"#050e08", surface:"#091410", border:"#0f2a18", text:"#d4f4de", muted:"#3d7a56", dim:"#1a3828", accent:"#4ade80" },
            crimson:  { name:"Crimson",   bg:"#0e0508", surface:"#160a0c", border:"#2d1018", text:"#fde8e8", muted:"#8a3a40", dim:"#3d1a1e", accent:"#f87171" },
              vapor:    { name:"Vaporwave", bg:"#0a0514", surface:"#120a1e", border:"#2a1040", text:"#f0d4ff", muted:"#7a4a99", dim:"#3d1a5c", accent:"#c084fc" },
                light:    { name:"Light",     bg:"#f8f9fc", surface:"#ffffff", border:"#e2e8f0", text:"#0f172a", muted:"#64748b", dim:"#cbd5e1", accent:"#2563eb" },
};

const PALETTES = ["#f59e0b","#10b981","#6366f1","#ef4444","#3b82f6","#ec4899","#14b8a6","#f]
}
        })
}
}
}