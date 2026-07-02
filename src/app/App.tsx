import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowRight, Star, ChevronDown, Sparkles, Heart, Shield, ShoppingBag, Plus, Minus, Trash2, MapPin, Truck } from "lucide-react";

// ── TYPES ─────────────────────────────────────────
interface Product {
  id: number;
  name: string;
  tag: string;
  desc: string;
  price: number;
  color: string;
  material: string;
  img: string;
  colors: string[];
}

interface CartItem extends Product {
  qty: number;
  selectedColor: string;
}

// ── DATA ──────────────────────────────────────────
const nav = ["Collection", "About", "Lookbook", "Reviews"];

const products: Product[] = [
  {
    id: 1,
    name: "The Cloud Wrap",
    tag: "Bestseller",
    desc: "Feather-light chiffon that drapes perfectly — zero pins needed. Our #1 seller since day one.",
    price: 42,
    color: "Pearl White",
    material: "Chiffon",
    img: "https://images.unsplash.com/photo-1613611927458-3ddd4b0afdb9?w=600&h=750&fit=crop&auto=format",
    colors: ["Pearl White", "Blush Rose", "Sage Green"],
  },
  {
    id: 2,
    name: "The Silk Press",
    tag: "New Drop",
    desc: "Satin-finish luxury with all-day hold. From the subway to the boardroom.",
    price: 58,
    color: "Midnight Black",
    material: "Satin",
    img: "https://images.unsplash.com/photo-1662806407800-56793fa8e924?w=600&h=750&fit=crop&auto=format",
    colors: ["Midnight Black", "Deep Rose", "Charcoal"],
  },
  {
    id: 3,
    name: "The NYC Drape",
    tag: "NYC Exclusive",
    desc: "Inspired by the streets of Brooklyn. Relaxed, confident, effortlessly cool.",
    price: 48,
    color: "Caramel Brown",
    material: "Cotton Blend",
    img: "https://images.unsplash.com/photo-1613447895817-e617a4093f50?w=600&h=750&fit=crop&auto=format",
    colors: ["Caramel Brown", "Terracotta", "Stone"],
  },
  {
    id: 4,
    name: "The Luxe Modal",
    tag: "Fan Favorite",
    desc: "Butter-soft modal fabric that feels like a second skin. Perfect for all-day comfort.",
    price: 52,
    color: "Deep Rose",
    material: "Modal",
    img: "https://images.unsplash.com/photo-1574297500578-afae55026ff3?w=600&h=750&fit=crop&auto=format",
    colors: ["Deep Rose", "Burgundy", "Blush"],
  },
  {
    id: 5,
    name: "The Winter Wrap",
    tag: "Season Pick",
    desc: "Cozy cashmere-touch warmth without the bulk. Made for New York winters.",
    price: 65,
    color: "Ivory Cream",
    material: "Cashmere Blend",
    img: "https://images.unsplash.com/photo-1652473291442-7a2e034a00d1?w=600&h=750&fit=crop&auto=format",
    colors: ["Ivory Cream", "Oat", "Soft Grey"],
  },
  {
    id: 6,
    name: "The Sport Layer",
    tag: "Active",
    desc: "Moisture-wicking, stays put no matter what. From yoga to errands to brunches.",
    price: 38,
    color: "Clean White",
    material: "Performance Fabric",
    img: "https://images.unsplash.com/photo-1612307057748-b44842539a29?w=600&h=750&fit=crop&auto=format",
    colors: ["Clean White", "Navy", "Blush Pink"],
  },
];

const testimonials = [
  {
    name: "Nour Al-Hassan",
    age: 19,
    city: "Brooklyn, NY",
    text: "I wore the Cloud Wrap to my uni orientation and got stopped three times asking where I got it. Afaaf just gets it.",
    stars: 5,
    avatar: "N",
  },
  {
    name: "Mariam Farouk",
    age: 23,
    city: "Dearborn, MI",
    text: "Finally a brand that doesn't make modest fashion look outdated. The quality is insane for the price — and it shipped so fast.",
    stars: 5,
    avatar: "M",
  },
  {
    name: "Sara Idris",
    age: 16,
    city: "Houston, TX",
    text: "My mum and I literally fight over the Silk Press. That's how good it is.",
    stars: 5,
    avatar: "S",
  },
  {
    name: "Lina Chaoui",
    age: 21,
    city: "Chicago, IL",
    text: "Ordered Tuesday, wore it Friday. Fast US shipping and the packaging felt like a gift to myself.",
    stars: 5,
    avatar: "L",
  },
];

const pillars = [
  {
    icon: Sparkles,
    title: "Designed for real life",
    desc: "From the subway rush to rooftop dinners — Afaaf moves with you, not against you.",
  },
  {
    icon: Heart,
    title: "Made with intention",
    desc: "Every stitch, every fabric, every color — curated by Muslim women, for Muslim women.",
  },
  {
    icon: Shield,
    title: "Quality you will feel",
    desc: "30-day wear guarantee. If it doesn't earn a permanent spot in your rotation, we will make it right.",
  },
];

// ── HELPERS ───────────────────────────────────────
const fmt = (n: number) => `$${n.toFixed(2)}`;

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [addedId, setAddedId] = useState<number | null>(null);
  const [selectedColors, setSelectedColors] = useState<Record<number, string>>(
    Object.fromEntries(products.map((p) => [p.id, p.colors[0]]))
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveTestimonial((p) => (p + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const addToCart = (product: Product) => {
    const color = selectedColors[product.id];
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id && i.selectedColor === color);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id && i.selectedColor === color ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1, selectedColor: color }];
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
    setCartOpen(true);
  };

  const removeFromCart = (id: number, color: string) => {
    setCart((prev) => prev.filter((i) => !(i.id === id && i.selectedColor === color)));
  };

  const updateQty = (id: number, color: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.id === id && i.selectedColor === color ? { ...i, qty: i.qty + delta } : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div
      className="min-h-screen bg-background text-foreground overflow-x-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ── NAV ───────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-background/90 backdrop-blur-md border-b border-border" : ""
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="text-2xl tracking-tight" style={{ fontFamily: "'Fraunces', serif", color: "#fce8ec" }}>
            afaaf<span style={{ color: "#e8325a" }}>.</span>
          </a>

          <ul className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
            {nav.map((item) => (
              <li key={item}>
                <a href={`#${item.toLowerCase()}`} className="hover:text-foreground transition-colors duration-200">
                  {item}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href="#collection"
              className="hidden md:inline-flex px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ background: "#e8325a", color: "#fff0f3" }}
            >
              Shop Now
            </a>
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                  style={{ background: "#e8325a", color: "#fff0f3" }}
                >
                  {totalItems}
                </span>
              )}
            </button>
            <button className="md:hidden text-foreground" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-background border-b border-border px-6 py-6 flex flex-col gap-5"
          >
            {nav.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-lg font-medium text-foreground" onClick={() => setMenuOpen(false)}>
                {item}
              </a>
            ))}
            <a
              href="#collection"
              className="px-5 py-3 rounded-full text-sm font-semibold text-center"
              style={{ background: "#e8325a", color: "#fff0f3" }}
              onClick={() => setMenuOpen(false)}
            >
              Shop Now
            </a>
          </motion.div>
        )}
      </header>

      {/* ── CART DRAWER ───────────────────────────── */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setCartOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full z-50 w-full max-w-md flex flex-col border-l border-border"
              style={{ background: "#1a0810" }}
            >
              {/* Cart header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <ShoppingBag size={20} style={{ color: "#e8325a" }} />
                  <h2 className="text-lg font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>
                    Your Bag
                  </h2>
                  {totalItems > 0 && (
                    <span className="text-xs text-muted-foreground">({totalItems} {totalItems === 1 ? "item" : "items"})</span>
                  )}
                </div>
                <button onClick={() => setCartOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* US shipping badge */}
              <div className="mx-6 mt-4 flex items-center gap-2 px-4 py-3 rounded-xl border border-border text-xs text-muted-foreground"
                style={{ background: "rgba(232,50,90,0.08)" }}>
                <Truck size={14} style={{ color: "#e8325a" }} />
                <span>Free shipping on orders over <strong className="text-foreground">$75</strong> · Ships across the US</span>
              </div>

              {/* Cart items */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                    <ShoppingBag size={48} className="text-muted-foreground opacity-30" />
                    <p className="text-muted-foreground text-sm">Your bag is empty.</p>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="px-6 py-3 rounded-full text-sm font-semibold"
                      style={{ background: "#e8325a", color: "#fff0f3" }}
                    >
                      Start shopping
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={`${item.id}-${item.selectedColor}`} className="flex gap-4 p-4 rounded-2xl border border-border"
                      style={{ background: "rgba(42,15,24,0.6)" }}>
                      <div className="w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-foreground">{item.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{item.selectedColor} · {item.material}</p>
                          </div>
                          <button onClick={() => removeFromCart(item.id, item.selectedColor)}
                            className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2 border border-border rounded-full px-1 py-1">
                            <button
                              onClick={() => updateQty(item.id, item.selectedColor, -1)}
                              className="w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-sm font-semibold w-4 text-center">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.id, item.selectedColor, 1)}
                              className="w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="text-sm font-bold" style={{ color: "#f2a0b2", fontFamily: "'Fraunces', serif" }}>
                            {fmt(item.price * item.qty)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart footer */}
              {cart.length > 0 && (
                <div className="px-6 py-6 border-t border-border space-y-4">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="text-foreground font-semibold">{fmt(subtotal)}</span>
                  </div>
                  {subtotal < 75 && (
                    <p className="text-xs text-muted-foreground text-center">
                      Add <strong className="text-foreground">{fmt(75 - subtotal)}</strong> more for free shipping
                    </p>
                  )}
                  <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((subtotal / 75) * 100, 100)}%`, background: "#e8325a" }}
                    />
                  </div>
                  <button
                    disabled
                    className="w-full py-4 rounded-full font-semibold text-sm opacity-60 cursor-not-allowed"
                    style={{ background: "#e8325a", color: "#fff0f3" }}
                  >
                    Checkout — Coming Soon
                  </button>
                  <p className="text-xs text-muted-foreground text-center">
                    Payment integration coming soon. Save your items!
                  </p>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── HERO ──────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1552874869-5c39ec9288dc?w=1600&h=1000&fit=crop&auto=format"
            alt="Elegant woman in hijab"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(115deg, #1a0810 45%, rgba(26,8,16,0.55) 100%)" }} />
        </div>

        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #e8325a 0%, transparent 70%)" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-2 mb-6">
              <MapPin size={14} style={{ color: "#e8325a" }} />
              <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "#e8325a" }}>
                Born in New York · Ships Nationwide
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl leading-[1.05] mb-6 text-foreground"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
              Wrap yourself<br />
              <span style={{ color: "#e8325a" }}>in your story.</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-10 max-w-md leading-relaxed">
              New York-born hijab for women who refuse to choose between style and faith. Bold drops, soft fabrics, zero compromise — delivered across America.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#collection"
                className="group inline-flex items-center gap-2 px-7 py-4 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 active:scale-95"
                style={{ background: "#e8325a", color: "#fff0f3" }}>
                Explore the collection
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#about"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full font-semibold text-sm border border-border hover:border-foreground/40 transition-colors duration-200">
                Our story
              </a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }} className="hidden md:flex flex-col gap-4 items-end">
            {[
              { val: "10k+", label: "Women wearing Afaaf", color: "#f2a0b2" },
              { val: "4.9★", label: "From 600+ verified reviews", color: "#e8325a" },
              { val: "Free", label: "Returns within 30 days", color: "#fce8ec" },
            ].map(({ val, label, color }) => (
              <div key={label} className="rounded-2xl p-5 backdrop-blur-sm border border-border"
                style={{ background: "rgba(42,15,24,0.85)" }}>
                <p className="text-3xl font-bold mb-1" style={{ fontFamily: "'Fraunces', serif", color }}>{val}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground text-xs">
          <span>Scroll</span>
          <ChevronDown size={16} className="animate-bounce" />
        </div>
      </section>

      {/* ── TRUST STRIP ───────────────────────────── */}
      <div className="border-y border-border py-5 overflow-hidden" style={{ background: "#2a0f1880" }}>
        <div className="flex items-center gap-12 whitespace-nowrap px-6" style={{ animation: "scroll 25s linear infinite" }}>
          {[
            "✦ Born in New York City",
            "✦ Free shipping over $75",
            "✦ Ships all 50 US states",
            "✦ 30-day love guarantee",
            "✦ New drops every month",
            "✦ Ethically made fabrics",
            "✦ Born in New York City",
            "✦ Free shipping over $75",
            "✦ Ships all 50 US states",
            "✦ 30-day love guarantee",
            "✦ New drops every month",
            "✦ Ethically made fabrics",
          ].map((item, i) => (
            <span key={i} className="text-sm font-medium text-muted-foreground flex-shrink-0">{item}</span>
          ))}
        </div>
      </div>

      {/* ── COLLECTION ────────────────────────────── */}
      <section id="collection" className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ color: "#f2a0b2" }}>
              Current drop
            </p>
            <h2 className="text-4xl md:text-5xl text-foreground leading-tight"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
              Styles made for<br />
              <span style={{ color: "#e8325a" }}>every chapter.</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-border text-xs text-muted-foreground"
            style={{ background: "rgba(232,50,90,0.08)" }}>
            <Truck size={12} style={{ color: "#e8325a" }} />
            <span>Shipping across the US · Orders ship in 2–4 days</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <motion.div key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group flex flex-col"
            >
              {/* Image */}
              <div className="relative rounded-2xl overflow-hidden mb-4 aspect-[4/5] bg-muted">
                <img src={product.img} alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: "#e8325a", color: "#fff0f3" }}>
                  {product.tag}
                </span>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-xs text-white/60">{product.material}</span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-base font-semibold text-foreground">{product.name}</h3>
                  <span className="text-base font-bold ml-3 flex-shrink-0"
                    style={{ color: "#f2a0b2", fontFamily: "'Fraunces', serif" }}>
                    {fmt(product.price)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{product.desc}</p>

                {/* Color selector */}
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">
                    Color: <span className="text-foreground font-medium">{selectedColors[product.id]}</span>
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {product.colors.map((c) => (
                      <button key={c}
                        onClick={() => setSelectedColors((prev) => ({ ...prev, [product.id]: c }))}
                        className="text-xs px-3 py-1 rounded-full border transition-all duration-150"
                        style={{
                          borderColor: selectedColors[product.id] === c ? "#e8325a" : "rgba(242,160,178,0.2)",
                          color: selectedColors[product.id] === c ? "#e8325a" : "#b87a8a",
                          background: selectedColors[product.id] === c ? "rgba(232,50,90,0.1)" : "transparent",
                        }}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add to cart */}
                <button
                  onClick={() => addToCart(product)}
                  className="mt-auto w-full py-3 rounded-full text-sm font-semibold transition-all duration-200 active:scale-95"
                  style={{
                    background: addedId === product.id ? "rgba(232,50,90,0.15)" : "transparent",
                    color: addedId === product.id ? "#e8325a" : "#fce8ec",
                    border: `1px solid ${addedId === product.id ? "#e8325a" : "rgba(242,160,178,0.2)"}`,
                  }}
                >
                  {addedId === product.id ? "Added to bag ✓" : "Add to bag"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── WHY AFAAF ─────────────────────────────── */}
      <section id="about" className="py-24 border-y border-border"
        style={{ background: "linear-gradient(135deg, #2a0f1880 0%, #3d1220 100%)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <p className="text-xs font-bold tracking-[0.25em] uppercase mb-4" style={{ color: "#f2a0b2" }}>
                Our story
              </p>
              <h2 className="text-4xl md:text-5xl text-foreground leading-tight mb-6"
                style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
                Built in New York.<br />
                <span style={{ color: "#e8325a" }}>For every American Muslim woman.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Afaaf started in a Queens apartment with a simple question: why does modest fashion still feel like an afterthought in American style culture?
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We ship to all 50 states because every Muslim woman in America deserves access to hijabs that are designed for her life — not imported from a catalog that doesn't know her city, her commute, or her vibe.
              </p>
            </div>
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-muted">
              <img
                src="https://images.unsplash.com/photo-1536463726684-434ca0eeea33?w=800&h=600&fit=crop&auto=format"
                alt="Woman wearing Afaaf hijab"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-2 text-white text-sm font-medium">
                  <MapPin size={14} style={{ color: "#f2a0b2" }} />
                  <span>New York City, USA</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="p-8 rounded-2xl border border-border hover:border-primary/50 transition-colors duration-300"
                style={{ background: "rgba(42,15,24,0.6)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: "rgba(232,50,90,0.15)" }}>
                  <Icon size={22} style={{ color: "#e8325a" }} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOOKBOOK ──────────────────────────────── */}
      <section id="lookbook" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-4" style={{ color: "#f2a0b2" }}>Lookbook</p>
          <h2 className="text-4xl md:text-5xl text-foreground" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
            Modest does not mean <span style={{ color: "#e8325a" }}>invisible.</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { src: "https://images.unsplash.com/photo-1570771887955-9d20fd91403e?w=400&h=550&fit=crop&auto=format", tall: true },
            { src: "https://images.unsplash.com/photo-1651828855150-ba40f6870a53?w=400&h=400&fit=crop&auto=format", tall: false },
            { src: "https://images.unsplash.com/photo-1613611927458-3ddd4b0afdb9?w=400&h=400&fit=crop&auto=format", tall: false },
            { src: "https://images.unsplash.com/photo-1662806407800-56793fa8e924?w=400&h=550&fit=crop&auto=format", tall: true },
          ].map(({ src, tall }, i) => (
            <div key={i} className={`rounded-2xl overflow-hidden bg-muted ${tall ? "row-span-2" : ""}`}
              style={{ aspectRatio: tall ? "3/4" : "1/1" }}>
              <img src={src} alt={`Afaaf lookbook ${i + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────── */}
      <section id="reviews" className="py-24 border-t border-border" style={{ background: "#2a0f1850" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-[0.25em] uppercase mb-4" style={{ color: "#f2a0b2" }}>
              Real women, real love
            </p>
            <h2 className="text-4xl md:text-5xl text-foreground" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
              They said it better.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map(({ name, age, city, text, stars, avatar }, i) => (
              <motion.div key={name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`p-6 rounded-2xl border transition-all duration-300 ${i === activeTestimonial ? "border-primary/60" : "border-border"}`}
                style={{ background: "rgba(42,15,24,0.7)" }}>
                <div className="flex gap-1 mb-4">
                  {Array(stars).fill(0).map((_, j) => (
                    <Star key={j} size={14} fill="#f2a0b2" color="#f2a0b2" />
                  ))}
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed mb-5 italic">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ background: "#e8325a", color: "#fff0f3" }}>
                    {avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{name}</p>
                    <p className="text-xs text-muted-foreground">{age} · {city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)} className="rounded-full transition-all duration-300"
                style={{
                  width: i === activeTestimonial ? "24px" : "8px",
                  height: "8px",
                  background: i === activeTestimonial ? "#e8325a" : "rgba(232,50,90,0.3)",
                }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── EMAIL CAPTURE ─────────────────────────── */}
      <section className="py-24 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #e8325a 0%, #b01a3a 100%)" }}>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #f2a0b2 0%, transparent 70%)" }} />
        <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
          <p className="text-sm font-bold tracking-[0.2em] uppercase mb-4 text-white/70">Join the community</p>
          <h2 className="text-4xl md:text-5xl text-white leading-tight mb-4"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
            Get 15% off your first order.
          </h2>
          <p className="text-white/80 mb-10 leading-relaxed">
            Join 10,000+ women across the US getting early access to new drops, styling tips, and exclusive discounts.
          </p>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/30">
              <p className="text-2xl mb-2" style={{ fontFamily: "'Fraunces', serif" }}>You are in! ✨</p>
              <p className="text-white/80 text-sm">Check your inbox — your 15% code is on its way.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-5 py-4 rounded-full text-sm outline-none border-none placeholder-white/50"
                style={{ background: "rgba(255,255,255,0.2)", color: "#fff", backdropFilter: "blur(10px)" }}
              />
              <button type="submit"
                className="px-7 py-4 rounded-full text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0"
                style={{ background: "#fff0f3", color: "#e8325a" }}>
                Claim my 15%
              </button>
            </form>
          )}
          <p className="text-xs text-white/50 mt-5">No spam. Unsubscribe anytime. We respect you.</p>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────── */}
      <footer className="border-t border-border py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <p className="text-3xl mb-2" style={{ fontFamily: "'Fraunces', serif", color: "#fce8ec" }}>
                afaaf<span style={{ color: "#e8325a" }}>.</span>
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                <MapPin size={11} /> <span>New York City, USA · Ships nationwide</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Next-gen hijab for modern Muslim women. Built with intention, worn with pride, shipped across America.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mb-4">Shop</p>
              <ul className="space-y-3">
                {["New arrivals", "Bestsellers", "Active wear", "Gift cards"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mb-4">Help</p>
              <ul className="space-y-3">
                {["Sizing guide", "US shipping info", "Returns & exchanges", "Contact us"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">© 2025 Afaaf. New York, NY. All rights reserved.</p>
            <div className="flex gap-6">
              {["Instagram", "TikTok", "Pinterest"].map((s) => (
                <a key={s} href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        ::-webkit-scrollbar { width: 0; height: 0; }
      `}</style>
    </div>
  );
}
