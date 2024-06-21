"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const PORT = 3000;
const DB_FILE = 'db.json';
app.use(body_parser_1.default.json());
// Endpoint to check if the server is running
app.get('/ping', (req, res) => {
    res.json({ success: true });
});
// Endpoint to submit a form
app.post('/submit', (req, res) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;
    // Read existing submissions
    let submissions = [];
    try {
        const data = fs_1.default.readFileSync(DB_FILE, 'utf8');
        submissions = JSON.parse(data);
    }
    catch (err) {
        console.error('Error reading file:', err);
    }
    // Add new submission
    submissions.push({ name, email, phone, github_link, stopwatch_time });
    // Write updated submissions back to the file
    fs_1.default.writeFileSync(DB_FILE, JSON.stringify(submissions, null, 2));
    res.json({ success: true });
});
// Endpoint to read a form submission by index
app.get('/read', (req, res) => {
    const index = Number(req.query.index);
    // Read existing submissions
    let submissions = [];
    try {
        const data = fs_1.default.readFileSync(DB_FILE, 'utf8');
        submissions = JSON.parse(data);
    }
    catch (err) {
        console.error('Error reading file:', err);
    }
    if (index >= 0 && index < submissions.length) {
        res.json(submissions[index]);
    }
    else {
        res.status(404).json({ error: 'Submission not found' });
    }
});
// Endpoint to delete a form submission by index
app.delete('/delete/:index', (req, res) => {
    const index = Number(req.params.index);
    // Read existing submissions
    let submissions = [];
    try {
        const data = fs_1.default.readFileSync(DB_FILE, 'utf8');
        submissions = JSON.parse(data);
    }
    catch (err) {
        console.error('Error reading file:', err);
    }
    if (index >= 0 && index < submissions.length) {
        // Remove submission at specified index
        submissions.splice(index, 1);
        // Write updated submissions back to the file
        fs_1.default.writeFileSync(DB_FILE, JSON.stringify(submissions, null, 2));
        res.json({ success: true });
    }
    else {
        res.status(404).json({ error: 'Submission not found' });
    }
});
// Endpoint to edit a form submission by index
app.put('/edit/:index', (req, res) => {
    const index = Number(req.params.index);
    const { name, email, phone, github_link, stopwatch_time } = req.body;
    // Read existing submissions
    let submissions = [];
    try {
        const data = fs_1.default.readFileSync(DB_FILE, 'utf8');
        submissions = JSON.parse(data);
    }
    catch (err) {
        console.error('Error reading file:', err);
    }
    if (index >= 0 && index < submissions.length) {
        // Update submission at specified index
        submissions[index] = { name, email, phone, github_link, stopwatch_time };
        // Write updated submissions back to the file
        fs_1.default.writeFileSync(DB_FILE, JSON.stringify(submissions, null, 2));
        res.json({ success: true });
    }
    else {
        res.status(404).json({ error: 'Submission not found' });
    }
});
// Endpoint to search form submissions by email
app.get('/search', (req, res) => {
    const email = req.query.email;
    // Read existing submissions
    let submissions = [];
    try {
        const data = fs_1.default.readFileSync(DB_FILE, 'utf8');
        submissions = JSON.parse(data);
    }
    catch (err) {
        console.error('Error reading file:', err);
    }
    // Filter submissions by email
    const results = submissions.filter(submission => submission.email === email);
    res.json(results);
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
