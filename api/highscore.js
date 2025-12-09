import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "highscore.json");

async function readHighscore() {
  try {
    const data = await fs.readFile(filePath, "utf8");
    const obj = JSON.parse(data);
    return obj.score || 0;
  } catch {
    return 0;
  }
}

async function writeHighscore(score) {
  await fs.writeFile(filePath, JSON.stringify({ score }), "utf8");
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const score = await readHighscore();
    res.status(200).json({ score });
  } else if (req.method === "POST") {
    const { score } = req.body;
    if (typeof score !== "number") return res.status(400).json({ error: "Invalid score" });
    
    const current = await readHighscore(); // always read current highscore first
    if (score > current) {
      await writeHighscore(score);
      res.status(200).json({ score }); // new highscore
    } else {
      res.status(200).json({ score: current }); // previous highscore
    }
  } else {
    res.status(405).end();
  }
}
