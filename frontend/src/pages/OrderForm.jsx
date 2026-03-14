import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const WHATSAPP_NUMBER = "918870969828"; // ← Replace with your number

const buildMsg = (cart, form, grandTotal, shipping) =>
  encodeURIComponent(
    `🌿 *New Order — HanBamboo*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `👤 *Customer*\n` +
    `  Name:  ${form.name}\n` +
    `  Phone: +91 ${form.phone}\n` +
    `  Email: ${form.email || "—"}\n\n` +
    `📦 *Delivery Address*\n` +
    `  ${form.address}\n` +
    `  ${form.city}, ${form.state} — ${form.pincode}\n\n` +
    `🛒 *Items*\n` +
    cart.map((i) => `  • ${i.name} ×${i.qty} = ₹${i.price * i.qty}`).join("\n") +
    `\n\n━━━━━━━━━━━━━━━━━━━━\n` +
    `  Shipping: ${shipping === 0 ? "FREE 🎉" : `₹${shipping}`}\n` +
    `  *TOTAL: ₹${grandTotal}*\n\n` +
    (form.note ? `📝 Note: ${form.note}\n\n` : "") +
    `Please confirm. Thank you! 🙏`
  );

const EMPTY = { name: "", phone: "", email: "", address: "", city: "", state: "", pincode: "", note: "" };

const OrderForm = () => {
  const { cart, cartCount, subtotal, shipping, grandTotal, savings, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm]           = useState(EMPTY);
  const [errors, setErrors]       = useState({});
  const [done, setDone]           = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false); // mobile collapsible
  const [orderRef]                = useState(`HB-${Math.floor(100000 + Math.random() * 900000)}`);

  // ── Validation ────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Required";
    if (!form.phone.trim())   e.phone   = "Required";
    else if (!/^\d{10}$/.test(form.phone.trim())) e.phone = "Enter valid 10-digit number";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim())    e.city    = "Required";
    if (!form.state.trim())   e.state   = "Required";
    if (!form.pincode.trim()) e.pincode = "Required";
    else if (!/^\d{6}$/.test(form.pincode.trim())) e.pincode = "6-digit PIN";
    return e;
  };

  const change = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const submit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${buildMsg(cart, form, grandTotal, shipping)}`, "_blank");
    clearCart();
    setDone(true);
  };

  // ── Empty cart ────────────────────────────────────────────
  if (cartCount === 0 && !done) {
    return (
      <>
        <style>{CSS}</style>
        <div className="of-empty">
          <div style={{ fontSize: 60 }}>🛒</div>
          <h2 className="of-empty-title">Your cart is empty</h2>
          <Link to="/shop" className="of-wa-btn" style={{ textDecoration: "none", display: "inline-block", marginTop: 8 }}>
            Browse Products →
          </Link>
        </div>
      </>
    );
  }

  // ── Success screen ────────────────────────────────────────
  if (done) {
    return (
      <>
        <style>{CSS}</style>
        <div className="of-success">
          <div className="of-success-check">✓</div>
          <h2 className="of-success-title">Order Sent!</h2>
          <p className="of-success-sub">
            Your order is sent via WhatsApp. We'll confirm within 2 hours.
          </p>
          <div className="of-ref-box">
            <div className="of-ref-lbl">Order Reference</div>
            <div className="of-ref-num">{orderRef}</div>
          </div>
          <button className="of-wa-btn" onClick={() => navigate("/shop")}>
            Continue Shopping →
          </button>
        </div>
      </>
    );
  }

  // ── Main form ─────────────────────────────────────────────
  return (
    <>
      <style>{CSS}</style>

      {/* Breadcrumb */}
      <div className="of-bc-bar">
        <div className="container of-bc">
          <Link to="/" className="of-bc-link">Home</Link>
          <span className="of-bc-sep">›</span>
          <Link to="/cart" className="of-bc-link">Cart</Link>
          <span className="of-bc-sep">›</span>
          <span className="of-bc-cur">Place Order</span>
        </div>
      </div>

      {/* ── MOBILE: Collapsible order summary at top ── */}
      <div className="of-mobile-summary">
        <button className="of-summary-toggle" onClick={() => setSummaryOpen(!summaryOpen)}>
          <span>🛒 {cartCount} item{cartCount !== 1 ? "s" : ""}</span>
          <span className="of-toggle-total">
            ₹{grandTotal}
            <span className="of-toggle-arrow">{summaryOpen ? "▲" : "▼"}</span>
          </span>
        </button>

        {summaryOpen && (
          <div className="of-mobile-summary-body">
            {cart.map((i) => (
              <div key={i._id} className="of-sum-row">
                <div className="of-sum-info">
                  <img src={i.image} alt={i.name} className="of-sum-thumb" />
                  <div>
                    <div className="of-sum-name">{i.name}</div>
                    <div className="of-sum-qty">Qty: {i.qty}</div>
                  </div>
                </div>
                <span className="of-sum-price">₹{i.price * i.qty}</span>
              </div>
            ))}
            <div className="of-sum-divider" />
            <div className="of-sum-line"><span>Subtotal</span><span>₹{subtotal}</span></div>
            <div className="of-sum-line">
              <span>Shipping</span>
              <span className={shipping === 0 ? "of-free" : ""}>{shipping === 0 ? "FREE 🎉" : `₹${shipping}`}</span>
            </div>
            {savings > 0 && <div className="of-sum-line of-green"><span>You save</span><span>−₹{savings}</span></div>}
            <div className="of-sum-total"><span>Total</span><span className="of-total-amt">₹{grandTotal}</span></div>
          </div>
        )}
      </div>

      {/* ── Page title ── */}
      <div className="of-hdr">
        <div className="container">
          <p className="of-eyebrow">Last Step</p>
          <h1 className="of-title">Delivery <em>Details</em></h1>
          <p className="of-sub">Fill your details below — your order opens in WhatsApp, just tap Send!</p>
        </div>
      </div>

      <div className="container of-layout">

        {/* ════════ FORM COLUMN ════════ */}
        <form onSubmit={submit} noValidate className="of-form">

          {/* Contact */}
          <div className="of-card">
            <h3 className="of-card-title">👤 Contact Information</h3>

            <div className="of-field">
              <label className="of-label">Full Name <span className="of-req">*</span></label>
              <input className={`of-input ${errors.name ? "of-err-inp" : ""}`}
                name="name" value={form.name} onChange={change} placeholder="Priya Sharma" />
              {errors.name && <span className="of-err">{errors.name}</span>}
            </div>

            <div className="of-field">
              <label className="of-label">Phone Number <span className="of-req">*</span></label>
              <div className="of-phone-row">
                <span className="of-phone-pre">🇮🇳 +91</span>
                <input className={`of-input of-phone-inp ${errors.phone ? "of-err-inp" : ""}`}
                  name="phone" value={form.phone} onChange={change}
                  placeholder="10-digit mobile" type="tel" maxLength={10} />
              </div>
              {errors.phone && <span className="of-err">{errors.phone}</span>}
            </div>

            <div className="of-field">
              <label className="of-label">Email <span className="of-opt">(optional)</span></label>
              <input className="of-input" name="email" value={form.email}
                onChange={change} placeholder="email@example.com" type="email" />
            </div>
          </div>

          {/* Address */}
          <div className="of-card">
            <h3 className="of-card-title">📦 Delivery Address</h3>

            <div className="of-field">
              <label className="of-label">Street Address <span className="of-req">*</span></label>
              <input className={`of-input ${errors.address ? "of-err-inp" : ""}`}
                name="address" value={form.address} onChange={change}
                placeholder="House no., Street, Locality, Landmark" />
              {errors.address && <span className="of-err">{errors.address}</span>}
            </div>

            <div className="of-row2">
              <div className="of-field">
                <label className="of-label">City <span className="of-req">*</span></label>
                <input className={`of-input ${errors.city ? "of-err-inp" : ""}`}
                  name="city" value={form.city} onChange={change} placeholder="Mumbai" />
                {errors.city && <span className="of-err">{errors.city}</span>}
              </div>
              <div className="of-field">
                <label className="of-label">State <span className="of-req">*</span></label>
                <input className={`of-input ${errors.state ? "of-err-inp" : ""}`}
                  name="state" value={form.state} onChange={change} placeholder="Maharashtra" />
                {errors.state && <span className="of-err">{errors.state}</span>}
              </div>
            </div>

            <div className="of-field of-pin-field">
              <label className="of-label">Pincode <span className="of-req">*</span></label>
              <input className={`of-input ${errors.pincode ? "of-err-inp" : ""}`}
                name="pincode" value={form.pincode} onChange={change}
                placeholder="6-digit PIN" type="tel" maxLength={6} />
              {errors.pincode && <span className="of-err">{errors.pincode}</span>}
            </div>
          </div>

          {/* Note */}
          <div className="of-card">
            <h3 className="of-card-title">📝 Special Instructions <span className="of-opt">(optional)</span></h3>
            <textarea className="of-textarea" name="note" value={form.note} onChange={change}
              placeholder="Gift wrap? Colour preference? Delivery time?…" rows={3} />
          </div>

          {/* Steps info — visible on mobile above button */}
          <div className="of-steps-mobile">
            {["We receive your WhatsApp order", "We confirm & share payment link", "Pay via UPI / COD", "Dispatched in 2 business days 🚀"].map((s, i) => (
              <div key={i} className="of-step">
                <div className="of-step-num">{i + 1}</div>
                <span className="of-step-txt">{s}</span>
              </div>
            ))}
          </div>

          {/* Submit */}
          <button type="submit" className="of-wa-btn">
            💬 Send Order via WhatsApp
          </button>
          <p className="of-wa-hint">WhatsApp opens with your order pre-filled. Just tap Send!</p>
        </form>

        {/* ════════ STICKY SIDEBAR (desktop only) ════════ */}
        <div className="of-sidebar">

          {/* Order summary */}
          <div className="of-summary-box">
            <h3 className="of-sum-title">Your Order</h3>
            <div className="of-sum-body">
              {cart.map((i) => (
                <div key={i._id} className="of-sum-row">
                  <div className="of-sum-info">
                    <img src={i.image} alt={i.name} className="of-sum-thumb" />
                    <div>
                      <div className="of-sum-name">{i.name}</div>
                      <div className="of-sum-qty">Qty: {i.qty}</div>
                    </div>
                  </div>
                  <span className="of-sum-price">₹{i.price * i.qty}</span>
                </div>
              ))}
              <div className="of-sum-divider" />
              <div className="of-sum-line"><span>Subtotal</span><span>₹{subtotal}</span></div>
              <div className="of-sum-line">
                <span>Shipping</span>
                <span className={shipping === 0 ? "of-free" : ""}>{shipping === 0 ? "FREE 🎉" : `₹${shipping}`}</span>
              </div>
              {savings > 0 && <div className="of-sum-line of-green"><span>You save</span><span>−₹{savings}</span></div>}
              <div className="of-sum-total"><span>Total</span><span className="of-total-amt">₹{grandTotal}</span></div>
            </div>
          </div>

          {/* What happens next */}
          <div className="of-steps-box">
            <h4 className="of-steps-title">What happens next?</h4>
            {["We receive your WhatsApp order", "We confirm & share payment link", "Pay via UPI / COD", "Dispatched in 2 business days 🚀"].map((s, i) => (
              <div key={i} className="of-step">
                <div className="of-step-num">{i + 1}</div>
                <span className="of-step-txt">{s}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

const CSS = `
  /* Breadcrumb */
  .of-bc-bar { background:#FFF0E0; border-bottom:1px solid #E8D5B7; padding:10px 0; }
  .of-bc { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
  .of-bc-link { font-size:13px; font-weight:600; color:#7A6652; text-decoration:none; }
  .of-bc-link:hover { color:#C84B31; }
  .of-bc-sep { color:#bbb; font-size:13px; }
  .of-bc-cur { font-size:13px; font-weight:700; color:#C84B31; }

  /* ── MOBILE SUMMARY TOGGLE ── */
  .of-mobile-summary {
    background:#1B4332; display:none;
  }
  .of-summary-toggle {
    width:100%; display:flex; align-items:center; justify-content:space-between;
    padding:14px 20px; background:none; border:none; cursor:pointer;
    color:#FDF6EC; font-family:'Nunito',sans-serif; font-size:15px; font-weight:700;
  }
  .of-toggle-total { display:flex; align-items:center; gap:8px; font-size:17px; font-weight:800; color:#E8A44A; }
  .of-toggle-arrow { font-size:12px; color:#9DC4A8; }
  .of-mobile-summary-body { background:#FFF8EF; padding:16px 20px; }

  /* Page header */
  .of-hdr { background:#FFF8EF; border-bottom:2px solid #E8D5B7; padding:22px 0 16px; }
  .of-eyebrow { font-size:11px; letter-spacing:4px; color:#C84B31; text-transform:uppercase; font-weight:800; margin-bottom:5px; }
  .of-title { font-family:'Playfair Display',serif; font-size:clamp(1.4rem,3vw,2rem); color:#1B4332; margin-bottom:5px; }
  .of-title em { color:#E8A44A; font-style:italic; }
  .of-sub { font-size:13px; color:#7A6652; line-height:1.7; }

  /* Layout */
  .of-layout { padding-top:24px; padding-bottom:80px; display:grid; grid-template-columns:1fr 300px; gap:24px; align-items:start; }

  /* Form */
  .of-form { display:flex; flex-direction:column; gap:16px; }
  .of-card { background:#fff; border-radius:14px; padding:20px; box-shadow:0 2px 14px rgba(44,24,16,.07); }
  .of-card-title { font-size:15px; font-weight:800; color:#1B4332; margin-bottom:16px; }

  /* Fields */
  .of-field { display:flex; flex-direction:column; gap:5px; margin-bottom:14px; }
  .of-field:last-child { margin-bottom:0; }
  .of-label { font-size:13px; font-weight:700; color:#1B4332; }
  .of-req { color:#C84B31; }
  .of-opt { font-size:11px; color:#B0A090; font-weight:400; }
  .of-input {
    padding:12px 14px; border:2px solid #E8D5B7; border-radius:12px;
    font-family:'Nunito',sans-serif; font-size:14px; color:#2C1810;
    background:#FFFBF5; outline:none; transition:border-color .2s;
    width:100%;
  }
  .of-input:focus { border-color:#E8A44A; box-shadow:0 0 0 3px rgba(232,164,74,.12); }
  .of-err-inp { border-color:#C84B31 !important; background:#FFF5F5; }
  .of-err { font-size:12px; color:#C84B31; font-weight:600; }

  /* Phone */
  .of-phone-row { display:flex; }
  .of-phone-pre {
    background:#F5F0E8; border:2px solid #E8D5B7; border-right:none;
    border-radius:12px 0 0 12px; padding:12px 12px; font-size:13px; font-weight:700; color:#1B4332;
    display:flex; align-items:center; white-space:nowrap;
  }
  .of-phone-inp { border-radius:0 12px 12px 0 !important; }

  /* 2 col row */
  .of-row2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .of-pin-field { max-width:180px; }

  /* Textarea */
  .of-textarea {
    padding:12px 14px; border:2px solid #E8D5B7; border-radius:12px;
    font-family:'Nunito',sans-serif; font-size:14px; color:#2C1810;
    background:#FFFBF5; outline:none; resize:vertical; width:100%;
    transition:border-color .2s;
  }
  .of-textarea:focus { border-color:#E8A44A; }

  /* Steps on mobile */
  .of-steps-mobile {
    background:#F0FFF4; border:1px solid #C8E6C9; border-radius:14px; padding:16px;
    display:none;
  }

  /* Submit button */
  .of-wa-btn {
    width:100%; background:#25D366; color:#fff; border:none;
    padding:16px; border-radius:50px; font-family:'Nunito',sans-serif;
    font-weight:800; font-size:16px; cursor:pointer;
    box-shadow:0 4px 18px rgba(37,211,102,.4); transition:all .2s;
    display:flex; align-items:center; justify-content:center; gap:8px;
  }
  .of-wa-btn:hover { background:#20B558; transform:translateY(-1px); }
  .of-wa-hint { font-size:12px; color:#B0A090; text-align:center; margin-top:8px; line-height:1.6; }

  /* ── SIDEBAR ── */
  .of-sidebar { position:sticky; top:80px; display:flex; flex-direction:column; gap:14px; }

  /* Summary box */
  .of-summary-box { background:#fff; border-radius:14px; box-shadow:0 4px 20px rgba(44,24,16,.09); overflow:hidden; }
  .of-sum-title { font-family:'Playfair Display',serif; font-size:16px; background:#1B4332; color:#FDF6EC; padding:14px 18px; margin:0; }
  .of-sum-body  { padding:14px 18px; }
  .of-sum-row   { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:12px; }
  .of-sum-info  { display:flex; align-items:center; gap:9px; flex:1; min-width:0; }
  .of-sum-thumb { width:38px; height:38px; border-radius:8px; object-fit:cover; flex-shrink:0; }
  .of-sum-name  { font-size:12px; font-weight:700; color:#1B4332; line-height:1.3; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:110px; }
  .of-sum-qty   { font-size:11px; color:#B0A090; }
  .of-sum-price { font-size:13px; font-weight:800; color:#C84B31; white-space:nowrap; }
  .of-sum-divider { height:1px; background:#F0E8D8; margin:8px 0; }
  .of-sum-line  { display:flex; justify-content:space-between; font-size:13px; color:#7A6652; font-weight:600; margin-bottom:7px; }
  .of-free  { color:#2D6A4F !important; font-weight:700; }
  .of-green { color:#2D6A4F !important; }
  .of-sum-total { display:flex; justify-content:space-between; align-items:center; border-top:2px solid #F0E8D8; padding-top:10px; margin-top:4px; font-weight:700; color:#1B4332; }
  .of-total-amt { font-size:22px; font-weight:800; color:#C84B31; }

  /* Steps box */
  .of-steps-box { background:#F0FFF4; border:1px solid #C8E6C9; border-radius:14px; padding:16px; }
  .of-steps-title { font-size:13px; font-weight:800; color:#1B4332; margin-bottom:12px; }
  .of-step { display:flex; align-items:flex-start; gap:10px; margin-bottom:10px; }
  .of-step:last-child { margin-bottom:0; }
  .of-step-num { width:22px; height:22px; border-radius:50%; background:#2D6A4F; color:#fff; font-size:11px; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; }
  .of-step-txt { font-size:12px; color:#3D6B42; line-height:1.5; }

  /* Empty */
  .of-empty { min-height:65vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; padding:40px 20px; text-align:center; }
  .of-empty-title { font-family:'Playfair Display',serif; font-size:24px; color:#1B4332; }

  /* Success */
  .of-success { min-height:72vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; padding:40px 20px; text-align:center; }
  .of-success-check { width:76px; height:76px; border-radius:50%; background:linear-gradient(135deg,#2D6A4F,#1B4332); color:#fff; font-size:34px; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 28px rgba(45,106,79,.4); }
  .of-success-title { font-family:'Playfair Display',serif; font-size:28px; color:#1B4332; }
  .of-success-sub { font-size:14px; color:#7A6652; line-height:1.8; max-width:380px; }
  .of-ref-box { background:#F5F0E8; border-radius:12px; padding:14px 28px; }
  .of-ref-lbl { font-size:11px; color:#7A6652; margin-bottom:4px; }
  .of-ref-num { font-size:22px; font-weight:800; color:#1B4332; }

  /* ── RESPONSIVE ── */
  @media (max-width:820px) {
    .of-layout { grid-template-columns:1fr; }
    .of-sidebar { display:none; }           /* hidden — replaced by mobile toggle */
    .of-mobile-summary { display:block; }   /* show collapsible summary */
    .of-steps-mobile { display:block; }     /* show steps above button */
    .of-pin-field { max-width:100%; }
  }
  @media (max-width:480px) {
    .of-card { padding:16px 14px; }
    .of-row2 { grid-template-columns:1fr; gap:0; }
    .of-wa-btn { font-size:15px; padding:14px; }
  }
`;

export default OrderForm;