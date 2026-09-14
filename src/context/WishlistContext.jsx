import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getUserWishlist, saveUserWishlist } from "../utils/storage";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { currentUser } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    if (currentUser) {
      setWishlistItems(getUserWishlist(currentUser.id));
    } else {
      setWishlistItems([]);
    }
  }, [currentUser]);

  function persist(updatedItems) {
    setWishlistItems(updatedItems);
    if (currentUser) {
      saveUserWishlist(currentUser.id, updatedItems);
    }
  }

  function addToWishlist(product) {
    const alreadyInWishlist = wishlistItems.some(
      (item) => item.id === product.id
    );

    if (alreadyInWishlist) {
      return;
    }

    const updatedItems = [
      ...wishlistItems,
      {
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        category: product.category,
        rating: product.rating,
      },
    ];

    persist(updatedItems);
  }

  function removeFromWishlist(productId) {
    const updatedItems = wishlistItems.filter((item) => item.id !== productId);
    persist(updatedItems);
  }

  function isInWishlist(productId) {
    return wishlistItems.some((item) => item.id === productId);
  }

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    wishlistCount: wishlistItems.length,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider.");
  }

  return context;
}
