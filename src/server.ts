import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const dbFilePath = 'db.json';

// Ensure db.json exists
if (!fs.existsSync(dbFilePath)) {
  fs.writeFileSync(dbFilePath, JSON.stringify([]));
}

// Helper function to read from db.json
const readDB = () => {
  const data = fs.readFileSync(dbFilePath, 'utf8');
  return JSON.parse(data);
};

// Helper function to write to db.json
const writeDB = (data: any) => {
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
};

app.get('/ping', (req, res) => {
  res.json(true);
});

app.post('/submit', (req, res) => {
  const { name, email, phone, github_link, stopwatch_time } = req.body;
  const submissions = readDB();
  submissions.push({ name, email, phone, github_link, stopwatch_time });
  writeDB(submissions);
  res.status(201).json({ message: 'Submission saved!' });
});

app.get('/read', (req, res) => {
  const index = parseInt(req.query.index as string, 10);
  const submissions = readDB();
  if (index >= 0 && index < submissions.length) {
    res.json(submissions[index]);
  } else {
    res.status(404).json({ message: 'Submission not found' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
