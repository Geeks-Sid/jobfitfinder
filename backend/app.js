const express = require('express');
const cors = require('cors');
import app from './routes/index';

const app = express();
const port = 3001; // Different from the React app's port

// Middleware
app.use(cors());

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
