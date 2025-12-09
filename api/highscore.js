let highscore = 0; // temporary global storage

export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json({ score: highscore });
  } else if (req.method === "POST") {
    const { score } = req.body;
    if (score > highscore) {
      highscore = score;
    }
    res.status(200).json({ score: highscore });
  } else {
    res.status(405).end(); // method not allowed
  }
}
