import { useCart } from "../context/CartContext";

const ProductCard = ({ product: p }) => {
  const { addToCart, cart } = useCart();
  const inCart = cart.some(i => i._id === p._id);
  const discount = p.mrp > p.price ? Math.round((1 - p.price / p.mrp) * 100) : 0;

  return (
    <article className="pc-card">
      {/* Image */}
      <div className="pc-img-wrap">
        <img
          src={p.image}
          alt={p.name}
          className="pc-img"
          onError={e => { e.currentTarget.src = "https://placehold.co/400x400/EDE5D8/1C3A2A?text=🎍"; }}
          loading="lazy"
        />
        {/* Badges */}
        <div className="pc-badges">
          {!p.inStock && <span className="pc-badge pc-badge-out">Out of stock</span>}
          {p.tag && p.inStock && <span className="pc-badge pc-badge-tag">{p.tag}</span>}
          {discount >= 5 && p.inStock && <span className="pc-badge pc-badge-disc">{discount}% off</span>}
        </div>
        {/* Quick add overlay */}
        {p.inStock && (
          <button
            className={`pc-quick-add ${inCart ? "pc-quick-added" : ""}`}
            onClick={() => addToCart(p)}
          >
            {inCart ? "✓ Added" : "+ Add to cart"}
          </button>
        )}
      </div>

      {/* Info */}
      <div className="pc-info">
        <p className="pc-category">{p.category}</p>
        <h3 className="pc-name">{p.name}</h3>
        <div className="pc-pricing">
          <span className="pc-price">₹{p.price}</span>
          {p.mrp > p.price && <span className="pc-mrp">₹{p.mrp}</span>}
        </div>
      </div>
    </article>
  );
};

export const ProductCardCSS = `
  .pc-card {
    display: flex;
    flex-direction: column;
    background: var(--white);
    border-radius: var(--radius-lg);
    overflow: hidden;
    transition: transform var(--transition), box-shadow var(--transition);
    cursor: pointer;
  }
  .pc-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  .pc-img-wrap {
    position: relative;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    background: var(--cream-dark);
  }
  .pc-img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
  .pc-card:hover .pc-img { transform: scale(1.04); }

  .pc-badges {
    position: absolute;
    top: 10px; left: 10px;
    display: flex; flex-direction: column; gap: 5px;
  }
  .pc-badge {
    display: inline-block;
    padding: 3px 9px;
    border-radius: 50px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.3px;
    text-transform: uppercase;
  }
  .pc-badge-tag  { background: var(--green); color: var(--cream); }
  .pc-badge-disc { background: var(--terra); color: #fff; }
  .pc-badge-out  { background: rgba(255,255,255,.9); color: var(--muted); }

  .pc-quick-add {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    padding: 12px;
    background: var(--green);
    color: var(--cream);
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.3px;
    text-align: center;
    transform: translateY(100%);
    transition: transform var(--transition), background var(--transition);
    border: none;
    cursor: pointer;
  }
  .pc-card:hover .pc-quick-add { transform: translateY(0); }
  .pc-quick-added { background: var(--green-mid) !important; }

  .pc-info { padding: 14px 16px 16px; flex: 1; display: flex; flex-direction: column; gap: 4px; }

  .pc-category {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    color: var(--muted);
  }
  .pc-name {
    font-family: var(--font-display);
    font-size: 17px;
    font-weight: 500;
    color: var(--green);
    line-height: 1.3;
    margin-top: 2px;
  }
  .pc-pricing {
    display: flex;
    align-items: baseline;
    gap: 7px;
    margin-top: 6px;
  }
  .pc-price {
    font-size: 16px;
    font-weight: 700;
    color: var(--brown);
  }
  .pc-mrp {
    font-size: 13px;
    color: var(--muted);
    text-decoration: line-through;
  }

  @media (max-width: 480px) {
    .pc-name { font-size: 15px; }
    .pc-quick-add { transform: translateY(0); font-size: 12px; padding: 10px; }
  }
`;

export default ProductCard;