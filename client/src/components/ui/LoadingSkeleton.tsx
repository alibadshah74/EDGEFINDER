export function LoadingSkeleton() {
  return (
    <div className="rounded-lg border border-white/10 bg-[#121823]/86 p-4 shadow-2xl shadow-black/20">
      <div className="mb-4 h-9 w-72 animate-pulse rounded-md bg-white/8" />
      <div className="space-y-2">
        {Array.from({ length: 12 }).map((_, row) => (
          <div key={row} className="grid grid-cols-8 gap-2">
            {Array.from({ length: 8 }).map((__, col) => (
              <div
                key={`${row}-${col}`}
                className="h-9 animate-pulse rounded-md bg-white/[0.045]"
                style={{ animationDelay: `${(row + col) * 35}ms` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
