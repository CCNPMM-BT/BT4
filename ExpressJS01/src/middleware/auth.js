require('dotenv').config();
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const white_lists = ["/", "/register", "/login"];
    if (white_lists.some(item => req.originalUrl.endsWith(item))) {
        next();
    } else {
        if (req?.headers?.authorization?.split(' ')[1]) {
            const token = req.headers.authorization.split(' ')[1];
            //verify token
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = {
                    id: decoded.id,
                    email: decoded.email,
                    name: decoded.name,
                    role: decoded.role
                }
                next();
            } catch (error) {
                console.log('>>> check token error: ', error.message);
                return res.status(401).json({
                    EC: 1,
                    EM: 'Token bị hết hạn hoặc không hợp lệ',
                    DT: null
                });
            }
        } else {
            return res.status(401).json({
                EC: 1,
                EM: 'Bạn chưa truyền Access Token ở header',
                DT: null
            });
        }
    }
}

module.exports = auth;