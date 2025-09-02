// api/emojis/category/[category].js
module.exports = async (req, res) => {
  try {
    const category = req.query.category || req.params?.category || '';
    // upstream has an endpoint /api/all/category/{category}, use it
    const r = await fetch(`https://emojihub.yurace.pro/api/all/category/${encodeURIComponent(category)}`);
    const data = await r.json();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(data);
  } catch (err) {
    console.error('api/emojis/category error:', err && err.message ? err.message : err);
    res.status(500).json({ error: 'Category fetch failed' });
  }
};
