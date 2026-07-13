import { useState, useMemo } from "react";
import {
  LayoutDashboard, Package, Truck, Archive, LogOut, Search, X,
  Edit2, Plus, ChevronDown, AlertTriangle, TrendingUp, ShoppingCart,
  CheckCircle, Clock, RotateCcw, XCircle, Menu, Eye, Printer,
  ChevronRight, RefreshCw, Tag, MapPin, Mail, Phone,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────── */
const A = {
  sidebar:      "#16121F",
  sidebarBrd:   "rgba(255,255,255,0.06)",
  bg:           "#F2F2F7",
  white:        "#FFFFFF",
  border:       "#E4E4EE",
  text:         "#111827",
  muted:        "#6B7280",
  accent:       "#3D2E3A",   // AFAFF plum
  accentLight:  "#EDE8F0",
  success:      "#059669",
  successBg:    "#ECFDF5",
  warning:      "#D97706",
  warningBg:    "#FFFBEB",
  danger:       "#DC2626",
  dangerBg:     "#FEF2F2",
  info:         "#2563EB",
  infoBg:       "#EFF6FF",
  shipped:      "#7C3AED",
  shippedBg:    "#F5F3FF",
  serif:        "'Cormorant Garamond', Georgia, serif",
  sans:         "'DM Sans', system-ui, sans-serif",
};

/* ─────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────── */
type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
type AdminTab    = "dashboard" | "orders" | "delivery" | "inventory";

interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  color: string;
  colorHex: string;
  qty: number;
  total: number;
  status: OrderStatus;
  date: string;
  tracking?: string;
  courier?: string;
  notes?: string;
  estDelivery?: string;
}

interface InventoryItem {
  color: string;
  colorHex: string;
  stock: number;
  reserved: number;
  sold: number;
  reorderPoint: number;
}

/* ─────────────────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────────────────── */
const INITIAL_ORDERS: Order[] = [
  { id:"AFF-0001", customer:"Fatima Al-Hassan",  email:"fatima.ah@gmail.com",    phone:"(718) 555-0142", address:"147 Atlantic Ave, Brooklyn, NY 11201",       color:"Noor Black",      colorHex:"#1C1C1C", qty:2, total:76,  status:"delivered",  date:"2025-10-28", tracking:"1Z999AA10123456784", courier:"UPS",   estDelivery:"2025-11-02" },
  { id:"AFF-0002", customer:"Mariam Farouk",     email:"m.farouk@outlook.com",   phone:"(313) 555-0188", address:"892 Michigan Ave, Dearborn, MI 48124",        color:"Dusty Rose",      colorHex:"#C29088", qty:1, total:38,  status:"shipped",    date:"2025-11-01", tracking:"9400111899223897079010", courier:"USPS", estDelivery:"2025-11-08" },
  { id:"AFF-0003", customer:"Sara Idris",        email:"sara.idris@yahoo.com",   phone:"(713) 555-0233", address:"3204 Westheimer Rd, Houston, TX 77027",       color:"Deep Plum",       colorHex:"#3D2E3A", qty:3, total:114, status:"processing", date:"2025-11-03" },
  { id:"AFF-0004", customer:"Lina Chaoui",       email:"linachaoui@gmail.com",   phone:"(312) 555-0076", address:"1501 N Michigan Ave, Chicago, IL 60610",      color:"Mocha Taupe",     colorHex:"#9A7D6A", qty:1, total:38,  status:"pending",    date:"2025-11-04" },
  { id:"AFF-0005", customer:"Nour Abdullah",     email:"nour.ab@gmail.com",      phone:"(313) 555-0291", address:"425 Queen St, Detroit, MI 48226",             color:"Olive Sage",      colorHex:"#7A8C66", qty:2, total:76,  status:"pending",    date:"2025-11-04" },
  { id:"AFF-0006", customer:"Hana Khalil",       email:"hanakhalil@me.com",      phone:"(203) 555-0184", address:"89 Elm St, New Haven, CT 06510",              color:"Soft Ivory",      colorHex:"#EDE4CC", qty:1, total:38,  status:"shipped",    date:"2025-10-31", tracking:"784215791007",        courier:"FedEx", estDelivery:"2025-11-06" },
  { id:"AFF-0007", customer:"Aisha Mohammed",    email:"aisha.m@gmail.com",      phone:"(212) 555-0139", address:"2201 Broadway, New York, NY 10024",           color:"Cream",           colorHex:"#E5D9BE", qty:4, total:152, status:"delivered",  date:"2025-10-25", tracking:"1Z999AA10987654321", courier:"UPS" },
  { id:"AFF-0008", customer:"Zainab Hassan",     email:"zainab.h@hotmail.com",   phone:"(312) 555-0257", address:"567 Halsted St, Chicago, IL 60661",           color:"Stone Gray",      colorHex:"#908882", qty:1, total:38,  status:"processing", date:"2025-11-03" },
  { id:"AFF-0009", customer:"Rania Aziz",        email:"rania.aziz@gmail.com",   phone:"(213) 555-0318", address:"1200 Wilshire Blvd, Los Angeles, CA 90017",   color:"Chocolate Brown", colorHex:"#5C3825", qty:2, total:76,  status:"pending",    date:"2025-11-05" },
  { id:"AFF-0010", customer:"Dina Mansour",      email:"d.mansour@gmail.com",    phone:"(617) 555-0205", address:"340 Congress St, Boston, MA 02210",           color:"Espresso",        colorHex:"#3A2110", qty:1, total:38,  status:"shipped",    date:"2025-11-02", tracking:"9374889676090204114951", courier:"USPS", estDelivery:"2025-11-09" },
  { id:"AFF-0011", customer:"Yasmin Nasser",     email:"yasmin.n@yahoo.com",     phone:"(703) 555-0163", address:"765 King St, Alexandria, VA 22314",           color:"Noor Black",      colorHex:"#1C1C1C", qty:3, total:114, status:"delivered",  date:"2025-10-22", tracking:"1Z999AA10555666777", courier:"UPS" },
  { id:"AFF-0012", customer:"Leila Rashid",      email:"leila.rashid@gmail.com", phone:"(617) 555-0341", address:"90 Brighton Ave, Boston, MA 02134",           color:"Dusty Rose",      colorHex:"#C29088", qty:2, total:76,  status:"pending",    date:"2025-11-05" },
  { id:"AFF-0013", customer:"Amina Diallo",      email:"amina.d@outlook.com",    phone:"(718) 555-0422", address:"2800 Fulton St, Brooklyn, NY 11207",          color:"Mocha Taupe",     colorHex:"#9A7D6A", qty:1, total:38,  status:"cancelled",  date:"2025-10-29" },
  { id:"AFF-0014", customer:"Maryam Suleiman",   email:"maryam.s@gmail.com",     phone:"(212) 555-0183", address:"450 7th Ave, New York, NY 10123",             color:"Deep Plum",       colorHex:"#3D2E3A", qty:2, total:76,  status:"processing", date:"2025-11-04" },
  { id:"AFF-0015", customer:"Khadija Omar",      email:"khadija.omar@gmail.com", phone:"(215) 555-0294", address:"1515 Market St, Philadelphia, PA 19102",      color:"Stone Gray",      colorHex:"#908882", qty:1, total:38,  status:"pending",    date:"2025-11-05" },
  { id:"AFF-0016", customer:"Iman Siddiqui",     email:"iman.s@gmail.com",       phone:"(732) 555-0118", address:"220 Park Ave, Newark, NJ 07102",              color:"Cream",           colorHex:"#E5D9BE", qty:1, total:38,  status:"processing", date:"2025-11-05" },
  { id:"AFF-0017", customer:"Basma Al-Farsi",    email:"basma.af@gmail.com",     phone:"(404) 555-0276", address:"875 Peachtree St, Atlanta, GA 30309",         color:"Olive Sage",      colorHex:"#7A8C66", qty:3, total:114, status:"pending",    date:"2025-11-06" },
];

const INITIAL_INVENTORY: InventoryItem[] = [
  { color:"Noor Black",      colorHex:"#1C1C1C", stock:45, reserved:8,  sold:127, reorderPoint:20 },
  { color:"Soft Ivory",      colorHex:"#EDE4CC", stock:62, reserved:3,  sold:85,  reorderPoint:20 },
  { color:"Cream",           colorHex:"#E5D9BE", stock:38, reserved:4,  sold:92,  reorderPoint:20 },
  { color:"Mocha Taupe",     colorHex:"#9A7D6A", stock:18, reserved:6,  sold:108, reorderPoint:20 },
  { color:"Chocolate Brown", colorHex:"#5C3825", stock:72, reserved:2,  sold:63,  reorderPoint:20 },
  { color:"Espresso",        colorHex:"#3A2110", stock:8,  reserved:2,  sold:145, reorderPoint:20 },
  { color:"Deep Plum",       colorHex:"#3D2E3A", stock:54, reserved:7,  sold:98,  reorderPoint:20 },
  { color:"Dusty Rose",      colorHex:"#C29088", stock:12, reserved:5,  sold:178, reorderPoint:20 },
  { color:"Olive Sage",      colorHex:"#7A8C66", stock:35, reserved:4,  sold:71,  reorderPoint:20 },
  { color:"Stone Gray",      colorHex:"#908882", stock:91, reserved:3,  sold:54,  reorderPoint:20 },
];

const COURIERS = ["USPS", "UPS", "FedEx", "DHL"];

/* ─────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────── */
const fmt = (n: number) => `$${n.toFixed(2)}`;

const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; color: string; icon: React.FC<any> }> = {
  pending:    { label: "Pending",    bg: A.warningBg, color: A.warning, icon: Clock        },
  processing: { label: "Processing", bg: A.infoBg,    color: A.info,    icon: RotateCcw    },
  shipped:    { label: "Shipped",    bg: A.shippedBg, color: A.shipped, icon: Truck        },
  delivered:  { label: "Delivered",  bg: A.successBg, color: A.success, icon: CheckCircle  },
  cancelled:  { label: "Cancelled",  bg: A.dangerBg,  color: A.danger,  icon: XCircle      },
};

function StatusBadge({ status, size = "sm" }: { status: OrderStatus; size?: "sm" | "md" }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: size === "md" ? "5px 12px" : "3px 8px",
      borderRadius: 20,
      background: cfg.bg,
      color: cfg.color,
      fontSize: size === "md" ? "0.82rem" : "0.72rem",
      fontWeight: 600,
      letterSpacing: "0.01em",
      whiteSpace: "nowrap",
    }}>
      <Icon size={size === "md" ? 13 : 11} strokeWidth={2.5} />
      {cfg.label}
    </span>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: A.white,
      borderRadius: 12,
      border: `1px solid ${A.border}`,
      ...style,
    }}>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", style }: {
  value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; style?: React.CSSProperties;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        padding: "9px 12px",
        border: `1px solid ${A.border}`,
        borderRadius: 8,
        fontSize: "0.88rem",
        color: A.text,
        background: A.white,
        outline: "none",
        fontFamily: A.sans,
        width: "100%",
        boxSizing: "border-box",
        ...style,
      }}
    />
  );
}

function Btn({
  children, onClick, variant = "primary", size = "md", disabled = false, style,
}: {
  children: React.ReactNode; onClick?: () => void;
  variant?: "primary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md"; disabled?: boolean; style?: React.CSSProperties;
}) {
  const base: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 6,
    borderRadius: 8, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
    border: "none", fontFamily: A.sans, transition: "opacity 0.15s",
    opacity: disabled ? 0.5 : 1,
    padding: size === "sm" ? "6px 12px" : "9px 16px",
    fontSize: size === "sm" ? "0.78rem" : "0.85rem",
  };
  const variants: Record<string, React.CSSProperties> = {
    primary: { background: A.accent,   color: "#FBF8F3" },
    ghost:   { background: "transparent", color: A.muted, border: "none" },
    danger:  { background: A.dangerBg, color: A.danger,  border: `1px solid ${A.danger}` },
    outline: { background: A.white,    color: A.text,     border: `1px solid ${A.border}` },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, gap: 12 }}>
      <div>
        <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: A.text, margin: 0 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: "0.82rem", color: A.muted, marginTop: 3 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   LOGIN SCREEN
───────────────────────────────────────────────────────── */
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === "afaff2025") { onLogin(); }
    else { setErr(true); setTimeout(() => setErr(false), 2000); }
  };

  return (
    <div style={{
      minHeight: "100vh", background: A.sidebar,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: A.sans,
    }}>
      <div style={{ width: 360, padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <p style={{ fontFamily: A.serif, fontSize: "2.4rem", fontWeight: 300, color: "#FBF8F3", letterSpacing: "0.12em", marginBottom: 4 }}>
            AFAFF
          </p>
          <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Admin Panel
          </p>
        </div>

        <Card style={{ padding: 28 }}>
          <h1 style={{ fontSize: "1.1rem", fontWeight: 700, color: A.text, marginBottom: 6 }}>Sign in</h1>
          <p style={{ fontSize: "0.82rem", color: A.muted, marginBottom: 24 }}>Enter your admin password to continue.</p>
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Input
              type="password"
              value={pw}
              onChange={setPw}
              placeholder="Password"
              style={{ borderColor: err ? A.danger : A.border }}
            />
            {err && <p style={{ fontSize: "0.78rem", color: A.danger, margin: 0 }}>Incorrect password. Try again.</p>}
            <button
              type="submit"
              style={{
                padding: "11px", borderRadius: 8, background: A.accent, color: "#FBF8F3",
                border: "none", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", fontFamily: A.sans,
              }}
            >
              Sign In
            </button>
          </form>
          <p style={{ fontSize: "0.72rem", color: A.muted, textAlign: "center", marginTop: 16 }}>
            Hint: <code style={{ background: A.bg, padding: "1px 6px", borderRadius: 4 }}>afaff2025</code>
          </p>
        </Card>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   DASHBOARD TAB
───────────────────────────────────────────────────────── */
function DashboardTab({ orders, inventory }: { orders: Order[]; inventory: InventoryItem[] }) {
  const revenue      = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const activeOrders = orders.filter(o => ["pending", "processing"].includes(o.status)).length;
  const shipped      = orders.filter(o => o.status === "shipped").length;
  const lowStock     = inventory.filter(i => i.stock <= i.reorderPoint).length;

  const stats = [
    { label: "Total Revenue",    value: fmt(revenue),          icon: TrendingUp,  bg: A.accentLight, color: A.accent  },
    { label: "Active Orders",    value: String(activeOrders),  icon: ShoppingCart, bg: A.infoBg,     color: A.info    },
    { label: "In Transit",       value: String(shipped),        icon: Truck,       bg: A.shippedBg,  color: A.shipped },
    { label: "Low Stock Alerts", value: String(lowStock),       icon: AlertTriangle, bg: A.warningBg, color: A.warning },
  ];

  const recent = [...orders].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);

  const byStatus = (["pending","processing","shipped","delivered","cancelled"] as OrderStatus[]).map(s => ({
    status: s,
    count: orders.filter(o => o.status === s).length,
  }));

  return (
    <div>
      <SectionHeader title="Dashboard" subtitle="Today's overview of your AFAFF store" />

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 14, marginBottom: 24 }}>
        {stats.map(({ label, value, icon: Icon, bg, color }) => (
          <Card key={label} style={{ padding: "20px 22px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "0.75rem", color: A.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{label}</p>
                <p style={{ fontSize: "1.8rem", fontWeight: 800, color: A.text, lineHeight: 1 }}>{value}</p>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={18} color={color} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "start" }}>
        {/* Recent Orders */}
        <Card style={{ overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${A.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontWeight: 700, fontSize: "0.9rem", color: A.text }}>Recent Orders</h3>
            <a href="#orders" style={{ fontSize: "0.78rem", color: A.accent, fontWeight: 600, textDecoration: "none" }}>View all</a>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
            <thead>
              <tr style={{ background: A.bg }}>
                {["Order", "Customer", "Color", "Total", "Status"].map(h => (
                  <th key={h} style={{ padding: "8px 14px", textAlign: "left", fontWeight: 600, color: A.muted, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((o, i) => (
                <tr key={o.id} style={{ borderTop: `1px solid ${A.border}`, background: i % 2 === 0 ? A.white : "#FAFAFA" }}>
                  <td style={{ padding: "10px 14px", fontWeight: 700, color: A.accent }}>{o.id}</td>
                  <td style={{ padding: "10px 14px", color: A.text }}>{o.customer}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 12, height: 12, borderRadius: "50%", background: o.colorHex, border: "1px solid rgba(0,0,0,0.1)", flexShrink: 0 }} />
                      <span style={{ color: A.muted }}>{o.color}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px", fontWeight: 700, color: A.text }}>{fmt(o.total)}</td>
                  <td style={{ padding: "10px 14px" }}><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Order status breakdown */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 200 }}>
          <Card style={{ padding: "16px 18px" }}>
            <p style={{ fontWeight: 700, fontSize: "0.85rem", color: A.text, marginBottom: 14 }}>Order Status</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {byStatus.map(({ status, count }) => {
                const cfg = STATUS_CONFIG[status];
                return (
                  <div key={status} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <StatusBadge status={status} />
                    <span style={{ fontWeight: 700, color: A.text, fontSize: "0.88rem" }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card style={{ padding: "16px 18px" }}>
            <p style={{ fontWeight: 700, fontSize: "0.85rem", color: A.text, marginBottom: 14 }}>Low Stock</p>
            {inventory.filter(i => i.stock <= i.reorderPoint).length === 0 ? (
              <p style={{ fontSize: "0.82rem", color: A.success }}>All items well-stocked ✓</p>
            ) : (
              inventory.filter(i => i.stock <= i.reorderPoint).map(item => (
                <div key={item.color} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.colorHex, flexShrink: 0 }} />
                  <span style={{ fontSize: "0.8rem", color: A.text, flex: 1 }}>{item.color}</span>
                  <span style={{
                    fontSize: "0.75rem", fontWeight: 700,
                    color: item.stock === 0 ? A.danger : A.warning,
                    background: item.stock === 0 ? A.dangerBg : A.warningBg,
                    padding: "2px 7px", borderRadius: 10,
                  }}>{item.stock} left</span>
                </div>
              ))
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   ORDER DETAIL DRAWER
───────────────────────────────────────────────────────── */
function OrderDrawer({
  order, onClose, onStatusChange, onSaveTracking,
}: {
  order: Order; onClose: () => void;
  onStatusChange: (id: string, s: OrderStatus) => void;
  onSaveTracking: (id: string, tracking: string, courier: string, estDelivery: string) => void;
}) {
  const [tracking, setTracking]     = useState(order.tracking ?? "");
  const [courier, setCourier]       = useState(order.courier ?? "USPS");
  const [estDate, setEstDate]       = useState(order.estDelivery ?? "");
  const [showStatusDd, setShowStatusDd] = useState(false);

  const statusOptions: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 80 }} />
      {/* Drawer */}
      <div style={{
        position: "fixed", right: 0, top: 0, bottom: 0, width: "100%", maxWidth: 460,
        background: A.white, zIndex: 81, overflowY: "auto", boxShadow: "-4px 0 32px rgba(0,0,0,0.12)",
        fontFamily: A.sans,
      }}>
        {/* Header */}
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${A.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: A.white, zIndex: 1 }}>
          <div>
            <p style={{ fontWeight: 800, color: A.accent, fontSize: "0.95rem" }}>{order.id}</p>
            <p style={{ fontSize: "0.72rem", color: A.muted, marginTop: 1 }}>{order.date}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <StatusBadge status={order.status} size="md" />
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: A.muted, padding: 4 }}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Customer */}
          <Card style={{ padding: 18 }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: A.muted, marginBottom: 12 }}>Customer</p>
            <p style={{ fontWeight: 700, color: A.text, marginBottom: 6 }}>{order.customer}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.82rem", color: A.muted }}>
                <Mail size={12} />{order.email}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.82rem", color: A.muted }}>
                <Phone size={12} />{order.phone}
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: "0.82rem", color: A.muted }}>
                <MapPin size={12} style={{ marginTop: 2, flexShrink: 0 }} />{order.address}
              </div>
            </div>
          </Card>

          {/* Order Items */}
          <Card style={{ padding: 18 }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: A.muted, marginBottom: 12 }}>Order Items</p>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 52, borderRadius: 8, background: order.colorHex, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, color: A.text, fontSize: "0.9rem" }}>AFAFF Everyday Modal Hijab</p>
                <p style={{ fontSize: "0.78rem", color: A.muted, marginTop: 2 }}>{order.color} · 70×180 cm · 160–180 GSM</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontWeight: 700, color: A.text }}>{fmt(order.total)}</p>
                <p style={{ fontSize: "0.72rem", color: A.muted }}>Qty: {order.qty}</p>
              </div>
            </div>
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${A.border}`, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.82rem", color: A.muted }}>Subtotal</span>
              <span style={{ fontWeight: 700, color: A.text }}>{fmt(order.total)}</span>
            </div>
            <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.82rem", color: A.muted }}>Shipping</span>
              <span style={{ fontSize: "0.82rem", color: A.success, fontWeight: 600 }}>Free</span>
            </div>
          </Card>

          {/* Update Status */}
          <Card style={{ padding: 18 }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: A.muted, marginBottom: 12 }}>Update Status</p>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowStatusDd(v => !v)}
                style={{
                  width: "100%", padding: "10px 14px", border: `1px solid ${A.border}`, borderRadius: 8,
                  background: A.white, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
                  fontFamily: A.sans, fontSize: "0.88rem", color: A.text,
                }}
              >
                <StatusBadge status={order.status} size="md" />
                <ChevronDown size={16} color={A.muted} />
              </button>
              {showStatusDd && (
                <div style={{
                  position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
                  background: A.white, border: `1px solid ${A.border}`, borderRadius: 8,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 10, overflow: "hidden",
                }}>
                  {statusOptions.map(s => (
                    <button
                      key={s}
                      onClick={() => { onStatusChange(order.id, s); setShowStatusDd(false); }}
                      style={{
                        display: "block", width: "100%", padding: "10px 14px", border: "none",
                        background: order.status === s ? A.bg : "transparent",
                        cursor: "pointer", textAlign: "left", fontFamily: A.sans,
                      }}
                    >
                      <StatusBadge status={s} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Tracking */}
          <Card style={{ padding: 18 }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: A.muted, marginBottom: 14 }}>
              Shipping & Tracking
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: A.muted, display: "block", marginBottom: 4 }}>Courier</label>
                <select
                  value={courier}
                  onChange={e => setCourier(e.target.value)}
                  style={{
                    width: "100%", padding: "9px 12px", border: `1px solid ${A.border}`, borderRadius: 8,
                    fontSize: "0.88rem", color: A.text, background: A.white, fontFamily: A.sans,
                    outline: "none",
                  }}
                >
                  {COURIERS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: A.muted, display: "block", marginBottom: 4 }}>Tracking Number</label>
                <Input value={tracking} onChange={setTracking} placeholder="Enter tracking number" />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: A.muted, display: "block", marginBottom: 4 }}>Estimated Delivery</label>
                <Input type="date" value={estDate} onChange={setEstDate} />
              </div>
              <Btn onClick={() => onSaveTracking(order.id, tracking, courier, estDate)} style={{ alignSelf: "flex-start" }}>
                <CheckCircle size={14} /> Save Tracking
              </Btn>
              {order.tracking && (
                <p style={{ fontSize: "0.75rem", color: A.success }}>
                  ✓ Tracking saved: {order.tracking}
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   ORDERS TAB
───────────────────────────────────────────────────────── */
function OrdersTab({
  orders, onStatusChange, onSaveTracking,
}: {
  orders: Order[];
  onStatusChange: (id: string, s: OrderStatus) => void;
  onSaveTracking: (id: string, t: string, c: string, e: string) => void;
}) {
  const [search, setSearch]         = useState("");
  const [filterStatus, setFilter]   = useState<OrderStatus | "all">("all");
  const [selectedOrder, setSelected] = useState<Order | null>(null);

  const filtered = useMemo(() => orders.filter(o => {
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()) || o.color.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  }), [orders, search, filterStatus]);

  const statuses: Array<OrderStatus | "all"> = ["all", "pending", "processing", "shipped", "delivered", "cancelled"];

  return (
    <div>
      <SectionHeader
        title="Orders"
        subtitle={`${orders.length} total orders`}
      />

      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        <div style={{ position: "relative", flex: "1 1 240px", maxWidth: 320 }}>
          <Search size={15} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: A.muted }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search orders, customers, colors…"
            style={{
              width: "100%", padding: "9px 12px 9px 34px", border: `1px solid ${A.border}`,
              borderRadius: 8, fontSize: "0.85rem", color: A.text, background: A.white,
              outline: "none", fontFamily: A.sans, boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: "8px 14px", borderRadius: 8, border: `1px solid ${filterStatus === s ? A.accent : A.border}`,
                background: filterStatus === s ? A.accentLight : A.white,
                color: filterStatus === s ? A.accent : A.muted,
                fontWeight: 600, fontSize: "0.78rem", cursor: "pointer",
                fontFamily: A.sans, textTransform: "capitalize",
              }}
            >
              {s === "all" ? `All (${orders.length})` : `${STATUS_CONFIG[s].label} (${orders.filter(o => o.status === s).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", minWidth: 680 }}>
            <thead>
              <tr style={{ background: A.bg, borderBottom: `1px solid ${A.border}` }}>
                {["Order ID", "Customer", "Color", "Qty", "Total", "Status", "Date", ""].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, color: A.muted, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: 32, textAlign: "center", color: A.muted, fontSize: "0.88rem" }}>No orders match your filters.</td></tr>
              ) : filtered.map((o, i) => (
                <tr
                  key={o.id}
                  style={{ borderTop: `1px solid ${A.border}`, background: i % 2 === 0 ? A.white : "#FAFAFA", cursor: "pointer", transition: "background 0.1s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#F0F0F8")}
                  onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? A.white : "#FAFAFA")}
                  onClick={() => setSelected(o)}
                >
                  <td style={{ padding: "11px 14px", fontWeight: 800, color: A.accent }}>{o.id}</td>
                  <td style={{ padding: "11px 14px" }}>
                    <div>
                      <p style={{ fontWeight: 600, color: A.text }}>{o.customer}</p>
                      <p style={{ fontSize: "0.72rem", color: A.muted }}>{o.email}</p>
                    </div>
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 14, height: 14, borderRadius: "50%", background: o.colorHex, border: "1px solid rgba(0,0,0,0.08)", flexShrink: 0 }} />
                      <span style={{ color: A.text }}>{o.color}</span>
                    </div>
                  </td>
                  <td style={{ padding: "11px 14px", color: A.text, fontWeight: 600 }}>{o.qty}</td>
                  <td style={{ padding: "11px 14px", fontWeight: 700, color: A.text }}>{fmt(o.total)}</td>
                  <td style={{ padding: "11px 14px" }}><StatusBadge status={o.status} /></td>
                  <td style={{ padding: "11px 14px", color: A.muted, whiteSpace: "nowrap" }}>{o.date}</td>
                  <td style={{ padding: "11px 14px" }}>
                    <Btn variant="ghost" size="sm" onClick={e => { e.stopPropagation(); setSelected(o); }}>
                      <Eye size={14} /> View
                    </Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Order Drawer */}
      {selectedOrder && (
        <OrderDrawer
          order={orders.find(o => o.id === selectedOrder.id) ?? selectedOrder}
          onClose={() => setSelected(null)}
          onStatusChange={(id, s) => { onStatusChange(id, s); setSelected(prev => prev ? { ...prev, status: s } : null); }}
          onSaveTracking={(id, t, c, e) => { onSaveTracking(id, t, c, e); setSelected(prev => prev ? { ...prev, tracking: t, courier: c, estDelivery: e } : null); }}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   DELIVERY TAB
───────────────────────────────────────────────────────── */
function DeliveryTab({
  orders, onStatusChange, onSaveTracking,
}: {
  orders: Order[];
  onStatusChange: (id: string, s: OrderStatus) => void;
  onSaveTracking: (id: string, t: string, c: string, e: string) => void;
}) {
  const [deliveryTab, setDeliveryTab] = useState<"ready" | "transit" | "delivered">("ready");
  const [trackingInputs, setTrackingInputs] = useState<Record<string, { tracking: string; courier: string; date: string }>>({});

  const readyToShip = orders.filter(o => o.status === "processing");
  const inTransit   = orders.filter(o => o.status === "shipped");
  const delivered   = orders.filter(o => o.status === "delivered");

  const getInput = (id: string) => trackingInputs[id] ?? { tracking: "", courier: "USPS", date: "" };
  const setInput = (id: string, key: string, val: string) =>
    setTrackingInputs(p => ({ ...p, [id]: { ...getInput(id), [key]: val } }));

  const handleShip = (order: Order) => {
    const inp = getInput(order.id);
    onSaveTracking(order.id, inp.tracking, inp.courier, inp.date);
    onStatusChange(order.id, "shipped");
  };

  const tabs = [
    { key: "ready",   label: "Ready to Ship", count: readyToShip.length, color: A.info    },
    { key: "transit", label: "In Transit",     count: inTransit.length,   color: A.shipped },
    { key: "delivered", label: "Delivered",    count: delivered.length,   color: A.success },
  ] as const;

  const visibleOrders = deliveryTab === "ready" ? readyToShip : deliveryTab === "transit" ? inTransit : delivered;

  return (
    <div>
      <SectionHeader
        title="Delivery Management"
        subtitle="Manage shipments, tracking numbers, and delivery status"
      />

      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: `1px solid ${A.border}`, paddingBottom: 0 }}>
        {tabs.map(({ key, label, count, color }) => (
          <button
            key={key}
            onClick={() => setDeliveryTab(key)}
            style={{
              padding: "10px 18px",
              border: "none",
              borderBottom: deliveryTab === key ? `2px solid ${A.accent}` : "2px solid transparent",
              background: "transparent",
              color: deliveryTab === key ? A.accent : A.muted,
              fontWeight: deliveryTab === key ? 700 : 500,
              fontSize: "0.85rem",
              cursor: "pointer",
              fontFamily: A.sans,
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: -1,
            }}
          >
            {label}
            <span style={{
              background: deliveryTab === key ? A.accent : A.bg,
              color: deliveryTab === key ? "#fff" : A.muted,
              padding: "1px 7px",
              borderRadius: 10,
              fontSize: "0.72rem",
              fontWeight: 700,
            }}>{count}</span>
          </button>
        ))}
      </div>

      {visibleOrders.length === 0 ? (
        <Card style={{ padding: 48, textAlign: "center" }}>
          <Truck size={36} color={A.border} style={{ marginBottom: 12 }} />
          <p style={{ color: A.muted, fontSize: "0.9rem" }}>
            {deliveryTab === "ready" ? "No orders ready to ship — all caught up!" :
             deliveryTab === "transit" ? "No orders currently in transit." :
             "No delivered orders yet."}
          </p>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {visibleOrders.map(order => (
            <Card key={order.id} style={{ padding: 20 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-start" }}>
                {/* Order info */}
                <div style={{ flex: "1 1 250px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontWeight: 800, color: A.accent, fontSize: "0.9rem" }}>{order.id}</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <p style={{ fontWeight: 700, color: A.text, fontSize: "0.92rem" }}>{order.customer}</p>
                  <p style={{ fontSize: "0.78rem", color: A.muted, marginTop: 2 }}>{order.address}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: order.colorHex, border: "1px solid rgba(0,0,0,0.1)" }} />
                    <span style={{ fontSize: "0.82rem", color: A.text }}>{order.color}</span>
                    <span style={{ fontSize: "0.82rem", color: A.muted }}>× {order.qty}</span>
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: A.text }}>{fmt(order.total)}</span>
                  </div>
                </div>

                {/* Tracking form (ready to ship) or tracking info (shipped/delivered) */}
                {deliveryTab === "ready" ? (
                  <div style={{ flex: "1 1 340px", display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: "0.72rem", fontWeight: 600, color: A.muted, display: "block", marginBottom: 3 }}>Courier</label>
                        <select
                          value={getInput(order.id).courier}
                          onChange={e => setInput(order.id, "courier", e.target.value)}
                          style={{ width: "100%", padding: "8px 10px", border: `1px solid ${A.border}`, borderRadius: 7, fontSize: "0.85rem", fontFamily: A.sans, color: A.text, background: A.white, outline: "none" }}
                        >
                          {COURIERS.map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: "0.72rem", fontWeight: 600, color: A.muted, display: "block", marginBottom: 3 }}>Est. Delivery</label>
                        <Input type="date" value={getInput(order.id).date} onChange={v => setInput(order.id, "date", v)} />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: "0.72rem", fontWeight: 600, color: A.muted, display: "block", marginBottom: 3 }}>Tracking Number</label>
                      <Input value={getInput(order.id).tracking} onChange={v => setInput(order.id, "tracking", v)} placeholder="Enter tracking number" />
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Btn onClick={() => handleShip(order)} style={{ flex: 1 }}>
                        <Truck size={14} /> Mark as Shipped
                      </Btn>
                      <Btn variant="outline" onClick={() => onStatusChange(order.id, "pending")} size="sm">
                        <RotateCcw size={13} /> Back to Pending
                      </Btn>
                    </div>
                  </div>
                ) : (
                  <div style={{ flex: "1 1 260px" }}>
                    {order.tracking ? (
                      <div style={{ background: deliveryTab === "transit" ? A.shippedBg : A.successBg, borderRadius: 10, padding: "14px 16px" }}>
                        <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: deliveryTab === "transit" ? A.shipped : A.success, marginBottom: 6 }}>
                          {deliveryTab === "transit" ? "📦 In Transit" : "✓ Delivered"}
                        </p>
                        <p style={{ fontSize: "0.82rem", color: A.text, fontWeight: 600 }}>{order.courier}</p>
                        <p style={{ fontSize: "0.78rem", color: A.muted, marginTop: 2, wordBreak: "break-all" }}>{order.tracking}</p>
                        {order.estDelivery && (
                          <p style={{ fontSize: "0.75rem", color: A.muted, marginTop: 4 }}>Est. {order.estDelivery}</p>
                        )}
                      </div>
                    ) : (
                      <p style={{ fontSize: "0.82rem", color: A.muted, fontStyle: "italic" }}>No tracking number on file.</p>
                    )}
                    {deliveryTab === "transit" && (
                      <Btn variant="outline" size="sm" onClick={() => onStatusChange(order.id, "delivered")} style={{ marginTop: 10 }}>
                        <CheckCircle size={13} /> Mark Delivered
                      </Btn>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   EDIT STOCK MODAL
───────────────────────────────────────────────────────── */
function EditStockModal({
  item, onClose, onSave,
}: {
  item: InventoryItem; onClose: () => void;
  onSave: (color: string, stock: number, reorderPoint: number) => void;
}) {
  const [stock, setStock] = useState(String(item.stock));
  const [reorder, setReorder] = useState(String(item.reorderPoint));
  const [notes, setNotes] = useState("");

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 90 }} />
      <div style={{
        position: "fixed", inset: "0", margin: "auto",
        width: "100%", maxWidth: 400, height: "fit-content",
        background: A.white, borderRadius: 16, zIndex: 91,
        padding: 28, boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
        fontFamily: A.sans,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: item.colorHex, border: "1px solid rgba(0,0,0,0.1)" }} />
            <h3 style={{ fontWeight: 700, color: A.text, fontSize: "1rem" }}>Edit: {item.color}</h3>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: A.muted }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: A.muted, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>Current Stock (units)</label>
            <Input type="number" value={stock} onChange={setStock} placeholder="0" />
          </div>
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: A.muted, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>Reorder Point</label>
            <Input type="number" value={reorder} onChange={setReorder} placeholder="20" />
            <p style={{ fontSize: "0.72rem", color: A.muted, marginTop: 4 }}>Alert when stock falls below this number.</p>
          </div>
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: A.muted, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>Adjustment Notes</label>
            <input
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Received 50 units from supplier"
              style={{
                width: "100%", padding: "9px 12px", border: `1px solid ${A.border}`, borderRadius: 8,
                fontSize: "0.85rem", color: A.text, background: A.white, fontFamily: A.sans,
                outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <Btn onClick={() => { onSave(item.color, Number(stock) || 0, Number(reorder) || 20); onClose(); }} style={{ flex: 1 }}>
              <CheckCircle size={14} /> Save Changes
            </Btn>
            <Btn variant="outline" onClick={onClose}>Cancel</Btn>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   INVENTORY TAB
───────────────────────────────────────────────────────── */
function InventoryTab({
  inventory, onSave,
}: {
  inventory: InventoryItem[];
  onSave: (color: string, stock: number, reorderPoint: number) => void;
}) {
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const totalUnits = inventory.reduce((s, i) => s + i.stock, 0);
  const totalSold  = inventory.reduce((s, i) => s + i.sold, 0);
  const lowCount   = inventory.filter(i => i.stock <= i.reorderPoint).length;
  const maxStock   = Math.max(...inventory.map(i => i.sold));

  return (
    <div>
      <SectionHeader
        title="Inventory"
        subtitle="Stock levels across all 10 launch colors"
      />

      {/* Summary row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Units in Stock", value: totalUnits, color: A.info    },
          { label: "Total Units Sold",     value: totalSold,  color: A.success },
          { label: "Low Stock Alerts",     value: lowCount,   color: lowCount > 0 ? A.warning : A.success },
        ].map(({ label, value, color }) => (
          <Card key={label} style={{ padding: "16px 18px" }}>
            <p style={{ fontSize: "0.72rem", color: A.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{label}</p>
            <p style={{ fontSize: "1.7rem", fontWeight: 800, color }}>{value}</p>
          </Card>
        ))}
      </div>

      {/* Inventory table */}
      <Card style={{ overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${A.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontWeight: 700, fontSize: "0.9rem", color: A.text }}>All Colors</h3>
          <p style={{ fontSize: "0.75rem", color: A.muted }}>Click a row to edit stock levels</p>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ background: A.bg, borderBottom: `1px solid ${A.border}` }}>
              {["Color", "In Stock", "Reserved", "Available", "Sold", "Demand", "Status", ""].map(h => (
                <th key={h} style={{ padding: "9px 14px", textAlign: "left", fontWeight: 700, color: A.muted, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inventory.map((item, i) => {
              const available = Math.max(0, item.stock - item.reserved);
              const isLow     = item.stock <= item.reorderPoint;
              const isOut     = item.stock === 0;
              return (
                <tr
                  key={item.color}
                  style={{ borderTop: `1px solid ${A.border}`, background: i % 2 === 0 ? A.white : "#FAFAFA", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#F0F0F8")}
                  onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? A.white : "#FAFAFA")}
                  onClick={() => setEditItem(item)}
                >
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 20, height: 20, borderRadius: 4, background: item.colorHex, border: "1px solid rgba(0,0,0,0.08)", flexShrink: 0 }} />
                      <span style={{ fontWeight: 600, color: A.text }}>{item.color}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px", fontWeight: 700, color: isOut ? A.danger : isLow ? A.warning : A.text }}>{item.stock}</td>
                  <td style={{ padding: "12px 14px", color: A.muted }}>{item.reserved}</td>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: available < 5 ? A.danger : A.text }}>{available}</td>
                  <td style={{ padding: "12px 14px", color: A.muted }}>{item.sold}</td>
                  {/* Demand bar */}
                  <td style={{ padding: "12px 14px", minWidth: 110 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 6, borderRadius: 4, background: A.bg, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${(item.sold / maxStock) * 100}%`, background: A.accent, borderRadius: 4 }} />
                      </div>
                      <span style={{ fontSize: "0.72rem", color: A.muted, whiteSpace: "nowrap" }}>{item.sold} sold</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    {isOut ? (
                      <span style={{ padding: "3px 8px", borderRadius: 20, background: A.dangerBg, color: A.danger, fontSize: "0.72rem", fontWeight: 700 }}>Out of Stock</span>
                    ) : isLow ? (
                      <span style={{ padding: "3px 8px", borderRadius: 20, background: A.warningBg, color: A.warning, fontSize: "0.72rem", fontWeight: 700 }}>Low Stock</span>
                    ) : (
                      <span style={{ padding: "3px 8px", borderRadius: 20, background: A.successBg, color: A.success, fontSize: "0.72rem", fontWeight: 700 }}>In Stock</span>
                    )}
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <Btn variant="ghost" size="sm" onClick={e => { e.stopPropagation(); setEditItem(item); }}>
                      <Edit2 size={13} />
                    </Btn>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {editItem && (
        <EditStockModal
          item={editItem}
          onClose={() => setEditItem(null)}
          onSave={(color, stock, reorderPoint) => {
            onSave(color, stock, reorderPoint);
            setEditItem(null);
          }}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN ADMIN COMPONENT
───────────────────────────────────────────────────────── */
export default function Admin() {
  const [authed, setAuthed]       = useState(false);
  const [tab, setTab]             = useState<AdminTab>("dashboard");
  const [orders, setOrders]       = useState<Order[]>(INITIAL_ORDERS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [sidebarOpen, setSidebar] = useState(false);

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const updateOrderStatus = (id: string, status: OrderStatus) =>
    setOrders(p => p.map(o => o.id === id ? { ...o, status } : o));

  const saveTracking = (id: string, tracking: string, courier: string, estDelivery: string) =>
    setOrders(p => p.map(o => o.id === id ? { ...o, tracking, courier, estDelivery } : o));

  const saveStock = (color: string, stock: number, reorderPoint: number) =>
    setInventory(p => p.map(i => i.color === color ? { ...i, stock, reorderPoint } : i));

  const navItems: Array<{ key: AdminTab; label: string; icon: React.FC<any> }> = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "orders",    label: "Orders",    icon: Package          },
    { key: "delivery",  label: "Delivery",  icon: Truck            },
    { key: "inventory", label: "Inventory", icon: Archive          },
  ];

  const pendingCount = orders.filter(o => o.status === "pending").length;

  const SidebarContent = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Brand */}
      <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${A.sidebarBrd}` }}>
        <p style={{ fontFamily: A.serif, fontSize: "1.5rem", fontWeight: 300, color: "#FBF8F3", letterSpacing: "0.12em", lineHeight: 1 }}>AFAFF</p>
        <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 3 }}>Admin Panel</p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px" }}>
        {navItems.map(({ key, label, icon: Icon }) => {
          const active = tab === key;
          const badge  = key === "orders" && pendingCount > 0 ? pendingCount : null;
          return (
            <button
              key={key}
              onClick={() => { setTab(key); setSidebar(false); }}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 9, border: "none",
                background: active ? "rgba(255,255,255,0.1)" : "transparent",
                color: active ? "#FFFFFF" : "rgba(255,255,255,0.5)",
                fontWeight: active ? 700 : 400, fontSize: "0.88rem",
                cursor: "pointer", fontFamily: A.sans, marginBottom: 2,
                textAlign: "left", position: "relative",
                transition: "all 0.15s",
              }}
            >
              {active && (
                <div style={{ position: "absolute", left: 0, top: "20%", bottom: "20%", width: 3, borderRadius: "0 4px 4px 0", background: "#C29088" }} />
              )}
              <Icon size={17} strokeWidth={active ? 2.5 : 2} />
              {label}
              {badge && (
                <span style={{
                  marginLeft: "auto", background: A.warning, color: "#fff",
                  padding: "1px 7px", borderRadius: 10, fontSize: "0.68rem", fontWeight: 800,
                }}>
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: "14px 12px 20px", borderTop: `1px solid ${A.sidebarBrd}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: A.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#FBF8F3", fontSize: "0.75rem", fontWeight: 700 }}>AF</span>
          </div>
          <div>
            <p style={{ fontSize: "0.8rem", color: "#FBF8F3", fontWeight: 600 }}>AFAFF Admin</p>
            <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)" }}>wearafaff.com</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => window.open("/", "_blank")}
            style={{ flex: 1, padding: "7px 10px", borderRadius: 7, border: `1px solid ${A.sidebarBrd}`, background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", cursor: "pointer", fontFamily: A.sans, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}
          >
            <Eye size={12} /> Store
          </button>
          <button
            onClick={() => setAuthed(false)}
            style={{ flex: 1, padding: "7px 10px", borderRadius: 7, border: `1px solid ${A.sidebarBrd}`, background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", cursor: "pointer", fontFamily: A.sans, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}
          >
            <LogOut size={12} /> Logout
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: A.sans, background: A.bg }}>

      {/* Desktop sidebar */}
      <aside style={{
        width: 220, background: A.sidebar, flexShrink: 0,
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 30,
        display: "none",
      }} className="admin-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile: sidebar overlay */}
      {sidebarOpen && (
        <>
          <div onClick={() => setSidebar(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }} />
          <aside style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: 220, background: A.sidebar, zIndex: 41 }}>
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }} className="admin-main">

        {/* Top bar (mobile + desktop) */}
        <header style={{
          background: A.white, borderBottom: `1px solid ${A.border}`,
          padding: "12px 20px", position: "sticky", top: 0, zIndex: 20,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setSidebar(true)}
              className="mobile-menu-btn"
              style={{ background: "none", border: "none", cursor: "pointer", color: A.text, padding: 4 }}
            >
              <Menu size={22} />
            </button>
            <div>
              <h1 style={{ fontSize: "1rem", fontWeight: 800, color: A.text, margin: 0, lineHeight: 1 }}>
                {navItems.find(n => n.key === tab)?.label}
              </h1>
              <p style={{ fontSize: "0.72rem", color: A.muted, marginTop: 1 }}>AFAFF Store Management</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {pendingCount > 0 && (
              <span style={{ fontSize: "0.75rem", color: A.warning, background: A.warningBg, padding: "4px 10px", borderRadius: 20, fontWeight: 700, cursor: "pointer" }}
                onClick={() => { setTab("orders"); }}>
                {pendingCount} pending orders
              </span>
            )}
            <a href="/" target="_blank" style={{ fontSize: "0.78rem", color: A.accent, fontWeight: 600, textDecoration: "none", padding: "6px 12px", border: `1px solid ${A.accent}`, borderRadius: 7 }}>
              View Store ↗
            </a>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: "24px 20px", maxWidth: 1200, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
          {tab === "dashboard" && <DashboardTab orders={orders} inventory={inventory} />}
          {tab === "orders"    && <OrdersTab orders={orders} onStatusChange={updateOrderStatus} onSaveTracking={saveTracking} />}
          {tab === "delivery"  && <DeliveryTab orders={orders} onStatusChange={updateOrderStatus} onSaveTracking={saveTracking} />}
          {tab === "inventory" && <InventoryTab inventory={inventory} onSave={saveStock} />}
        </main>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .admin-sidebar { display: block !important; }
          .admin-main { margin-left: 220px; }
          .mobile-menu-btn { display: none !important; }
        }
        * { box-sizing: border-box; }
        input[type="number"]::-webkit-inner-spin-button { opacity: 0.5; }
        select:focus, input:focus { outline: 1.5px solid #3D2E3A; }
      `}</style>
    </div>
  );
}
