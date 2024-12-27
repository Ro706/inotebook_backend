const express = require('express');
const connectToMongo = require('./db');

connectToMongo();

const app = express();
const port = 3000;

// Middleware
app.use(express.json()); // Correctly use express.json()

// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
// Start the server
app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
