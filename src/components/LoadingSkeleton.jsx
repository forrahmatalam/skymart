export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-4 h-40 w-full rounded-lg bg-gray-200" />
      <div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />
      <div className="mb-4 h-3 w-1/2 rounded bg-gray-200" />
      <div className="h-6 w-1/3 rounded bg-gray-200" />
    </div>
  );
}

export default function LoadingSkeleton({ count = 8 }) {
  const placeholders = Array.from({ length: count });

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {placeholders.map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
