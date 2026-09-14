import { Link, Navigate, useLocation } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { formatPrice } from "../utils/calculations";

export default function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-9 w-9 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900">Order Placed Successfully!</h1>
        <p className="mt-1 text-sm text-gray-500">
          Thank you for shopping with SkyMart. Your order is being processed.
        </p>

        <div className="mt-6 rounded-lg bg-gray-50 p-4 text-left">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Order ID</span>
            <span className="font-medium text-gray-900">{order.id}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-gray-500">Payment Method</span>
            <span className="font-medium capitalize text-gray-900">{order.paymentMethod}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-gray-500">Items</span>
            <span className="font-medium text-gray-900">{order.items.length}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 text-sm font-bold">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/products"
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Continue Shopping
          </Link>
          <Link
            to="/orders"
            className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
