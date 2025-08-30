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
                    email: decoded.email,
                    name: decoded.name
                }
                next();
            } catch (error) {
                console.log('>>> check token: ', decoded);
                return res.status(401).json({
                    message: 'Token bị hết hạn/Học không hợp lệ'
                });
            }
        } else {
            return res.status(401).json({
                message: 'Bạn chưa truyền Access Token ở header/Học token bị hết hạn'
            });
        }
    }
}

module.exports = auth;