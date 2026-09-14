// Centralized localStorage helpers for all user-specific application data.
// Every piece of data that belongs to a single user (cart, wishlist, orders,
// recently viewed products) is stored under a key that includes that user's
// ID so that different accounts never see each other's data.

const CART_PREFIX = "skymart_cart_";
const WISHLIST_PREFIX = "skymart_wishlist_";
const ORDERS_PREFIX = "skymart_orders_";
const RECENT_PREFIX = "skymart_recent_";

const RECENTLY_VIEWED_LIMIT = 6;

function readJson(key, fallbackValue) {
  try {
    const rawValue = localStorage.getItem(key);
    if (!rawValue) {
      return fallbackValue;
    }
    return JSON.parse(rawValue);
  } catch (error) {
    console.error(`Failed to read localStorage key "${key}":`, error);
    return fallbackValue;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to write localStorage key "${key}":`, error);
  }
}

// ---------- Cart ----------

export function getUserCart(userId) {
  if (!userId) {
    return [];
  }
  return readJson(`${CART_PREFIX}${userId}`, []);
}

export function saveUserCart(userId, cartItems) {
  if (!userId) {
    return;
  }
  writeJson(`${CART_PREFIX}${userId}`, cartItems);
}

// ---------- Wishlist ----------

export function getUserWishlist(userId) {
  if (!userId) {
    return [];
  }
  return readJson(`${WISHLIST_PREFIX}${userId}`, []);
}

export function saveUserWishlist(userId, wishlistItems) {
  if (!userId) {
    return;
  }
  writeJson(`${WISHLIST_PREFIX}${userId}`, wishlistItems);
}

// ---------- Orders ----------

export function getUserOrders(userId) {
  if (!userId) {
    return [];
  }
  return readJson(`${ORDERS_PREFIX}${userId}`, []);
}

export function saveUserOrders(userId, orders) {
  if (!userId) {
    return;
  }
  writeJson(`${ORDERS_PREFIX}${userId}`, orders);
}

export function addUserOrder(userId, order) {
  const existingOrders = getUserOrders(userId);
  const updatedOrders = [order, ...existingOrders];
  saveUserOrders(userId, updatedOrders);
  return updatedOrders;
}

// ---------- Recently viewed products ----------

export function getRecentlyViewed(userId) {
  if (!userId) {
    return [];
  }
  return readJson(`${RECENT_PREFIX}${userId}`, []);
}

export function saveRecentlyViewed(userId, products) {
  if (!userId) {
    return;
  }
  writeJson(`${RECENT_PREFIX}${userId}`, products);
}

export function addRecentlyViewed(userId, product) {
  if (!userId || !product) {
    return [];
  }

  const existingProducts = getRecentlyViewed(userId);
  const withoutDuplicate = existingProducts.filter((item) => item.id !== product.id);
  const updatedProducts = [product, ...withoutDuplicate].slice(0, RECENTLY_VIEWED_LIMIT);

  saveRecentlyViewed(userId, updatedProducts);
  return updatedProducts;
}
