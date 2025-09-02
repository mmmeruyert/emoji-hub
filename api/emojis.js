
/* export default async function handler(req, res) {
  try {
    const response = await fetch("https://emojihub.yurace.pro/api/all");
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("EmojiHub fetch error:", err);
    res.status(500).json({ error: "Failed to fetch emojis" });
  }
} */

// api/emojis.js
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get('https://emojihub.yurace.pro/api/all');
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching emojis:', error);
    res.status(500).json({ error: 'Failed to fetch emojis' });
  }
}



