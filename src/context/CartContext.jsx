import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getUserCart, saveUserCart } from "../utils/storage";
import { calculateSubtotal } from "../utils/calculations";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // Whenever the logged-in user changes, load that user's own cart instead
  // of showing whatever was left over from a previous session.
  useEffect(() => {
    if (currentUser) {
      setCartItems(getUserCart(currentUser.id));
    } else {
      setCartItems([]);
    }
  }, [currentUser]);

  function persist(updatedItems) {
    setCartItems(updatedItems);
    if (currentUser) {
      saveUserCart(currentUser.id, updatedItems);
    }
  }

  function addToCart(product, quantity = 1) {
    const existingItem = cartItems.find((item) => item.id === product.id);

    let updatedItems;
    if (existingItem) {
      updatedItems = cartItems.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedItems = [
        ...cartItems,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          quantity,
        },
      ];
    }

    persist(updatedItems);
  }

  function removeFromCart(productId) {
    const updatedItems = cartItems.filter((item) => item.id !== productId);
    persist(updatedItems);
  }

  function updateQuantity(productId, quantity) {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    const updatedItems = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    persist(updatedItems);
  }

  function clearCart() {
    persist([]);
  }

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = calculateSubtotal(cartItems);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider.");
  }

  return context;
}
