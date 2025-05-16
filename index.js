const express = require('express');
const connectToMongo = require('./db');
const cors = require('cors');
const morgan = require('morgan');

connectToMongo(); // ✅ Ensure MongoDB connection

const app = express();
const port = process.env.PORT || 5000;

// ✅ Configure CORS
app.use(cors({
    origin: '*',  // Allow all origins (for dev), change as needed for production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'auth-token']
}));

// ✅ Middleware
app.use(express.json()); // Enable JSON parsing
app.use(morgan('dev')); // ✅ Log requests to console

// ✅ Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Server Error:", err.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
});

// ✅ Start Server
app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`);
});