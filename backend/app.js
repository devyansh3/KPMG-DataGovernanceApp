// Load environment variables from .env file
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const passport = require('./config/passportConfig');
const routes = require('./routes');
const { ERROR_MESSAGES, STATUS_CODES } = require('./utils/constants.js');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(
    cors({
        credentials: true,
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            //  Check if the origin is allowed
            const allowedOrigins = [process.env.ALLOWED_ORIGIN];
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error(ERROR_MESSAGES.CORS_ERROR));
            }
        }
    })
);

// MongoDB connection
// MongoDB connection
mongoose.connect(process.env.DB_URL)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

app.use('', routes);

// Server setup
startServer();

function startServer() {
    const port = Number(process.env.PORT);
    console.log(new Date().toISOString(), `Environment Name: ${process.env.NODE_ENV}`);
    app.listen(port, () => {
        console.log(new Date().toISOString(), `Server is listening on port ${port}`);
    });
}