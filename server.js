const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const db = new sqlite3.Database("./database.db");

// Create employee table
db.run(`
  CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    phone TEXT,
    department TEXT,
    designation TEXT
  )
`);

// Add employee
app.post("/api/employees", (req, res) => {
  const { name, email, phone, department, designation } = req.body;

  db.run(
    `INSERT INTO employees (name, email, phone, department, designation)
     VALUES (?, ?, ?, ?, ?)`,
    [name, email, phone, department, designation],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ message: "Employee added", id: this.lastID });
    }
  );
});

// Get all employees
app.get("/api/employees", (req, res) => {
  db.all("SELECT * FROM employees", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// Delete employee
app.delete("/api/employees/:id", (req, res) => {
  db.run("DELETE FROM employees WHERE id = ?", req.params.id, function (err) {
    if (err) return res.status(500).json(err);
    res.json({ message: "Employee deleted" });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
