const express = require('express');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const pdfParse = require('pdf-parse');
const axios = require('axios');

const app = express();

// Rate limiter to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Apply rate limiter to all requests
app.use(limiter);

const storage = multer.memoryStorage(); // Use memory storage for better security
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Only allow PDFs
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDFs are allowed'));
    }
    cb(null, true);
  }
});

app.post('/scan', upload.single('resume'), async (req, res) => {
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ message: 'File upload is required' });
  }

  let parsedText;
  try {
    parsedText = await pdfParse(req.file.buffer);
  } catch (error) {
    console.error('Error parsing PDF:', error);
    return res.status(400).json({ message: 'Invalid PDF format' });
  }

  const prompt = `${process.env.SKILL_PROMPT} ${parsedText.text}`;
  const gpt3Data = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ],
  };

  const apiKey = process.env.OPENAI_API_KEY;
  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  let skills;
  try {
    const gpt3Response = await axios.post(apiUrl, gpt3Data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    skills = gpt3Response.data.choices[0].text;
  } catch (error) {
    console.error('Error calling GPT-3 API:', error);
    return res.status(500).json({ message: 'Error processing resume' });
  } 

  const extractedSkills = skills.split(',').map(skill => skill.trim());
  res.json({ skills: extractedSkills.join(', ') });
});

module.exports = app;
