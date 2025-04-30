const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL);

const connection = mongoose.connection;

connection.on('connected', () => {
    console.log('Database connected successfully');
})

connection.on('error', (err) => {
    console.log('Database connection error: ', err);
})

module.exports = mongoose;