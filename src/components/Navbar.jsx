import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { currentUser, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  function handleSearchSubmit(event) {
    event.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  }

  function handleLogout() {
    logout();
    toast.success("Logged out successfully");
    setIsMobileMenuOpen(false);
    navigate("/login");
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Package className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold text-gray-900">SkyMart</span>
        </Link>

        <form
          onSubmit={handleSearchSubmit}
          className="hidden flex-1 items-center md:flex"
        >
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search products..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </form>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          <Link
            to="/products"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Products
          </Link>

          <Link
            to="/wishlist"
            className="relative rounded-lg p-2 text-gray-700 transition hover:bg-gray-100"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="relative rounded-lg p-2 text-gray-700 transition hover:bg-gray-100"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="ml-2 flex items-center gap-1 border-l border-gray-200 pl-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                <User className="h-4 w-4" />
                {currentUser?.name?.split(" ")[0]}
              </Link>
              <Link
                to="/orders"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Orders
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="ml-2 flex items-center gap-2 border-l border-gray-200 pl-2">
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
              >
                Register
              </Link>
            </div>
          )}
        </nav>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          className="ml-auto rounded-lg p-2 text-gray-700 md:hidden"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-gray-200 px-4 py-4 md:hidden">
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search products..."
                className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-500"
              />
            </div>
          </form>

          <div className="flex flex-col gap-1">
            <Link to="/products" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
              Products
            </Link>
            <Link to="/wishlist" onClick={closeMobileMenu} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
              Wishlist {wishlistCount > 0 && <span>({wishlistCount})</span>}
            </Link>
            <Link to="/cart" onClick={closeMobileMenu} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
              Cart {cartCount > 0 && <span>({cartCount})</span>}
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                  Profile
                </Link>
                <Link to="/orders" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                  Orders
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                  Login
                </Link>
                <Link to="/register" onClick={closeMobileMenu} className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white text-center hover:bg-brand-700">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
