import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { formatPrice } from "../utils/calculations";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const inWishlist = isInWishlist(product.id);
  const hasDiscount = product.discountPercentage > 0;

  function handleAddToCart(event) {
    event.preventDefault();
    addToCart(product, 1);
    toast.success(`${product.title} added to cart`);
  }

  function handleToggleWishlist(event) {
    event.preventDefault();

    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success(`${product.title} removed from wishlist`);
    } else {
      addToWishlist(product);
      toast.success(`${product.title} added to wishlist`);
    }
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-105"
        />

        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow transition hover:bg-white"
        >
          <Heart
            className={`h-4 w-4 ${
              inWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>

        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white">
            -{Math.round(product.discountPercentage)}%
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-brand-600">
          {product.category}
        </span>

        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
          {product.title}
        </h3>

        <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span>{product.rating?.toFixed(1)}</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-base font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>

          <button
            type="button"
            onClick={handleAddToCart}
            aria-label="Add to cart"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white transition hover:bg-brand-700"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
