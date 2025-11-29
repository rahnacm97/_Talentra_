import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  variant?: "default" | "employer";
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  const delta = 2;
  const pages: (number | string)[] = [];

  pages.push(1);
  if (currentPage > delta + 2) pages.push("...");

  for (
    let i = Math.max(2, currentPage - delta);
    i <= Math.min(totalPages - 1, currentPage + delta);
    i++
  ) {
    pages.push(i);
  }

  if (currentPage < totalPages - delta - 1) pages.push("...");
  if (totalPages > 1) pages.push(totalPages);

  const uniquePages = Array.from(new Set(pages));

  const baseBtn = "px-4 py-2.5 text-sm font-medium rounded-lg transition-all";
  const activeBtn = "bg-indigo-600 text-white shadow-md";
  const inactiveBtn =
    "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50";
  const disabledBtn = "opacity-50 cursor-not-allowed";

  return (
    <nav
      className={`flex items-center justify-center gap-2 cursor-pointer mt-10 ${className}`}
      aria-label="Pagination"
    >
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`${baseBtn} ${currentPage === 1 ? disabledBtn : inactiveBtn} flex items-center gap-1 cursor-pointer`}
      >
        <ChevronLeft className="w-4 h-4" />
        Prev
      </button>

      {uniquePages.map((p, idx) =>
        p === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className="px-3 py-2 text-gray-500 cursor-pointer"
          >
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`${baseBtn} ${
              currentPage === p ? activeBtn : inactiveBtn
            } min-w-10 cursor-pointer`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`${baseBtn} ${currentPage === totalPages ? disabledBtn : inactiveBtn} flex items-center gap-1 cursor-pointer`}
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
};

export default Pagination;
