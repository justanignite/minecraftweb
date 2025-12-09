import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === "GET") {
    const score = (await kv.get('highscore')) || 0;
    res.status(200).json({ score });
  } else if (req.method === "POST") {
    const { score } = req.body;
    if (typeof score !== "number") return res.status(400).json({ error: "Invalid score" });
    
    const current = (await kv.get('highscore')) || 0;
    if (score > current) {
      await kv.set('highscore', score);
      res.status(200).json({ score });
    } else {
      res.status(200).json({ score: current });
    }
  } else {
    res.status(405).end();
  }
}
