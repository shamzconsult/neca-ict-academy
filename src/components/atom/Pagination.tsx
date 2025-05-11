export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  return (
    <div className='flex justify-center gap-2 mt-4 p-4'>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className='px-4 py-2 border rounded disabled:opacity-50 cursor-pointer'>
        Previous
      </button>
      <span className='px-4 py-2'>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className='px-4 py-2 border rounded disabled:opacity-50 cursor-pointer'>
        Next
      </button>
    </div>
  );
};
