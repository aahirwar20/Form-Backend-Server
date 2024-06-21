"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const port = 3000;
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
const dbFilePath = 'db.json';
// Ensure db.json exists
if (!fs_1.default.existsSync(dbFilePath)) {
    fs_1.default.writeFileSync(dbFilePath, JSON.stringify([]));
}
// Helper function to read from db.json
const readDB = () => {
    const data = fs_1.default.readFileSync(dbFilePath, 'utf8');
    return JSON.parse(data);
};
// Helper function to write to db.json
const writeDB = (data) => {
    fs_1.default.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
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
    const index = parseInt(req.query.index, 10);
    const submissions = readDB();
    if (index >= 0 && index < submissions.length) {
        res.json(submissions[index]);
    }
    else {
        res.status(404).json({ message: 'Submission not found' });
    }
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
