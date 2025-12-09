import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Get the current global highscore
    const score = (await kv.get('highscore')) || 0;
    return res.status(200).json({ score });
  }

  if (req.method === "POST") {
    const { score } = req.body;
    if (typeof score !== "number") {
      return res.status(400).json({ error: "Invalid score" });
    }

    const current = (await kv.get('highscore')) || 0;

    // Only update if the new score is higher
    if (score > current) {
      await kv.set('highscore', score);
      return res.status(200).json({ score });
    } else {
      return res.status(200).json({ score: current });
    }
  }

  return res.status(405).end(); // Method not allowed
}
