const pagesVisible = 7;

export const generatePaginationNumbers = ( currentePage: number, totalPages: number ) => {
    if (totalPages < pagesVisible) {
        return Array.from({ length: totalPages }, ( _, i ) => i + 1);
    }

    if (currentePage <= 3) {
        return [1, 2, 3, '...', totalPages - 1, totalPages];
    }

    if (currentePage >= totalPages - 2) {
        return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentePage - 1, currentePage, currentePage + 1,  '...', totalPages];
}