// ✅ Load environment variables from .env
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Feedback = require('./models/Feedback');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Debug: check if MONGO_URI is loaded
console.log('Connecting to:', process.env.MONGO_URI);

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ POST /api/feedback - Submit feedback
app.post('/api/feedback', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    await Feedback.create({ name, email, message });
    res.status(200).json({ message: 'Feedback submitted!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET /api/feedbacks - Admin view all feedback
app.get('/api/feedbacks', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
