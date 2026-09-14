import { Link } from "react-router-dom";
import { Package } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                <Package className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-gray-900">SkyMart</span>
            </div>
            <p className="text-sm text-gray-500">
              Your everyday shop for quality products at honest prices.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/products" className="hover:text-brand-600">All Products</Link></li>
              <li><Link to="/wishlist" className="hover:text-brand-600">Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-brand-600">Cart</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Account</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/profile" className="hover:text-brand-600">Profile</Link></li>
              <li><Link to="/orders" className="hover:text-brand-600">Orders</Link></li>
              <li><Link to="/login" className="hover:text-brand-600">Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">About</h4>
            <p className="text-sm text-gray-500">
              SkyMart is a demo storefront built for portfolio purposes. No real
              orders or payments are processed.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
          &copy; {currentYear} SkyMart. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
