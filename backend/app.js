const express = require('express');
const cors = require('cors');
const routes = require("./routes/index");
const app = express();
require('dotenv').config();


const port = 3001; // Different from the React app's port


app.use('/', routes)

// Middleware
app.use(cors());

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
