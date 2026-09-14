// All network requests to the DummyJSON product API are centralized here so
// pages and components never call fetch() directly.

const BASE_URL = "https://dummyjson.com";

async function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export async function getProducts({ limit = 100, skip = 0 } = {}) {
  try {
    const response = await fetch(
      `${BASE_URL}/products?limit=${limit}&skip=${skip}`
    );
    const data = await handleResponse(response);
    return data.products || [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw new Error("We couldn't load products right now. Please try again.");
  }
}

export async function getProductById(id) {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);

    if (response.status === 404) {
      throw new Error("Product not found.");
    }

    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error);
    throw error instanceof Error
      ? error
      : new Error("We couldn't load this product right now.");
  }
}

export async function getProductsByCategory(category) {
  try {
    const response = await fetch(
      `${BASE_URL}/products/category/${category}`
    );
    const data = await handleResponse(response);
    return data.products || [];
  } catch (error) {
    console.error(`Failed to fetch category ${category}:`, error);
    throw new Error("We couldn't load these products right now.");
  }
}

export async function searchProducts(query) {
  try {
    const response = await fetch(
      `${BASE_URL}/products/search?q=${encodeURIComponent(query)}`
    );
    const data = await handleResponse(response);
    return data.products || [];
  } catch (error) {
    console.error(`Failed to search products for "${query}":`, error);
    throw new Error("We couldn't complete your search right now.");
  }
}

export async function getCategories() {
  try {
    const response = await fetch(`${BASE_URL}/products/categories`);
    const data = await handleResponse(response);
    return data || [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}
