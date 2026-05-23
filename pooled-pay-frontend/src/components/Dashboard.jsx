
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── ICONS (inline SVG — no extra dep) ──────────────────────────
const Icon = {
  ShoppingBag: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
  Layers:      (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  Cpu:         (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>,
  Truck:       (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  Activity:    (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  User:        (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Users:       (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  LogOut:      (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Check:       (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  CheckCircle: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  XCircle:     (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  Star:        (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  TrendDown:   (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>,
  PlusCircle:  (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  Refresh:     (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>,
  CreditCard:  (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  Zap:         (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Shield:      (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  BarChart:    (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  Package:     (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  Wallet:      (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V22H4a2 2 0 01-2-2V6a2 2 0 012-2h16v4"/><path d="M22 12H18a2 2 0 000 4h4V12z"/></svg>,
  ArrowUp:     (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
  ArrowDown:   (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
};

function SI(C, size=18, color) {
  return <C width={size} height={size} style={{ color, flexShrink: 0 }} />;
}

// ─── JWT DECODE ──────────────────────────────────────────────────
function decodeJwt(token) {
  try {
    const b64 = token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/');
    return JSON.parse(decodeURIComponent(atob(b64).split('').map(c=>'%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)).join('')));
  } catch { return null; }
}

// ─── MOCK DATA ───────────────────────────────────────────────────
const MOCK_PRODUCTS = [
  { id: 1, name: 'Paracetamol 500mg (Pack of 100)', category: 'Pharma', originalPrice: 240, groupPrice: 168, stock: 5000 },
  { id: 2, name: 'Dettol Antiseptic Liquid 500ml', category: 'FMCG', originalPrice: 185, groupPrice: 130, stock: 2000 },
  { id: 3, name: 'Azithromycin 250mg (Pack of 10)', category: 'Pharma', originalPrice: 320, groupPrice: 210, stock: 1500 },
  { id: 4, name: 'ORS Electrolyte Sachets (Box/20)', category: 'Pharma', originalPrice: 140, groupPrice: 95, stock: 8000 },
  { id: 5, name: 'Lifebuoy Soap Bar (12 pack)', category: 'FMCG', originalPrice: 280, groupPrice: 195, stock: 3000 },
  { id: 6, name: 'Cetirizine 10mg (Strip of 10)', category: 'Pharma', originalPrice: 55, groupPrice: 38, stock: 6000 },
];

const MOCK_POOLS = [
  { id: 101, productId: 1, status: 'ACTIVE', participantsCount: 7, deliveryStatus: null, createdAt: new Date(Date.now()-3600000*2).toISOString(), supplierId: null },
  { id: 102, productId: 3, status: 'SUPPLIER_ASSIGNED', participantsCount: 12, deliveryStatus: 'PREPARING', createdAt: new Date(Date.now()-3600000*18).toISOString(), supplierId: 201 },
  { id: 103, productId: 5, status: 'DELIVERED', participantsCount: 9, deliveryStatus: 'DELIVERED', createdAt: new Date(Date.now()-3600000*48).toISOString(), supplierId: 203 },
];

const MOCK_SUPPLIERS = [
  { id: 201, name: 'PharmaCorp India', category: 'Pharma', rating: 4.8, activeOrdersCount: 2, capacity: 50 },
  { id: 202, name: 'Global BioPharma', category: 'Pharma', rating: 4.5, activeOrdersCount: 0, capacity: 30 },
  { id: 203, name: 'Apex FMCG Distributors', category: 'FMCG', rating: 4.9, activeOrdersCount: 4, capacity: 80 },
  { id: 204, name: 'Medix Wholesale', category: 'Pharma', rating: 4.7, activeOrdersCount: 1, capacity: 40 },
];

const INITIAL_CASHFLOW = [
  { type: 'INFLOW', description: 'Weekly Pharmacy Sales', amount: 52000, date: '2 days ago' },
  { type: 'OUTFLOW', description: 'Monthly Supplier Payment', amount: 15000, date: '5 days ago' },
  { type: 'INFLOW', description: 'OTC Counter Revenue', amount: 18000, date: '1 week ago' },
  { type: 'OUTFLOW', description: 'Staff Salaries', amount: 22000, date: '1 week ago' },
];

// ─── HELPERS ─────────────────────────────────────────────────────
const statusColor = {
  ACTIVE:            { bg: 'rgba(6,182,212,0.12)',   c: '#22d3ee', border: 'rgba(6,182,212,0.25)' },
  CLOSED:            { bg: 'rgba(124,58,237,0.12)',  c: '#a78bfa', border: 'rgba(124,58,237,0.25)' },
  SUPPLIER_ASSIGNED: { bg: 'rgba(245,158,11,0.12)',  c: '#fbbf24', border: 'rgba(245,158,11,0.25)' },
  DELIVERED:         { bg: 'rgba(16,185,129,0.12)',  c: '#34d399', border: 'rgba(16,185,129,0.25)' },
  PREPARING:         { bg: 'rgba(245,158,11,0.12)',  c: '#fbbf24', border: 'rgba(245,158,11,0.25)' },
  SHIPPED:           { bg: 'rgba(6,182,212,0.12)',   c: '#22d3ee', border: 'rgba(6,182,212,0.25)' },
};

function StatusBadge({ status }) {
  const s = statusColor[status] || statusColor.ACTIVE;
  const icons = { ACTIVE:'🟢', CLOSED:'🔒', SUPPLIER_ASSIGNED:'🚚', DELIVERED:'✅', PREPARING:'⚙️', SHIPPED:'📦' };
  return (
    <span style={{ background: s.bg, color: s.c, border: `1px solid ${s.border}`, padding: '3px 10px', borderRadius: '20px', fontSize: '0.74rem', fontWeight: '700', letterSpacing: '0.04em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <span style={{ fontSize: '0.7rem' }}>{icons[status] || '•'}</span> {status?.replace('_', ' ')}
    </span>
  );
}

function savePct(orig, grp) { return Math.round((1 - grp / orig) * 100); }

// ─── LIVE TICKER ─────────────────────────────────────────────────
function LiveTicker() {
  const items = ['💊 Paracetamol pool closed — 7 retailers saved ₹504 each', '🚚 Dettol batch shipped from PharmaCorp', '📈 New pool forming for Azithromycin — join now!', '✅ ORS Electrolytes delivered to 12 retailers', '🏆 Total savings generated this week: ₹38,420'];
  const txt = items.join('   ·   ');
  return (
    <div style={{ background: 'rgba(124,58,237,0.08)', borderBottom: '1px solid rgba(124,58,237,0.15)', padding: '7px 0', overflow: 'hidden', position: 'relative' }}>
      <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'ticker 28s linear infinite' }}>
        <span style={{ fontSize: '0.78rem', color: '#c4b5fd', paddingRight: '60px' }}>{txt}</span>
        <span style={{ fontSize: '0.78rem', color: '#c4b5fd', paddingRight: '60px' }}>{txt}</span>
      </div>
    </div>
  );
}

// ─── ORDER STEPPER ───────────────────────────────────────────────
function OrderStepper({ pool }) {
  const steps = [
    { label: 'Order Placed', done: true },
    { label: 'Pool Active',  done: pool.status !== 'ACTIVE' || true },
    { label: 'Supplier Assigned', done: pool.status === 'SUPPLIER_ASSIGNED' || pool.status === 'DELIVERED' },
    { label: 'Delivered',   done: pool.deliveryStatus === 'DELIVERED' || pool.status === 'DELIVERED' },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0', padding: '16px 0', position: 'relative' }}>
      {/* connector line */}
      <div style={{ position: 'absolute', top: '26px', left: '14px', right: '14px', height: '2px', background: 'rgba(255,255,255,0.06)', zIndex: 0 }} />
      {steps.map((s, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: '8px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: s.done ? 'linear-gradient(135deg, #10b981, #34d399)' : 'rgba(255,255,255,0.05)',
            border: s.done ? 'none' : '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: s.done ? '#000' : '#64748b',
            boxShadow: s.done ? '0 0 12px rgba(16,185,129,0.4)' : 'none',
            transition: 'all 0.4s ease',
          }}>
            {s.done ? SI(Icon.Check, 14) : <span style={{ fontSize: '0.7rem', fontWeight: '700' }}>{i+1}</span>}
          </div>
          <span style={{ fontSize: '0.72rem', textAlign: 'center', color: s.done ? 'var(--text-sub)' : 'var(--text-muted)', fontWeight: s.done ? '600' : '400', lineHeight: 1.3 }}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── CHECKOUT MODAL ──────────────────────────────────────────────
function CheckoutModal({ product, token, onClose, onSuccess }) {
  const [qty, setQty]             = useState(5);
  const [method, setMethod]       = useState('UPI');
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);

  const total    = product.groupPrice * qty;
  const original = product.originalPrice * qty;
  const saved    = original - total;

  const execute = async (succeed) => {
    if (!succeed) { setResult({ ok: false }); return; }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/pools/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ userId: localStorage.getItem('userId') || 1, productId: product.id, quantity: qty }),
        signal: AbortSignal.timeout(3000),
      });
      if (!res.ok) throw new Error();
    } catch { /* demo mode — proceed anyway */ }
    setLoading(false);
    setResult({ ok: true, total, saved, pct: savePct(product.originalPrice, product.groupPrice) });
    onSuccess({ productId: product.id, outflow: total });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px', backdropFilter: 'blur(6px)' }}>
      <div className="glass-intense animate-fade-in-scale" style={{ width: '100%', maxWidth: '500px', padding: '36px 32px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '4px' }}>Checkout Simulator</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{product.name}</p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', color: 'var(--text-muted)', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
        </div>

        {!result ? (
          <>
            {/* Qty + price */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>Quantity</label>
                <input type="number" min={1} value={qty} onChange={e=>setQty(Math.max(1,+e.target.value))} className="input-field" />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>Group Price / Unit</label>
                <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--success)', paddingTop: '10px' }}>₹{product.groupPrice}</div>
              </div>
            </div>

            {/* Bill summary */}
            <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                <span>MRP (individual)</span>
                <span style={{ textDecoration: 'line-through', color: 'var(--danger)' }}>₹{original}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: '600', marginBottom: '8px' }}>
                <span>Pooled Price</span>
                <span style={{ color: 'var(--success)' }}>₹{total}</span>
              </div>
              <div style={{ borderTop: '1px dashed rgba(255,255,255,0.06)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: '700', color: 'var(--accent)' }}>
                <span>🎉 Your Savings</span>
                <span>₹{saved} ({savePct(product.originalPrice, product.groupPrice)}% OFF)</span>
              </div>
            </div>

            {/* Payment method */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '10px' }}>Payment Mode</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { key: 'UPI',  icon: '⚡', label: 'Instant UPI',  sub: 'Scan & pay now' },
                  { key: 'BNPL', icon: '🕐', label: 'BNPL Credit', sub: 'Pay in 15 days' },
                ].map(m => (
                  <button key={m.key} onClick={() => setMethod(m.key)}
                    style={{
                      padding: '14px', border: `1px solid ${method===m.key ? 'rgba(6,182,212,0.5)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-sm)', background: method===m.key ? 'rgba(6,182,212,0.08)' : 'rgba(0,0,0,0.2)',
                      cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                      boxShadow: method===m.key ? '0 0 0 2px rgba(6,182,212,0.15)' : 'none',
                    }}>
                    <div style={{ fontSize: '1.3rem', marginBottom: '4px' }}>{m.icon}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: method===m.key ? 'var(--accent)' : 'var(--text-main)' }}>{m.label}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{m.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* UPI QR */}
            {method === 'UPI' && (
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '14px', marginBottom: '20px' }}>
                <div style={{ background: '#fff', padding: '8px', borderRadius: '8px', flexShrink: 0 }}>
                  <div style={{ width: '72px', height: '72px', background: 'repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 50% / 12px 12px', borderRadius: '3px' }} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '4px' }}>pooledpay@yesbank</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>Scan with PhonePe, GPay, Paytm or any UPI app. ₹{total} split collected from all pool participants.</div>
                </div>
              </div>
            )}
            {method === 'BNPL' && (
              <div style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 'var(--radius-sm)', padding: '14px', marginBottom: '20px', fontSize: '0.85rem', color: 'var(--accent)' }}>
                🕐 <strong>BNPL Enabled</strong> — Pay ₹{total} within 15 days of delivery. Powered by Pooled Pay Credit Engine. Zero interest for on-time payment.
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px' }}>
              <button onClick={() => execute(true)} disabled={loading} className="btn btn-accent btn-full">
                {loading ? '⏳ Processing…' : `✓ Simulate Success  ₹${total}`}
              </button>
              <button onClick={() => execute(false)} className="btn btn-danger" style={{ padding: '10px 16px' }}>✗ Fail</button>
            </div>
          </>
        ) : (
          <div className="animate-fade-in" style={{ textAlign: 'center', padding: '20px 0' }}>
            {result.ok ? (
              <>
                <div style={{ fontSize: '4rem', marginBottom: '16px', animation: 'float 2s ease-in-out infinite' }}>🎉</div>
                <h3 style={{ color: 'var(--success)', fontSize: '1.3rem', fontWeight: '800', marginBottom: '8px' }}>Payment Successful!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px', lineHeight: 1.6 }}>
                  Pool order confirmed. You paid <strong style={{ color: 'var(--text-main)' }}>₹{result.total}</strong> and saved <strong style={{ color: 'var(--success)' }}>₹{result.saved}</strong> ({result.pct}%) through Pooled Pay group buying.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ background: 'var(--success-soft)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--success)' }}>₹{result.saved}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Saved vs MRP</div>
                  </div>
                  <div style={{ background: 'var(--accent-soft)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent)' }}>{result.pct}%</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Discount</div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>❌</div>
                <h3 style={{ color: 'var(--danger)', fontSize: '1.3rem', fontWeight: '800', marginBottom: '8px' }}>Payment Failed</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>UPI transaction was rejected. Please retry or switch to BNPL credit.</p>
              </>
            )}
            <button onClick={onClose} className="btn btn-outline btn-full">Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ADD PRODUCT FORM (SUPPLIER) ─────────────────────────────────
function AddProductForm({ token, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '', category: 'Pharma', description: '', unit: 'kg',
    basePrice: '', groupPrice: '', totalStockQuantity: '',
    minOrderQuantity: '', availableQuantity: '', deliveryTimeEstimate: '', batchSize: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const uid = localStorage.getItem('userId');
      const payload = { 
        ...formData, 
        basePrice: +formData.basePrice, 
        groupPrice: +formData.groupPrice,
        totalStockQuantity: +formData.totalStockQuantity,
        minOrderQuantity: +formData.minOrderQuantity,
        availableQuantity: +formData.availableQuantity,
        batchSize: +formData.batchSize || 0,
        deliveryTimeEstimate: formData.deliveryTimeEstimate || null,
        supplierId: uid ? Number(uid) : 1
      };
      console.log('[AddProduct] Submitting payload:', JSON.stringify(payload));
      const res = await fetch('http://localhost:8080/api/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const saved = await res.json();
        console.log('[AddProduct] Saved:', saved);
        onSuccess(saved);
      } else {
        const errText = await res.text();
        console.error('[AddProduct] Server error:', res.status, errText);
        setError(`Server error (${res.status}): ${errText.slice(0, 200)}`);
      }
    } catch (err) {
      console.error('[AddProduct] Network error:', err);
      setError('Could not reach the backend server. Is it running on port 8080?');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>Add New Product Batch</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div><label className="text-muted" style={{ fontSize: '0.8rem' }}>Product Name</label><input required className="input-field" name="name" onChange={handleChange} /></div>
        <div><label className="text-muted" style={{ fontSize: '0.8rem' }}>Category</label><select className="input-field" name="category" onChange={handleChange}><option>Pharma</option><option>FMCG</option><option>Grocery</option></select></div>
        <div><label className="text-muted" style={{ fontSize: '0.8rem' }}>Description</label><input className="input-field" name="description" onChange={handleChange} /></div>
        <div><label className="text-muted" style={{ fontSize: '0.8rem' }}>Unit (e.g. kg, liters, strips)</label><input required className="input-field" name="unit" onChange={handleChange} /></div>
        <div><label className="text-muted" style={{ fontSize: '0.8rem' }}>Individual Base Price (₹)</label><input required type="number" className="input-field" name="basePrice" onChange={handleChange} /></div>
        <div><label className="text-muted" style={{ fontSize: '0.8rem' }}>Pooled Group Price (₹)</label><input required type="number" className="input-field" name="groupPrice" onChange={handleChange} /></div>
        <div><label className="text-muted" style={{ fontSize: '0.8rem' }}>Total Stock Quantity</label><input required type="number" className="input-field" name="totalStockQuantity" onChange={handleChange} /></div>
        <div><label className="text-muted" style={{ fontSize: '0.8rem' }}>Min Order Quantity</label><input required type="number" className="input-field" name="minOrderQuantity" onChange={handleChange} /></div>
        <div><label className="text-muted" style={{ fontSize: '0.8rem' }}>Available Quantity</label><input required type="number" className="input-field" name="availableQuantity" onChange={handleChange} /></div>
        <div><label className="text-muted" style={{ fontSize: '0.8rem' }}>Delivery Time Estimate (days)</label><input className="input-field" name="deliveryTimeEstimate" onChange={handleChange} /></div>
        <div><label className="text-muted" style={{ fontSize: '0.8rem' }}>Batch Size</label><input type="number" className="input-field" name="batchSize" onChange={handleChange} /></div>
      </div>
      <button type="submit" disabled={loading} className="btn btn-accent" style={{ marginTop: '10px' }}>{loading ? 'Saving...' : 'Publish Product'}</button>
      {error && (
        <div style={{ marginTop: '8px', padding: '12px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', fontSize: '0.84rem', lineHeight: 1.5 }}>
          ⚠️ {error}
        </div>
      )}
    </form>
  );
}

// ─── SUPPLIER ASSIGNMENT MODAL ───────────────────────────────────
function AssignModal({ pool, suppliers, onAssign, onClose }) {
  const product = MOCK_PRODUCTS.find(p => p.id === pool.productId) || {};
  const reqCat  = product.category || 'Pharma';

  const score = (sup) => {
    let s = 100;
    if (sup.category.toLowerCase() !== reqCat.toLowerCase()) s -= 40;
    s -= sup.activeOrdersCount * 8;
    s += (sup.rating - 4.5) * 20;
    if (sup.capacity < 40) s -= 10;
    return Math.max(0, Math.min(100, Math.round(s)));
  };

  const ranked = [...suppliers].map(s => ({ ...s, score: score(s) })).sort((a,b) => b.score - a.score);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px', backdropFilter: 'blur(6px)' }}>
      <div className="glass-intense animate-fade-in-scale" style={{ width: '100%', maxWidth: '580px', padding: '36px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '4px' }}>Supplier Assignment Optimizer</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Algorithmic matching · Pool #{pool.id} · {reqCat} category</p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', color: 'var(--text-muted)', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
        </div>

        {/* Scoring legend */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px', marginBottom: '20px' }}>
          {[
            { factor: 'Category Match', pts: '+60' },
            { factor: 'Low Busyness',   pts: '+up to 40' },
            { factor: 'High Rating',    pts: '+up to 10' },
            { factor: 'High Capacity',  pts: '+10' },
          ].map(f => (
            <div key={f.factor} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '2px' }}>{f.factor}</div>
              <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--accent)' }}>{f.pts}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {ranked.map((sup, i) => {
            const sc = sup.score;
            const clr = sc > 75 ? 'var(--success)' : sc > 50 ? 'var(--warning)' : 'var(--danger)';
            return (
              <div key={sup.id} className="animate-fade-in" style={{ animationDelay: `${i*60}ms`, display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: i===0 ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.01)', border: `1px solid ${i===0 ? 'rgba(16,185,129,0.15)' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)' }}>
                <div style={{ minWidth: '28px', height: '28px', borderRadius: '50%', background: i===0 ? 'var(--success)' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '800', color: i===0 ? '#000' : 'var(--text-muted)' }}>
                  #{i+1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {sup.name}
                    <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', padding: '1px 6px', borderRadius: '4px' }}>{sup.category}</span>
                    {i===0 && <span style={{ fontSize: '0.7rem', background: 'var(--success-soft)', color: 'var(--success)', padding: '1px 7px', borderRadius: '4px', fontWeight: '700' }}>BEST MATCH</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '14px', marginTop: '4px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span>⭐ {sup.rating}</span>
                    <span>📦 {sup.activeOrdersCount} active orders</span>
                    <span>🏭 Cap: {sup.capacity}</span>
                  </div>
                  {/* Score bar */}
                  <div style={{ marginTop: '8px', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${sc}%`, background: `linear-gradient(to right, ${clr}, ${clr}aa)`, borderRadius: '2px', transition: 'width 0.8s ease' }} />
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: '800', color: clr }}>{sc}%</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>match score</div>
                  <button onClick={() => onAssign(pool.id, sup.id, sup.name)} className={`btn btn-sm ${sc > 75 ? 'btn-accent' : 'btn-outline'}`} style={{ marginTop: '8px' }}>
                    Assign
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── AI COPILOT PANEL ────────────────────────────────────────────
function AiCopilot() {
  const [events, setEvents]   = useState(INITIAL_CASHFLOW);
  const [gstDue, setGstDue]   = useState(12000);
  const [simAmt, setSimAmt]   = useState('');
  const [simType, setSimType] = useState('INFLOW');
  const [simDesc, setSimDesc] = useState('');
  const [tab, setTab]         = useState('analysis');

  const inflows   = events.filter(e=>e.type==='INFLOW').reduce((s,e)=>s+e.amount,0);
  const outflows  = events.filter(e=>e.type==='OUTFLOW').reduce((s,e)=>s+e.amount,0) + gstDue;
  const net       = inflows - outflows;
  const ratio     = outflows / Math.max(inflows, 1);

  const risk = ratio > 1 ? 'HIGH' : ratio > 0.7 ? 'MEDIUM' : 'LOW';
  const riskColor = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#10b981' }[risk];
  const riskGlow  = { HIGH: 'rgba(239,68,68,0.3)', MEDIUM: 'rgba(245,158,11,0.3)', LOW: 'rgba(16,185,129,0.3)' }[risk];

  const analysis = {
    HIGH:   { reason: `Outflows (₹${outflows.toLocaleString()}) exceed inflows by ₹${Math.abs(net).toLocaleString()}. Critical cash crunch imminent.`, suggestion: 'Halt individual purchases. Join Pooled Pay pools immediately to reduce costs by 18–30%.', pred: 'Cash shortage in 5–7 days if corrective action not taken.' },
    MEDIUM: { reason: `Liabilities are high vs inflows. Safety margin thin at ${Math.round((1-ratio)*100)}%.`, suggestion: 'Switch upcoming procurement to group pools. Use BNPL to defer payment by 15 days.', pred: 'Potential stress in 10–14 days if sales soften.' },
    LOW:    { reason: `Strong position. Inflows exceed liabilities by ₹${net.toLocaleString()}.`, suggestion: 'Continue pool ordering to maximise savings. Consider pre-paying GST to avoid penalties.', pred: 'Cash flow stable for 30+ days.' },
  }[risk];

  const addEvent = (e) => {
    e.preventDefault();
    if (!simAmt || !simDesc) return;
    setEvents(prev => [{ type: simType, description: simDesc, amount: +simAmt, date: 'Just simulated' }, ...prev]);
    setSimAmt(''); setSimDesc('');
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '6px' }}>AI Cashflow Copilot <span style={{ fontSize: '0.8rem', background: 'var(--primary-soft)', color: '#a78bfa', padding: '3px 10px', borderRadius: '20px', verticalAlign: 'middle', fontWeight: '600' }}>BETA</span></h1>
        <p style={{ color: 'var(--text-muted)' }}>Real-time cashflow intelligence & procurement risk scoring for your pharmacy.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px' }}>

        {/* Risk Gauge */}
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '20px', alignSelf: 'flex-start', display:'flex', alignItems:'center', gap:'8px' }}>
            {SI(Icon.Shield, 18, riskColor)} Risk Assessment
          </h3>

          {/* Ring gauge */}
          <div style={{
            width: '160px', height: '160px', borderRadius: '50%',
            border: `10px solid rgba(255,255,255,0.04)`,
            borderTop: `10px solid ${riskColor}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 30px ${riskGlow}, inset 0 0 20px rgba(0,0,0,0.3)`,
            animation: 'spin-slow 8s linear infinite',
            margin: '10px 0 20px',
          }}>
            <div style={{ animation: 'spin-slow 8s linear infinite reverse', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '2rem', fontWeight: '900', color: riskColor }}>{risk}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>RISK LEVEL</span>
            </div>
          </div>

          {/* Key metrics */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Total Inflows',  val: `+₹${inflows.toLocaleString()}`,  c: 'var(--success)' },
              { label: 'Total Outflows', val: `-₹${outflows.toLocaleString()}`, c: 'var(--danger)' },
              { label: 'Net Position',   val: `${net>=0?'+':''}₹${net.toLocaleString()}`, c: net>=0 ? 'var(--success)' : 'var(--danger)' },
              { label: 'GST Due',        val: `₹${gstDue.toLocaleString()}`,    c: 'var(--warning)' },
            ].map(m => (
              <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.84rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{m.label}</span>
                <span style={{ fontWeight: '700', color: m.c, fontFamily: 'JetBrains Mono, monospace' }}>{m.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {/* Analysis cards */}
          {[
            { title: '🔍 Reasoning', text: analysis.reason,      c: riskColor },
            { title: '💡 Recommendation', text: analysis.suggestion, c: 'var(--accent)' },
            { title: '📅 14-day Prediction', text: analysis.pred, c: 'var(--primary)' },
          ].map(c => (
            <div key={c.title} className="glass-panel" style={{ padding: '18px 20px', borderLeft: `3px solid ${c.c}` }}>
              <div style={{ fontWeight: '700', fontSize: '0.88rem', marginBottom: '6px' }}>{c.title}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{c.text}</div>
            </div>
          ))}

          {/* GST adjuster */}
          <div className="glass-panel" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>Upcoming GST Liability</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Due in 5 days · Adjust to simulate</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>₹</span>
                <input type="number" value={gstDue} onChange={e=>setGstDue(+e.target.value)} className="input-field" style={{ width: '120px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '700' }} />
              </div>
            </div>
          </div>

          {/* Simulate event */}
          <div className="glass-panel" style={{ padding: '18px 20px' }}>
            <h4 style={{ fontWeight: '700', fontSize: '0.92rem', marginBottom: '12px' }}>➕ Simulate Cashflow Event</h4>
            <form onSubmit={addEvent} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <select value={simType} onChange={e=>setSimType(e.target.value)} className="input-field" style={{ flex: '0 0 120px' }}>
                <option value="INFLOW">+ Inflow</option>
                <option value="OUTFLOW">− Outflow</option>
              </select>
              <input type="text" placeholder="Description" value={simDesc} onChange={e=>setSimDesc(e.target.value)} className="input-field" style={{ flex: 1, minWidth: '140px' }} required />
              <input type="number" placeholder="Amount ₹" value={simAmt} onChange={e=>setSimAmt(e.target.value)} className="input-field" style={{ flex: '0 0 120px' }} required />
              <button type="submit" className="btn btn-accent">Add Event</button>
            </form>
          </div>

          {/* Ledger */}
          <div className="glass-panel" style={{ padding: '18px 20px', flex: 1 }}>
            <h4 style={{ fontWeight: '700', fontSize: '0.92rem', marginBottom: '12px' }}>📒 Cashflow Ledger</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
              {events.map((e, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.015)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.84rem' }}>
                  <div>
                    <div style={{ fontWeight: '600' }}>{e.description}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{e.date}</div>
                  </div>
                  <span style={{ fontWeight: '800', color: e.type==='INFLOW' ? 'var(--success)' : 'var(--danger)', fontFamily: 'JetBrains Mono, monospace' }}>
                    {e.type==='INFLOW' ? '+' : '−'}₹{e.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ── MAIN DASHBOARD ─────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════
export default function Dashboard() {
  const [token, setToken]         = useState(localStorage.getItem('token') || '');
  const [user, setUser]           = useState({ username: '', role: '' });
  const [activeTab, setActiveTab] = useState('');
  const navigate = useNavigate();

  const [products, setProducts]     = useState(MOCK_PRODUCTS);
  const [myProducts, setMyProducts] = useState([]);   // Supplier's own products
  const [pools, setPools]           = useState(MOCK_POOLS);
  const [suppliers]                 = useState(MOCK_SUPPLIERS);
  const [loading, setLoading]       = useState(false);
  const [toast, setToast]           = useState('');
  const [editingProduct, setEditingProduct] = useState(null); // product being edited

  const [checkout, setCheckout]     = useState(null);   // { product }
  const [assignPool, setAssignPool] = useState(null);   // pool obj

  // ── Auth guard ─────────────────────────────────────────────────
  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    // Read role from localStorage first (set explicitly on login/signup)
    // Fall back to JWT decode for backward-compat with old sessions
    const storedRole = localStorage.getItem('userRole');
    const storedName = localStorage.getItem('username');
    if (storedRole && storedName) {
      setUser({ username: storedName, role: storedRole });
      setActiveTab(storedRole === 'SUPPLIER' ? 'my-products' : storedRole === 'ADMIN' ? 'admin' : 'marketplace');
      return;
    }
    const dec = decodeJwt(token);
    if (!dec) { localStorage.removeItem('token'); navigate('/login'); return; }
    const role = dec.role || 'RETAILER';
    setUser({ username: dec.sub || 'User', role });
    setActiveTab(role === 'SUPPLIER' ? 'my-products' : role === 'ADMIN' ? 'admin' : 'marketplace');
  }, [token]);

  // ── Data fetch (with mock fallback) ────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const uid = localStorage.getItem('userId') || '1';
      const storedRole = localStorage.getItem('userRole') || user.role;

      const [pRes, poolRes] = await Promise.all([
        fetch('http://localhost:8080/api/products', { signal: AbortSignal.timeout(3000) }),
        fetch('http://localhost:8080/api/pools', { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(3000) }),
      ]);
      if (pRes.ok) {
        const prodData = await pRes.json();
        if (prodData.length > 0) setProducts(prodData);
      }
      if (poolRes.ok) {
        const poolData = await poolRes.json();
        if (poolData.length > 0) setPools(poolData);
      }
      // Fetch supplier's own products
      if (storedRole === 'SUPPLIER') {
        const myRes = await fetch(`http://localhost:8080/api/products/supplier/${uid}`, { signal: AbortSignal.timeout(3000) });
        if (myRes.ok) setMyProducts(await myRes.json());
      }
    } catch { /* demo fallback */ }
    setLoading(false);
  }, [token, user.role]);

  useEffect(() => { if (token) fetchData(); }, [token]);

  // ── Toast ──────────────────────────────────────────────────────
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 4000); };

  // ── Handlers ───────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    setToken(''); navigate('/login');
  };

  const handleCheckoutSuccess = ({ productId, outflow }) => {
    const prod = products.find(p => p.id === productId);
    const newPool = { id: Date.now(), productId, status: 'ACTIVE', participantsCount: 1, deliveryStatus: null, createdAt: new Date().toISOString(), supplierId: null };
    setPools(prev => [newPool, ...prev]);
    showToast(`✅ Pool created for ${prod?.name}! Outflow of ₹${outflow} recorded.`);
  };

  const handleJoinPool = async (poolId, productName) => {
    try {
      await fetch(`http://localhost:8080/api/pools/join/${poolId}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(2000) });
    } catch { /* demo */ }
    setPools(prev => prev.map(p => p.id === poolId ? { ...p, participantsCount: p.participantsCount + 1 } : p));
    showToast(`🙌 Successfully joined pool for ${productName}!`);
  };

  const adminStatusUpdate = (poolId, status) => {
    setPools(prev => prev.map(p => p.id === poolId ? { ...p, status } : p));
    showToast(`⚡ Pool #${poolId} status → ${status}`);
  };

  const assignSupplier = (poolId, suppId, suppName) => {
    setPools(prev => prev.map(p => p.id === poolId ? { ...p, status: 'SUPPLIER_ASSIGNED', supplierId: suppId, deliveryStatus: 'PREPARING' } : p));
    setAssignPool(null);
    showToast(`🚚 "${suppName}" assigned to Pool #${poolId}!`);
  };

  const supplierStatusUpdate = (poolId, ds) => {
    setPools(prev => prev.map(p => p.id === poolId ? { ...p, deliveryStatus: ds, status: ds === 'DELIVERED' ? 'DELIVERED' : p.status } : p));
    showToast(`📦 Order status updated → ${ds}`);
  };

  // ── Sidebar nav items ──────────────────────────────────────────
  const navItems = {
    RETAILER: [
      { id: 'marketplace', icon: Icon.ShoppingBag, label: 'Browse Products' },
      { id: 'pools',       icon: Icon.Layers,      label: 'My Active Pools' },
      { id: 'ai',          icon: Icon.Cpu,         label: 'AI Copilot' },
    ],
    SUPPLIER: [
      { id: 'my-products',  icon: Icon.Package,    label: 'My Products' },
      { id: 'add-product',  icon: Icon.PlusCircle, label: 'Add Product' },
      { id: 'supplier',     icon: Icon.Truck,      label: 'Pool Orders' },
    ],
    ADMIN: [
      { id: 'admin', icon: Icon.Activity, label: 'Pool Lifecycle' },
    ],
  };

  const roleGradient = { RETAILER: '#7c3aed, #06b6d4', SUPPLIER: '#059669, #10b981', ADMIN: '#dc2626, #f59e0b' };

  // ─────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-root)', flexDirection: 'column' }}>
      <LiveTicker />

      <div style={{ display: 'flex', flex: 1 }}>
        {/* ── SIDEBAR ───────────────────────────────────────────── */}
        <div style={{ width: '250px', flexShrink: 0, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '24px 16px', background: 'rgba(255,255,255,0.008)', position: 'sticky', top: 0, height: '100vh' }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', paddingLeft: '6px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: `linear-gradient(135deg, ${roleGradient[user.role] || ''}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1rem', color: '#fff', boxShadow: '0 4px 12px rgba(124,58,237,0.4)', flexShrink: 0 }}>P</div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '1rem', lineHeight: 1 }}>Pooled Pay</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Fintech Platform</div>
            </div>
          </div>

          {/* User card */}
          <div style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `linear-gradient(135deg, ${roleGradient[user.role] || '#7c3aed, #06b6d4'})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.95rem', color: '#fff', flexShrink: 0 }}>
                {user.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.88rem', color: 'var(--text-main)' }}>{user.username}</div>
                <span className={`badge badge-${user.role==='RETAILER'?'accent':user.role==='SUPPLIER'?'success':'warning'}`} style={{ marginTop: '3px' }}>
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
            {(navItems[user.role] || []).map(item => {
              const active = activeTab === item.id;
              return (
                <button key={item.id} onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                    border: active ? '1px solid rgba(6,182,212,0.2)' : '1px solid transparent',
                    background: active ? 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))' : 'transparent',
                    color: active ? 'var(--text-main)' : 'var(--text-muted)',
                    cursor: 'pointer', fontWeight: active ? '600' : '500',
                    fontSize: '0.875rem', width: '100%', textAlign: 'left',
                    transition: 'all 0.2s',
                    boxShadow: active ? '0 0 0 1px rgba(6,182,212,0.1) inset' : 'none',
                  }}>
                  <item.icon width={16} height={16} style={{ color: active ? 'var(--accent)' : 'var(--text-muted)', flexShrink: 0 }} />
                  {item.label}
                  {active && <div style={{ marginLeft: 'auto', width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent)' }} />}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <button onClick={handleLogout} className="btn btn-ghost btn-full" style={{ gap: '8px', justifyContent: 'flex-start', marginTop: '8px' }}>
            <Icon.LogOut width={15} height={15} /> Logout
          </button>
        </div>

        {/* ── MAIN CONTENT ──────────────────────────────────────── */}
        <div style={{ flex: 1, padding: '36px 40px', overflowY: 'auto', maxHeight: '100vh' }}>

          {/* Toast */}
          {toast && (
            <div className="animate-slide-up" style={{ position: 'fixed', top: '20px', right: '24px', zIndex: 999, background: 'var(--success-soft)', border: '1px solid rgba(16,185,129,0.3)', color: 'var(--success)', padding: '14px 20px', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-lg)', fontSize: '0.88rem', fontWeight: '600', maxWidth: '380px', display: 'flex', alignItems: 'center', gap: '8px', backdropFilter: 'blur(12px)' }}>
              {SI(Icon.CheckCircle, 16)} {toast}
            </div>
          )}

          {/* ════ RETAILER: MARKETPLACE ════ */}
          {user.role === 'RETAILER' && activeTab === 'marketplace' && (
            <div className="animate-fade-in">
              <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '6px' }}>Retailer Sourcing Portal</h1>
                <p style={{ color: 'var(--text-muted)' }}>Browse wholesale batches. Join live pools to unlock group pricing up to 30% off MRP.</p>
              </div>

              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                  <Icon.Refresh width={28} height={28} style={{ color: 'var(--accent)', animation: 'spin 1s linear infinite' }} />
                </div>
              ) : products.length === 0 ? (
                <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛒</div>
                  <div style={{ fontWeight: '600', marginBottom: '6px' }}>No products listed yet</div>
                  <div style={{ fontSize: '0.85rem' }}>Suppliers haven’t added any products. Check back soon!</div>
                </div>
              ) : (
                <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                  {products.map(prod => {
                    const baseP = prod.basePrice || prod.originalPrice || 0;
                    const groupP = prod.groupPrice || 0;
                    const sp = savePct(baseP, groupP);
                    const saved = baseP - groupP;
                    const activePool = pools.find(p => p.productId === prod.id && p.status === 'ACTIVE');

                    return (
                      <div key={prod.id} className="glass-panel animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {/* Top row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span className={`badge badge-${prod.category==='Pharma'?'primary':prod.category==='FMCG'?'accent':'success'}`}>{prod.category}</span>
                          {activePool && <span className="badge badge-success">{SI(Icon.Users, 11)} {activePool.participantsCount} in pool</span>}
                        </div>

                        <div>
                          <h3 style={{ fontSize: '0.97rem', fontWeight: '700', color: 'var(--text-main)', lineHeight: 1.4, marginBottom: '4px' }}>{prod.name}</h3>
                          {prod.description && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{prod.description}</p>}
                        </div>

                        {/* Stock & delivery info */}
                        <div style={{ display: 'flex', gap: '12px', fontSize: '0.76rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                          {prod.availableQuantity != null && <span>📦 {prod.availableQuantity} {prod.unit || 'units'} available</span>}
                          {prod.minOrderQuantity != null && <span>📋 Min: {prod.minOrderQuantity} {prod.unit || 'units'}</span>}
                          {prod.deliveryTimeEstimate && <span>🕐 {prod.deliveryTimeEstimate} days</span>}
                        </div>

                        {/* Savings widget */}
                        <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '8px' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Individual MRP</span>
                            <span style={{ textDecoration: 'line-through', color: 'var(--danger)' }}>₹{baseP}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Pool Price</span>
                            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--success)' }}>₹{groupP}</span>
                          </div>
                          <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', marginBottom: '8px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${sp}%`, background: 'linear-gradient(to right, var(--success), #34d399)', borderRadius: '3px' }} />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: '700', color: 'var(--accent)' }}>
                            <span>You save</span>
                            <span>₹{saved} ({sp}% OFF)</span>
                          </div>
                        </div>

                        {/* CTA */}
                        {activePool ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <button onClick={() => setCheckout({ product: prod })} className="btn btn-accent btn-full">
                              {SI(Icon.Users, 15)} Join Active Pool ({activePool.participantsCount} already in)
                            </button>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)', padding: '0 2px' }}>
                              <span>📍 {activePool.location || 'Your area'}</span>
                              <span>Auto-closes at min. quantity</span>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => setCheckout({ product: prod })} className="btn btn-primary btn-full">
                            {SI(Icon.PlusCircle, 15)} Start Pool Order
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ════ RETAILER: ACTIVE POOLS ════ */}
          {user.role === 'RETAILER' && activeTab === 'pools' && (
            <div className="animate-fade-in">
              <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '6px' }}>Active Procurement Pools</h1>
                  <p style={{ color: 'var(--text-muted)' }}>Track live matching, supplier assignments, and delivery status.</p>
                </div>
                <button onClick={fetchData} className="btn btn-outline" style={{ gap: '6px' }}>
                  <Icon.Refresh width={14} height={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> Refresh
                </button>
              </div>

              {pools.length === 0 ? (
                <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛒</div>
                  <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '6px' }}>No pools yet</div>
                  <div style={{ fontSize: '0.85rem' }}>Visit the Sourcing portal to create or join a pool!</div>
                </div>
              ) : (
                <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {pools.map(pool => {
                    const prod = products.find(p => p.id === pool.productId) || { name: 'Unknown', basePrice: 0, groupPrice: 0 };
                    const baseP = prod.basePrice || prod.originalPrice || 0;
                    return (
                      <div key={pool.id} className="glass-panel animate-fade-in" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                          <div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '4px' }}>{prod.name}</h3>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              Pool #{pool.id} · {pool.location || 'Your area'} · Opened {new Date(pool.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <StatusBadge status={pool.status} />
                            {pool.deliveryStatus && <StatusBadge status={pool.deliveryStatus} />}
                          </div>
                        </div>

                        <OrderStepper pool={pool} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', fontSize: '0.84rem', color: 'var(--text-muted)', flexWrap: 'wrap', gap: '8px' }}>
                          <span>👥 <strong style={{ color: 'var(--accent)' }}>{pool.participantsCount} retailers</strong> joined · Qty: {pool.currentQuantity || 0}</span>
                          <span>💰 Pool Price: <strong style={{ color: 'var(--success)' }}>₹{prod.groupPrice}</strong> <span style={{ color: 'var(--accent)' }}>({savePct(baseP, prod.groupPrice)}% saved)</span></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ════ RETAILER: AI COPILOT ════ */}
          {user.role === 'RETAILER' && activeTab === 'ai' && <AiCopilot />}

          {/* ════ SUPPLIER PORTAL ════ */}
          {user.role === 'SUPPLIER' && activeTab === 'supplier' && (
            <div className="animate-fade-in">
              <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '6px' }}>Supplier Dashboard</h1>
                <p style={{ color: 'var(--text-muted)' }}>Manage assigned pool orders and update fulfillment status.</p>
              </div>

              {/* Supplier stats */}
              <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '28px' }}>
                {[
                  { label: 'Assigned Orders',   val: pools.length,  icon: Icon.Package, c: 'var(--accent)' },
                  { label: 'Delivered Today',    val: pools.filter(p=>p.deliveryStatus==='DELIVERED').length, icon: Icon.CheckCircle, c: 'var(--success)' },
                  { label: 'In Transit',         val: pools.filter(p=>p.deliveryStatus==='SHIPPED').length,   icon: Icon.Truck, c: 'var(--warning)' },
                ].map(s => (
                  <div key={s.label} className="stat-card animate-fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '10px' }}>
                      <span>{s.label}</span>
                      <s.icon width={16} height={16} style={{ color: s.c }} />
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: s.c }}>{s.val}</div>
                  </div>
                ))}
              </div>

              {pools.length === 0 ? (
                <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
                  <div>No orders assigned yet. Orders appear here once Admin completes matching.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {pools.map(pool => {
                    const prod = products.find(p => p.id === pool.productId) || { name: 'Unknown', groupPrice: 0 };
                    const total = prod.groupPrice * pool.participantsCount;
                    const ds = pool.deliveryStatus;
                    return (
                      <div key={pool.id} className="glass-panel animate-fade-in" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                          <div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '4px' }}>Pooled Batch: {prod.name}</h3>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Pool #{pool.id} · {pool.participantsCount} retailer batches</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--success)' }}>₹{total.toLocaleString()}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total order value</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', flexWrap: 'wrap', gap: '12px' }}>
                          <div style={{ fontSize: '0.88rem' }}>
                            Delivery Status: {ds ? <StatusBadge status={ds} /> : <span style={{ color: 'var(--text-muted)' }}>Pending Assignment</span>}
                          </div>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {!ds && (
                              <>
                                <button onClick={() => supplierStatusUpdate(pool.id, 'PREPARING')} className="btn btn-success btn-sm">✓ Accept Order</button>
                                <button className="btn btn-danger btn-sm">✗ Reject</button>
                              </>
                            )}
                            {ds === 'PREPARING' && <button onClick={() => supplierStatusUpdate(pool.id, 'SHIPPED')} className="btn btn-accent btn-sm">📦 Mark as Shipped</button>}
                            {ds === 'SHIPPED'   && <button onClick={() => supplierStatusUpdate(pool.id, 'DELIVERED')} className="btn btn-success btn-sm">✅ Mark as Delivered</button>}
                            {ds === 'DELIVERED' && <span style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: '600', display:'flex', alignItems:'center', gap:'4px' }}>{SI(Icon.CheckCircle, 14, 'var(--success)')} Fulfilled</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ════ SUPPLIER: MY PRODUCTS ════ */}
          {user.role === 'SUPPLIER' && activeTab === 'my-products' && (
            <div className="animate-fade-in">
              <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '6px' }}>My Products</h1>
                  <p style={{ color: 'var(--text-muted)' }}>All products you’ve listed. Retailers can see and pool these products.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={fetchData} className="btn btn-outline" style={{ gap: '6px' }}>
                    <Icon.Refresh width={14} height={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> Refresh
                  </button>
                  <button onClick={() => setActiveTab('add-product')} className="btn btn-accent" style={{ gap: '6px' }}>
                    {SI(Icon.PlusCircle, 14)} Add Product
                  </button>
                </div>
              </div>

              {myProducts.length === 0 ? (
                <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📦</div>
                  <div style={{ fontWeight: '600', marginBottom: '8px' }}>No products listed yet</div>
                  <div style={{ fontSize: '0.85rem', marginBottom: '20px' }}>Add your first product to make it available for retailers to pool orders.</div>
                  <button onClick={() => setActiveTab('add-product')} className="btn btn-accent">{SI(Icon.PlusCircle, 14)} Add Your First Product</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {myProducts.map(prod => {
                    const activePoolsForProduct = pools.filter(p => p.productId === prod.id && p.status === 'ACTIVE');
                    const totalPoolParticipants = activePoolsForProduct.reduce((s, p) => s + (p.participantsCount || 0), 0);
                    return (
                      <div key={prod.id} className="glass-panel animate-fade-in" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                              <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>{prod.name}</h3>
                              <span className={`badge badge-${prod.category==='Pharma'?'primary':prod.category==='FMCG'?'accent':'success'}`}>{prod.category}</span>
                              {activePoolsForProduct.length > 0 && (
                                <span className="badge badge-success">🔥 {activePoolsForProduct.length} active pool{activePoolsForProduct.length > 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                            {prod.description && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px', lineHeight: 1.5 }}>{prod.description}</p>}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
                              {[
                                { label: 'Base Price',     val: `₹${prod.basePrice}`,          icon: '🏷️' },
                                { label: 'Pool Price',     val: `₹${prod.groupPrice}`,         icon: '💰' },
                                { label: 'Min Qty',        val: `${prod.minOrderQuantity} ${prod.unit || 'units'}`, icon: '📋' },
                                { label: 'Available',      val: `${prod.availableQuantity} ${prod.unit || 'units'}`, icon: '📦' },
                                { label: 'Delivery',       val: prod.deliveryTimeEstimate ? `${prod.deliveryTimeEstimate} days` : 'N/A', icon: '🚚' },
                                { label: 'Pool Interest',  val: `${totalPoolParticipants} retailers`, icon: '👥' },
                              ].map(item => (
                                <div key={item.label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}>
                                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '3px' }}>{item.icon} {item.label}</div>
                                  <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-main)' }}>{item.val}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                            <button
                              onClick={async () => {
                                const newQty = prompt(`Update available quantity for "${prod.name}" (current: ${prod.availableQuantity}):`);
                                if (newQty === null || isNaN(+newQty)) return;
                                try {
                                  const res = await fetch(`http://localhost:8080/api/products/${prod.id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                                    body: JSON.stringify({ ...prod, availableQuantity: +newQty }),
                                  });
                                  if (res.ok) {
                                    const updated = await res.json();
                                    setMyProducts(prev => prev.map(p => p.id === prod.id ? updated : p));
                                    showToast('✅ Quantity updated!');
                                  }
                                } catch { showToast('✅ Updated (demo mode)'); setMyProducts(prev => prev.map(p => p.id === prod.id ? { ...p, availableQuantity: +newQty } : p)); }
                              }}
                              className="btn btn-outline btn-sm"
                              style={{ gap: '5px' }}
                            >
                              {SI(Icon.ArrowUp, 12)} Update Stock
                            </button>
                            <button
                              onClick={async () => {
                                if (!confirm(`Delete "${prod.name}"?`)) return;
                                try {
                                  await fetch(`http://localhost:8080/api/products/${prod.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
                                } catch {}
                                setMyProducts(prev => prev.filter(p => p.id !== prod.id));
                                setProducts(prev => prev.filter(p => p.id !== prod.id));
                                showToast('🗑️ Product removed');
                              }}
                              className="btn btn-danger btn-sm"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        {activePoolsForProduct.length > 0 && (
                          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--accent)', marginBottom: '10px' }}>Active Pools for this Product</div>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                              {activePoolsForProduct.map(pool => (
                                <div key={pool.id} style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 'var(--radius-sm)', padding: '8px 14px', fontSize: '0.8rem' }}>
                                  <span style={{ fontWeight: '600', color: 'var(--accent)' }}>Pool #{pool.id}</span>
                                  <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>{pool.participantsCount} retailers · Qty {pool.currentQuantity}/{prod.minOrderQuantity}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ════ SUPPLIER: ADD PRODUCT ════ */}
          {user.role === 'SUPPLIER' && activeTab === 'add-product' && (
            <div className="animate-fade-in">
              <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '6px' }}>Add Product</h1>
                <p style={{ color: 'var(--text-muted)' }}>List your wholesale products for retailers to pool.</p>
              </div>
              <AddProductForm token={token} onSuccess={(p) => {
                setProducts(prev => [p, ...prev]);
                setMyProducts(prev => [p, ...prev]);
                showToast('✅ Product published! Retailers can now see and pool it.');
                setActiveTab('my-products');
              }} />
            </div>
          )}

          {/* ════ ADMIN PORTAL ════ */}
          {user.role === 'ADMIN' && activeTab === 'admin' && (
            <div className="animate-fade-in">
              <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '6px' }}>Admin Central Command</h1>
                <p style={{ color: 'var(--text-muted)' }}>Full lifecycle control — close pools, run algorithmic supplier matching, confirm deliveries.</p>
              </div>

              {/* KPI stat cards */}
              <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '32px' }}>
                {[
                  { label: 'Total Retailers',   val: 24,        sub: '+3 this week',  icon: Icon.Users,     c: 'var(--accent)' },
                  { label: 'Active Pools',       val: pools.filter(p=>p.status==='ACTIVE').length, sub: 'Awaiting closure', icon: Icon.Activity, c: 'var(--primary)' },
                  { label: 'Registered Suppliers', val: suppliers.length, sub: '2 online now', icon: Icon.Truck, c: 'var(--warning)' },
                  { label: 'Total Savings Generated', val: '₹38.4K', sub: 'This month', icon: Icon.BarChart, c: 'var(--success)' },
                ].map(s => (
                  <div key={s.label} className="stat-card animate-fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>{s.label}</span>
                      <s.icon width={16} height={16} style={{ color: s.c }} />
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: s.c, lineHeight: 1 }}>{s.val}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Lifecycle panel */}
              <div className="glass-panel" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Pool Lifecycle State Management</h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--border)' }}>
                    {pools.length} pools total
                  </span>
                </div>

                {pools.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No pools in the system yet.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {pools.map(pool => {
                      const prod = products.find(p => p.id === pool.productId) || { name: 'Unknown', category: 'Pharma' };
                      return (
                        <div key={pool.id} className="animate-fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'rgba(255,255,255,0.015)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', flexWrap: 'wrap', gap: '12px' }}>
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '0.92rem', marginBottom: '4px' }}>{prod.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                              <span>Pool #{pool.id}</span>
                              <StatusBadge status={pool.status} />
                              {pool.deliveryStatus && <StatusBadge status={pool.deliveryStatus} />}
                              <span>👥 {pool.participantsCount} retailers</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {pool.status === 'ACTIVE' && (
                              <button onClick={() => adminStatusUpdate(pool.id, 'CLOSED')} className="btn btn-outline btn-sm" style={{ borderColor: 'rgba(124,58,237,0.4)', color: '#a78bfa' }}>
                                🔒 Close Pool
                              </button>
                            )}
                            {pool.status === 'CLOSED' && (
                              <button onClick={() => setAssignPool(pool)} className="btn btn-accent btn-sm">
                                🤖 Assign Supplier
                              </button>
                            )}
                            {pool.status === 'SUPPLIER_ASSIGNED' && pool.deliveryStatus === 'DELIVERED' && (
                              <button onClick={() => adminStatusUpdate(pool.id, 'DELIVERED')} className="btn btn-success btn-sm">
                                ✅ Confirm Delivery
                              </button>
                            )}
                            {pool.status === 'DELIVERED' && (
                              <span style={{ color: 'var(--success)', fontSize: '0.82rem', fontWeight: '700', display:'flex', alignItems:'center', gap:'4px' }}>
                                {SI(Icon.CheckCircle, 14, 'var(--success)')} FULFILLED
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Suppliers table */}
              <div className="glass-panel" style={{ padding: '28px', marginTop: '24px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '18px' }}>Registered Suppliers</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
                  {suppliers.map(sup => (
                    <div key={sup.id} className="animate-fade-in" style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '6px' }}>{sup.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <span className={`badge badge-${sup.category==='Pharma'?'primary':'accent'}`}>{sup.category}</span>
                        <span>⭐ {sup.rating}</span>
                        <span>📦 {sup.activeOrdersCount} active</span>
                        <span>🏭 Cap: {sup.capacity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>{/* /main */}
      </div>{/* /flex */}

      {/* ── MODALS ────────────────────────────────────────────────── */}
      {checkout && (
        <CheckoutModal
          product={checkout.product}
          token={token}
          onClose={() => setCheckout(null)}
          onSuccess={(data) => { setCheckout(null); handleCheckoutSuccess(data); }}
        />
      )}
      {assignPool && (
        <AssignModal
          pool={assignPool}
          suppliers={suppliers}
          onAssign={assignSupplier}
          onClose={() => setAssignPool(null)}
        />
      )}
    </div>
  );
}


