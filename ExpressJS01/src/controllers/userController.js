const { createUserService, loginService, getUserService, getCurrentUserService } = require('../services/userService');

const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const result = await createUserService(name, email, password);
        
        if (result.EC === 0) {
            return res.status(201).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error('Error in createUser controller:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Có lỗi xảy ra ở server',
            DT: null
        });
    }
};

const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await loginService(email, password);
        
        if (result.EC === 0) {
            return res.status(200).json(result);
        } else {
            return res.status(401).json(result);
        }
    } catch (error) {
        console.error('Error in handleLogin controller:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Có lỗi xảy ra ở server',
            DT: null
        });
    }
};

const getUser = async (req, res) => {
    try {
        const result = await getUserService();
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error in getUser controller:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Có lỗi xảy ra ở server',
            DT: null
        });
    }
};

const getAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await getCurrentUserService(userId);
        
        if (result.EC === 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json(result);
        }
    } catch (error) {
        console.error('Error in getAccount controller:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Có lỗi xảy ra ở server',
            DT: null
        });
    }
};

module.exports = { createUser, handleLogin, getUser, getAccount };