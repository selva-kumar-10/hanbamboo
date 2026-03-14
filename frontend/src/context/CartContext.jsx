import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("hb_cart");
      if (saved) setCart(JSON.parse(saved));
    } catch (_) {}
  }, []);

  // Persist cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("hb_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((i) => i._id === product._id);
      if (exists) {
        return prev.map((i) =>
          i._id === product._id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i._id !== id));
  };

  const updateQty = (id, newQty) => {
    if (newQty < 1) return;
    setCart((prev) =>
      prev.map((i) =>
        i._id === id ? { ...i, qty: newQty } : i
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartCount   = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal    = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping    = subtotal >= 999 ? 0 : 99;
  const grandTotal  = subtotal + shipping;
  const savings     = cart.reduce((s, i) => s + (i.mrp - i.price) * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        shipping,
        grandTotal,
        savings,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};