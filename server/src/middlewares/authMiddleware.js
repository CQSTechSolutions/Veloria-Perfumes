const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(401).send('Unauthorized');
            } else {
                req.user = decoded;
                next();
            }
        });
    } else {
        res.status(401).send('Unauthorized');
    }
};

const isAdmin = (req, res, next) => {
    if (req.user.role === 'admin') {
        next();
    } else {
        res.status(403).send('Forbidden');
    }
};

module.exports = { isAdmin, isAuthenticated };