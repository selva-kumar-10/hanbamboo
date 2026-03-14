import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productAPI } from "../api/axios";
import ProductCard, { ProductCardCSS } from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import bottleImg from "../assets/bottle.jpg";
import geminiImg from "../assets/Gemini.webp";
import productImg from "../assets/productj.png";



const CATS = [
  { key: "Home",     icon: "🏡", desc: "Décor & living" },
  { key: "Kitchen",  icon: "🍃", desc: "Eco kitchenware" },
  { key: "Pooja",    icon: "🪔", desc: "Sacred items" },
  { key: "Personal", icon: "✨", desc: "Daily essentials" },
];

const WHY = [
  { icon: "🌿", title: "100% Natural",    body: "Every product is crafted from sustainably harvested bamboo." },
  { icon: "🤝", title: "Artisan Made",    body: "Supporting skilled craftspeople across rural India." },
  { icon: "♻️", title: "Zero Waste",      body: "Biodegradable packaging and eco-friendly practices." },
  { icon: "🚚", title: "Free Shipping",   body: "Complimentary delivery on orders above ₹500." },
];

const Home = () => {
  const [featured, setFeatured]   = useState([]);
  const [bestsellers, setBest]    = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    productAPI.getAll({ limit: 8 })
      .then(r => {
        const all = r.data.data || [];
        setFeatured(all.slice(0, 4));
        setBest(all.filter(p => p.tag === "Bestseller").slice(0, 4));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{CSS + ProductCardCSS}</style>

      {/* ── INTRO STRIP ─────────────────────────────────────── */}
      <section className="hm-intro">
        <div className="container hm-intro-inner">
          <div className="hm-intro-left">
            <p className="hm-eyebrow">Est. 2020 · Tamil Nadu, Deliver all over india</p>
            <h1 className="hm-headline">
              Premium craft,<br />
              <em>made with care</em>
            </h1>
            <p className="hm-body">
              Everyday products hand-crafted by Indian artisans. Beautiful, sustainable, and made to last.
            </p>
            <div className="hm-cta-row">
              <Link to="/shop" className="hm-btn-primary">Shop the collection</Link>
              <Link to="/shop?category=Bestseller" className="hm-btn-ghost">Bestsellers →</Link>
            </div>
          </div>
          <div className="hm-intro-right">
            <div className="hm-mosaic">
              <div className="hm-mosaic-main">
                <img src={bottleImg} alt="Bamboo crafts" />
              </div>
              <div className="hm-mosaic-sub">
                <img src={geminiImg} alt="Bamboo item" />
                <img src={productImg} alt="Bamboo product" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ──────────────────────────────────────── */}
      <section className="hm-section">
        <div className="container">
          <div className="hm-section-hdr">
            <h2 className="hm-section-title">Browse by category</h2>
          </div>
          <div className="hm-cats">
            {CATS.map(c => (
              <Link key={c.key} to={`/shop?category=${c.key}`} className="hm-cat-card">
                <span className="hm-cat-icon">{c.icon}</span>
                <span className="hm-cat-name">{c.key}</span>
                <span className="hm-cat-desc">{c.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ───────────────────────────────── */}
      <section className="hm-section hm-section-alt">
        <div className="container">
          <div className="hm-section-hdr">
            <h2 className="hm-section-title">New arrivals</h2>
            <Link to="/shop" className="hm-see-all">See all →</Link>
          </div>
          {loading ? (
            <div className="hm-loading">
              {[1,2,3,4].map(i => <div key={i} className="hm-skeleton" />)}
            </div>
          ) : featured.length > 0 ? (
            <div className="hm-grid">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <div className="hm-empty">
              <p>Products coming soon.</p>
              <Link to="/shop" className="hm-btn-primary" style={{marginTop:12,display:"inline-block"}}>Browse Shop</Link>
            </div>
          )}
        </div>
      </section>

      {/* ── BANNER STRIP ────────────────────────────────────── */}
      <section className="hm-banner">
        <div className="container hm-banner-inner">
          <div>
            <p className="hm-banner-tag">Limited time</p>
            <h3 className="hm-banner-title">Free shipping on orders above ₹500</h3>
          </div>
          <Link to="/shop" className="hm-btn-cream">Shop now →</Link>
        </div>
      </section>

      {/* ── BESTSELLERS ─────────────────────────────────────── */}
      {bestsellers.length > 0 && (
        <section className="hm-section">
          <div className="container">
            <div className="hm-section-hdr">
              <h2 className="hm-section-title">Customer favourites</h2>
              <Link to="/shop?tag=Bestseller" className="hm-see-all">See all →</Link>
            </div>
            <div className="hm-grid">
              {bestsellers.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── WHY US ──────────────────────────────────────────── */}
      <section className="hm-section hm-section-alt">
        <div className="container">
          <div className="hm-section-hdr hm-section-hdr-center">
            <h2 className="hm-section-title">Why HanBamboo?</h2>
            <p className="hm-section-sub">We believe everyday products can be beautiful and kind to the planet.</p>
          </div>
          <div className="hm-why-grid">
            {WHY.map((w, i) => (
              <div key={i} className="hm-why-card">
                <span className="hm-why-icon">{w.icon}</span>
                <h4 className="hm-why-title">{w.title}</h4>
                <p className="hm-why-body">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BOTTOM ──────────────────────────────────────── */}
      <section className="hm-cta-section">
        <div className="container hm-cta-inner">
          <span className="hm-cta-leaf">🎍</span>
          <h2 className="hm-cta-title">Ready to go green?</h2>
          <p className="hm-cta-sub">Join thousands of happy customers making the switch to bamboo.</p>
          <Link to="/shop" className="hm-btn-primary">Explore collection</Link>
        </div>
      </section>
    </>
  );
};

const CSS = `
  /* ── Intro ── */
  .hm-intro {
    padding: 48px 0 56px;
    background: var(--cream);
  }
  .hm-intro-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    align-items: center;
  }
  .hm-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--terra);
    margin-bottom: 16px;
  }
  .hm-headline {
    font-family: var(--font-display);
    font-size: clamp(2.4rem, 5vw, 3.6rem);
    font-weight: 400;
    line-height: 1.15;
    color: var(--green);
    margin-bottom: 18px;
  }
  .hm-headline em {
    font-style: italic;
    color: var(--terra);
  }
  .hm-body {
    font-size: 16px;
    color: var(--brown-mid);
    line-height: 1.75;
    max-width: 400px;
    margin-bottom: 28px;
  }
  .hm-cta-row { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
  .hm-btn-primary {
    display: inline-flex; align-items: center;
    padding: 12px 24px; border-radius: 50px;
    background: var(--green); color: var(--cream);
    font-size: 14px; font-weight: 600;
    transition: all var(--transition);
    text-decoration: none;
  }
  .hm-btn-primary:hover { background: var(--green-mid); transform: translateY(-1px); }
  .hm-btn-ghost {
    font-size: 14px; font-weight: 600; color: var(--green);
    text-decoration: none; transition: color var(--transition);
  }
  .hm-btn-ghost:hover { color: var(--terra); }
  .hm-btn-cream {
    display: inline-flex; align-items: center;
    padding: 11px 24px; border-radius: 50px;
    background: var(--cream); color: var(--green);
    font-size: 14px; font-weight: 600;
    text-decoration: none; white-space: nowrap;
    transition: all var(--transition);
  }
  .hm-btn-cream:hover { background: var(--cream-dark); }

  /* Mosaic */
  .hm-mosaic { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; height: 380px; }
  .hm-mosaic-main { grid-row: span 2; border-radius: var(--radius-lg); overflow: hidden; }
  .hm-mosaic-main img { width:100%; height:100%; object-fit:cover; }
  .hm-mosaic-sub { display:flex; flex-direction:column; gap:10px; }
  .hm-mosaic-sub img { width:100%; flex:1; border-radius: var(--radius-md); object-fit:cover; }

  /* ── Sections ── */
  .hm-section { padding: 60px 0; }
  .hm-section-alt { background: var(--cream-dark); }
  .hm-section-hdr {
    display: flex; align-items: baseline; justify-content: space-between;
    margin-bottom: 28px;
  }
  .hm-section-hdr-center { flex-direction: column; align-items: center; text-align: center; gap: 8px; }
  .hm-section-title {
    font-family: var(--font-display);
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 500;
    color: var(--green);
  }
  .hm-section-sub { font-size: 15px; color: var(--brown-mid); max-width: 480px; line-height: 1.7; }
  .hm-see-all { font-size: 13px; font-weight: 600; color: var(--terra); text-decoration: none; transition: opacity var(--transition); }
  .hm-see-all:hover { opacity: 0.7; }

  /* ── Category cards ── */
  .hm-cats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .hm-cat-card {
    display: flex; flex-direction: column; align-items: flex-start;
    padding: 20px 20px 22px;
    background: var(--white);
    border-radius: var(--radius-lg);
    border: 1.5px solid transparent;
    text-decoration: none;
    transition: all var(--transition);
    cursor: pointer;
    gap: 4px;
  }
  .hm-cat-card:hover {
    border-color: var(--green);
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }
  .hm-cat-icon { font-size: 28px; margin-bottom: 6px; }
  .hm-cat-name { font-size: 15px; font-weight: 700; color: var(--green); }
  .hm-cat-desc { font-size: 12px; color: var(--muted); }

  /* ── Product grid ── */
  .hm-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
  .hm-loading { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
  .hm-skeleton {
    aspect-ratio: 3/4; border-radius: var(--radius-lg);
    background: linear-gradient(90deg, var(--cream-mid) 25%, var(--cream-dark) 50%, var(--cream-mid) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  .hm-empty { text-align: center; padding: 60px 20px; color: var(--muted); }

  /* ── Banner ── */
  .hm-banner { background: var(--green); padding: 32px 0; }
  .hm-banner-inner {
    display: flex; align-items: center; justify-content: space-between;
    gap: 24px; flex-wrap: wrap;
  }
  .hm-banner-tag {
    font-size: 11px; font-weight: 700; letter-spacing: 2px;
    text-transform: uppercase; color: rgba(255,255,255,.55);
    margin-bottom: 4px;
  }
  .hm-banner-title {
    font-family: var(--font-display);
    font-size: 1.6rem; font-weight: 400;
    color: var(--cream);
  }

  /* ── Why grid ── */
  .hm-why-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
  .hm-why-card {
    padding: 24px 22px 26px;
    background: var(--white);
    border-radius: var(--radius-lg);
    display: flex; flex-direction: column; gap: 8px;
  }
  .hm-why-icon  { font-size: 28px; }
  .hm-why-title { font-size: 15px; font-weight: 700; color: var(--green); }
  .hm-why-body  { font-size: 13px; color: var(--brown-mid); line-height: 1.65; }

  /* ── CTA bottom ── */
  .hm-cta-section { padding: 80px 0; background: var(--cream); }
  .hm-cta-inner {
    display: flex; flex-direction: column; align-items: center;
    text-align: center; gap: 12px;
  }
  .hm-cta-leaf  { font-size: 36px; }
  .hm-cta-title {
    font-family: var(--font-display);
    font-size: clamp(1.6rem, 3vw, 2.4rem);
    font-weight: 500; color: var(--green);
  }
  .hm-cta-sub { font-size: 15px; color: var(--brown-mid); max-width: 380px; line-height: 1.7; margin-bottom: 8px; }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .hm-grid, .hm-loading { grid-template-columns: repeat(3, 1fr); }
    .hm-why-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 768px) {
    .hm-intro-inner { grid-template-columns: 1fr; gap: 32px; }
    .hm-intro-right { display: none; }
    .hm-cats { grid-template-columns: repeat(2, 1fr); }
    .hm-grid, .hm-loading { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .hm-why-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  }
  @media (max-width: 480px) {
    .hm-intro { padding: 28px 0 36px; }
    .hm-section { padding: 40px 0; }
    .hm-cats { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .hm-why-grid { grid-template-columns: 1fr 1fr; }
    .hm-banner-inner { flex-direction: column; align-items: flex-start; }
  }
`;

export default Home;