import { Global, Module } from '@nestjs/common';
import { open, Database } from 'sqlite';
import * as sqlite3 from 'sqlite3';

@Global()
@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (): Promise<Database> => {
        const db = await open({
          filename: 'database.sqlite',
          driver: sqlite3.Database
        });

        await db.exec(`
          CREATE TABLE IF NOT EXISTS emails (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            from_email  TEXT    NOT NULL,
            to_email    TEXT    NOT NULL,
            subject     TEXT    NOT NULL,
            body        TEXT    NOT NULL,
            type        TEXT    NOT NULL CHECK(type IN ('inbox','draft','sent')),
            is_read     INTEGER NOT NULL DEFAULT 0,
            created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
          );
          CREATE INDEX IF NOT EXISTS idx_emails_type   ON emails(type);
          CREATE INDEX IF NOT EXISTS idx_emails_from   ON emails(from_email);
          CREATE INDEX IF NOT EXISTS idx_emails_subject ON emails(subject);
        `);

        const row = await db.get<{ cnt: number }>(
          `SELECT COUNT(*) AS cnt FROM emails WHERE type = 'inbox'`
        );
        const inboxCount = row?.cnt ?? 0;

        if (inboxCount === 0) {
          const samples = [
            ['alice@example.com', 'me@mail.com', 'Welcome!', 'Hello and welcome to QMail.'],
            ['bob@example.com', 'me@mail.com', 'Meet', 'Shall we meet tomorrow at 10?'],
            ['carol@example.com', 'me@mail.com', 'Report Ready', 'What about report ?.'],
            ['carol@example.com', 'me@mail.com', 'Report Ready', 'What about report ?.'],
            ['carol@example.com', 'me@mail.com', 'Report Ready', 'What about report ?.'],
            ['carol@example.com', 'me@mail.com', 'Report Ready', 'What about report ?.'],
            ['carol@example.com', 'me@mail.com', 'Report Ready', 'What about report ?.'],
            ['carol@example.com', 'me@mail.com', 'Report Ready', 'What about report ?.'],
            ['carol@example.com', 'me@mail.com', 'Report Ready', 'What about report ?.'],
          ];

          for (const [from, to, subj, body] of samples) {
            await db.run(
              `INSERT INTO emails (from_email, to_email, subject, body, type)
               VALUES (?, ?, ?, ?, 'inbox')`,
              [from, to, subj, body]
            );
          }
        }

        return db;
      },
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule { }