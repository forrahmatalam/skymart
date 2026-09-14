import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import toast from "react-hot-toast";
import { getProductById, getProductsByCategory } from "../services/api";
import { addRecentlyViewed } from "../utils/storage";
import { formatPrice } from "../utils/calculations";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import QuantitySelector from "../components/QuantitySelector";
import ProductGrid from "../components/ProductGrid";
import LoadingSkeleton from "../components/LoadingSkeleton";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    loadProduct();
    window.scrollTo(0, 0);
  }, [id]);

  async function loadProduct() {
    setLoading(true);
    setError(null);
    setQuantity(1);
    setSelectedImageIndex(0);

    try {
      const fetchedProduct = await getProductById(id);
      setProduct(fetchedProduct);

      if (currentUser) {
        addRecentlyViewed(currentUser.id, {
          id: fetchedProduct.id,
          title: fetchedProduct.title,
          price: fetchedProduct.price,
          thumbnail: fetchedProduct.thumbnail,
          category: fetchedProduct.category,
          rating: fetchedProduct.rating,
          discountPercentage: fetchedProduct.discountPercentage,
        });
      }

      loadRelatedProducts(fetchedProduct.category, fetchedProduct.id);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadRelatedProducts(category, currentProductId) {
    try {
      const products = await getProductsByCategory(category);
      const filteredProducts = products
        .filter((relatedProduct) => relatedProduct.id !== currentProductId)
        .slice(0, 4);
      setRelatedProducts(filteredProducts);
    } catch (fetchError) {
      setRelatedProducts([]);
    }
  }

  function handleAddToCart() {
    addToCart(product, quantity);
    toast.success(`${product.title} added to cart`);
  }

  function handleBuyNow() {
    addToCart(product, quantity);
    navigate("/cart");
  }

  function handleToggleWishlist() {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <LoadingSkeleton count={1} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <p className="text-lg font-semibold text-gray-900">{error}</p>
        <Link to="/products" className="mt-4 inline-block text-brand-600 hover:underline">
          Back to products
        </Link>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [product.thumbnail];
  const inWishlist = isInWishlist(product.id);
  const hasDiscount = product.discountPercentage > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <div className="mb-3 aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
            <img
              src={images[selectedImageIndex]}
              alt={product.title}
              className="h-full w-full object-contain p-6"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                    selectedImageIndex === index ? "border-brand-600" : "border-gray-200"
                  }`}
                >
                  <img src={image} alt="" className="h-full w-full object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-brand-600">
            {product.category}
          </span>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">{product.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{product.brand}</p>

          <div className="mt-3 flex items-center gap-2">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-gray-700">{product.rating?.toFixed(1)}</span>
            <span className="text-sm text-gray-400">&bull;</span>
            <span className={`text-sm ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
            {hasDiscount && (
              <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">
                -{Math.round(product.discountPercentage)}%
              </span>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-gray-600">{product.description}</p>

          <div className="mt-6 flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Quantity</span>
            <QuantitySelector
              quantity={quantity}
              onIncrease={() => setQuantity((value) => Math.min(value + 1, product.stock))}
              onDecrease={() => setQuantity((value) => Math.max(value - 1, 1))}
              maxQuantity={product.stock}
            />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-brand-600 px-6 py-3 text-sm font-semibold text-brand-600 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Buy Now
            </button>
            <button
              type="button"
              onClick={handleToggleWishlist}
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-gray-300 transition hover:bg-gray-50"
            >
              <Heart className={`h-5 w-5 ${inWishlist ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
            </button>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Related Products</h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
}
