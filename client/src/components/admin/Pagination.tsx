import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const Pagination = ({ currentPage, totalPages, paginate }: any) => (
  <div className="flex items-center justify-between mt-6">
    <div className="text-sm text-gray-700">
      Showing page {currentPage} of {totalPages}
    </div>
    <div className="flex items-center space-x-2">
      <button
        onClick={() => paginate(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
      >
        <ArrowBackIcon sx={{ fontSize: 16, marginRight: 0.5 }} />
        Previous
      </button>

      <div className="flex space-x-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNum = i + 1;
          return (
            <button
              key={pageNum}
              onClick={() => paginate(pageNum)}
              className={`px-3 py-2 cursor-pointer rounded-lg text-sm font-medium transition-colors duration-200 ${
                currentPage === pageNum
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
      >
        Next
        <ArrowForwardIcon sx={{ fontSize: 16, marginLeft: 0.5 }} />
      </button>
    </div>
  </div>
);

export default Pagination;
