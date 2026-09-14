import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { getProducts, getCategories, searchProducts } from "../services/api";
import ProductGrid from "../components/ProductGrid";
import LoadingSkeleton from "../components/LoadingSkeleton";

const PRODUCTS_PER_PAGE = 12;

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);

  const searchQuery = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "all";
  const sortOption = searchParams.get("sort") || "default";

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [searchQuery]);

  useEffect(() => {
    setVisibleCount(PRODUCTS_PER_PAGE);
  }, [searchQuery, selectedCategory, sortOption]);

  async function loadProducts() {
    setLoading(true);
    setError(false);

    try {
      const products = searchQuery
        ? await searchProducts(searchQuery)
        : await getProducts({ limit: 100 });
      setAllProducts(products);
    } catch (fetchError) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function loadCategories() {
    const fetchedCategories = await getCategories();
    setCategories(fetchedCategories);
  }

  function handleCategoryChange(category) {
    const updatedParams = new URLSearchParams(searchParams);

    if (category === "all") {
      updatedParams.delete("category");
    } else {
      updatedParams.set("category", category);
    }

    setSearchParams(updatedParams);
  }

  function handleSortChange(event) {
    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.set("sort", event.target.value);
    setSearchParams(updatedParams);
  }

  function handleLoadMore() {
    setVisibleCount((count) => count + PRODUCTS_PER_PAGE);
  }

  const categoryFilteredProducts = allProducts.filter((product) => {
    if (selectedCategory === "all") {
      return true;
    }
    return product.category === selectedCategory;
  });

  const sortedProducts = [...categoryFilteredProducts].sort((firstProduct, secondProduct) => {
    if (sortOption === "price-asc") {
      return firstProduct.price - secondProduct.price;
    }
    if (sortOption === "price-desc") {
      return secondProduct.price - firstProduct.price;
    }
    if (sortOption === "rating") {
      return secondProduct.rating - firstProduct.rating;
    }
    return 0;
  });

  const visibleProducts = sortedProducts.slice(0, visibleCount);
  const hasMoreProducts = visibleCount < sortedProducts.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {searchQuery ? `Results for "${searchQuery}"` : "All Products"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {sortedProducts.length} product{sortedProducts.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleCategoryChange("all")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              selectedCategory === "all"
                ? "bg-brand-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {categories.slice(0, 8).map((category) => {
            const categoryValue = typeof category === "string" ? category : category.slug;
            const categoryLabel = typeof category === "string" ? category : category.name;

            return (
              <button
                key={categoryValue}
                type="button"
                onClick={() => handleCategoryChange(categoryValue)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
                  selectedCategory === categoryValue
                    ? "bg-brand-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {categoryLabel}
              </button>
            );
          })}
        </div>

        <select
          value={sortOption}
          onChange={handleSortChange}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
        >
          <option value="default">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      {loading && <LoadingSkeleton count={12} />}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
          Something went wrong while loading products. Please try again.
        </div>
      )}

      {!loading && !error && (
        <>
          <ProductGrid products={visibleProducts} />

          {hasMoreProducts && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={handleLoadMore}
                className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
