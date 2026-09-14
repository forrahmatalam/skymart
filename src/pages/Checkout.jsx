import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { addUserOrder } from "../utils/storage";
import {
  calculateSubtotal,
  calculateDiscount,
  calculateShipping,
  formatPrice,
} from "../utils/calculations";

const PAYMENT_METHODS = [
  { value: "cod", label: "Cash on Delivery" },
  { value: "upi", label: "UPI" },
  { value: "card", label: "Card" },
];

const INITIAL_FORM_STATE = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

export default function Checkout() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { currentUser } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const subtotal = calculateSubtotal(cartItems);
  const discount = calculateDiscount(cartItems);
  const shipping = calculateShipping(subtotal);
  const total = subtotal - discount + shipping;

  function handleFieldChange(field, value) {
    setFormData((previous) => ({ ...previous, [field]: value }));
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "Enter a valid 10-digit phone number.";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required.";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
    }
    if (!formData.state.trim()) {
      newErrors.state = "State is required.";
    }
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required.";
    } else if (!/^\d{4,6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = "Enter a valid pincode.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const order = {
      id: `ORD-${Date.now()}`,
      userId: currentUser.id,
      items: cartItems,
      customer: { ...formData },
      paymentMethod,
      subtotal,
      discount,
      shipping,
      total,
      status: "Processing",
      createdAt: new Date().toISOString(),
    };

    addUserOrder(currentUser.id, order);
    clearCart();

    toast.success("Order placed successfully");
    navigate("/order-success", { state: { order } });
    setIsSubmitting(false);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Shipping Details</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Full Name"
                value={formData.fullName}
                onChange={(value) => handleFieldChange("fullName", value)}
                error={errors.fullName}
              />
              <FormField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(value) => handleFieldChange("email", value)}
                error={errors.email}
              />
              <FormField
                label="Phone"
                value={formData.phone}
                onChange={(value) => handleFieldChange("phone", value)}
                error={errors.phone}
              />
              <FormField
                label="Pincode"
                value={formData.pincode}
                onChange={(value) => handleFieldChange("pincode", value)}
                error={errors.pincode}
              />
              <FormField
                label="City"
                value={formData.city}
                onChange={(value) => handleFieldChange("city", value)}
                error={errors.city}
              />
              <FormField
                label="State"
                value={formData.state}
                onChange={(value) => handleFieldChange("state", value)}
                error={errors.state}
              />
              <div className="sm:col-span-2">
                <FormField
                  label="Address"
                  value={formData.address}
                  onChange={(value) => handleFieldChange("address", value)}
                  error={errors.address}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Payment Method</h2>

            <div className="space-y-2">
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition ${
                    paymentMethod === method.value
                      ? "border-brand-600 bg-brand-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                    className="h-4 w-4 accent-brand-600"
                  />
                  {method.label}
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-400">
              This is a demo store. No real payment will be processed.
            </p>
          </div>
        </div>

        <div className="h-fit rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h2>

          <div className="mb-4 max-h-48 space-y-2 overflow-y-auto text-sm">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-gray-600">
                <span className="line-clamp-1">{item.title} x{item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-gray-200 pt-4 text-sm">
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

          <button
            type="submit"
            disabled={isSubmitting || cartItems.length === 0}
            className="mt-6 w-full rounded-lg bg-brand-600 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {isSubmitting ? "Placing order..." : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
}

function FormField({ label, value, onChange, error, type = "text" }) {
  const fieldId = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div>
      <label htmlFor={fieldId} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={fieldId}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
          error ? "border-red-300 focus:ring-red-100" : "border-gray-300 focus:border-brand-500 focus:ring-brand-100"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
