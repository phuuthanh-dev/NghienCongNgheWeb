module.exports = (objectPagination, req, countDocuments) => {
    if (req.query.page) {
        objectPagination.currentPage = parseInt(req.query.page);
    }

    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.itemsPerPage;

    objectPagination.totalPages = Math.ceil(countDocuments / objectPagination.itemsPerPage);
    
    return objectPagination;
}