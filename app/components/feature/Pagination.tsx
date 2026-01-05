"use client";

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import clsx from "clsx";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between pt-4">
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="px-3 py-2 text-sm rounded-md border hover:bg-muted flex items-center gap-1"
        >
          <IconChevronLeft size={16} />
          Previous
        </button>

        {pages.slice(0, 5).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={clsx(
              "px-3 py-2 text-sm rounded-md border",
              currentPage === page
                ? "bg-primary text-white"
                : "hover:bg-muted"
            )}
          >
            {page}
          </button>
        ))}

        <span className="px-2">…</span>

        <button
          onClick={() => onPageChange(totalPages)}
          className="px-3 py-2 text-sm rounded-md border hover:bg-muted"
        >
          {totalPages}
        </button>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="px-3 py-2 text-sm rounded-md border hover:bg-muted flex items-center gap-1"
        >
          Next
          <IconChevronRight size={16} />
        </button>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing 100 of 1,000 results
      </p>
    </div>
  );
}
