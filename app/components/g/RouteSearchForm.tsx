import { Form, useSubmit } from "@remix-run/react";
import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";

interface RouteSearchFormProps {
  initialSearch?: string | null;
  totalRoutes: number;
}

export function RouteSearchForm({ initialSearch, totalRoutes }: RouteSearchFormProps) {
  const submit = useSubmit();
  const [searchValue, setSearchValue] = useState(initialSearch || "");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setSearchValue(initialSearch || "");
  }, [initialSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    const formData = new FormData();
    if (searchValue.trim()) {
      formData.append("search", searchValue.trim());
    }
    
    submit(formData, { method: "get" });
    
    // Reset searching state after a delay
    setTimeout(() => setIsSearching(false), 500);
  };

  const handleClear = () => {
    setSearchValue("");
    const formData = new FormData();
    submit(formData, { method: "get" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            name="search"
            value={searchValue}
            onChange={handleInputChange}
            placeholder="Search by city, airport code, or destination..."
            className="w-full pl-12 pr-20 py-4 text-lg border-2 border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            autoComplete="off"
          />
          
          {searchValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-14 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          
          <button
            type="submit"
            disabled={isSearching}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-full font-medium transition-colors"
          >
            {isSearching ? "..." : "Search"}
          </button>
        </div>
      </Form>

      {/* Search Stats */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          {initialSearch ? (
            <>
              {totalRoutes > 0 
                ? `Found ${totalRoutes} routes matching "${initialSearch}"`
                : `No routes found for "${initialSearch}"`
              }
              {totalRoutes > 0 && (
                <button
                  onClick={handleClear}
                  className="ml-2 text-blue-600 hover:text-blue-700 underline"
                >
                  Clear search
                </button>
              )}
            </>
          ) : (
            `Search ${totalRoutes} popular flight routes`
          )}
        </p>
      </div>

      {/* Quick Search Suggestions */}
      {!initialSearch && (
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-3 text-center">Popular searches:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "London",
              "New York", 
              "Tokyo",
              "Paris",
              "Dubai",
              "Sydney",
              "LAX",
              "JFK"
            ].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  setSearchValue(suggestion);
                  const formData = new FormData();
                  formData.append("search", suggestion);
                  submit(formData, { method: "get" });
                }}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}