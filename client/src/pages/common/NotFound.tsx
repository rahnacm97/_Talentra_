import React from "react";
import { Link } from "react-router-dom";
import ErrorIcon from "@mui/icons-material/Error";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-red-100 rounded-full animate-pulse"></div>
          </div>
          <div className="relative flex items-center justify-center">
            <ErrorIcon
              sx={{ fontSize: 100, color: "#ef4444" }}
              className="animate-bounce"
            />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          4<span className="text-blue-600">0</span>4
        </h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          We couldn't find the page you're looking for. It might have been
          moved, deleted, or perhaps it never existed.
        </p>

        {/* Helpful Suggestions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Here are some helpful links:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/"
              className="flex flex-col items-center p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-200 hover:scale-105 group"
            >
              <HomeIcon
                className="text-blue-600 mb-2 group-hover:scale-110 transition-transform"
                sx={{ fontSize: 32 }}
              />
              <span className="font-medium text-gray-800">Home</span>
              <span className="text-sm text-gray-600">Go to homepage</span>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex flex-col items-center p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-all duration-200 hover:scale-105 group"
            >
              <ArrowBackIcon
                className="text-purple-600 mb-2 group-hover:scale-110 transition-transform"
                sx={{ fontSize: 32 }}
              />
              <span className="font-medium text-gray-800">Go Back</span>
              <span className="text-sm text-gray-600">Previous page</span>
            </button>

            <Link
              to="/search"
              className="flex flex-col items-center p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-all duration-200 hover:scale-105 group"
            >
              <SearchIcon
                className="text-green-600 mb-2 group-hover:scale-110 transition-transform"
                sx={{ fontSize: 32 }}
              />
              <span className="font-medium text-gray-800">Search</span>
              <span className="text-sm text-gray-600">Find what you need</span>
            </Link>
          </div>
        </div>

        {/* Primary CTA Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <HomeIcon />
          Take Me Home
        </Link>

        {/* Error Code Reference */}
        <p className="mt-8 text-sm text-gray-500">
          Error Code: 404 | If you believe this is a mistake, please contact
          support.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
