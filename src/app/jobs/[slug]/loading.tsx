export default function Loading() {
  return (
    <div>
      <header className="fixed top-0 left-0 w-full text-white z-50" style={{ backgroundColor: '#BF1A1A' }}>
        <div className="container mx-auto py-6 px-4 text-center">
          <h1 className="text-4xl font-bold">Clear Sarkari Exam</h1>
        </div>
      </header>
      
      <main className="pt-24 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8" style={{ width: '70%' }}>
          {/* Loading skeleton */}
          <div className="animate-pulse">
            {/* Job title skeleton */}
            <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            
            {/* Organization skeleton */}
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
            
            {/* Main content box skeleton */}
            <div className="border-2 border-gray-300 bg-white p-4 rounded-sm">
              {/* Two columns skeleton */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="border border-gray-300 p-4 rounded-sm">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="border border-gray-300 p-4 rounded-sm">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
              
              {/* Additional sections skeleton */}
              <div className="space-y-4">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
