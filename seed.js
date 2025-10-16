const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const DB_FILE = path.join(__dirname, 'data.sqlite');
const db = new sqlite3.Database(DB_FILE);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  const sampleNotes = [
    { title: 'Welcome to DevHub Notes', content: 'This is a sample note. Edit or delete it.' },
    { title: 'Project Plan', content: 'Create backend, frontend, and wire up CRUD routes.' },
    { title: 'Citations', content: 'Inspired by Designing Web APIs (Jin et al.)' },
  ];

  db.all('SELECT COUNT(*) as c FROM notes', [], (err, rows) => {
    if (err) return console.error(err.message);
    if (rows[0].c === 0) {
      const stmt = db.prepare('INSERT INTO notes (title, content) VALUES (?, ?)');
      sampleNotes.forEach(n => stmt.run(n.title, n.content));
      stmt.finalize(() => {
        console.log('Seeded database with sample notes.');
        db.close();
      });
    } else {
      console.log('Database already seeded.');
      db.close();
    }
  });
});
