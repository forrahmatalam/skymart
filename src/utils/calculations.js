// Reusable pricing calculations shared by the Cart and Checkout pages.
// Keeping this logic in one place means the same rules are applied
// consistently everywhere a total is shown.

const FREE_SHIPPING_THRESHOLD = 100;
const STANDARD_SHIPPING_FEE = 9.99;
const LOYALTY_DISCOUNT_RATE = 0.05;
const LOYALTY_DISCOUNT_MIN_SUBTOTAL = 200;

export function calculateSubtotal(cartItems) {
  return cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
}

export function calculateDiscount(cartItems) {
  const subtotal = calculateSubtotal(cartItems);

  if (subtotal >= LOYALTY_DISCOUNT_MIN_SUBTOTAL) {
    return subtotal * LOYALTY_DISCOUNT_RATE;
  }

  return 0;
}

export function calculateShipping(subtotal) {
  if (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }

  return STANDARD_SHIPPING_FEE;
}

export function calculateTotal(cartItems) {
  const subtotal = calculateSubtotal(cartItems);
  const discount = calculateDiscount(cartItems);
  const shipping = calculateShipping(subtotal);

  return subtotal - discount + shipping;
}

export function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}
