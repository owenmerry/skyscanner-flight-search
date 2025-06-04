export function FlightSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <div className="h-4 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Flight Card Skeletons */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <FlightCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

function FlightCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
          {/* Airline & Aircraft Skeleton */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            <div>
              <div className="h-5 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
          </div>

          {/* Flight Times Skeleton */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="h-8 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
              </div>
              
              <div className="flex-1 mx-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                </div>
                <div className="text-center mt-1">
                  <div className="h-3 bg-gray-200 rounded w-12 mx-auto animate-pulse"></div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="h-8 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Price & Book Skeleton */}
          <div className="text-center lg:text-right">
            <div className="h-8 bg-gray-200 rounded w-20 mb-2 mx-auto lg:mx-0 lg:ml-auto animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-16 mb-4 mx-auto lg:mx-0 lg:ml-auto animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-full lg:w-32 lg:ml-auto animate-pulse"></div>
          </div>
        </div>

        {/* Details Toggle Skeleton */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}