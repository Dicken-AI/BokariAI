import initSqlJs from 'sql.js';
import type { Database as SqlJsRawDatabase } from 'sql.js';
import path from 'path';
import fs from 'fs';

const DATA_DIR = process.env.DATA_DIR || process.cwd();
const dbPath = path.join(DATA_DIR, './data/db.sqlite');

export async function runMigrations() {
  const dataDir = path.dirname(dbPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const SQL = await initSqlJs();

  let db;
  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  const migrationsFolder = path.join(DATA_DIR, 'drizzle');

  db.run(`
    CREATE TABLE IF NOT EXISTS ran_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      run_on DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  if (!fs.existsSync(migrationsFolder)) {
    // No migrations folder yet, save and return
    const data = db.export();
    fs.writeFileSync(dbPath, Buffer.from(data));
    db.close();
    return;
  }

  function sanitizeSql(content: string) {
    const statements = content
      .split(/--> statement-breakpoint/g)
      .map((stmt) =>
        stmt
          .split(/\r?\n/)
          .filter((l) => !l.trim().startsWith('-->'))
          .join('\n')
          .trim(),
      )
      .filter((stmt) => stmt.length > 0);

    return statements;
  }

  const migrationFiles = fs
    .readdirSync(migrationsFolder)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of migrationFiles) {
    const filePath = path.join(migrationsFolder, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const statements = sanitizeSql(content);

    const migrationName = file.split('_')[0] || file;

    const already = db.exec(
      `SELECT 1 FROM ran_migrations WHERE name = '${migrationName}'`,
    );

    if (already.length > 0 && already[0].values.length > 0) {
      console.log(`Skipping already-applied migration: ${file}`);
      continue;
    }

    try {
      statements.forEach((stmt) => {
        if (stmt.trim()) {
          db.run(stmt);
        }
      });

      db.run(
        `INSERT OR IGNORE INTO ran_migrations (name) VALUES ('${migrationName}')`,
      );
      console.log(`Applied migration: ${file}`);
    } catch (err) {
      console.error(`Failed to apply migration ${file}:`, err);
      throw err;
    }
  }

  // Save database
  const data = db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
  db.close();
}
