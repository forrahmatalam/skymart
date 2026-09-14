import { Link } from "react-router-dom";
import { ShoppingBag, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import {
  calculateSubtotal,
  calculateDiscount,
  calculateShipping,
  formatPrice,
} from "../utils/calculations";
import QuantitySelector from "../components/QuantitySelector";
import EmptyState from "../components/EmptyState";

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();

  function handleRemoveItem(itemId, title) {
    removeFromCart(itemId);
    toast.success(`${title} removed from cart`);
  }

  function handleClearCart() {
    clearCart();
    toast.success("Cart cleared");
  }

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          message="Looks like you haven't added anything to your cart yet."
          actionLabel="Continue Shopping"
          actionTo="/products"
        />
      </div>
    );
  }

  const subtotal = calculateSubtotal(cartItems);
  const discount = calculateDiscount(cartItems);
  const shipping = calculateShipping(subtotal);
  const total = subtotal - discount + shipping;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        <button
          type="button"
          onClick={handleClearCart}
          className="text-sm font-medium text-gray-500 hover:text-red-600"
        >
          Clear cart
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex flex-col divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 p-4">
                <Link to={`/product/${item.id}`} className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50">
                  <img src={item.thumbnail} alt={item.title} className="h-full w-full object-contain p-1" />
                </Link>

                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/product/${item.id}`} className="text-sm font-medium text-gray-900 hover:text-brand-600">
                      {item.title}
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id, item.title)}
                      aria-label="Remove item"
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <QuantitySelector
                      quantity={item.quantity}
                      onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                      onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                    />
                    <span className="text-sm font-semibold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link to="/products" className="mt-4 inline-block text-sm font-medium text-brand-600 hover:underline">
            Continue shopping
          </Link>
        </div>

        <div className="h-fit rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
          </div>

          <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-base font-bold text-gray-900">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <Link
            to="/checkout"
            className="mt-6 block w-full rounded-lg bg-brand-600 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
