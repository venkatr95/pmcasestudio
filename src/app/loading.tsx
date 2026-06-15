export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-app/80 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-accent-app/20 animate-pulse" />
        
        {/* Inner spinning ring */}
        <div className="w-16 h-16 rounded-full border-4 border-transparent border-t-accent-app animate-spin" />
        
        {/* Center dot */}
        <div className="absolute w-2 h-2 rounded-full bg-accent-app animate-pulse" />
      </div>
      <p className="mt-4 text-sm font-medium text-primary-app animate-pulse">Loading...</p>
    </div>
  );
}
