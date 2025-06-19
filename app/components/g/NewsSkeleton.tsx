interface NewsSkeletonProps {
  type?: "card" | "hero" | "article" | "list";
  count?: number;
}

export function NewsSkeleton({ type = "card", count = 1 }: NewsSkeletonProps) {
  const renderCardSkeleton = () => (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-md animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-48 bg-gray-200"></div>
      
      <div className="p-6">
        {/* Category badge skeleton */}
        <div className="mb-3">
          <div className="inline-block w-16 h-6 bg-gray-200 rounded-full"></div>
        </div>
        
        {/* Title skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        
        {/* Excerpt skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          <div className="h-3 bg-gray-200 rounded w-4/6"></div>
        </div>
        
        {/* Meta info skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-3 bg-gray-200 rounded w-20"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );

  const renderHeroSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
      {/* Featured Article Skeleton */}
      <div className="lg:col-span-2">
        <div className="relative overflow-hidden rounded-xl bg-white shadow-lg">
          <div className="relative">
            <div className="w-full h-80 md:h-96 bg-gray-200"></div>
            {/* Badge skeleton */}
            <div className="absolute top-6 left-6">
              <div className="w-24 h-8 bg-gray-300 rounded-full"></div>
            </div>
            {/* Content overlay skeleton */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="space-y-3">
                <div className="h-6 bg-gray-300 rounded w-full"></div>
                <div className="h-6 bg-gray-300 rounded w-4/5"></div>
                <div className="h-4 bg-gray-300 rounded w-3/5"></div>
                <div className="h-3 bg-gray-300 rounded w-2/5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Stories Skeleton */}
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-32"></div>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderArticleSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
      {/* Header skeleton */}
      <div className="p-8 pb-0">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
          <div className="w-12 h-5 bg-gray-200 rounded-full"></div>
          <div className="w-14 h-5 bg-gray-200 rounded-full"></div>
        </div>
        
        {/* Title skeleton */}
        <div className="space-y-3 mb-4">
          <div className="h-8 bg-gray-200 rounded w-full"></div>
          <div className="h-8 bg-gray-200 rounded w-4/5"></div>
        </div>
        
        {/* Excerpt skeleton */}
        <div className="space-y-2 mb-6">
          <div className="h-5 bg-gray-200 rounded w-full"></div>
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        </div>
        
        {/* Author info skeleton */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="space-y-1">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="h-3 bg-gray-200 rounded w-20"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>

      {/* Image skeleton */}
      <div className="px-8 py-6">
        <div className="w-full h-64 md:h-96 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Content skeleton */}
      <div className="px-8 pb-8">
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              {index % 3 === 0 && <div className="h-4 bg-gray-200 rounded w-4/6"></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderListSkeleton = () => (
    <div className="space-y-6 animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex space-x-4 p-4 bg-white rounded-lg shadow-sm">
          <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-4 bg-gray-200 rounded"></div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-4/5"></div>
            <div className="h-4 bg-gray-200 rounded w-3/5"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSkeletons = () => {
    switch (type) {
      case "hero":
        return renderHeroSkeleton();
      case "article":
        return renderArticleSkeleton();
      case "list":
        return renderListSkeleton();
      case "card":
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, index) => (
              <div key={index}>
                {renderCardSkeleton()}
              </div>
            ))}
          </div>
        );
    }
  };

  return <>{renderSkeletons()}</>;
}

// Navigation skeleton
export function NavigationSkeleton() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo skeleton */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-200 rounded-lg mr-3"></div>
            <div className="w-20 h-6 bg-gray-200 rounded"></div>
          </div>

          {/* Navigation items skeleton */}
          <div className="hidden md:flex items-center space-x-8">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="w-16 h-4 bg-gray-200 rounded"></div>
            ))}
          </div>

          {/* Search button skeleton */}
          <div className="w-20 h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    </nav>
  );
}

// Category section skeleton
export function CategorySectionSkeleton() {
  return (
    <section className="mb-12 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="w-48 h-8 bg-gray-200 rounded"></div>
        <div className="w-16 h-6 bg-gray-200 rounded"></div>
      </div>
      <NewsSkeleton type="card" count={4} />
    </section>
  );
}
