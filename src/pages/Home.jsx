import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Truck, Undo2 } from "lucide-react";
import { getProducts } from "../services/api";
import { getRecentlyViewed } from "../utils/storage";
import { useAuth } from "../context/AuthContext";
import ProductGrid from "../components/ProductGrid";
import LoadingSkeleton from "../components/LoadingSkeleton";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { currentUser } = useAuth();

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  useEffect(() => {
    loadRecentlyViewed();
  }, [currentUser]);

  async function loadFeaturedProducts() {
    setLoading(true);
    setError(false);

    try {
      const products = await getProducts({ limit: 8 });
      setFeaturedProducts(products);
    } catch (fetchError) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  function loadRecentlyViewed() {
    if (currentUser) {
      setRecentProducts(getRecentlyViewed(currentUser.id));
    } else {
      setRecentProducts([]);
    }
  }

  return (
    <div>
      <section className="bg-gradient-to-br from-brand-600 to-brand-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-xl">
            <h1 className="text-3xl font-bold sm:text-5xl">
              Everything you need, delivered to your door.
            </h1>
            <p className="mt-4 text-lg text-brand-100">
              Discover thousands of quality products at prices that make sense.
            </p>
            <Link
              to="/products"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
            >
              Shop now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
            <Truck className="h-8 w-8 text-brand-600" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Free Shipping</p>
              <p className="text-xs text-gray-500">On orders over $100</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
            <Undo2 className="h-8 w-8 text-brand-600" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Easy Returns</p>
              <p className="text-xs text-gray-500">30-day return policy</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
            <ShieldCheck className="h-8 w-8 text-brand-600" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Secure Checkout</p>
              <p className="text-xs text-gray-500">Your data stays protected</p>
            </div>
          </div>
        </div>
      </section>

      {recentProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Recently Viewed</h2>
          <ProductGrid products={recentProducts} />
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Featured Products</h2>
          <Link to="/products" className="text-sm font-medium text-brand-600 hover:underline">
            View all
          </Link>
        </div>

        {loading && <LoadingSkeleton count={8} />}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
            We couldn't load featured products. Please refresh the page.
          </div>
        )}

        {!loading && !error && <ProductGrid products={featuredProducts} />}
      </section>
    </div>
  );
}
