
export const BeverageSkeleton = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col animate-pulse">
      {/* Fake Thumbnail Image Block */}
      <div className="w-full h-48 bg-gray-200"></div>
      
      {/* Fake Content Area */}
      <div className="p-4 flex-grow flex flex-col justify-between space-y-4">
        <div>
          {/* Fake Category Tag */}
          <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
          {/* Fake Title Line 1 */}
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-1"></div>
        </div>
        
        {/* Fake CTA Button */}
        <div className="h-9 bg-gray-200 rounded-lg w-full"></div>
      </div>
    </div>
  );
};