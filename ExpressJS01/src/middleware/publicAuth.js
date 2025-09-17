const jwt = require('jsonwebtoken');

const publicAuth = (req, res, next) => {
    // Cho phép truy cập public vào các routes products và categories
    const publicRoutes = ['/categories', '/products'];
    const isPublicRoute = publicRoutes.some(route => req.path.startsWith(route));
    
    if (isPublicRoute) {
        return next();
    }
    
    // Với các routes khác, yêu cầu authentication
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ EC: 1, EM: 'Access token is required' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ EC: 1, EM: 'Invalid access token' });
    }
};

module.exports = publicAuth;


