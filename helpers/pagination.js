module.exports = (req, countDocuments) => {
    const objectPagination = {
        itemsPerPage: 4,
        currentPage: parseInt(req.query.page) || 1,
        url: req.originalUrl
    };

    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.itemsPerPage;

    objectPagination.totalPages = Math.ceil(countDocuments / objectPagination.itemsPerPage);
    
    return objectPagination;
}