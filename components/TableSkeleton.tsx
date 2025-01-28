export function TableSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
      <div className="space-y-3">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="grid grid-cols-9 gap-4">
            {[...Array(9)].map((_, j) => (
              <div key={j} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

