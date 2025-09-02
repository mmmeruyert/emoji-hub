
export default async function handler(req, res) {
  try {
    const response = await fetch("https://emojihub.yurace.pro/api/all");
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("EmojiHub fetch error:", err);
    res.status(500).json({ error: "Failed to fetch emojis" });
  }
}



