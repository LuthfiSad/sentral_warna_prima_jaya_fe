import React from "react";

interface IPaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<IPaginationProps> = ({
  currentPage,
  onPageChange,
  totalPages,
}) => {
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const delta = 2;

    const range = {
      start: Math.max(2, currentPage - delta),
      end: Math.min(totalPages - 1, currentPage + delta),
    };

    pageNumbers.push(
      <button
        key={1}
        onClick={() => handlePageChange(1)}
        className={
          currentPage === 1
            ? "border border-solid bg-gradient-to-tr from-gray-900 to-gray-800 border-gray-800 w-8 h-8 rounded-md text-white"
            : "border border-solid border-gray-800 w-8 h-8 rounded-md text-black"
        }
      >
        1
      </button>
    );

    if (range.start > 2) {
      pageNumbers.push(<span key="start-ellipsis">...</span>);
    }

    for (let i = range.start; i <= range.end; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={
            i === currentPage
              ? "border border-solid bg-gradient-to-tr from-gray-900 to-gray-800 border-gray-800 w-8 h-8 rounded-md text-white"
              : "border border-solid border-gray-800 w-8 h-8 rounded-md text-black"
          }
        >
          {i}
        </button>
      );
    }

    if (range.end < totalPages - 1) {
      pageNumbers.push(<span key="end-ellipsis text-black">...</span>);
    }

    if (totalPages > 1) {
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={
            currentPage === totalPages
              ? "border border-solid bg-gradient-to-tr from-gray-900 to-gray-800 border-gray-800 w-8 h-8 rounded-md text-white"
              : "border border-solid border-gray-800 w-8 h-8 rounded-md text-black"
          }
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="pagination my-6 flex items-center gap-2">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={
          currentPage === 1
            ? "border border-solid bg-gray-400 border-gray-400 h-8 rounded-md px-2 text-xs text-white"
            : "border border-solid border-gray-800 h-8 rounded-md px-2 text-black text-xs"
        }
      >
        Previous
      </button>
      <div className="flex items-center gap-2">{renderPageNumbers()}</div>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={
          currentPage === totalPages
            ? "border border-solid bg-gray-400 border-gray-400 h-8 rounded-md px-2 text-xs text-white"
            : "border border-solid border-gray-800 h-8 rounded-md px-2 text-black text-xs"
        }
      >
        Next
      </button>
    </div>
  );
};
