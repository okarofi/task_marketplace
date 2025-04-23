
function errorHandler(err, req, res, next) {
    console.error(err); // log ke terminal untuk debug

    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(status).json({ error: message });
}

module.exports = errorHandler