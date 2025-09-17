require('dotenv').config();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const createUserService = async (name, email, password) => {
    try {
        // Validate input
        if (!name || !email || !password) {
            return {
                EC: 1,
                EM: 'Tên, email và mật khẩu là bắt buộc',
                DT: null
            };
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return {
                EC: 1,
                EM: 'Email đã được sử dụng',
                DT: null
            };
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, saltRounds);
        
        // Create user
        const newUser = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashPassword,
            role: 'User',
            favoriteProducts: [],
            viewedProducts: []
        });

        return {
            EC: 0,
            EM: 'Đăng ký thành công',
            DT: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        };
    } catch (error) {
        console.error('Error creating user:', error);
        return {
            EC: 1,
            EM: 'Có lỗi xảy ra khi tạo tài khoản',
            DT: null
        };
    }
};

const loginService = async (email, password) => {
    try {
        // Validate input
        if (!email || !password) {
            return {
                EC: 1,
                EM: 'Email và mật khẩu là bắt buộc',
                DT: null
            };
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return {
                EC: 1,
                EM: 'Email hoặc mật khẩu không đúng',
                DT: null
            };
        }

        // Check password
        const isMatchPassword = await bcrypt.compare(password, user.password);
        if (!isMatchPassword) {
            return {
                EC: 1,
                EM: 'Email hoặc mật khẩu không đúng',
                DT: null
            };
        }

        // Create JWT payload with user ID
        const payload = { 
            id: user._id,
            email: user.email, 
            name: user.name,
            role: user.role
        };
        
        const access_token = jwt.sign(payload, process.env.JWT_SECRET, { 
            expiresIn: process.env.JWT_EXPIRE || '24h' 
        });

        return {
            EC: 0,
            EM: 'Đăng nhập thành công',
            DT: {
                access_token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        };
    } catch (error) {
        console.error('Error in login service:', error);
        return {
            EC: 1,
            EM: 'Có lỗi xảy ra khi đăng nhập',
            DT: null
        };
    }
};

const getUserService = async () => {
    try {
        const users = await User.find({}, { password: 0 }); // Exclude password
        return {
            EC: 0,
            EM: 'Lấy danh sách người dùng thành công',
            DT: users
        };
    } catch (error) {
        console.error('Error getting users:', error);
        return {
            EC: 1,
            EM: 'Có lỗi xảy ra khi lấy danh sách người dùng',
            DT: null
        };
    }
};

// Get current user info
const getCurrentUserService = async (userId) => {
    try {
        const user = await User.findById(userId, { password: 0 });
        if (!user) {
            return {
                EC: 1,
                EM: 'Người dùng không tồn tại',
                DT: null
            };
        }

        return {
            EC: 0,
            EM: 'Lấy thông tin người dùng thành công',
            DT: user
        };
    } catch (error) {
        console.error('Error getting current user:', error);
        return {
            EC: 1,
            EM: 'Có lỗi xảy ra khi lấy thông tin người dùng',
            DT: null
        };
    }
};

module.exports = { createUserService, loginService, getUserService, getCurrentUserService };