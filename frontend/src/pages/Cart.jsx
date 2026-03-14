import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cart, cartCount, subtotal, shipping, grandTotal, savings, removeFromCart, updateQty, clearCart } = useCart();
  const navigate = useNavigate();

  if (cartCount === 0) {
    return (
      <>
        <style>{CSS}</style>
        <div className="ct-empty">
          <div className="ct-empty-inner">
            <span className="ct-empty-icon">🛍️</span>
            <h2 className="ct-empty-title">Your bag is empty</h2>
            <p className="ct-empty-sub">Discover our handcrafted bamboo collection</p>
            <Link to="/shop" className="ct-btn-primary">Browse products →</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="ct-bc-bar">
        <div className="container ct-bc">
          <Link to="/" className="ct-bc-link">Home</Link>
          <span className="ct-bc-sep">›</span>
          <Link to="/shop" className="ct-bc-link">Shop</Link>
          <span className="ct-bc-sep">›</span>
          <span className="ct-bc-cur">Bag ({cartCount})</span>
        </div>
      </div>

      <div className="container ct-layout">
        <div className="ct-items">
          <div className="ct-items-hdr">
            <h1 className="ct-title">Your Bag</h1>
            <button className="ct-clear" onClick={clearCart}>Clear all</button>
          </div>
          <div className="ct-list">
            {cart.map(item => (
              <div key={item._id} className="ct-item">
                <div className="ct-item-img">
                  <img src={item.image} alt={item.name}
                    onError={e => { e.currentTarget.src = "https://placehold.co/100x100/EDE5D8/1C3A2A?text=🎍"; }} />
                </div>
                <div className="ct-item-info">
                  <p className="ct-item-cat">{item.category}</p>
                  <h3 className="ct-item-name">{item.name}</h3>
                  <div className="ct-item-bottom">
                    <div className="ct-qty">
                      <button className="ct-qty-btn" onClick={() => updateQty(item._id, item.qty - 1)} disabled={item.qty <= 1}>−</button>
                      <span className="ct-qty-num">{item.qty}</span>
                      <button className="ct-qty-btn" onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
                    </div>
                    <button className="ct-remove" onClick={() => removeFromCart(item._id)}>Remove</button>
                  </div>
                </div>
                <div className="ct-item-price">
                  <span className="ct-item-total">₹{item.price * item.qty}</span>
                  {item.mrp > item.price && <span className="ct-item-mrp">₹{item.mrp * item.qty}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ct-summary">
          <div className="ct-summary-box">
            <h2 className="ct-summary-title">Order Summary</h2>
            <div className="ct-summary-lines">
              <div className="ct-summary-line"><span>Subtotal ({cartCount} items)</span><span>₹{subtotal}</span></div>
              <div className="ct-summary-line">
                <span>Shipping</span>
                <span className={shipping === 0 ? "ct-free" : ""}>{shipping === 0 ? "Free 🎉" : `₹${shipping}`}</span>
              </div>
              {savings > 0 && <div className="ct-summary-line ct-savings"><span>You save</span><span>−₹{savings}</span></div>}
            </div>
            <div className="ct-summary-divider" />
            <div className="ct-summary-total">
              <span>Total</span>
              <span className="ct-total-price">₹{grandTotal}</span>
            </div>
            {shipping > 0 && subtotal < 500 && (
              <p className="ct-free-hint">Add ₹{500 - subtotal} more for free shipping</p>
            )}
            <button className="ct-btn-primary ct-checkout" onClick={() => navigate("/order")}>
              Proceed to Order →
            </button>
            <Link to="/shop" className="ct-continue">← Continue shopping</Link>
            <div className="ct-trust">
              <span>🔒 Secure</span>
              <span>📦 Quick dispatch</span>
              <span>♻️ Eco packaging</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const CSS = `
  .ct-empty { min-height:70vh; display:flex; align-items:center; justify-content:center; }
  .ct-empty-inner { text-align:center; display:flex; flex-direction:column; align-items:center; gap:12px; padding:40px; }
  .ct-empty-icon  { font-size:52px; }
  .ct-empty-title { font-family:var(--font-display); font-size:1.8rem; font-weight:500; color:var(--green); }
  .ct-empty-sub   { font-size:15px; color:var(--muted); }
  .ct-bc-bar { background:var(--cream-dark); border-bottom:1px solid var(--border); padding:10px 0; }
  .ct-bc { display:flex; align-items:center; gap:6px; }
  .ct-bc-link { font-size:12px; font-weight:600; color:var(--muted); text-decoration:none; transition:color var(--transition); }
  .ct-bc-link:hover { color:var(--green); }
  .ct-bc-sep { color:var(--border); }
  .ct-bc-cur { font-size:12px; font-weight:600; color:var(--green); }
  .ct-layout { display:grid; grid-template-columns:1fr 340px; gap:32px; padding-top:32px; padding-bottom:80px; align-items:start; }
  .ct-items-hdr { display:flex; align-items:baseline; justify-content:space-between; margin-bottom:20px; }
  .ct-title { font-family:var(--font-display); font-size:1.8rem; font-weight:500; color:var(--green); }
  .ct-clear { font-size:12px; font-weight:600; color:var(--muted); transition:color var(--transition); }
  .ct-clear:hover { color:var(--terra); }
  .ct-list { display:flex; flex-direction:column; }
  .ct-item { display:grid; grid-template-columns:90px 1fr auto; gap:16px; align-items:flex-start; padding:20px 0; border-bottom:1px solid var(--border); }
  .ct-item:first-child { border-top:1px solid var(--border); }
  .ct-item-img { width:90px; height:90px; border-radius:var(--radius-md); overflow:hidden; background:var(--cream-dark); }
  .ct-item-img img { width:100%; height:100%; object-fit:cover; }
  .ct-item-cat  { font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:1px; color:var(--muted); margin-bottom:3px; }
  .ct-item-name { font-family:var(--font-display); font-size:16px; font-weight:500; color:var(--green); margin-bottom:12px; line-height:1.3; }
  .ct-item-bottom { display:flex; align-items:center; gap:16px; }
  .ct-qty { display:flex; align-items:center; border:1.5px solid var(--border); border-radius:8px; overflow:hidden; }
  .ct-qty-btn { width:32px; height:32px; font-size:16px; font-weight:500; color:var(--green); background:none; transition:background var(--transition); cursor:pointer; display:flex; align-items:center; justify-content:center; }
  .ct-qty-btn:hover { background:var(--cream-dark); }
  .ct-qty-btn:disabled { color:var(--muted); cursor:not-allowed; }
  .ct-qty-num { min-width:32px; text-align:center; font-size:13px; font-weight:700; color:var(--green); }
  .ct-remove { font-size:12px; font-weight:600; color:var(--muted); transition:color var(--transition); }
  .ct-remove:hover { color:var(--terra); }
  .ct-item-price { text-align:right; display:flex; flex-direction:column; gap:3px; }
  .ct-item-total { font-size:15px; font-weight:700; color:var(--brown); }
  .ct-item-mrp   { font-size:12px; color:var(--muted); text-decoration:line-through; }
  .ct-summary-box { background:var(--white); border-radius:var(--radius-lg); padding:24px; box-shadow:var(--shadow-md); position:sticky; top:calc(var(--nav-h) + 20px); display:flex; flex-direction:column; }
  .ct-summary-title { font-family:var(--font-display); font-size:1.2rem; font-weight:600; color:var(--green); margin-bottom:20px; }
  .ct-summary-lines { display:flex; flex-direction:column; gap:12px; margin-bottom:16px; }
  .ct-summary-line { display:flex; justify-content:space-between; font-size:14px; color:var(--brown-mid); }
  .ct-free    { color:var(--green-mid); font-weight:700; }
  .ct-savings { color:var(--green-mid); font-weight:600; }
  .ct-summary-divider { height:1px; background:var(--border); margin-bottom:16px; }
  .ct-summary-total { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:8px; font-weight:700; color:var(--green); }
  .ct-total-price { font-size:24px; font-weight:700; color:var(--brown); }
  .ct-free-hint { font-size:12px; color:var(--terra); font-weight:600; background:#FFF3E8; padding:8px 12px; border-radius:8px; margin:8px 0 0; text-align:center; }
  .ct-btn-primary { display:flex; align-items:center; justify-content:center; padding:14px; border-radius:50px; background:var(--green); color:var(--cream); font-family:var(--font-body); font-size:14px; font-weight:700; text-decoration:none; cursor:pointer; transition:all var(--transition); border:none; }
  .ct-btn-primary:hover { background:var(--green-mid); transform:translateY(-1px); }
  .ct-checkout { margin-top:16px; }
  .ct-continue { display:block; text-align:center; font-size:13px; font-weight:600; color:var(--muted); text-decoration:none; margin-top:12px; transition:color var(--transition); }
  .ct-continue:hover { color:var(--green); }
  .ct-trust { display:flex; justify-content:space-between; margin-top:20px; padding-top:16px; border-top:1px solid var(--border); flex-wrap:wrap; gap:6px; }
  .ct-trust span { font-size:11px; color:var(--muted); font-weight:500; }
  @media (max-width:768px) {
    .ct-layout { grid-template-columns:1fr; }
    .ct-summary-box { position:static; }
    .ct-item { grid-template-columns:72px 1fr auto; gap:12px; }
    .ct-item-img { width:72px; height:72px; }
  }
  @media (max-width:480px) {
    .ct-item { grid-template-columns:64px 1fr; }
    .ct-item-price { display:none; }
  }
`;

export default Cart;