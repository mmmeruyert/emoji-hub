// api/emojis/category/[category].js
import axios from 'axios';

export default async function handler(req, res) {
  const { category } = req.query;
  try {
    const response = await axios.get(`https://emojihub.yurace.pro/api/all/category/${category}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Category fetch failed' });
  }
}