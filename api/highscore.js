import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL_KV_URL,
  token: process.env.KV_REST_API_URL_KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const score = (await redis.get("global_highscore")) || 0;
      return res.status(200).json({ score });
    }

    if (req.method === "POST") {
      const { score } = req.body;
      if (typeof score !== "number") return res.status(400).end();

      const current = (await redis.get("global_highscore")) || 0;
      if (score > current) {
        await redis.set("global_highscore", score);
      }

      return res.status(200).json({ score: Math.max(score, current) });
    }

    res.status(405).end();
  } catch (err) {
    console.error("KV ERROR:", err);
    res.status(500).json({ error: "KV connection failed" });
  }
}
