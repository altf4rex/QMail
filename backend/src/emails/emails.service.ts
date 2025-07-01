import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Database } from 'sqlite';
import { EmailRecord, EmailType } from './interfaces/email.interface';
import { CreateEmailDto } from './dto/create-email.dto';

@Injectable()
export class EmailsService {
  constructor(
    @Inject('DATABASE_CONNECTION')
    private readonly db: Database,
  ) { }

  async list(type: EmailType, search?: string): Promise<EmailRecord[]> {
    let sql = 'SELECT * FROM emails WHERE type = ?';
    const params: any[] = [type];

    if (search) {
      sql += ` AND (
      from_email LIKE ?
      OR to_email   LIKE ?
      OR subject    LIKE ?
    )`;
      const fragment = `%${search}%`;
      params.push(fragment, fragment, fragment);
    }

    sql += ' ORDER BY created_at DESC';
    return this.db.all<EmailRecord[]>(sql, params);
  }


  async listNew(): Promise<EmailRecord[]> {
    const rows = await this.db.all<EmailRecord[]>(
      "SELECT * FROM emails WHERE type = 'inbox' AND is_read = 0 ORDER BY created_at DESC",
    );
    return rows;
  }

  async getById(id: number, type: EmailType): Promise<EmailRecord> {
    const row = await this.db.get<EmailRecord>(
      'SELECT * FROM emails WHERE id = ? AND type = ?',
      [id, type],
    );
    if (!row) {
      throw new NotFoundException(`Email id=${id} type=${type} not found`);
    }
    return row;
  }

  async deleteById(id: number, type: EmailType): Promise<void> {
    await this.getById(id, type);
    await this.db.run('DELETE FROM emails WHERE id = ? AND type = ?', [
      id,
      type,
    ]);
  }

  async sendEmail(dto: CreateEmailDto): Promise<EmailRecord> {
    const sql =
      "INSERT INTO emails (from_email, to_email, subject, body, type) VALUES (?, ?, ?, ?, 'sent')";
    const result = await this.db.run(sql, [
      dto.from_email,
      dto.to_email,
      dto.subject,
      dto.body,
    ]);
    const id = result.lastID as number;
    return this.getById(id, 'sent');
  }

  async sendDraftById(id: number): Promise<EmailRecord> {
    await this.getById(id, 'draft');

    await this.db.run(
      `UPDATE emails
       SET type = 'sent',
           updated_at = CURRENT_TIMESTAMP
     WHERE id = ? AND type = 'draft'`,
      [id]
    );

    return this.getById(id, 'sent');
  }


  async sendAllDrafts(): Promise<number> {
    const drafts = await this.db.all<{ id: number }[]>(
      `SELECT id FROM emails WHERE type = 'draft'`
    );

    for (const { id } of drafts) {
      await this.db.run(
        `UPDATE emails
         SET type = 'sent',
             updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND type = 'draft'`,
        [id]
      );
    }

    return drafts.length;
  }


  async saveDraft(dto: CreateEmailDto): Promise<EmailRecord> {
    const sql =
      "INSERT INTO emails (from_email, to_email, subject, body, type) VALUES (?, ?, ?, ?, 'draft')";
    const result = await this.db.run(sql, [
      dto.from_email,
      dto.to_email,
      dto.subject,
      dto.body,
    ]);
    const id = result.lastID as number;
    return this.getById(id, 'draft');
  }

  async updateDraft(id: number, dto: CreateEmailDto): Promise<EmailRecord> {
    await this.getById(id, 'draft');
    const sql = `
      UPDATE emails
         SET from_email = ?, to_email = ?, subject = ?, body = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND type = 'draft'
    `;
    await this.db.run(sql, [
      dto.from_email,
      dto.to_email,
      dto.subject,
      dto.body,
      id,
    ]);
    return this.getById(id, 'draft');
  }

  async markAsRead(id: number): Promise<EmailRecord> {
    await this.getById(id, 'inbox');
    const sql =
      "UPDATE emails SET is_read = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND type = 'inbox'";
    await this.db.run(sql, [id]);
    return this.getById(id, 'inbox');
  }
}