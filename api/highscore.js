let highscore = 0; // temporary global storage

export default function handler(req, res) {
  if (req.method === "GET") {
    // Return the current highscore
    res.status(200).json({ score: highscore });
  } 
  else if (req.method === "POST") {
    const { score } = req.body;

    // Update highscore only if the new score is higher
    if (score > highscore) {
      highscore = score;
    }

    res.status(200).json({ score: highscore });
  } 
  else {
    // Method not allowed
    res.status(405).end();
  }
}
