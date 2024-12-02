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

// app.use(
//     cors({
//         credentials: true,
//         origin: (origin, callback) => {
//             if (!origin) return callback(null, true); // Allow requests with no origin (e.g., mobile apps)
//             const allowedOrigins = [process.env.ALLOWED_ORIGIN];
//             if (allowedOrigins.includes(origin)) {
//                 callback(null, true);
//             } else {
//                 callback(new Error(ERROR_MESSAGES.CORS_ERROR));
//             }
//         }
//     })
// );


app.use(
    cors({
        origin: "http://localhost:5173", // Allow your frontend's origin
        credentials: true,               // Allow cookies and other credentials
        methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific HTTP methods
        allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
    })
);


// MongoDB connection
console.log("env", process.env.DB_URL)
mongoose.connect('mongodb://127.0.0.1:27017/datagovernance')
    .then(() => {
        console.log('MongoDB connected');
        startServer(); // Start the server after successful connection
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit if MongoDB connection fails
    });


// Routes
app.use('/', routes);

// Server setup
function startServer() {
    const port = Number(process.env.PORT) || 3000;
    console.log(new Date().toISOString(), `Environment: ${process.env.NODE_ENV}`);
    app.listen(port, () => {
        console.log(new Date().toISOString(), `Server is listening on port ${port}`);
    });
}
