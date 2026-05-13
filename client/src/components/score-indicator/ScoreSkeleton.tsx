export function ScoreSkeleton() {
  return (
    <div className="grid min-h-[calc(100vh-5.25rem)] gap-3">
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-20 animate-pulse rounded border border-white/10 bg-white/[0.045]" style={{ animationDelay: `${index * 55}ms` }} />
        ))}
      </div>
      <div className="h-[64vh] animate-pulse rounded border border-white/10 bg-white/[0.045]" />
    </div>
  )
}
