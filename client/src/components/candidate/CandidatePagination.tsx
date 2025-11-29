import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showPageNumbers?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  showPageNumbers = true,
}) => {
  if (totalPages <= 1) return null;

  const delta = 2;
  const pages: (number | string)[] = [];

  pages.push(1);

  if (currentPage > delta + 2) {
    pages.push("...");
  }

  for (
    let i = Math.max(2, currentPage - delta);
    i <= Math.min(totalPages - 1, currentPage + delta);
    i++
  ) {
    pages.push(i);
  }

  if (currentPage < totalPages - delta - 1) {
    pages.push("...");
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  const uniquePages = Array.from(new Set(pages));

  return (
    <nav
      className={`flex items-center justify-center gap-1 mt-10 ${className}`}
      aria-label="Pagination"
    >
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium rounded-lg transition-all
                   bg-white border border-gray-300 text-gray-700
                   hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center gap-1 cursor-pointer"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
        Prev
      </button>

      {showPageNumbers &&
        uniquePages.map((p, idx) =>
          p === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-3 py-2 text-gray-500 cursor-pointer"
              aria-hidden="true"
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer
                         ${
                           currentPage === p
                             ? "bg-blue-600 text-white shadow-sm"
                             : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                         }`}
              aria-label={`Page ${p}`}
              aria-current={currentPage === p ? "page" : undefined}
            >
              {p}
            </button>
          ),
        )}

      {!showPageNumbers && (
        <span className="px-4 py-2 text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium rounded-lg transition-all
                   bg-white border border-gray-300 text-gray-700
                   hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center gap-1 cursor-pointer"
        aria-label="Next page"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
};

export default Pagination;
