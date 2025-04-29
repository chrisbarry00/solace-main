import React from 'react';

type Props = {
  handlePageChange: (page: number) => void;
  page: number;
  totalPages: number | null;
};

export default function AdvocatesFooter({ handlePageChange, page, totalPages }: Props) {
  return (
    <div className="mt-6 p-4 flex items-center justify-center gap-4">
      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-2 text-sm border rounded disabled:opacity-50 bg-white hover:bg-gray-100"
      >
        Previous
      </button>
      <span className="text-sm text-gray-700">
        Page {page}
        {totalPages ? ` of ${totalPages}` : ''}
      </span>
      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={totalPages !== null && page >= totalPages}
        className="px-3 py-2 text-sm border rounded disabled:opacity-50 bg-white hover:bg-gray-100"
      >
        Next
      </button>
    </div>
  );
}
