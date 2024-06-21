import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
const PORT = 3000;
const DB_FILE = 'db.json';

app.use(bodyParser.json());

// Endpoint to check if the server is running
app.get('/ping', (req: Request, res: Response) => {
    res.json({ success: true });
});

// Endpoint to submit a form
app.post('/submit', (req: Request, res: Response) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;

    // Read existing submissions
    let submissions: any[] = [];
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        submissions = JSON.parse(data);
    } catch (err) {
        console.error('Error reading file:', err);
    }

    // Add new submission
    submissions.push({ name, email, phone, github_link, stopwatch_time });

    // Write updated submissions back to the file
    fs.writeFileSync(DB_FILE, JSON.stringify(submissions, null, 2));

    res.json({ success: true });
});

// Endpoint to read a form submission by index
app.get('/read', (req: Request, res: Response) => {
    const index = Number(req.query.index);

    // Read existing submissions
    let submissions: any[] = [];
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        submissions = JSON.parse(data);
    } catch (err) {
        console.error('Error reading file:', err);
    }

    if (index >= 0 && index < submissions.length) {
        res.json(submissions[index]);
    } else {
        res.status(404).json({ error: 'Submission not found' });
    }
});

// Endpoint to delete a form submission by index
app.delete('/delete/:index', (req: Request, res: Response) => {
  const index = Number(req.params.index);

  // Read existing submissions
  let submissions: any[] = [];
  try {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      submissions = JSON.parse(data);
  } catch (err) {
      console.error('Error reading file:', err);
  }

  if (index >= 0 && index < submissions.length) {
      // Remove submission at specified index
      submissions.splice(index, 1);

      // Write updated submissions back to the file
      fs.writeFileSync(DB_FILE, JSON.stringify(submissions, null, 2));

      res.json({ success: true });
  } else {
      res.status(404).json({ error: 'Submission not found' });
  }
});

// Endpoint to edit a form submission by index
app.put('/edit/:index', (req: Request, res: Response) => {
  const index = Number(req.params.index);
  const { name, email, phone, github_link, stopwatch_time } = req.body;

  // Read existing submissions
  let submissions: any[] = [];
  try {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      submissions = JSON.parse(data);
  } catch (err) {
      console.error('Error reading file:', err);
  }

  if (index >= 0 && index < submissions.length) {
      // Update submission at specified index
      submissions[index] = { name, email, phone, github_link, stopwatch_time };

      // Write updated submissions back to the file
      fs.writeFileSync(DB_FILE, JSON.stringify(submissions, null, 2));

      res.json({ success: true });
  } else {
      res.status(404).json({ error: 'Submission not found' });
  }
});

// Endpoint to search form submissions by email
app.get('/search', (req: Request, res: Response) => {
  const email = req.query.email as string;

  // Read existing submissions
  let submissions: any[] = [];
  try {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      submissions = JSON.parse(data);
  } catch (err) {
      console.error('Error reading file:', err);
  }

  // Filter submissions by email
  const results = submissions.filter(submission => submission.email === email);

  res.json(results);
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
