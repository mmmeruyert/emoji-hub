// api/emojis.js
module.exports = async (req, res) => {
  try {
    const r = await fetch('https://emojihub.yurace.pro/api/all');
    const data = await r.json();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(data);
  } catch (err) {
    console.error('api/emojis error:', err && err.message ? err.message : err);
    res.status(500).json({ error: 'Failed to fetch emojis' });
  }
};
