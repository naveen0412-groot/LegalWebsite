import { useState, useEffect, useRef } from "react";

const SERVICES = [
  {
    id: 1,
    title: "Private Limited Company",
    category: "Incorporation",
    icon: "🏢",
    tagline: "Most trusted structure for startups",
    description: "Register your business as a Private Limited Company — the gold standard for startups seeking investment, credibility, and liability protection. Includes DIN, DSC, MOA, AOA, and Certificate of Incorporation.",
    price: 6999,
    duration: "7–10 working days",
    steps: ["Name Approval (MCA)", "Digital Signature Certificate", "Director Identification Number", "MOA & AOA Drafting", "Certificate of Incorporation"],
    badge: "Popular",
    color: "#6366f1"
  },
  {
    id: 2,
    title: "LLP Registration",
    category: "Incorporation",
    icon: "🤝",
    tagline: "Flexible partnership with limited liability",
    description: "Limited Liability Partnership combines the flexibility of a partnership with the protection of limited liability. Ideal for professional services firms and consulting businesses.",
    price: 4999,
    duration: "8–12 working days",
    steps: ["LLP Name Reservation", "DSC for Partners", "DPIN for Partners", "LLP Agreement Drafting", "Certificate of Incorporation"],
    badge: null,
    color: "#8b5cf6"
  },
  {
    id: 3,
    title: "GST Registration",
    category: "GST",
    icon: "📋",
    tagline: "Mandatory for businesses above ₹40L turnover",
    description: "Obtain your GSTIN and become GST compliant. Required for businesses with annual turnover above ₹40 lakhs. Enables input tax credit and interstate trade without restrictions.",
    price: 1499,
    duration: "3–5 working days",
    steps: ["Document Collection", "Application Filing on GST Portal", "ARN Generation", "GSTIN Allotment", "GST Certificate"],
    badge: "Quick",
    color: "#10b981"
  },
  {
    id: 4,
    title: "MSME / Udyam Registration",
    category: "MSME",
    icon: "🏭",
    tagline: "Unlock government benefits & subsidies",
    description: "Register your Micro, Small, or Medium Enterprise to access priority lending, government subsidies, tax exemptions, and protection against delayed payments under MSMED Act.",
    price: 999,
    duration: "1–2 working days",
    steps: ["Aadhaar Verification", "Business Details Entry", "NIC Code Selection", "Self-Declaration", "Udyam Certificate"],
    badge: "Fastest",
    color: "#f59e0b"
  },
  {
    id: 5,
    title: "Trademark Registration",
    category: "Trademark",
    icon: "™️",
    tagline: "Protect your brand name & logo",
    description: "Secure exclusive rights to your brand name, logo, or slogan under the Trade Marks Act 1999. Get the ® symbol and legal protection against infringement across India.",
    price: 7999,
    duration: "18–24 months",
    steps: ["Trademark Search", "Class Selection", "Application Filing (TM-A)", "Examination Report Response", "Registration Certificate"],
    badge: "IP Protection",
    color: "#ef4444"
  },
  {
    id: 6,
    title: "OPC Registration",
    category: "Incorporation",
    icon: "👤",
    tagline: "Solo founder? This is your structure",
    description: "One Person Company lets a single entrepreneur enjoy the benefits of a corporate entity with limited liability. Perfect for solopreneurs who want full control with legal protection.",
    price: 5499,
    duration: "7–10 working days",
    steps: ["Name Approval", "DSC & DIN for Director", "Nominee Appointment", "MOA & AOA Drafting", "Certificate of Incorporation"],
    badge: null,
    color: "#06b6d4"
  }
];

const CATEGORIES = ["All", "Incorporation", "GST", "MSME", "Trademark"];

const generateTxnId = () => "TXN" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();

// ─── ADMIN MOCK DATA ───────────────────────────────────────────────────────
const INIT_REQUESTS = [
  { id: "TXN1A2B3C", name: "Priya Sharma", email: "priya@gmail.com", phone: "9876543210", service: "GST Registration", amount: 1499, status: "Paid", date: "2025-06-01" },
  { id: "TXN4D5E6F", name: "Arjun Mehta", email: "arjun@techco.in", phone: "9123456780", service: "Pvt Ltd Company", amount: 6999, status: "Paid", date: "2025-06-03" },
  { id: "TXN7G8H9I", name: "Sunita Rao", email: "sunita@startup.io", phone: "9988776655", service: "Trademark Registration", amount: 7999, status: "Pending", date: "2025-06-05" },
  { id: "TXNJKLMNO", name: "Rahul Kumar", email: "rahul@biz.com", phone: "9012345678", service: "MSME Registration", amount: 999, status: "Paid", date: "2025-06-07" },
];

// ─── UTILS ─────────────────────────────────────────────────────────────────
function exportCSV(data) {
  const headers = ["Transaction ID", "Name", "Email", "Phone", "Service", "Amount", "Status", "Date"];
  const rows = data.map(r => [r.id, r.name, r.email, r.phone, r.service, r.amount, r.status, r.date]);
  const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "registrations.csv"; a.click();
}

// ─── COMPONENTS ────────────────────────────────────────────────────────────

function Badge({ text, color }) {
  if (!text) return null;
  return (
    <span style={{ background: color + "22", color: color, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, letterSpacing: "0.05em", textTransform: "uppercase" }}>
      {text}
    </span>
  );
}

function ServiceCard({ service, onInterested, onDetail }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${hovered ? service.color + "55" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 16,
        padding: "24px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        transform: hovered ? "translateY(-2px)" : "none",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        position: "relative",
        overflow: "hidden"
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: hovered ? service.color : "transparent", transition: "all 0.2s" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 32 }}>{service.icon}</span>
        <Badge text={service.badge} color={service.color} />
      </div>
      <div>
        <p style={{ fontSize: 11, color: service.color, fontWeight: 600, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{service.category}</p>
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{service.title}</h3>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{service.tagline}</p>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 4 }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>₹{service.price.toLocaleString()}</span>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>+ GST</span>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <button
          onClick={() => onDetail(service)}
          style={{ flex: 1, padding: "10px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "rgba(255,255,255,0.7)", fontSize: 13, cursor: "pointer", fontWeight: 500 }}
        >
          Learn More
        </button>
        <button
          onClick={() => onInterested(service)}
          style={{ flex: 1, padding: "10px", background: service.color, border: "none", borderRadius: 10, color: "#fff", fontSize: 13, cursor: "pointer", fontWeight: 700, letterSpacing: "0.02em" }}
        >
          I'm Interested →
        </button>
      </div>
    </div>
  );
}

function LeadModal({ service, onClose, onSuccess }) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!name || !email || !phone) { setError("All fields are required."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email."); return; }
    if (!/^\d{10}$/.test(phone)) { setError("Enter a valid 10-digit mobile number."); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess({ name, email, phone }); }, 1000);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 32, width: "100%", maxWidth: 400 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: service.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Quick Contact</p>
            <h2 style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 800, color: "#fff" }}>Get Started</h2>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 18 }}>×</button>
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 24 }}>{service.icon}</span>
          <div>
            <p style={{ margin: 0, fontWeight: 700, color: "#fff", fontSize: 14 }}>{service.title}</p>
            <p style={{ margin: 0, color: service.color, fontSize: 13, fontWeight: 700 }}>₹{service.price.toLocaleString()}</p>
          </div>
        </div>
        {[
          { label: "Full Name", val: name, set: setName, type: "text", ph: "Priya Sharma" },
          { label: "Email Address", val: email, set: setEmail, type: "email", ph: "you@example.com" },
          { label: "Mobile Number", val: phone, set: setPhone, type: "tel", ph: "10-digit number" }
        ].map(f => (
          <div key={f.label} style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{f.label}</label>
            <input
              type={f.type}
              placeholder={f.ph}
              value={f.val}
              onChange={e => f.set(e.target.value)}
              style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
            />
          </div>
        ))}
        {error && <p style={{ color: "#ef4444", fontSize: 12, margin: "0 0 12px" }}>{error}</p>}
        <button
          onClick={handleSubmit}
          style={{ width: "100%", padding: "14px", background: service.color, border: "none", borderRadius: 12, color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Processing..." : "Proceed to Cart →"}
        </button>
        <p style={{ margin: "12px 0 0", fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>🔒 Your data is encrypted and never shared.</p>
      </div>
    </div>
  );
}

function ServiceDetailModal({ service, onClose, onInterested }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 32, width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 40 }}>{service.icon}</span>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: service.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{service.category}</p>
              <h2 style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 800, color: "#fff" }}>{service.title}</h2>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 18 }}>×</button>
        </div>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>{service.description}</p>
        <div style={{ marginBottom: 24 }}>
          <h4 style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Process Steps</h4>
          {service.steps.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: service.color + "22", border: `1px solid ${service.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: service.color, flexShrink: 0 }}>{i + 1}</div>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>{step}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 16, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 16, marginBottom: 24 }}>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Price</p>
            <p style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 800, color: "#fff" }}>₹{service.price.toLocaleString()}</p>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Timeline</p>
            <p style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 600, color: service.color }}>{service.duration}</p>
          </div>
        </div>
        <button onClick={() => { onClose(); onInterested(service); }}
          style={{ width: "100%", padding: 14, background: service.color, border: "none", borderRadius: 12, color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
          Get Started — ₹{service.price.toLocaleString()} →
        </button>
      </div>
    </div>
  );
}

function CartPage({ cart, lead, onRemove, onCheckout, onBack }) {
  const total = cart.reduce((s, c) => s + c.price, 0);
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 16px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", padding: "12px 0", marginBottom: 16, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>← Back to Services</button>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Your Cart</h2>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 24 }}>Registered as: <span style={{ color: "#fff" }}>{lead.name}</span> • {lead.email}</p>
      {cart.length === 0 ? (
        <div style={{ textAlign: "center", padding: 48, color: "rgba(255,255,255,0.3)", fontSize: 14 }}>Your cart is empty.<br /><button onClick={onBack} style={{ marginTop: 12, background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>Browse Services</button></div>
      ) : (
        <>
          {cart.map(s => (
            <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "16px 20px", marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: 24 }}>{s.icon}</span>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, color: "#fff", fontSize: 15 }}>{s.title}</p>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{s.category} • {s.duration}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontWeight: 800, color: "#fff", fontSize: 16 }}>₹{s.price.toLocaleString()}</span>
                <button onClick={() => onRemove(s.id)} style={{ background: "rgba(239,68,68,0.15)", border: "none", color: "#ef4444", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 13 }}>✕</button>
              </div>
            </div>
          ))}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Total (excl. GST)</p>
              <p style={{ margin: 0, fontSize: 28, fontWeight: 900, color: "#fff" }}>₹{total.toLocaleString()}</p>
            </div>
            <button onClick={onCheckout}
              style={{ padding: "14px 28px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", borderRadius: 12, color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer" }}>
              Pay Now →
            </button>
          </div>
          <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "rgba(16,185,129,0.9)" }}>
            🔐 Payments secured by 256-bit SSL encryption
          </div>
        </>
      )}
    </div>
  );
}

function PaymentPage({ cart, lead, onSuccess, onBack }) {
  const [tab, setTab] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const total = cart.reduce((s, c) => s + c.price, 0);

  const handlePay = () => {
    if (tab === "upi" && !upiId) { setError("Enter your UPI ID."); return; }
    if (tab === "card") {
      if (!card.number || !card.expiry || !card.cvv || !card.name) { setError("Fill all card details."); return; }
    }
    setError(""); setProcessing(true);
    setTimeout(() => { setProcessing(false); onSuccess(generateTxnId()); }, 2200);
  };

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 16px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", padding: "12px 0", marginBottom: 16, fontSize: 14 }}>← Back to Cart</button>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Checkout</h2>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 24 }}>Amount: <span style={{ color: "#fff", fontWeight: 700 }}>₹{total.toLocaleString()}</span> for {cart.length} service{cart.length > 1 ? "s" : ""}</p>

      <div style={{ display: "flex", gap: 0, background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: 4, marginBottom: 24 }}>
        {["upi", "card"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "10px", background: tab === t ? "rgba(99,102,241,0.9)" : "transparent", border: "none", borderRadius: 9, color: tab === t ? "#fff" : "rgba(255,255,255,0.5)", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s" }}>
            {t === "upi" ? "🏦 UPI" : "💳 Card"}
          </button>
        ))}
      </div>

      {tab === "upi" && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: 20, display: "inline-block", marginBottom: 12 }}>
              <svg width="120" height="120" viewBox="0 0 120 120">
                {Array.from({ length: 100 }).map((_, i) => (
                  Math.random() > 0.5 ? <rect key={i} x={(i % 10) * 12} y={Math.floor(i / 10) * 12} width="10" height="10" fill="#000" rx="1" /> : null
                ))}
                <rect x="30" y="30" width="60" height="60" fill="#fff" />
                <text x="60" y="57" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#6366f1">UPI</text>
                <text x="60" y="68" textAnchor="middle" fontSize="6" fill="#000">PAY</text>
                <text x="60" y="79" textAnchor="middle" fontSize="6" fill="#000">₹{total.toLocaleString()}</text>
              </svg>
            </div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Scan with any UPI app · PhonePe · GPay · Paytm</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>or enter UPI ID</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
          </div>
          <input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi" style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, color: "#fff", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
        </div>
      )}

      {tab === "card" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Card Number</label>
            <input value={card.number} onChange={e => setCard({ ...card, number: e.target.value.replace(/\D/g, "").slice(0, 16) })} placeholder="1234 5678 9012 3456" style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, color: "#fff", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Expiry</label>
              <input value={card.expiry} onChange={e => setCard({ ...card, expiry: e.target.value })} placeholder="MM/YY" style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, color: "#fff", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>CVV</label>
              <input value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value.slice(0, 3) })} placeholder="•••" type="password" style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, color: "#fff", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Name on Card</label>
            <input value={card.name} onChange={e => setCard({ ...card, name: e.target.value })} placeholder="Priya Sharma" style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, color: "#fff", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
          </div>
        </div>
      )}

      {error && <p style={{ color: "#ef4444", fontSize: 13, margin: "12px 0 0" }}>{error}</p>}
      <button onClick={handlePay} disabled={processing}
        style={{ width: "100%", padding: 16, marginTop: 24, background: processing ? "rgba(99,102,241,0.5)" : "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", borderRadius: 14, color: "#fff", fontWeight: 800, fontSize: 16, cursor: processing ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
        {processing ? (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="9" strokeDasharray="28 56" style={{ animation: "spin 0.8s linear infinite", transformOrigin: "center" }} />
            </svg>
            Processing Payment...
          </>
        ) : `Pay ₹${total.toLocaleString()} Securely`}
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function SuccessPage({ txnId, lead, cart, onHome }) {
  const [waSent, setWaSent] = useState(false);
  useEffect(() => { setTimeout(() => setWaSent(true), 1500); }, []);
  const total = cart.reduce((s, c) => s + c.price, 0);

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 16px", textAlign: "center" }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 32 }}>✓</div>
      <h2 style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 8 }}>Payment Successful!</h2>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 32 }}>Your registration is being processed. We'll update you at every step.</p>

      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 24, marginBottom: 20, textAlign: "left" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>Transaction ID</span>
          <span style={{ color: "#6366f1", fontWeight: 800, fontSize: 14, fontFamily: "monospace" }}>{txnId}</span>
        </div>
        {[
          ["Customer", lead.name],
          ["Email", lead.email],
          ["Mobile", lead.phone],
          ["Services", cart.map(c => c.title).join(", ")],
          ["Amount Paid", `₹${total.toLocaleString()}`],
          ["Date", new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })]
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{k}</span>
            <span style={{ color: "#fff", fontSize: 13, fontWeight: 600, textAlign: "right", maxWidth: "60%" }}>{v}</span>
          </div>
        ))}
      </div>

      <div style={{ background: waSent ? "rgba(37,211,102,0.1)" : "rgba(255,255,255,0.05)", border: `1px solid ${waSent ? "rgba(37,211,102,0.3)" : "rgba(255,255,255,0.1)"}`, borderRadius: 12, padding: "14px 20px", marginBottom: 24, display: "flex", gap: 12, alignItems: "center", transition: "all 0.5s", textAlign: "left" }}>
        <span style={{ fontSize: 24 }}>💬</span>
        <div>
          <p style={{ margin: 0, fontWeight: 700, color: waSent ? "#25d366" : "rgba(255,255,255,0.7)", fontSize: 14, transition: "color 0.5s" }}>
            {waSent ? "WhatsApp Notification Sent!" : "Sending WhatsApp notification..."}
          </p>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Receipt & details sent to +91 {lead.phone}</p>
        </div>
      </div>

      <button onClick={onHome} style={{ width: "100%", padding: 14, background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.4)", borderRadius: 12, color: "#6366f1", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
        ← Back to Home
      </button>
    </div>
  );
}

function AdminPanel({ requests, services, onAddService, onDeleteService, onEditService, onBack }) {
  const [view, setView] = useState("leads");
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editSvc, setEditSvc] = useState(null);
  const [form, setForm] = useState({ title: "", category: "Incorporation", description: "", price: "" });

  const filtered = requests.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase()) ||
    r.service.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveService = () => {
    if (!form.title || !form.description || !form.price) return;
    if (editSvc) { onEditService({ ...editSvc, ...form, price: parseInt(form.price) }); setEditSvc(null); }
    else { onAddService({ ...form, price: parseInt(form.price), id: Date.now(), icon: "🏛️", tagline: form.description.slice(0, 50), steps: [], badge: null, duration: "TBD", color: "#6366f1" }); }
    setForm({ title: "", category: "Incorporation", description: "", price: "" }); setShowAddForm(false);
  };

  const startEdit = (s) => { setEditSvc(s); setForm({ title: s.title, category: s.category, description: s.description, price: s.price }); setShowAddForm(true); };

  const statusColor = { Paid: "#10b981", Pending: "#f59e0b", Failed: "#ef4444" };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: 0, fontSize: 13, marginBottom: 8, display: "block" }}>← Back to Portal</button>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: "#fff" }}>Admin Panel</h2>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["leads", "services"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding: "8px 18px", background: view === v ? "rgba(99,102,241,0.9)" : "rgba(255,255,255,0.06)", border: "none", borderRadius: 10, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", textTransform: "capitalize" }}>{v}</button>
          ))}
        </div>
      </div>

      {view === "leads" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
            {[
              { label: "Total Leads", value: requests.length, color: "#6366f1" },
              { label: "Paid", value: requests.filter(r => r.status === "Paid").length, color: "#10b981" },
              { label: "Pending", value: requests.filter(r => r.status === "Pending").length, color: "#f59e0b" },
              { label: "Revenue", value: "₹" + requests.filter(r => r.status === "Paid").reduce((s, r) => s + r.amount, 0).toLocaleString(), color: "#8b5cf6" }
            ].map(m => (
              <div key={m.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px 16px" }}>
                <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{m.label}</p>
                <p style={{ margin: "6px 0 0", fontSize: 22, fontWeight: 800, color: m.color }}>{m.value}</p>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads..." style={{ flex: 1, padding: "10px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none" }} />
            <button onClick={() => exportCSV(filtered)} style={{ padding: "10px 20px", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10, color: "#10b981", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              ↓ Export CSV
            </button>
          </div>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    {["Txn ID", "Name", "Email", "Phone", "Service", "Amount", "Status", "Date"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "rgba(255,255,255,0.4)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={r.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                      <td style={{ padding: "12px 16px", color: "#6366f1", fontFamily: "monospace", fontWeight: 700, whiteSpace: "nowrap" }}>{r.id}</td>
                      <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 600 }}>{r.name}</td>
                      <td style={{ padding: "12px 16px", color: "rgba(255,255,255,0.6)" }}>{r.email}</td>
                      <td style={{ padding: "12px 16px", color: "rgba(255,255,255,0.6)" }}>{r.phone}</td>
                      <td style={{ padding: "12px 16px", color: "rgba(255,255,255,0.7)", whiteSpace: "nowrap" }}>{r.service}</td>
                      <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 700 }}>₹{r.amount.toLocaleString()}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ background: (statusColor[r.status] || "#888") + "22", color: statusColor[r.status] || "#888", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{r.status}</span>
                      </td>
                      <td style={{ padding: "12px 16px", color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap" }}>{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {view === "services" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: 14 }}>{services.length} services in catalog</p>
            <button onClick={() => { setEditSvc(null); setForm({ title: "", category: "Incorporation", description: "", price: "" }); setShowAddForm(!showAddForm); }}
              style={{ padding: "10px 20px", background: "rgba(99,102,241,0.9)", border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              + Add Service
            </button>
          </div>
          {showAddForm && (
            <div style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 14, padding: 24, marginBottom: 20 }}>
              <h4 style={{ margin: "0 0 16px", color: "#fff", fontWeight: 800 }}>{editSvc ? "Edit Service" : "New Service"}</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                {[
                  { label: "Title", key: "title", ph: "e.g. GST Registration" },
                  { label: "Price (₹)", key: "price", ph: "e.g. 1499", type: "number" }
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6 }}>{f.label}</label>
                    <input value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.ph} type={f.type || "text"} style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6 }}>Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none" }}>
                  {["Incorporation", "GST", "MSME", "Trademark"].map(c => <option key={c} value={c} style={{ background: "#1a1a1a" }}>{c}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6 }}>Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the service..." rows={3} style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={handleSaveService} style={{ padding: "10px 20px", background: "#6366f1", border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Save Service</button>
                <button onClick={() => { setShowAddForm(false); setEditSvc(null); }} style={{ padding: "10px 20px", background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 10, color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {services.map(s => (
              <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px 20px" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ fontSize: 24 }}>{s.icon}</span>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, color: "#fff", fontSize: 15 }}>{s.title}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{s.category} · {s.duration}</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontWeight: 800, color: "#fff", fontSize: 16 }}>₹{s.price.toLocaleString()}</span>
                  <button onClick={() => startEdit(s)} style={{ padding: "6px 14px", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 8, color: "#6366f1", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Edit</button>
                  <button onClick={() => onDeleteService(s.id)} style={{ padding: "6px 14px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, color: "#ef4444", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [services, setServices] = useState(SERVICES);
  const [requests, setRequests] = useState(INIT_REQUESTS);
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [lead, setLead] = useState(null);
  const [leadModal, setLeadModal] = useState(null);
  const [detailModal, setDetailModal] = useState(null);
  const [txnId, setTxnId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const filtered = services.filter(s => category === "All" || s.category === category);

  const handleInterested = (service) => {
    if (cart.some(c => c.id === service.id)) { setPage("cart"); return; }
    setLeadModal(service);
  };

  const handleLeadSuccess = (leadData) => {
    setLead(leadData);
    setCart(prev => prev.some(c => c.id === leadModal.id) ? prev : [...prev, leadModal]);
    setLeadModal(null);
    setPage("cart");
  };

  const handlePaymentSuccess = (id) => {
    setTxnId(id);
    const newRequest = {
      id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      service: cart.map(c => c.title).join(", "),
      amount: cart.reduce((s, c) => s + c.price, 0),
      status: "Paid",
      date: new Date().toISOString().split("T")[0]
    };
    setRequests(prev => [newRequest, ...prev]);
    setPage("success");
  };

  const handleHome = () => { setPage("home"); setCart([]); setLead(null); setTxnId(""); };

  const navItems = [
    { label: "Services", page: "home" },
    { label: "Cart" + (cart.length ? ` (${cart.length})` : ""), page: "cart", disabled: !lead },
    { label: "Admin", action: () => setIsAdmin(!isAdmin) },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif", color: "#fff" }}>
      <style>{`
        * { box-sizing: border-box; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.25); }
        select option { background: #1a1a1a; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        .fade-in { animation: fadeInUp 0.4s ease both; }
      `}</style>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(10,10,10,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={handleHome}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚖</div>
            <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.02em" }}>LegalEase<span style={{ color: "#6366f1" }}>.</span>in</span>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {navItems.map(n => (
              <button key={n.label} onClick={() => { n.action ? n.action() : (!n.disabled && setPage(n.page)); }}
                style={{ padding: "7px 16px", background: (isAdmin && n.label === "Admin") || page === n.page ? "rgba(99,102,241,0.2)" : "transparent", border: "none", borderRadius: 8, color: n.disabled ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.75)", fontWeight: 600, fontSize: 13, cursor: n.disabled ? "not-allowed" : "pointer", transition: "all 0.15s" }}>
                {n.label === "Admin" && isAdmin ? "✕ Admin" : n.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ADMIN OVERLAY */}
      {isAdmin && (
        <div style={{ background: "#0a0a0a", padding: "32px 24px", minHeight: "calc(100vh - 60px)" }}>
          <AdminPanel
            requests={requests}
            services={services}
            onAddService={s => setServices(prev => [...prev, s])}
            onDeleteService={id => setServices(prev => prev.filter(s => s.id !== id))}
            onEditService={updated => setServices(prev => prev.map(s => s.id === updated.id ? updated : s))}
            onBack={() => setIsAdmin(false)}
          />
        </div>
      )}

      {/* MAIN CONTENT */}
      {!isAdmin && (
        <main style={{ padding: "40px 24px 80px" }}>
          {/* HOME */}
          {page === "home" && (
            <div className="fade-in">
              {/* HERO */}
              <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 56px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 20, padding: "6px 16px", marginBottom: 24, fontSize: 12, fontWeight: 700, color: "#a5b4fc", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  🇮🇳 100% Online · MCA Registered Experts
                </div>
                <h1 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 900, margin: "0 0 16px", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
                  Make Your Business<br />
                  <span style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    Official
                  </span>
                </h1>
                <p style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: "0 auto", maxWidth: 480 }}>
                  Register your company, get GST, MSME, and protect your trademark — all in one place. Trusted by 50,000+ businesses.
                </p>
              </div>

              {/* STATS */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, maxWidth: 600, margin: "0 auto 48px" }}>
                {[["50,000+", "Businesses Registered"], ["₹299 Cr+", "Taxes Filed"], ["4.9★", "Customer Rating"]].map(([v, l]) => (
                  <div key={l} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px", textAlign: "center" }}>
                    <p style={{ margin: 0, fontWeight: 900, fontSize: 20, color: "#fff" }}>{v}</p>
                    <p style={{ margin: "4px 0 0", fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{l}</p>
                  </div>
                ))}
              </div>

              {/* CATEGORY FILTER */}
              <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 36 }}>
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setCategory(c)}
                    style={{ padding: "8px 20px", background: category === c ? "rgba(99,102,241,0.9)" : "rgba(255,255,255,0.06)", border: `1px solid ${category === c ? "transparent" : "rgba(255,255,255,0.1)"}`, borderRadius: 20, color: category === c ? "#fff" : "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}>
                    {c}
                  </button>
                ))}
              </div>

              {/* SERVICE GRID */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, maxWidth: 1100, margin: "0 auto" }}>
                {filtered.map(s => (
                  <ServiceCard key={s.id} service={s} onInterested={handleInterested} onDetail={svc => setDetailModal(svc)} />
                ))}
              </div>
            </div>
          )}

          {/* CART */}
          {page === "cart" && (
            <div className="fade-in">
              <CartPage cart={cart} lead={lead || { name: "Guest", email: "", phone: "" }} onRemove={id => setCart(prev => prev.filter(c => c.id !== id))} onCheckout={() => setPage("payment")} onBack={() => setPage("home")} />
            </div>
          )}

          {/* PAYMENT */}
          {page === "payment" && (
            <div className="fade-in">
              <PaymentPage cart={cart} lead={lead} onSuccess={handlePaymentSuccess} onBack={() => setPage("cart")} />
            </div>
          )}

          {/* SUCCESS */}
          {page === "success" && (
            <div className="fade-in">
              <SuccessPage txnId={txnId} lead={lead} cart={cart} onHome={handleHome} />
            </div>
          )}
        </main>
      )}

      {/* MODALS */}
      {leadModal && <LeadModal service={leadModal} onClose={() => setLeadModal(null)} onSuccess={handleLeadSuccess} />}
      {detailModal && <ServiceDetailModal service={detailModal} onClose={() => setDetailModal(null)} onInterested={handleInterested} />}
    </div>
  );
}
