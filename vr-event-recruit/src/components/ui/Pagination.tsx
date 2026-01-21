'use client';

import styles from './Pagination.module.css';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages < 1) return null; // Only hide if 0 pages (no results)

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5; // How many numbers to show around current

        if (totalPages <= 7) {
            // If few pages, show all
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            // Complex logic: 1 ... 4 5 6 ... 10
            pages.push(1);

            if (currentPage > 4) pages.push('...');

            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            // Adjust window if near start or end
            if (currentPage <= 4) {
                start = 2;
                end = 5;
            } else if (currentPage >= totalPages - 3) {
                start = totalPages - 4;
                end = totalPages - 1;
            }

            for (let i = start; i <= end; i++) pages.push(i);

            if (currentPage < totalPages - 3) pages.push('...');

            pages.push(totalPages);
        }
        return pages;
    };

    const pages = getPageNumbers();

    return (
        <div className={styles.container}>
            {/* Prev Button (Optional if you want to keep it alongside numbers, or depend on numbers) */}
            {/* User image didn't clearly show Prev/Next, but usually they exist. I will keep them but style them similarly. */}
            {/* Actually user image only shows numbers 1 2 3 ... 562. But usability-wise Prev/Next is good. */}
            {/* I'll add Prev/Next for accessibility and usability but style them to fit. */}

            <button
                className={styles.navButton}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                &lt;
            </button>

            {pages.map((page, idx) => {
                if (page === '...') {
                    return <span key={`ellipsis-${idx}`} className={styles.ellipsis}>...</span>;
                }

                const pageNum = page as number;
                return (
                    <button
                        key={pageNum}
                        className={`${styles.pageButton} ${currentPage === pageNum ? styles.active : ''}`}
                        onClick={() => onPageChange(pageNum)}
                    >
                        {pageNum}
                    </button>
                );
            })}

            <button
                className={styles.navButton}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                &gt;
            </button>
        </div>
    );
}
