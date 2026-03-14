import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { productAPI } from "../api/axios";
import ProductCard, { ProductCardCSS } from "../components/ProductCard";
import { useCart } from "../context/CartContext";

const CATS = [
  { key: "All",      label: "All products" },
  { key: "Home",     label: "Home & Living" },
  { key: "Kitchen",  label: "Kitchen" },
  { key: "Pooja",    label: "Pooja & Spiritual" },
  { key: "Personal", label: "Personal Care" },
];

const SORT = [
  { key: "new",        label: "Newest first" },
  { key: "price-asc",  label: "Price: Low to high" },
  { key: "price-desc", label: "Price: High to low" },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "All";
  const search   = searchParams.get("search")   || "";
  const sort     = searchParams.get("sort")      || "new";

  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [searchInput, setSearchInput] = useState(search);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    val ? p.set(key, val) : p.delete(key);
    if (key !== "search") p.delete("search");
    setSearchParams(p);
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = {};
    if (category !== "All") params.category = category;
    if (search) params.search = search;
    productAPI.getAll(params)
      .then(r => { setProducts(r.data.data || []); })
      .catch(() => setError("Could not load products. Is the backend running?"))
      .finally(() => setLoading(false));
  }, [category, search]);

  // Sort client-side
  const sorted = [...products].sort((a, b) => {
    if (sort === "price-asc")  return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return 0;
  });

  const handleSearch = e => {
    e.preventDefault();
    const p = new URLSearchParams(searchParams);
    searchInput.trim() ? p.set("search", searchInput.trim()) : p.delete("search");
    setSearchParams(p);
  };

  return (
    <>
      <style>{CSS + ProductCardCSS}</style>

      {/* ── Breadcrumb ── */}
      <div className="sp-bc-bar">
        <div className="container sp-bc">
          <Link to="/" className="sp-bc-link">Home</Link>
          <span className="sp-bc-sep">›</span>
          <span className="sp-bc-cur">Shop</span>
          {category !== "All" && (
            <><span className="sp-bc-sep">›</span><span className="sp-bc-cur">{category}</span></>
          )}
        </div>
      </div>

      <div className="container sp-layout">

        {/* ── Sidebar overlay (mobile) ── */}
        {sidebarOpen && <div className="sp-overlay" onClick={() => setSidebarOpen(false)} />}

        {/* ── Sidebar ── */}
        <aside className={`sp-sidebar ${sidebarOpen ? "sp-sidebar-open" : ""}`}>
          <div className="sp-sidebar-hdr">
            <span className="sp-sidebar-title">Filter</span>
            <button className="sp-sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>
          </div>

          <div className="sp-filter-group">
            <p className="sp-filter-label">Category</p>
            {CATS.map(c => (
              <button key={c.key}
                className={`sp-filter-btn ${category === c.key ? "sp-filter-active" : ""}`}
                onClick={() => { setParam("category", c.key === "All" ? "" : c.key); setSidebarOpen(false); }}>
                {c.label}
                {category === c.key && <span className="sp-filter-check">✓</span>}
              </button>
            ))}
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="sp-main">

          {/* Topbar */}
          <div className="sp-topbar">
            <div className="sp-topbar-left">
              <button className="sp-filter-toggle" onClick={() => setSidebarOpen(true)}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/>
                </svg>
                Filter
              </button>
              <h1 className="sp-title">
                {category === "All" ? "All Products" : category}
              </h1>
              {!loading && <span className="sp-count">{sorted.length} items</span>}
            </div>

            <div className="sp-topbar-right">
              <form onSubmit={handleSearch} className="sp-search">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input placeholder="Search products…"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)} />
              </form>
              <select className="sp-sort" value={sort}
                onChange={e => { const p = new URLSearchParams(searchParams); p.set("sort", e.target.value); setSearchParams(p); }}>
                {SORT.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {/* Active filters */}
          {(category !== "All" || search) && (
            <div className="sp-active-filters">
              {category !== "All" && (
                <button className="sp-chip" onClick={() => setParam("category", "")}>
                  {category} ✕
                </button>
              )}
              {search && (
                <button className="sp-chip" onClick={() => { setSearchInput(""); setParam("search", ""); }}>
                  "{search}" ✕
                </button>
              )}
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className="sp-grid">
              {[1,2,3,4,5,6].map(i => <div key={i} className="sp-skeleton" />)}
            </div>
          ) : error ? (
            <div className="sp-state">
              <span style={{fontSize:40}}>⚠️</span>
              <p>{error}</p>
            </div>
          ) : sorted.length === 0 ? (
            <div className="sp-state">
              <span style={{fontSize:40}}>🔍</span>
              <p>No products found.</p>
              <button className="sp-reset" onClick={() => { setSearchParams({}); setSearchInput(""); }}>
                Clear filters
              </button>
            </div>
          ) : (
            <div className="sp-grid">
              {sorted.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

const CSS = `
  .sp-bc-bar { background: var(--cream-dark); border-bottom: 1px solid var(--border); padding: 10px 0; }
  .sp-bc { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
  .sp-bc-link { font-size: 12px; font-weight: 600; color: var(--muted); text-decoration: none; transition: color var(--transition); }
  .sp-bc-link:hover { color: var(--green); }
  .sp-bc-sep  { color: var(--border); font-size: 12px; }
  .sp-bc-cur  { font-size: 12px; font-weight: 600; color: var(--green); }

  .sp-layout {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 32px;
    padding-top: 28px;
    padding-bottom: 80px;
    align-items: start;
  }

  /* Sidebar */
  .sp-overlay {
    display: none;
    position: fixed; inset: 0; background: rgba(0,0,0,.4); z-index: 40;
  }
  .sp-sidebar {
    background: var(--white);
    border-radius: var(--radius-lg);
    padding: 20px;
    position: sticky;
    top: calc(var(--nav-h) + 16px);
    box-shadow: var(--shadow-sm);
  }
  .sp-sidebar-hdr {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px;
  }
  .sp-sidebar-title { font-size: 13px; font-weight: 700; color: var(--green); text-transform: uppercase; letter-spacing: 1px; }
  .sp-sidebar-close { display: none; width: 28px; height: 28px; border-radius: 6px; background: var(--cream-dark); font-size: 14px; color: var(--muted); align-items: center; justify-content: center; }
  .sp-filter-group { display: flex; flex-direction: column; gap: 2px; }
  .sp-filter-label { font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
  .sp-filter-btn {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; text-align: left; padding: 9px 12px; border-radius: 8px;
    font-size: 13px; font-weight: 500; color: var(--brown-mid);
    transition: all var(--transition); cursor: pointer;
  }
  .sp-filter-btn:hover { background: var(--cream-dark); color: var(--green); }
  .sp-filter-active { background: var(--green) !important; color: var(--cream) !important; font-weight: 600; }
  .sp-filter-check { font-size: 11px; }

  /* Main */
  .sp-main { display: flex; flex-direction: column; gap: 20px; }
  .sp-topbar {
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; flex-wrap: wrap;
  }
  .sp-topbar-left { display: flex; align-items: center; gap: 12px; }
  .sp-topbar-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

  .sp-filter-toggle {
    display: none; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: 8px;
    background: var(--white); border: 1.5px solid var(--border);
    font-size: 13px; font-weight: 600; color: var(--green);
    transition: all var(--transition);
  }
  .sp-filter-toggle:hover { border-color: var(--green); }

  .sp-title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 500; color: var(--green); }
  .sp-count { font-size: 12px; color: var(--muted); }

  .sp-search {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 14px; border-radius: 50px;
    background: var(--white); border: 1.5px solid var(--border);
    transition: border-color var(--transition);
  }
  .sp-search:focus-within { border-color: var(--green); }
  .sp-search svg { color: var(--muted); flex-shrink: 0; }
  .sp-search input { border: none; outline: none; background: none; font-size: 13px; color: var(--brown); width: 160px; }

  .sp-sort {
    padding: 8px 14px; border-radius: 50px;
    border: 1.5px solid var(--border); background: var(--white);
    font-size: 13px; color: var(--brown); outline: none; cursor: pointer;
    transition: border-color var(--transition);
  }
  .sp-sort:focus { border-color: var(--green); }

  .sp-active-filters { display: flex; gap: 8px; flex-wrap: wrap; }
  .sp-chip {
    padding: 5px 12px; border-radius: 50px;
    background: var(--cream-dark); border: 1.5px solid var(--border);
    font-size: 12px; font-weight: 600; color: var(--green);
    cursor: pointer; transition: all var(--transition);
  }
  .sp-chip:hover { background: var(--cream-mid); }

  .sp-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  .sp-skeleton {
    aspect-ratio: 3/4; border-radius: var(--radius-lg);
    background: linear-gradient(90deg, var(--cream-mid) 25%, var(--cream-dark) 50%, var(--cream-mid) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  .sp-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 80px 20px; text-align: center; color: var(--muted); }
  .sp-reset {
    padding: 10px 22px; border-radius: 50px;
    background: var(--green); color: var(--cream);
    font-size: 13px; font-weight: 600; cursor: pointer;
    transition: background var(--transition);
  }
  .sp-reset:hover { background: var(--green-mid); }

  @media (max-width: 900px) {
    .sp-layout { grid-template-columns: 1fr; }
    .sp-sidebar {
      display: none; position: fixed; top: 0; left: 0; bottom: 0;
      width: 280px; z-index: 50; border-radius: 0;
      transform: translateX(-100%); transition: transform var(--transition);
    }
    .sp-sidebar-open { display: flex !important; flex-direction: column; transform: translateX(0); }
    .sp-overlay { display: block; }
    .sp-sidebar-close { display: flex; }
    .sp-filter-toggle { display: flex; }
    .sp-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  }
  @media (max-width: 480px) {
    .sp-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .sp-search input { width: 110px; }
    .sp-topbar { gap: 8px; }
  }
`;

export default Shop;