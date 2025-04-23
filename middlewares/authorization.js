

function authorization(req, res, next) {

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access forbidden: admin only' });
    }
    
    next();
}

module.exports = authorization