export type EmailType = 'inbox' | 'draft' | 'sent';

export interface EmailRecord {
  id: number;
  from_email: string;
  to_email: string;
  subject: string;
  body: string;
  type: EmailType;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}
