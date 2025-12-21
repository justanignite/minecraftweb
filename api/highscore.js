import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const score = (await kv.get("global_highscore")) || 0;
    return res.status(200).json({ score });
  }

  if (req.method === "POST") {
    const { score } = req.body;

    if (typeof score !== "number") return res.status(400).end();

    const current = (await kv.get("global_highscore")) || 0;

    if (score > current) {
      await kv.set("global_highscore", score);
      return res.status(200).json({ score });
    }

    return res.status(200).json({ score: current });
  }

  res.status(405).end();
}
