import { IsIn, IsOptional, IsString } from 'class-validator';
import { EmailType } from '../interfaces/email.interface';

export class QueryEmailsDto {
  @IsIn(['inbox', 'draft', 'sent'])
  type: EmailType;

  @IsOptional()
  @IsString()
  search?: string;
}