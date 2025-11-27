const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


let matches = [];
let nextId = 1;


const clients = new Set();

function broadcastAll() {
  const payload = JSON.stringify(matches);
  for (const res of clients) {
    res.write(`data: ${payload}\n\n`);
  }
}

app.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  clients.add(res);

  
  res.write(`data: ${JSON.stringify(matches)}\n\n`);

  const heartbeat = setInterval(() => {
    res.write(": ping\n\n");
  }, 30000);

  req.on("close", () => {
    clearInterval(heartbeat);
    clients.delete(res);
    res.end();
  });
});


app.post("/matches", (req, res) => {
  const { team1, team2 } = req.body;

  if (!team1 || !team2) {
    return res.status(400).json({ error: "team1 and team2 are required" });
  }

  const match = {
    id: nextId++,
    team1: String(team1).trim(),
    team2: String(team2).trim(),
    score: "0 : 0"
  };

  matches.push(match);
  broadcastAll();

  res.status(201).json(match);
});


app.put("/matches/:id", (req, res) => {
  const id = Number(req.params.id);
  const match = matches.find(m => m.id === id);

  if (!match) return res.status(404).json({ error: "Match not found" });

  const { team1, team2, score } = req.body;

  if (team1) match.team1 = String(team1).trim();
  if (team2) match.team2 = String(team2).trim();

  if (score) {
    const s = String(score).trim();
    const pattern = /^\d+\s*:\s*\d+$/;

    if (!pattern.test(s)) {
      return res.status(400).json({ error: "Score must be like: 2 : 1" });
    }

    const [a, b] = s.split(":").map(x => x.trim());
    match.score = `${a} : ${b}`;
  }

  broadcastAll();
  res.json(match);
});


app.delete("/matches/:id", (req, res) => {
  const id = Number(req.params.id);
  const before = matches.length;

  matches = matches.filter(m => m.id !== id);

  if (matches.length === before) {
    return res.status(404).json({ error: "Match not found" });
  }

  broadcastAll();
  res.status(204).send();
});


app.get("/matches", (req, res) => {
  res.json(matches);
});

app.get("/", (req, res) => {
  res.send("Football Live Score Server (SSE)");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
