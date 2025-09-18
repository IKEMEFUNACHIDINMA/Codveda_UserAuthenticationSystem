const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

dotenv.config();

//Load environment variables and check for errors
const dotenvResult = dotenv.config({path: __dirname + '/.env'});
if (dotenvResult.error) {
    console.error('Error loading .env:', dotenvResult.error);
}

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
});
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});
// console.log('MONGO_URI:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    })
    .catch(err => console.error(err));