export default function Loading() {
  return (
    <div style={{ minWidth: '1024px' }}>
      <header className="fixed top-0 left-0 text-white z-50" style={{ backgroundColor: '#BF1A1A', width: '100%', minWidth: '1024px' }}>
        <div className="py-6 px-4 text-center">
          <h1 className="text-4xl font-bold">Clear Sarkari Exam</h1>
        </div>
      </header>
      
      <main className="pt-24">
        <div className="w-full mx-auto px-10 py-8" style={{ minWidth: '1024px' }}>
          <div className="grid grid-cols-3 gap-10">
            {/* Loading skeleton for each section */}
            {[1, 2, 3].map((i) => (
              <section key={i} className="border rounded-sm">
                <div className="text-white text-xl font-bold py-4 px-6 text-center animate-pulse" style={{ backgroundColor: '#BF1A1A' }}>
                  <div className="h-6 bg-white/20 rounded w-3/4 mx-auto"></div>
                </div>
                <div className="p-6 space-y-3">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div key={j} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
