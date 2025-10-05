import { useState } from "react";
import { Search, MapPin } from "lucide-react";

// Search Component
const SearchAppBar = () => {
  const [searchType, setSearchType] = useState("jobs");
  const [location, setLocation] = useState("");
  const [keyword, setKeyword] = useState("");

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 mx-4 -mb-16 relative z-10 border border-gray-100">
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 max-w-xs mx-auto">
          <button
            onClick={() => setSearchType("jobs")}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              searchType === "jobs"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Find Jobs
          </button>
          <button
            onClick={() => setSearchType("talent")}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              searchType === "talent"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Find Talent
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              searchType === "jobs"
                ? "Job title or keyword"
                : "Skills or position"
            }
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
        </div>

        <div className="relative">
          <MapPin className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="City or remote"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
        </div>

        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200 flex items-center justify-center space-x-2">
          <Search className="w-5 h-5" />
          <span>Search</span>
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        <span className="text-gray-500 text-sm">Popular searches:</span>
        {[
          "React Developer",
          "Product Manager",
          "UX Designer",
          "Data Scientist",
        ].map((term) => (
          <button
            key={term}
            className="text-blue-600 hover:text-blue-800 text-sm bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors duration-200"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchAppBar;
