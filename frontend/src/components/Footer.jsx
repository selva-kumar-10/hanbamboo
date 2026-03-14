import { Link } from "react-router-dom";

const Footer = () => (
  <>
    <style>{CSS}</style>
    <footer className="ft-root">
      <div className="container ft-inner">

        <div className="ft-brand">
          <div className="ft-logo">
            <span>🎍</span>
            <span className="ft-logo-text">HanBamboo</span>
          </div>
          <p className="ft-tagline">
            Handcrafted bamboo products by<br />Indian artisans. Made with love.
          </p>
          <a href="https://wa.me/918870969828" target="_blank" rel="noreferrer"
            className="ft-wa">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.557 4.112 1.526 5.839L0 24l6.335-1.507A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.213-3.728.888.926-3.619-.233-.374A9.817 9.817 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z"/>
            </svg>
            Chat on WhatsApp
          </a>
        </div>

        <div className="ft-col">
          <p className="ft-col-title">Shop</p>
          <Link to="/shop" className="ft-link">All Products</Link>
          <Link to="/shop?category=Home" className="ft-link">Home & Living</Link>
          <Link to="/shop?category=Kitchen" className="ft-link">Kitchen</Link>
          <Link to="/shop?category=Pooja" className="ft-link">Pooja</Link>
          <Link to="/shop?category=Personal" className="ft-link">Personal Care</Link>
        </div>

        <div className="ft-col">
          <p className="ft-col-title">Order</p>
          <Link to="/cart" className="ft-link">Your Bag</Link>
          <Link to="/order" className="ft-link">Place Order</Link>
        </div>

        <div className="ft-col">
          <p className="ft-col-title">Info</p>
          <p className="ft-text">Madurai, Tamil Nadu</p>
          <p className="ft-text">India — 625001</p>
          <a href="mailto:hello@hanbamboo.in" className="ft-link">hello@hanbamboo.in</a>
        </div>

      </div>
      <div className="ft-bottom">
        <div className="container ft-bottom-inner">
          <p className="ft-copy">© {new Date().getFullYear()} HanBamboo. Made with 🌿 in India.</p>
          <p className="ft-copy">All products handcrafted by local artisans.</p>
        </div>
      </div>
    </footer>
  </>
);

const CSS = `
  .ft-root { background: var(--green); color: var(--cream); margin-top: 0; }
  .ft-inner {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 48px;
    padding-top: 56px;
    padding-bottom: 48px;
  }
  .ft-logo { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
  .ft-logo span:first-child { font-size: 22px; }
  .ft-logo-text { font-family: var(--font-display); font-size: 20px; font-weight: 600; color: var(--cream); }
  .ft-tagline { font-size: 13px; color: rgba(250,247,242,.65); line-height: 1.7; margin-bottom: 20px; }
  .ft-wa {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 9px 18px; border-radius: 50px;
    background: #25D366; color: #fff;
    font-size: 13px; font-weight: 600;
    text-decoration: none; transition: opacity var(--transition);
  }
  .ft-wa:hover { opacity: .88; }

  .ft-col { display: flex; flex-direction: column; gap: 10px; }
  .ft-col-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: rgba(250,247,242,.5); margin-bottom: 4px; }
  .ft-link { font-size: 13px; color: rgba(250,247,242,.75); text-decoration: none; transition: color var(--transition); }
  .ft-link:hover { color: var(--cream); }
  .ft-text { font-size: 13px; color: rgba(250,247,242,.6); }

  .ft-bottom { border-top: 1px solid rgba(250,247,242,.12); }
  .ft-bottom-inner {
    padding: 18px 0;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 8px;
  }
  .ft-copy { font-size: 12px; color: rgba(250,247,242,.4); }

  @media (max-width: 768px) {
    .ft-inner { grid-template-columns: 1fr 1fr; gap: 32px; padding-top: 40px; padding-bottom: 32px; }
    .ft-brand { grid-column: span 2; }
    .ft-bottom-inner { flex-direction: column; align-items: flex-start; }
  }
  @media (max-width: 480px) {
    .ft-inner { grid-template-columns: 1fr 1fr; gap: 24px; }
  }
`;

export default Footer;