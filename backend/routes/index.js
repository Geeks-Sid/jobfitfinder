const express = require('express');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const pdfParse = require('pdf-parse');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Check for required environment variables
if (!process.env.SKILL_PROMPT || !process.env.OPENAI_API_KEY) {
  console.error(!process.env.SKILL_PROMPT ? 'Missing SKILL_PROMPT environment variable' : 'Missing OPENAI_API_KEY environment variable');
  console.error('Missing required environment variables');
  process.exit(1);
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/scan', limiter); // Apply rate limiter only to /scan

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDFs are allowed'));
    }
    cb(null, true);
  }
});

app.post('/scan', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      throw new Error('File upload is required');
    }

    const parsedText = await pdfParse(req.file.buffer);
    const prompt = `${process.env.SKILL_PROMPT} ${parsedText.text}`;
    const gpt3Data = {
      model: process.env.GPT3_MODEL || "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    };

    const gpt3Response = await axios.post(process.env.OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions', gpt3Data, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    }).catch(err => {
      console.error('GPT-3 API Error:', err);
      throw new Error('GPT-3 API Error');
    });

    // Change this line to correctly extract the skills
    const skills = gpt3Response.data.choices[0].message.content || gpt3Response.data.choices[0].message;

    if (skills) {
      const extractedSkills = skills.split(',').map(skill => skill.trim());
      console.log('Extracted skills:', extractedSkills);
      res.json({ skills: extractedSkills });
    } else {
      throw new Error('Skills not found in API response');
    }
  } catch (error) {
    console.error('Error processing resume:', error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = app;
