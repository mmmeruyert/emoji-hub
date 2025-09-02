// api/emojis/search.js
import axios from 'axios';

export default async function handler(req, res) {
  const { q } = req.query;
  try {
    const response = await axios.get('https://emojihub.yurace.pro/api/all');
    const filtered = response.data.filter(emoji =>
      emoji.name.toLowerCase().includes(q.toLowerCase())
    );
    res.status(200).json(filtered);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
}