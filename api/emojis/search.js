// api/emojis/search.js
module.exports = async (req, res) => {
  try {
    const q = (req.query.q || '').toString().toLowerCase();
    const r = await fetch('https://emojihub.yurace.pro/api/all');
    const data = await r.json();
    const filtered = data.filter(e => (e.name || '').toLowerCase().includes(q));
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(filtered);
  } catch (err) {
    console.error('api/emojis/search error:', err && err.message ? err.message : err);
    res.status(500).json({ error: 'Search failed' });
  }
};
