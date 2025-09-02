
const axios = require("axios");

module.exports = async (req, res) => {
  try {
    const { q, category, sort } = req.query;
    const { data } = await axios.get("https://emojihub.yurace.pro/api/all");

    let items = Array.isArray(data) ? data : [];

    if (q) {
      const needle = q.toLowerCase();
      items = items.filter(e => (e.name || '').toLowerCase().includes(needle));
    }
    if (category) {
      items = items.filter(e => (e.category || '').toLowerCase() === category.toLowerCase());
    }
    if (sort === "alpha") items.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    if (sort === "category") items.sort((a, b) => (a.category || '').localeCompare(b.category || ''));

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).json(items);
  } catch (err) {
    console.error("EmojiHub API error:", err.message);
    res.status(500).json({ error: "Failed to fetch emojis" });
  }
};

