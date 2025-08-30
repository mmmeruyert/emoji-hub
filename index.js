const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/catalog', (req, res) => {
  res.render('catalog');
});

// API Routes (Level 2 requirement)
app.get('/api/emojis', async (req, res) => {
  try {
    const response = await axios.get('https://emojihub.yurace.pro/api/all');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching emojis:', error);
    res.status(500).json({ error: 'Failed to fetch emojis' });
  }
});

app.get('/api/emojis/search', async (req, res) => {
  const { q } = req.query;
  try {
    const response = await axios.get('https://emojihub.yurace.pro/api/all');
    const filtered = response.data.filter(emoji => 
      emoji.name.toLowerCase().includes(q.toLowerCase())
    );
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

app.get('/api/emojis/category/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const response = await axios.get(`https://emojihub.yurace.pro/api/all/category/${category}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Category fetch failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Emoji Hub running at http://localhost:${PORT}`);
});