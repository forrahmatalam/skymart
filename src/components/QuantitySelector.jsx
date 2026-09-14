import { Minus, Plus } from "lucide-react";

export default function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  minQuantity = 1,
  maxQuantity = 99,
}) {
  const isAtMinimum = quantity <= minQuantity;
  const isAtMaximum = quantity >= maxQuantity;

  return (
    <div className="flex items-center rounded-lg border border-gray-300">
      <button
        type="button"
        onClick={onDecrease}
        disabled={isAtMinimum}
        aria-label="Decrease quantity"
        className="flex h-9 w-9 items-center justify-center rounded-l-lg text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-10 text-center text-sm font-medium text-gray-900">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={isAtMaximum}
        aria-label="Increase quantity"
        className="flex h-9 w-9 items-center justify-center rounded-r-lg text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
