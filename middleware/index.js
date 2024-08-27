const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateJWT = (req, res, next) => {
    // Ambil token dari header Authorization
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Misalnya: Bearer <token>
        
        // Verifikasi token
        jwt.verify(token, process.env.JWT_PASS, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden. Invalid token.' });
            }

            // Tambahkan objek user ke req untuk digunakan di rute
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ message: 'Unauthorized. No token provided.' });
    }
};

module.exports = authenticateJWT;
