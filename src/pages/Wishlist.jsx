import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/calculations";
import EmptyState from "../components/EmptyState";

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  function handleMoveToCart(item) {
    addToCart(item, 1);
    removeFromWishlist(item.id);
    toast.success(`${item.title} moved to cart`);
  }

  function handleRemove(item) {
    removeFromWishlist(item.id);
    toast.success(`${item.title} removed from wishlist`);
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          message="Save products you love here so you can find them easily later."
          actionLabel="Browse Products"
          actionTo="/products"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Wishlist <span className="text-gray-400">({wishlistItems.length})</span>
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wishlistItems.map((item) => (
          <div key={item.id} className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white">
            <Link to={`/product/${item.id}`} className="aspect-square bg-gray-50">
              <img src={item.thumbnail} alt={item.title} className="h-full w-full object-contain p-4" />
            </Link>

            <div className="flex flex-1 flex-col p-4">
              <Link to={`/product/${item.id}`} className="line-clamp-2 text-sm font-semibold text-gray-900 hover:text-brand-600">
                {item.title}
              </Link>
              <span className="mt-1 text-base font-bold text-gray-900">{formatPrice(item.price)}</span>

              <div className="mt-auto flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => handleMoveToCart(item)}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-brand-600 py-2 text-xs font-semibold text-white transition hover:bg-brand-700"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Move to Cart
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(item)}
                  aria-label="Remove from wishlist"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-500 transition hover:bg-gray-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
