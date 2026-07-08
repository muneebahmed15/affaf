import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ShoppingBag, Plus, Minus, Trash2, ChevronDown, Instagram, Mail } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────
   BRAND TOKENS
───────────────────────────────────────────────────────────────────────── */
const T = {
  bg: "#FBF8F3",
  fg: "#2A2118",
  plum: "#3D2E3A",
  taupe: "#A08070",
  cream: "#F5F0E8",
  border: "rgba(61,46,58,0.12)",
  mutedFg: "#8A7F75",
  serif: "'Cormorant Garamond', Georgia, serif",
  sans: "'DM Sans', system-ui, sans-serif",
};

/* ─────────────────────────────────────────────────────────────────────────
   HIJAB COLOR PALETTE  (10 launch colors)
───────────────────────────────────────────────────────────────────────── */
const COLORS = [
  { name: "Noor Black",      hex: "#1C1C1C", light: "#303030", dark: "#0A0A0A",  textLight: true  },
  { name: "Soft Ivory",      hex: "#EDE4CC", light: "#F5EDD8", dark: "#D8D0B4",  textLight: false },
  { name: "Cream",           hex: "#E5D9BE", light: "#EDE4CC", dark: "#CEC4A6",  textLight: false },
  { name: "Mocha Taupe",     hex: "#9A7D6A", light: "#B09280", dark: "#7A5D4A",  textLight: true  },
  { name: "Chocolate Brown", hex: "#5C3825", light: "#704A35", dark: "#422A1A",  textLight: true  },
  { name: "Espresso",        hex: "#3A2110", light: "#4E3222", dark: "#260E04",  textLight: true  },
  { name: "Deep Plum",       hex: "#3D2E3A", light: "#52404E", dark: "#2A1E28",  textLight: true  },
  { name: "Dusty Rose",      hex: "#C29088", light: "#D0A8A0", dark: "#A87870",  textLight: false },
  { name: "Olive Sage",      hex: "#7A8C66", light: "#8EA07A", dark: "#607050",  textLight: true  },
  { name: "Stone Gray",      hex: "#908882", light: "#A8A09A", dark: "#706860",  textLight: true  },
];

const PRICE = 38;
const PRICE_DISPLAY = `$${PRICE}.00`;

/* ─────────────────────────────────────────────────────────────────────────
   QUALITY FEATURES
───────────────────────────────────────────────────────────────────────── */
const QUALITY = [
  { icon: "◎", title: "Soft modal feel",       desc: "Ultra-smooth premium modal with a cashmere-like hand feel that gets softer with every wash." },
  { icon: "◎", title: "Breathable comfort",    desc: "Lightweight open-weave construction keeps airflow moving — cool and comfortable all day." },
  { icon: "◎", title: "Not see-through",       desc: "160–180 GSM weight delivers full opacity. No extra layers, no compromise on modesty." },
  { icon: "◎", title: "Elegant drape",         desc: "Falls in soft, natural folds that frame beautifully and stay in place without constant adjusting." },
  { icon: "◎", title: "Clean stitching",       desc: "Hand-finished rolled hems that lie perfectly flat — never fraying, never curling." },
  { icon: "◎", title: "160–180 GSM",           desc: "Premium weight: structured enough to hold shape, light enough for all-day everyday wear." },
  { icon: "◎", title: "70×180 cm everyday size", desc: "Ideal dimensions for versatile styling — full coverage with enough length to drape elegantly." },
];

/* ─────────────────────────────────────────────────────────────────────────
   PACKAGING
───────────────────────────────────────────────────────────────────────── */
const PACKAGING = [
  { step: "01", label: "AFAFF label",     desc: "Embossed brand label in deep plum. Understated, precise, and immediately recognizable." },
  { step: "02", label: "Minimal pouch",  desc: "Ivory linen drawstring pouch — reusable, travel-ready, and endlessly elegant." },
  { step: "03", label: "Care card",      desc: "Premium matte card with fabric care instructions — because good things deserve care." },
  { step: "04", label: "Thank you card", desc: "A personal message, because every order is the beginning of something worth celebrating." },
];

/* ─────────────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────────────── */
interface CartItem {
  colorName: string;
  colorHex: string;
  qty: number;
}

/* ─────────────────────────────────────────────────────────────────────────
   HIJAB DRAPE SVG ILLUSTRATION
   A flat, editorial-style fashion illustration of a hijab-draped figure.
───────────────────────────────────────────────────────────────────────── */
function HijabDrape({ colorHex, lightHex, darkHex }: { colorHex: string; lightHex: string; darkHex: string }) {
  return (
    <svg
      viewBox="0 0 300 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Hijab drape illustration"
      style={{ width: "100%", maxWidth: 340, display: "block" }}
    >
      <defs>
        <filter id="hijabShadow" x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="rgba(42,33,24,0.18)" />
        </filter>
        <filter id="faceShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="rgba(42,33,24,0.10)" />
        </filter>
        <radialGradient id="faceGrad" cx="42%" cy="38%" r="60%">
          <stop offset="0%" stopColor="#E2BE9E" />
          <stop offset="100%" stopColor="#C9A07E" />
        </radialGradient>
        <radialGradient id="hijabHighlight" cx="35%" cy="20%" r="55%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <radialGradient id="hijabShade" cx="50%" cy="50%" r="60%">
          <stop offset="60%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.10)" />
        </radialGradient>
      </defs>

      {/* ── SHOULDERS / BODY BASE ── */}
      <path
        d="M 0 450 Q 10 375 68 350 L 232 350 Q 290 375 300 450 L 300 480 L 0 480 Z"
        fill="#D4AC88"
      />

      {/* ── NECK ── */}
      <rect x="126" y="268" width="48" height="88" rx="24" fill="#D8B490" />

      {/* ── MAIN HIJAB SHAPE ── back-of-head + sides + drape ── */}
      {/* Slightly larger back layer for depth */}
      <path
        d="M 150 36
           C 196 33 248 62 268 112
           C 290 166 286 228 272 274
           C 254 328 222 356 208 406
           C 200 432 194 456 192 476
           L 108 476
           C 106 456 100 432 92 406
           C 78 356 46 328 28 274
           C 14 228 10 166 32 112
           C 52 62 104 33 150 36 Z"
        fill={darkHex}
        filter="url(#hijabShadow)"
        opacity="0.5"
      />

      {/* Main hijab layer */}
      <path
        d="M 150 42
           C 194 39 244 67 264 116
           C 285 168 280 226 266 271
           C 248 322 218 350 204 400
           C 196 426 190 453 188 474
           L 112 474
           C 110 453 104 426 96 400
           C 82 350 52 322 34 271
           C 20 226 15 168 36 116
           C 56 67 106 39 150 42 Z"
        fill={colorHex}
      />

      {/* Fabric highlight (top of hijab cap) */}
      <ellipse cx="136" cy="98" rx="54" ry="32" fill="url(#hijabHighlight)" />

      {/* Subtle edge shading for dimension */}
      <path
        d="M 150 42 C 106 39 56 67 36 116 C 20 166 20 226 34 271 L 60 210 C 50 168 64 108 150 68 Z"
        fill="rgba(0,0,0,0.05)"
      />
      <path
        d="M 150 42 C 194 39 244 67 264 116 C 280 166 280 226 266 271 L 240 210 C 250 168 236 108 150 68 Z"
        fill="rgba(0,0,0,0.05)"
      />

      {/* Left drape fold line */}
      <path
        d="M 68 185 Q 56 250 62 315 Q 66 360 80 405"
        stroke="rgba(255,255,255,0.13)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Second left fold */}
      <path
        d="M 82 210 Q 74 275 82 340"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Right drape fold line */}
      <path
        d="M 232 185 Q 244 250 238 315 Q 234 360 220 405"
        stroke="rgba(255,255,255,0.13)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Second right fold */}
      <path
        d="M 218 210 Q 226 275 218 340"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* ── EXPOSED FACE OVAL ── drawn over hijab to create opening ── */}
      <ellipse
        cx="150"
        cy="188"
        rx="72"
        ry="86"
        fill="url(#faceGrad)"
        filter="url(#faceShadow)"
      />

      {/* Subtle face dimension */}
      <ellipse cx="150" cy="215" rx="62" ry="65" fill="rgba(180,130,90,0.12)" />

      {/* ── FACE FEATURES (editorial-minimal) ── */}

      {/* Left eyebrow */}
      <path
        d="M 110 160 Q 122 153 136 158"
        stroke="#5C3820"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right eyebrow */}
      <path
        d="M 164 158 Q 178 153 190 160"
        stroke="#5C3820"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Left eye */}
      <path d="M 108 172 Q 122 164 136 172 Q 122 180 108 172 Z" fill="#3A2210" />
      <ellipse cx="120" cy="170" rx="2.2" ry="1.6" fill="rgba(255,255,255,0.38)" />

      {/* Right eye */}
      <path d="M 164 172 Q 178 164 192 172 Q 178 180 164 172 Z" fill="#3A2210" />
      <ellipse cx="176" cy="170" rx="2.2" ry="1.6" fill="rgba(255,255,255,0.38)" />

      {/* Nose — very minimal, just nostrils suggestion */}
      <ellipse cx="143" cy="207" rx="3" ry="2" fill="rgba(120,78,48,0.22)" />
      <ellipse cx="157" cy="207" rx="3" ry="2" fill="rgba(120,78,48,0.22)" />

      {/* Lips */}
      <path d="M 135 230 Q 150 240 165 230" fill="#B87A68" />
      <path
        d="M 135 230 Q 142 225 150 226 Q 158 225 165 230 Q 153 232 150 231 Q 147 232 135 230 Z"
        fill="#CC9080"
      />

      {/* ── CHIN WRAP ── hijab fabric under chin (drawn last to show draping) ── */}
      {/* This sits at the bottom of the face oval showing hijab fabric wrapping under chin */}
      <path
        d="M 84 248
           C 80 263 82 278 98 290
           C 116 304 132 308 150 308
           C 168 308 184 304 202 290
           C 218 278 220 263 216 248
           C 196 262 174 268 150 268
           C 126 268 104 262 84 248 Z"
        fill={colorHex}
      />
      {/* Chin wrap fold line */}
      <path
        d="M 96 260 Q 122 276 150 278 Q 178 276 204 260"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Shade overlay for depth at bottom of hijab */}
      <path
        d="M 112 474 C 108 440 90 400 76 362 C 82 368 90 380 100 390 C 106 415 108 450 112 474 Z"
        fill="rgba(0,0,0,0.04)"
      />
      <path
        d="M 188 474 C 192 440 210 400 224 362 C 218 368 210 380 200 390 C 194 415 192 450 188 474 Z"
        fill="rgba(0,0,0,0.04)"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   PRODUCT CARD IMAGE PLACEHOLDER
   A clean fabric-swatch card using the hijab color
───────────────────────────────────────────────────────────────────────── */
function ProductImage({ color }: { color: typeof COLORS[0] }) {
  const isLight = !color.textLight;
  return (
    <div
      style={{
        background: color.hex,
        width: "100%",
        aspectRatio: "4/5",
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle fabric texture lines */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.12 }}>
        <line x1="20%" y1="0" x2="10%" y2="100%" stroke={isLight ? "#000" : "#fff"} strokeWidth="0.5" />
        <line x1="40%" y1="0" x2="30%" y2="100%" stroke={isLight ? "#000" : "#fff"} strokeWidth="0.5" />
        <line x1="60%" y1="0" x2="50%" y2="100%" stroke={isLight ? "#000" : "#fff"} strokeWidth="0.5" />
        <line x1="80%" y1="0" x2="70%" y2="100%" stroke={isLight ? "#000" : "#fff"} strokeWidth="0.5" />
        <line x1="100%" y1="0" x2="90%" y2="100%" stroke={isLight ? "#000" : "#fff"} strokeWidth="0.5" />
      </svg>

      {/* Brand monogram */}
      <span
        style={{
          fontFamily: T.serif,
          fontSize: "3rem",
          fontWeight: 300,
          letterSpacing: "0.15em",
          color: color.textLight ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.25)",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        A
      </span>

      {/* Subtle highlight overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: `linear-gradient(to bottom, ${isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)"}, transparent)`,
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────────────────────────────────── */
export default function App() {
  const [menuOpen, setMenuOpen]     = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [cart, setCart]             = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen]     = useState(false);
  const [email, setEmail]           = useState("");
  const [emailDone, setEmailDone]   = useState(false);
  const [drapeIdx, setDrapeIdx]     = useState(0);          // selected color index for drape preview
  const [featuredIdx, setFeaturedIdx] = useState(0);        // selected color index for colors section
  const [addedFlash, setAddedFlash] = useState<string | null>(null); // color name flash
  const [detailColor, setDetailColor] = useState<typeof COLORS[0] | null>(null); // product detail modal
  const [detailQty, setDetailQty]   = useState(1);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* lock body scroll when cart or detail is open */
  useEffect(() => {
    document.body.style.overflow = cartOpen || detailColor ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen, detailColor]);

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal   = cart.reduce((s, i) => s + i.qty * PRICE, 0);

  const addToCart = useCallback((colorName: string, colorHex: string, qty = 1) => {
    setCart(prev => {
      const ex = prev.find(i => i.colorName === colorName);
      if (ex) return prev.map(i => i.colorName === colorName ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { colorName, colorHex, qty }];
    });
    setAddedFlash(colorName);
    setTimeout(() => setAddedFlash(null), 2000);
    setCartOpen(true);
  }, []);

  const removeFromCart = (name: string) => setCart(p => p.filter(i => i.colorName !== name));
  const updateQty = (name: string, delta: number) =>
    setCart(p => p.map(i => i.colorName === name ? { ...i, qty: Math.max(1, i.qty + delta) } : i));

  const openDetail = (color: typeof COLORS[0]) => {
    setDetailColor(color);
    setDetailQty(1);
  };
  const closeDetail = () => setDetailColor(null);

  const nav = [
    { label: "Shop",    href: "#shop"     },
    { label: "Colors",  href: "#colors"   },
    { label: "Drape",   href: "#drape"    },
    { label: "Quality", href: "#quality"  },
    { label: "About",   href: "#about"    },
    { label: "Contact", href: "#contact"  },
  ];

  /* ── render ── */
  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        color: T.fg,
        fontFamily: T.sans,
        overflowX: "hidden",
      }}
    >

      {/* ════════════════════════════════════════════════════════════════
          NAVBAR
      ════════════════════════════════════════════════════════════════ */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: "background 0.4s, box-shadow 0.4s",
          background: scrolled ? "rgba(251,248,243,0.94)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          boxShadow: scrolled ? `0 1px 0 ${T.border}` : "none",
        }}
      >
        <nav
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            height: 68,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <a
            href="#"
            style={{
              fontFamily: T.serif,
              fontSize: "1.75rem",
              fontWeight: 400,
              letterSpacing: "0.12em",
              color: T.plum,
              textDecoration: "none",
              lineHeight: 1,
            }}
          >
            AFAFF
          </a>

          {/* Desktop links */}
          <ul
            style={{
              display: "none",
              gap: 36,
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
            className="md-nav"
          >
            {nav.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: T.mutedFg,
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = T.plum)}
                  onMouseLeave={e => (e.currentTarget.style.color = T.mutedFg)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right: cart + hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 8,
                position: "relative",
                color: T.plum,
              }}
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    width: 17,
                    height: 17,
                    borderRadius: "50%",
                    background: T.plum,
                    color: T.bg,
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {totalItems}
                </span>
              )}
            </button>

            <button
              className="hamburger"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Menu"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 8,
                color: T.plum,
              }}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: "rgba(251,248,243,0.98)",
                borderBottom: `1px solid ${T.border}`,
                overflow: "hidden",
              }}
            >
              <div style={{ padding: "16px 24px 24px" }}>
                {nav.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: "block",
                      padding: "14px 0",
                      fontSize: "1.1rem",
                      fontFamily: T.serif,
                      fontWeight: 400,
                      letterSpacing: "0.04em",
                      color: T.fg,
                      textDecoration: "none",
                      borderBottom: `1px solid ${T.border}`,
                    }}
                  >
                    {label}
                  </a>
                ))}
                <a
                  href="#shop"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "block",
                    marginTop: 20,
                    padding: "14px 28px",
                    background: T.plum,
                    color: T.bg,
                    textAlign: "center",
                    borderRadius: 60,
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                  }}
                >
                  Shop Collection
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ════════════════════════════════════════════════════════════════
          CART DRAWER
      ════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 60,
                background: "rgba(42,33,24,0.45)",
                backdropFilter: "blur(4px)",
              }}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              style={{
                position: "fixed",
                right: 0,
                top: 0,
                bottom: 0,
                zIndex: 61,
                width: "100%",
                maxWidth: 420,
                background: T.bg,
                borderLeft: `1px solid ${T.border}`,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Cart header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "20px 24px",
                  borderBottom: `1px solid ${T.border}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <ShoppingBag size={18} style={{ color: T.plum }} />
                  <span style={{ fontFamily: T.serif, fontSize: "1.25rem", fontWeight: 400, color: T.fg }}>
                    Your Bag
                  </span>
                  {totalItems > 0 && (
                    <span style={{ fontSize: "0.75rem", color: T.mutedFg }}>({totalItems} item{totalItems !== 1 ? "s" : ""})</span>
                  )}
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: T.mutedFg, padding: 4 }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Cart items */}
              <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
                {cart.length === 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      gap: 16,
                      textAlign: "center",
                    }}
                  >
                    <ShoppingBag size={44} style={{ color: T.border, opacity: 0.5 }} />
                    <p style={{ color: T.mutedFg, fontSize: "0.9rem" }}>Your bag is empty.</p>
                    <button
                      onClick={() => setCartOpen(false)}
                      style={{
                        padding: "12px 28px",
                        borderRadius: 60,
                        background: T.plum,
                        color: T.bg,
                        border: "none",
                        cursor: "pointer",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      Explore Collection
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {cart.map(item => (
                      <div
                        key={item.colorName}
                        style={{
                          display: "flex",
                          gap: 14,
                          padding: 16,
                          borderRadius: 12,
                          border: `1px solid ${T.border}`,
                          background: T.cream,
                        }}
                      >
                        {/* Color swatch */}
                        <div
                          style={{
                            width: 56,
                            height: 68,
                            borderRadius: 8,
                            background: item.colorHex,
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                              <p style={{ fontWeight: 500, fontSize: "0.88rem", color: T.fg }}>{item.colorName}</p>
                              <p style={{ fontSize: "0.75rem", color: T.mutedFg, marginTop: 2 }}>
                                Premium Modal · 70×180 cm
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.colorName)}
                              style={{ background: "none", border: "none", cursor: "pointer", color: T.mutedFg, padding: 2 }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                border: `1px solid ${T.border}`,
                                borderRadius: 40,
                                padding: "4px 10px",
                              }}
                            >
                              <button
                                onClick={() => updateQty(item.colorName, -1)}
                                disabled={item.qty <= 1}
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: item.qty > 1 ? "pointer" : "default",
                                  color: T.mutedFg,
                                  padding: 0,
                                  display: "flex",
                                }}
                              >
                                <Minus size={12} />
                              </button>
                              <span style={{ fontSize: "0.85rem", fontWeight: 600, width: 16, textAlign: "center" }}>
                                {item.qty}
                              </span>
                              <button
                                onClick={() => updateQty(item.colorName, 1)}
                                style={{ background: "none", border: "none", cursor: "pointer", color: T.fg, padding: 0, display: "flex" }}
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <span style={{ fontFamily: T.serif, fontSize: "1rem", fontWeight: 500, color: T.plum }}>
                              ${(item.qty * PRICE).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart footer */}
              {cart.length > 0 && (
                <div
                  style={{
                    padding: "20px 24px 28px",
                    borderTop: `1px solid ${T.border}`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                    <span style={{ fontSize: "0.88rem", color: T.mutedFg }}>Subtotal</span>
                    <span style={{ fontFamily: T.serif, fontSize: "1.1rem", fontWeight: 500, color: T.fg }}>
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <button
                    disabled
                    style={{
                      width: "100%",
                      padding: "15px 24px",
                      borderRadius: 60,
                      background: T.plum,
                      color: T.bg,
                      border: "none",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      cursor: "not-allowed",
                      opacity: 0.55,
                    }}
                  >
                    Checkout — Launching Soon
                  </button>
                  <p style={{ fontSize: "0.72rem", color: T.mutedFg, textAlign: "center", marginTop: 10 }}>
                    Payment integration coming at launch. Your selections are saved.
                  </p>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════════════
          PRODUCT DETAIL MODAL
      ════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {detailColor && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDetail}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 70,
                background: "rgba(42,33,24,0.5)",
                backdropFilter: "blur(6px)",
              }}
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              style={{
                position: "fixed",
                inset: "5%",
                zIndex: 71,
                background: T.bg,
                borderRadius: 20,
                maxWidth: 780,
                maxHeight: "90vh",
                margin: "auto",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Modal header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "18px 24px",
                  borderBottom: `1px solid ${T.border}`,
                }}
              >
                <span style={{ fontFamily: T.serif, fontSize: "1.1rem", color: T.fg }}>Product Details</span>
                <button onClick={closeDetail} style={{ background: "none", border: "none", cursor: "pointer", color: T.mutedFg }}>
                  <X size={20} />
                </button>
              </div>

              {/* Modal content */}
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexWrap: "wrap" }}>
                {/* Image half */}
                <div style={{ flex: "1 1 280px", minWidth: 200 }}>
                  <div style={{ height: "100%", minHeight: 300, background: detailColor.hex, position: "relative" }}>
                    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.1 }}>
                      {[20, 40, 60, 80].map(x => (
                        <line key={x} x1={`${x}%`} y1="0" x2={`${x - 10}%`} y2="100%"
                          stroke={detailColor.textLight ? "#fff" : "#000"} strokeWidth="0.5" />
                      ))}
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{
                        fontFamily: T.serif,
                        fontSize: "5rem",
                        fontWeight: 300,
                        letterSpacing: "0.2em",
                        color: detailColor.textLight ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.18)",
                      }}>A</span>
                    </div>
                  </div>
                </div>

                {/* Info half */}
                <div style={{ flex: "1 1 280px", padding: "32px 28px", minWidth: 200 }}>
                  <p style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: T.mutedFg, marginBottom: 8 }}>
                    AFAFF Everyday Modal
                  </p>
                  <h2 style={{ fontFamily: T.serif, fontSize: "2rem", fontWeight: 400, color: T.fg, marginBottom: 4, lineHeight: 1.2 }}>
                    {detailColor.name}
                  </h2>
                  <p style={{ fontFamily: T.serif, fontSize: "1.5rem", fontWeight: 400, color: T.plum, marginBottom: 20 }}>
                    {PRICE_DISPLAY}
                  </p>

                  {/* Specs */}
                  <div style={{ marginBottom: 20, display: "flex", flexDirection: "column", gap: 6 }}>
                    {[
                      ["Material", "Premium Modal"],
                      ["Size",     "70×180 cm"],
                      ["Weight",   "160–180 GSM"],
                      ["Style",    "Solid Color"],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", gap: 12, fontSize: "0.84rem" }}>
                        <span style={{ color: T.mutedFg, minWidth: 72 }}>{k}</span>
                        <span style={{ color: T.fg, fontWeight: 500 }}>{v}</span>
                      </div>
                    ))}
                  </div>

                  {/* Color swatch */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: detailColor.hex, border: `2px solid ${T.plum}` }} />
                    <span style={{ fontSize: "0.85rem", color: T.fg, fontWeight: 500 }}>{detailColor.name}</span>
                  </div>

                  {/* Quantity */}
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 500, color: T.mutedFg, letterSpacing: "0.08em", textTransform: "uppercase" }}>Qty</span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        border: `1px solid ${T.border}`,
                        borderRadius: 40,
                        padding: "6px 16px",
                      }}
                    >
                      <button
                        onClick={() => setDetailQty(q => Math.max(1, q - 1))}
                        style={{ background: "none", border: "none", cursor: "pointer", color: T.mutedFg, padding: 0, display: "flex" }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ fontWeight: 600, minWidth: 20, textAlign: "center" }}>{detailQty}</span>
                      <button
                        onClick={() => setDetailQty(q => q + 1)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: T.fg, padding: 0, display: "flex" }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Add to cart */}
                  <button
                    onClick={() => { addToCart(detailColor.name, detailColor.hex, detailQty); closeDetail(); }}
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: 60,
                      background: T.plum,
                      color: T.bg,
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 10,
                    }}
                  >
                    Add to Bag
                  </button>

                  {/* Checkout state */}
                  <p style={{ fontSize: "0.75rem", color: T.mutedFg, textAlign: "center" }}>
                    Secure checkout launching soon — join the waitlist below.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          padding: "96px 24px 80px",
          maxWidth: 1200,
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        <div style={{ width: "100%", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 48 }}>
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ flex: "1 1 420px", minWidth: 0 }}
          >
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: T.taupe,
                marginBottom: 20,
              }}
            >
              New York · Modest Fashion
            </p>

            <h1
              style={{
                fontFamily: T.serif,
                fontSize: "clamp(3rem, 7vw, 5.5rem)",
                fontWeight: 300,
                lineHeight: 1.08,
                color: T.fg,
                marginBottom: 28,
                letterSpacing: "-0.01em",
              }}
            >
              Plain Premium
              <br />
              <em style={{ fontStyle: "italic", color: T.plum }}>Modal Hijabs.</em>
            </h1>

            <p
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.7,
                color: T.mutedFg,
                marginBottom: 14,
                maxWidth: 480,
              }}
            >
              Soft. Breathable. Effortless.
            </p>
            <p
              style={{
                fontSize: "0.92rem",
                lineHeight: 1.75,
                color: T.mutedFg,
                marginBottom: 40,
                maxWidth: 460,
              }}
            >
              A refined everyday hijab made with premium modal, designed for softness,
              comfort, and an elegant drape that lasts from morning to night.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <a
                href="#shop"
                style={{
                  padding: "15px 32px",
                  borderRadius: 60,
                  background: T.plum,
                  color: T.bg,
                  textDecoration: "none",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                Shop Collection
              </a>
              <a
                href="#colors"
                style={{
                  padding: "15px 32px",
                  borderRadius: 60,
                  background: "transparent",
                  color: T.plum,
                  textDecoration: "none",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  border: `1px solid ${T.plum}`,
                  transition: "background 0.2s, color 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = T.plum; e.currentTarget.style.color = T.bg; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.plum; }}
              >
                View Colors
              </a>
            </div>
          </motion.div>

          {/* Right: color showcase */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ flex: "1 1 340px", display: "flex", flexDirection: "column", gap: 16 }}
          >
            {/* Editorial color block */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 6,
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              {COLORS.slice(0, 10).map(c => (
                <div
                  key={c.name}
                  title={c.name}
                  style={{
                    background: c.hex,
                    aspectRatio: "1/2.8",
                    borderRadius: 4,
                    transition: "transform 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scaleY(1.06)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scaleY(1)")}
                  onClick={() => { document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}
                />
              ))}
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: 16 }}>
              {[
                { n: "10", label: "Launch Colors" },
                { n: "160–180", label: "GSM Premium" },
                { n: "70×180", label: "cm Everyday" },
              ].map(({ n, label }) => (
                <div
                  key={label}
                  style={{
                    flex: 1,
                    padding: "14px 12px",
                    background: T.cream,
                    borderRadius: 12,
                    textAlign: "center",
                    border: `1px solid ${T.border}`,
                  }}
                >
                  <p style={{ fontFamily: T.serif, fontSize: "1.2rem", fontWeight: 400, color: T.plum, lineHeight: 1 }}>{n}</p>
                  <p style={{ fontSize: "0.68rem", color: T.mutedFg, marginTop: 4, lineHeight: 1.3 }}>{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            color: T.mutedFg,
            fontSize: "0.68rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          <span>Scroll</span>
          <ChevronDown size={14} />
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          TRUST STRIP
      ════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          borderTop: `1px solid ${T.border}`,
          borderBottom: `1px solid ${T.border}`,
          padding: "14px 0",
          overflow: "hidden",
          background: T.cream,
        }}
      >
        <div style={{ display: "flex", animation: "trustScroll 30s linear infinite", whiteSpace: "nowrap" }}>
          {Array(3).fill([
            "✦ Premium Modal Fabric",
            "✦ 10 Refined Colors",
            "✦ 70×180 cm Everyday Size",
            "✦ 160–180 GSM Weight",
            "✦ Soft. Breathable. Elegant.",
            "✦ New York–Based Brand",
            "✦ Clean Stitching",
            "✦ Not See-Through",
          ]).flat().map((item, i) => (
            <span
              key={i}
              style={{
                padding: "0 28px",
                fontSize: "0.72rem",
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: T.taupe,
                flexShrink: 0,
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          SHOP SECTION
      ════════════════════════════════════════════════════════════════ */}
      <section id="shop" style={{ padding: "88px 24px", maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 52, display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 20 }}>
          <div>
            <p style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: T.taupe, marginBottom: 12 }}>
              Launch Collection
            </p>
            <h2 style={{ fontFamily: T.serif, fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, color: T.fg, lineHeight: 1.15 }}>
              AFAFF Everyday
              <br />
              <em style={{ fontStyle: "italic", color: T.plum }}>Modal Collection</em>
            </h2>
          </div>
          <div>
            <p style={{ fontSize: "0.82rem", color: T.mutedFg, lineHeight: 1.6 }}>
              One silhouette. Ten colors.
              <br />Every shade chosen for its elegance.
            </p>
          </div>
        </div>

        {/* Product grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "28px 20px",
          }}
          className="product-grid"
        >
          {COLORS.map((color, i) => (
            <motion.article
              key={color.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: (i % 4) * 0.08 }}
              style={{ display: "flex", flexDirection: "column" }}
            >
              {/* Product image */}
              <div
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  marginBottom: 14,
                  cursor: "pointer",
                  transition: "transform 0.3s",
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = "translateY(-3px)")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}
                onClick={() => openDetail(color)}
              >
                <ProductImage color={color} />
              </div>

              {/* Info */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  {/* Color swatch */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        background: color.hex,
                        border: `1px solid ${T.border}`,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontWeight: 500, fontSize: "0.88rem", color: T.fg }}>{color.name}</span>
                  </div>
                  <span style={{ fontFamily: T.serif, fontSize: "1rem", color: T.plum, fontWeight: 400 }}>
                    {PRICE_DISPLAY}
                  </span>
                </div>

                <p style={{ fontSize: "0.72rem", color: T.mutedFg, marginBottom: 12, lineHeight: 1.5 }}>
                  Premium Modal · 70×180 cm · 160–180 GSM
                </p>

                {/* Buttons */}
                <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                  <button
                    onClick={() => addToCart(color.name, color.hex)}
                    style={{
                      flex: 1,
                      padding: "10px 10px",
                      borderRadius: 60,
                      background: addedFlash === color.name ? T.plum : "transparent",
                      color: addedFlash === color.name ? T.bg : T.plum,
                      border: `1px solid ${T.plum}`,
                      cursor: "pointer",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      transition: "background 0.25s, color 0.25s",
                    }}
                  >
                    {addedFlash === color.name ? "Added ✓" : "Quick Add"}
                  </button>
                  <button
                    onClick={() => openDetail(color)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 60,
                      background: "transparent",
                      color: T.mutedFg,
                      border: `1px solid ${T.border}`,
                      cursor: "pointer",
                      fontSize: "0.72rem",
                      fontWeight: 500,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      transition: "border-color 0.2s, color 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = T.plum; e.currentTarget.style.color = T.plum; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.mutedFg; }}
                  >
                    View
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          COLORS SECTION
      ════════════════════════════════════════════════════════════════ */}
      <section
        id="colors"
        style={{
          padding: "88px 24px",
          background: T.cream,
          borderTop: `1px solid ${T.border}`,
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: T.taupe, marginBottom: 12 }}>
              The Palette
            </p>
            <h2 style={{ fontFamily: T.serif, fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, color: T.fg, lineHeight: 1.15 }}>
              Ten colors. One standard.
              <br />
              <em style={{ fontStyle: "italic", color: T.plum }}>Pure premium.</em>
            </h2>
          </div>

          {/* Featured preview + swatches */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 40, alignItems: "flex-start" }}>
            {/* Featured color card */}
            <div style={{ flex: "1 1 300px", minWidth: 240 }}>
              <motion.div
                key={featuredIdx}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                style={{
                  background: COLORS[featuredIdx].hex,
                  borderRadius: 16,
                  aspectRatio: "3/4",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  padding: 28,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.1 }}>
                  {[20, 40, 60, 80].map(x => (
                    <line key={x} x1={`${x}%`} y1="0" x2={`${x - 8}%`} y2="100%"
                      stroke={COLORS[featuredIdx].textLight ? "#fff" : "#000"} strokeWidth="0.5" />
                  ))}
                </svg>
                <div style={{ position: "absolute", top: "35%", left: "50%", transform: "translate(-50%,-50%)" }}>
                  <span style={{
                    fontFamily: T.serif,
                    fontSize: "6rem",
                    fontWeight: 300,
                    letterSpacing: "0.15em",
                    color: COLORS[featuredIdx].textLight ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.12)",
                  }}>A</span>
                </div>
                <div style={{ position: "relative", textAlign: "center" }}>
                  <p style={{
                    fontFamily: T.serif,
                    fontSize: "1.4rem",
                    fontWeight: 300,
                    color: COLORS[featuredIdx].textLight ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.7)",
                    letterSpacing: "0.05em",
                    marginBottom: 4,
                  }}>
                    {COLORS[featuredIdx].name}
                  </p>
                  <p style={{ fontSize: "0.68rem", color: COLORS[featuredIdx].textLight ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    Premium Modal
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Color swatches grid */}
            <div style={{ flex: "2 1 360px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                  gap: 14,
                }}
              >
                {COLORS.map((c, i) => (
                  <button
                    key={c.name}
                    onClick={() => setFeaturedIdx(i)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      borderRadius: 10,
                      border: `1.5px solid ${featuredIdx === i ? T.plum : T.border}`,
                      background: featuredIdx === i ? T.bg : "transparent",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      textAlign: "left",
                    }}
                    onMouseEnter={e => { if (featuredIdx !== i) e.currentTarget.style.borderColor = T.taupe; }}
                    onMouseLeave={e => { if (featuredIdx !== i) e.currentTarget.style.borderColor = T.border; }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: c.hex,
                        border: `1px solid rgba(0,0,0,0.08)`,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: featuredIdx === i ? 600 : 400,
                        color: featuredIdx === i ? T.plum : T.fg,
                        lineHeight: 1.3,
                      }}
                    >
                      {c.name}
                    </span>
                  </button>
                ))}
              </div>

              <p style={{ marginTop: 24, fontSize: "0.82rem", color: T.mutedFg, lineHeight: 1.65 }}>
                Each color is hand-selected for its depth, versatility, and the way it complements a wide range of skin tones. No fading, no seasonal trends — just enduring elegance.
              </p>

              <button
                onClick={() => openDetail(COLORS[featuredIdx])}
                style={{
                  marginTop: 24,
                  padding: "13px 30px",
                  borderRadius: 60,
                  background: T.plum,
                  color: T.bg,
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Shop {COLORS[featuredIdx].name}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          DRAPE SECTION
      ════════════════════════════════════════════════════════════════ */}
      <section id="drape" style={{ padding: "96px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 48, alignItems: "flex-start" }}>
          {/* Left: copy */}
          <div style={{ flex: "1 1 340px", paddingTop: 24 }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: T.taupe, marginBottom: 16 }}>
              The Drape
            </p>
            <h2 style={{ fontFamily: T.serif, fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, color: T.fg, lineHeight: 1.2, marginBottom: 24 }}>
              Designed for
              <br />
              <em style={{ fontStyle: "italic", color: T.plum }}>the way it falls.</em>
            </h2>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: T.mutedFg, marginBottom: 20, maxWidth: 400 }}>
              AFAFF modal is selected for its soft hand feel, breathable comfort, and effortless drape. Light enough for everyday wear, structured enough to look polished.
            </p>
            <p style={{ fontSize: "0.88rem", lineHeight: 1.75, color: T.mutedFg, maxWidth: 380 }}>
              The 70×180 cm dimensions give you full coverage and enough length to layer, wrap, or pin exactly how you like — without excess fabric that fights back.
            </p>

            <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                "Soft hand feel — like cashmere, lighter",
                "Natural fold memory — drapes clean, stays put",
                "Breathable open weave — cool in all weather",
              ].map(text => (
                <div key={text} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ color: T.plum, fontSize: "0.7rem", marginTop: 4 }}>◆</span>
                  <span style={{ fontSize: "0.85rem", color: T.fg, lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: interactive drape preview */}
          <div style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
            {/* Preview label */}
            <div style={{ textAlign: "center", width: "100%" }}>
              <motion.p
                key={drapeIdx}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: T.taupe,
                  marginBottom: 4,
                }}
              >
                Previewing: {COLORS[drapeIdx].name}
              </motion.p>
              <p style={{ fontSize: "0.68rem", color: T.mutedFg, letterSpacing: "0.08em" }}>
                Premium Modal · 70×180 cm · 160–180 GSM
              </p>
            </div>

            {/* The Drape Illustration */}
            <motion.div
              key={`drape-${drapeIdx}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
              style={{
                width: "100%",
                maxWidth: 300,
                filter: "drop-shadow(0 12px 28px rgba(42,33,24,0.12))",
              }}
            >
              <HijabDrape
                colorHex={COLORS[drapeIdx].hex}
                lightHex={COLORS[drapeIdx].light}
                darkHex={COLORS[drapeIdx].dark}
              />
            </motion.div>

            {/* Color selector */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, maxWidth: 340 }}>
              {COLORS.map((c, i) => (
                <button
                  key={c.name}
                  title={c.name}
                  onClick={() => setDrapeIdx(i)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: c.hex,
                    border: `2.5px solid ${drapeIdx === i ? T.plum : "transparent"}`,
                    outline: drapeIdx === i ? `1.5px solid ${T.plum}` : "none",
                    outlineOffset: 2,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    padding: 0,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                  }}
                />
              ))}
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 6,
                maxWidth: 340,
              }}
            >
              {COLORS.map((c, i) => (
                <span
                  key={c.name}
                  style={{
                    fontSize: "0.62rem",
                    letterSpacing: "0.08em",
                    color: drapeIdx === i ? T.plum : T.mutedFg,
                    fontWeight: drapeIdx === i ? 600 : 400,
                    cursor: "pointer",
                    textAlign: "center",
                    minWidth: 50,
                    transition: "color 0.2s",
                  }}
                  onClick={() => setDrapeIdx(i)}
                >
                  {c.name}
                </span>
              ))}
            </div>

            <button
              onClick={() => openDetail(COLORS[drapeIdx])}
              style={{
                padding: "12px 28px",
                borderRadius: 60,
                background: "transparent",
                color: T.plum,
                border: `1px solid ${T.plum}`,
                cursor: "pointer",
                fontSize: "0.78rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = T.plum; e.currentTarget.style.color = T.bg; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.plum; }}
            >
              Shop This Color
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          QUALITY SECTION
      ════════════════════════════════════════════════════════════════ */}
      <section
        id="quality"
        style={{
          padding: "88px 24px",
          background: T.plum,
          borderTop: `1px solid rgba(255,255,255,0.06)`,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: 56 }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(251,248,243,0.5)", marginBottom: 12 }}>
              The Standard
            </p>
            <h2 style={{ fontFamily: T.serif, fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, color: T.bg, lineHeight: 1.15, maxWidth: 540 }}>
              Built to a standard you will feel every time you wear it.
            </h2>
          </div>

          {/* Quality cards grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 2,
            }}
          >
            {QUALITY.map(({ title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.55, delay: (i % 3) * 0.1 }}
                style={{
                  padding: "32px 28px",
                  borderRight: i % 3 !== 2 ? "1px solid rgba(251,248,243,0.08)" : "none",
                  borderBottom: i < QUALITY.length - (QUALITY.length % 3 || 3) ? "1px solid rgba(251,248,243,0.08)" : "none",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "rgba(251,248,243,0.4)",
                    marginBottom: 20,
                  }}
                />
                <h3
                  style={{
                    fontFamily: T.serif,
                    fontSize: "1.2rem",
                    fontWeight: 400,
                    color: T.bg,
                    marginBottom: 10,
                    lineHeight: 1.3,
                  }}
                >
                  {title}
                </h3>
                <p style={{ fontSize: "0.84rem", lineHeight: 1.7, color: "rgba(251,248,243,0.65)" }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          PACKAGING SECTION
      ════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          padding: "88px 24px",
          background: T.bg,
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 48, alignItems: "flex-start" }}>
            {/* Left: copy */}
            <div style={{ flex: "1 1 340px" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: T.taupe, marginBottom: 12 }}>
                The Unboxing
              </p>
              <h2 style={{ fontFamily: T.serif, fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, color: T.fg, lineHeight: 1.2, marginBottom: 20 }}>
                Packaged to feel
                <br />
                <em style={{ fontStyle: "italic", color: T.plum }}>like a gift to yourself.</em>
              </h2>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.75, color: T.mutedFg, maxWidth: 400 }}>
                Every AFAFF order arrives as an experience, not just a delivery. Because the moment you receive it matters as much as the moment you wear it.
              </p>
            </div>

            {/* Right: packaging steps */}
            <div style={{ flex: "2 1 400px", display: "flex", flexDirection: "column", gap: 1 }}>
              {PACKAGING.map(({ step, label, desc }, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  style={{
                    display: "flex",
                    gap: 24,
                    padding: "28px 0",
                    borderBottom: i < PACKAGING.length - 1 ? `1px solid ${T.border}` : "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: T.serif,
                      fontSize: "0.75rem",
                      fontWeight: 400,
                      color: T.taupe,
                      letterSpacing: "0.08em",
                      paddingTop: 3,
                      flexShrink: 0,
                    }}
                  >
                    {step}
                  </span>
                  <div>
                    <h3
                      style={{
                        fontFamily: T.serif,
                        fontSize: "1.15rem",
                        fontWeight: 400,
                        color: T.fg,
                        marginBottom: 6,
                      }}
                    >
                      {label}
                    </h3>
                    <p style={{ fontSize: "0.85rem", lineHeight: 1.65, color: T.mutedFg }}>{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          ABOUT SECTION
      ════════════════════════════════════════════════════════════════ */}
      <section
        id="about"
        style={{
          padding: "88px 24px",
          background: T.cream,
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 56, alignItems: "center" }}>
          {/* Left: text */}
          <div style={{ flex: "1 1 400px" }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: T.taupe, marginBottom: 12 }}>
              Our Story
            </p>
            <h2 style={{ fontFamily: T.serif, fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 300, color: T.fg, lineHeight: 1.2, marginBottom: 28 }}>
              A New York–based
              <br />
              <em style={{ fontStyle: "italic", color: T.plum }}>modest fashion brand.</em>
            </h2>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: T.fg, marginBottom: 20, maxWidth: 480 }}>
              AFAFF is a New York-based modest fashion brand created to make premium everyday hijabs feel accessible. Our first launch focuses on plain premium modal hijabs in refined solid colors, made for softness, comfort, and effortless daily styling.
            </p>
            <p style={{ fontSize: "0.92rem", lineHeight: 1.8, color: T.mutedFg, maxWidth: 460 }}>
              We believe modest fashion deserves the same level of quality, thoughtfulness, and design intention as any other category. AFAFF is built for the woman who cares about what she wears — not because she has to, but because she chooses to.
            </p>
          </div>

          {/* Right: editorial block */}
          <div style={{ flex: "1 1 340px" }}>
            <div
              style={{
                background: T.plum,
                borderRadius: 16,
                padding: "48px 40px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Background A */}
              <span
                style={{
                  position: "absolute",
                  top: "-20%",
                  right: "-10%",
                  fontFamily: T.serif,
                  fontSize: "12rem",
                  fontWeight: 300,
                  color: "rgba(251,248,243,0.05)",
                  lineHeight: 1,
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              >
                A
              </span>

              <div style={{ position: "relative" }}>
                <p style={{ fontFamily: T.serif, fontSize: "2.4rem", fontWeight: 300, color: T.bg, lineHeight: 1.2, marginBottom: 24, letterSpacing: "0.08em" }}>
                  AFAFF
                </p>
                <p style={{ fontSize: "0.82rem", color: "rgba(251,248,243,0.7)", lineHeight: 1.7, marginBottom: 28 }}>
                  New York, USA
                  <br />
                  wearafaff.com
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    "Plain. Premium. Modal.",
                    "10 refined launch colors",
                    "Designed for everyday life",
                  ].map(line => (
                    <div key={line} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(251,248,243,0.4)", flexShrink: 0 }} />
                      <span style={{ fontSize: "0.82rem", color: "rgba(251,248,243,0.8)", letterSpacing: "0.04em" }}>{line}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          EMAIL SIGNUP
      ════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          padding: "88px 24px",
          background: T.bg,
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <div
          style={{
            maxWidth: 600,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: T.taupe, marginBottom: 16 }}>
            Join the List
          </p>
          <h2 style={{ fontFamily: T.serif, fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 300, color: T.fg, lineHeight: 1.2, marginBottom: 16 }}>
            Be first to know when
            <br />
            <em style={{ fontStyle: "italic", color: T.plum }}>AFAFF launches.</em>
          </h2>
          <p style={{ fontSize: "0.9rem", color: T.mutedFg, lineHeight: 1.7, marginBottom: 40 }}>
            Early access, launch colors, and a look behind the brand — delivered to your inbox before anyone else.
          </p>

          {emailDone ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                padding: "36px 40px",
                background: T.cream,
                borderRadius: 16,
                border: `1px solid ${T.border}`,
              }}
            >
              <p style={{ fontFamily: T.serif, fontSize: "1.6rem", fontWeight: 300, color: T.plum, marginBottom: 8 }}>
                You're on the list.
              </p>
              <p style={{ fontSize: "0.88rem", color: T.mutedFg, lineHeight: 1.6 }}>
                We'll let you know when AFAFF launches.
                <br />
                Thank you for being here.
              </p>
            </motion.div>
          ) : (
            <form
              onSubmit={e => { e.preventDefault(); if (email) setEmailDone(true); }}
              style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}
            >
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  flex: "1 1 240px",
                  padding: "14px 20px",
                  borderRadius: 60,
                  border: `1px solid ${T.border}`,
                  background: T.cream,
                  color: T.fg,
                  fontSize: "0.9rem",
                  outline: "none",
                  fontFamily: T.sans,
                  maxWidth: 360,
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "14px 28px",
                  borderRadius: 60,
                  background: T.plum,
                  color: T.bg,
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  flexShrink: 0,
                }}
              >
                Notify Me
              </button>
            </form>
          )}

          <p style={{ fontSize: "0.7rem", color: T.mutedFg, marginTop: 16 }}>
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════════ */}
      <footer
        id="contact"
        style={{
          background: T.plum,
          padding: "64px 24px 40px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 40, marginBottom: 56 }}>
            {/* Brand */}
            <div style={{ flex: "2 1 280px" }}>
              <p style={{ fontFamily: T.serif, fontSize: "2rem", fontWeight: 300, color: T.bg, letterSpacing: "0.1em", marginBottom: 10 }}>
                AFAFF
              </p>
              <p style={{ fontSize: "0.78rem", color: "rgba(251,248,243,0.5)", marginBottom: 4 }}>wearafaff.com</p>
              <p style={{ fontSize: "0.78rem", color: "rgba(251,248,243,0.5)", marginBottom: 20 }}>New York, USA</p>
              <p style={{ fontSize: "0.85rem", color: "rgba(251,248,243,0.65)", lineHeight: 1.7, maxWidth: 320 }}>
                Plain premium modal hijabs in ten refined colors. Designed for softness, comfort, and effortless everyday wear.
              </p>

              {/* Social links */}
              <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
                <a
                  href="#"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "rgba(251,248,243,0.6)",
                    textDecoration: "none",
                    fontSize: "0.78rem",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = T.bg)}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(251,248,243,0.6)")}
                >
                  <Instagram size={14} />
                  Instagram
                </a>
                <a
                  href="mailto:hello@wearafaff.com"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "rgba(251,248,243,0.6)",
                    textDecoration: "none",
                    fontSize: "0.78rem",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = T.bg)}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(251,248,243,0.6)")}
                >
                  <Mail size={14} />
                  hello@wearafaff.com
                </a>
              </div>
            </div>

            {/* Shop links */}
            <div style={{ flex: "1 1 140px" }}>
              <p style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(251,248,243,0.4)", marginBottom: 16 }}>
                Shop
              </p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {["Collection", "Colors", "Drape", "Quality"].map(item => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      style={{
                        fontSize: "0.85rem",
                        color: "rgba(251,248,243,0.65)",
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = T.bg)}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(251,248,243,0.65)")}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Info links */}
            <div style={{ flex: "1 1 140px" }}>
              <p style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(251,248,243,0.4)", marginBottom: 16 }}>
                Info
              </p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {["About", "Contact", "Shipping & Returns", "Privacy Policy", "Terms"].map(item => (
                  <li key={item}>
                    <a
                      href="#"
                      style={{
                        fontSize: "0.85rem",
                        color: "rgba(251,248,243,0.65)",
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = T.bg)}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(251,248,243,0.65)")}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              paddingTop: 24,
              borderTop: "1px solid rgba(251,248,243,0.1)",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <p style={{ fontSize: "0.72rem", color: "rgba(251,248,243,0.35)" }}>
              © 2025 AFAFF. New York, NY. All rights reserved.
            </p>
            <p style={{ fontSize: "0.72rem", color: "rgba(251,248,243,0.35)" }}>
              wearafaff.com
            </p>
          </div>
        </div>
      </footer>

      {/* ════════════════════════════════════════════════════════════════
          GLOBAL STYLES
      ════════════════════════════════════════════════════════════════ */}
      <style>{`
        @keyframes trustScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }

        /* Desktop nav visible */
        @media (min-width: 768px) {
          .md-nav {
            display: flex !important;
          }
          .hamburger {
            display: none !important;
          }
        }

        /* Shop grid: 2 cols on mobile, 3 on tablet, 4 on desktop */
        @media (max-width: 540px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 14px 10px !important;
          }
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Input focus */
        input:focus {
          outline: 1px solid #3D2E3A;
          border-color: #3D2E3A !important;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(61,46,58,0.2); border-radius: 4px; }

        /* Selection */
        ::selection { background: rgba(61,46,58,0.15); }
      `}</style>
    </div>
  );
}
