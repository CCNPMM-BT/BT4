require('dotenv').config();
const mongoose = require('mongoose');

const dbState = [
    { value: 0, label: 'disconnected' },
    { value: 1, label: 'connected' },
    { value: 2, label: 'connecting' },
    { value: 3, label: 'disconnecting' }
];

const connection = async () => {
    const mongoUrl = process.env.MONGO_DB_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/expressjs01';
    await mongoose.connect(mongoUrl);
    const state = Number(mongoose.connection.readyState);
    console.log(dbState.find(f => f.value === state).label, 'to database');
};

module.exports = connection;