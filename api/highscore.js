import { Redis } from "@upstash/redis";

// Initialize Redis with your URL + Token directly
const redis = new Redis({
  url: "https://enhanced-meerkat-41068.upstash.io",
  token: "AaBsAAIncDEwY2IxM2MxZjU4OTM0Zjc1OWNlNmNmOGRlODIwOGUwY3AxNDEwNjg",
});

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const score = (await redis.get("global_highscore")) || 0;
      return res.status(200).json({ score });
    } catch (err) {
      return res.status(500).json({ error: "KV connection failed" });
    }
  }

  if (req.method === "POST") {
    try {
      const { score } = req.body;
      if (typeof score !== "number") return res.status(400).end();

      const current = (await redis.get("global_highscore")) || 0;

      if (score > current) {
        await redis.set("global_highscore", score);
        return res.status(200).json({ score });
      }

      return res.status(200).json({ score: current });
    } catch (err) {
      return res.status(500).json({ error: "KV connection failed" });
    }
  }

  res.status(405).end();
}
