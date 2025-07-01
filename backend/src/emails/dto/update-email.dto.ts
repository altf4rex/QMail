import { IsBoolean } from 'class-validator';

export class UpdateEmailDto {
  @IsBoolean()
  is_read: boolean;
}