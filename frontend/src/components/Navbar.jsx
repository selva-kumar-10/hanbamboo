import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { cartCount } = useCart();
  const { pathname }  = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const links = [
    { to: "/",     label: "Home"  },
    { to: "/shop", label: "Shop"  },
  ];

  return (
    <>
      <style>{CSS}</style>
      <header className={`nb-root ${scrolled ? "nb-scrolled" : ""}`}>
        <div className="container nb-inner">

          {/* Logo */}
          <Link to="/" className="nb-logo">
            <span className="nb-logo-mark">🎍</span>
            <span className="nb-logo-text">HanBamboo</span>
          </Link>

          {/* Desktop nav */}
          <nav className="nb-links">
            {links.map(l => (
              <Link key={l.to} to={l.to}
                className={`nb-link ${pathname === l.to ? "nb-link-active" : ""}`}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="nb-actions">
            <Link to="/cart" className="nb-cart">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {cartCount > 0 && <span className="nb-badge">{cartCount}</span>}
            </Link>

            {/* Mobile hamburger */}
            <button className="nb-burger" onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu">
              <span className={`nb-bar ${menuOpen ? "nb-bar-top" : ""}`} />
              <span className={`nb-bar ${menuOpen ? "nb-bar-hide" : ""}`} />
              <span className={`nb-bar ${menuOpen ? "nb-bar-bot" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="nb-mobile-menu">
            {links.map(l => (
              <Link key={l.to} to={l.to}
                className={`nb-mobile-link ${pathname === l.to ? "nb-mobile-link-active" : ""}`}>
                {l.label}
              </Link>
            ))}
            <Link to="/cart" className="nb-mobile-link">
              Bag {cartCount > 0 && `(${cartCount})`}
            </Link>
          </div>
        )}
      </header>

      {/* Spacer so content doesn't hide under fixed nav */}
      <div style={{ height: "var(--nav-h)" }} />
    </>
  );
};

const CSS = `
  .nb-root {
    position: fixed; top: 0; left: 0; right: 0; z-index: 90;
    height: var(--nav-h);
    background: rgba(250,247,242,0.92);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid transparent;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  .nb-scrolled {
    border-bottom-color: var(--border);
    box-shadow: 0 2px 20px rgba(44,24,16,.06);
  }
  .nb-inner {
    height: var(--nav-h);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }
  .nb-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    flex-shrink: 0;
  }
  .nb-logo-mark { font-size: 22px; line-height:1; }
  .nb-logo-text {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 600;
    color: var(--green);
    letter-spacing: -0.3px;
  }
  .nb-links {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .nb-link {
    padding: 6px 14px;
    border-radius: 50px;
    font-size: 14px;
    font-weight: 500;
    color: var(--brown-mid);
    transition: all var(--transition);
    text-decoration: none;
  }
  .nb-link:hover { color: var(--green); background: var(--cream-dark); }
  .nb-link-active { color: var(--green); font-weight: 600; background: var(--cream-dark); }

  .nb-actions { display: flex; align-items: center; gap: 8px; }

  .nb-cart {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px; height: 40px;
    border-radius: 50%;
    color: var(--green);
    transition: background var(--transition);
    text-decoration: none;
  }
  .nb-cart:hover { background: var(--cream-dark); }
  .nb-badge {
    position: absolute;
    top: 4px; right: 4px;
    width: 16px; height: 16px;
    background: var(--terra);
    color: #fff;
    border-radius: 50%;
    font-size: 9px;
    font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    border: 1.5px solid var(--cream);
  }

  .nb-burger {
    display: none;
    flex-direction: column;
    gap: 5px;
    width: 40px; height: 40px;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: background var(--transition);
  }
  .nb-burger:hover { background: var(--cream-dark); }
  .nb-bar {
    display: block;
    width: 20px; height: 1.5px;
    background: var(--green);
    border-radius: 2px;
    transition: all 0.25s;
    transform-origin: center;
  }
  .nb-bar-top  { transform: translateY(6.5px) rotate(45deg); }
  .nb-bar-hide { opacity: 0; transform: scaleX(0); }
  .nb-bar-bot  { transform: translateY(-6.5px) rotate(-45deg); }

  .nb-mobile-menu {
    background: var(--cream);
    border-top: 1px solid var(--border);
    padding: 12px 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .nb-mobile-link {
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 500;
    color: var(--brown-mid);
    transition: all var(--transition);
    text-decoration: none;
  }
  .nb-mobile-link:hover { background: var(--cream-dark); color: var(--green); }
  .nb-mobile-link-active { color: var(--green); font-weight: 600; }

  @media (max-width: 640px) {
    .nb-links  { display: none; }
    .nb-burger { display: flex; }
  }
`;

export default Navbar;