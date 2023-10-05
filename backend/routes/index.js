const express = require('express');
const multer = require('multer');

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post('/scan', upload.single('resume'), (req, res) => {
  // Simulate a 3-second scan operation
  setTimeout(() => {
    res.json({ message: 'Scan complete' });
  }, 3000);
});

module.exports = app;