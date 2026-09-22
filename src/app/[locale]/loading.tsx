export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-10 w-64 bg-[#D2DDDB]/60 rounded-lg"></div>
      
      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-white rounded-xl border border-[#D2DDDB]/60 p-4 space-y-3">
            <div className="h-4 w-24 bg-[#D2DDDB]/50 rounded"></div>
            <div className="h-8 w-16 bg-[#D2DDDB]/70 rounded"></div>
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="bg-white rounded-2xl border border-[#D2DDDB]/60 p-6 space-y-6">
        <div className="h-6 w-72 bg-[#D2DDDB]/60 rounded"></div>
        <div className="space-y-3">
          <div className="h-12 w-full bg-[#F3F7F6] rounded-lg"></div>
          <div className="h-12 w-full bg-[#F3F7F6] rounded-lg"></div>
          <div className="h-12 w-full bg-[#F3F7F6] rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
