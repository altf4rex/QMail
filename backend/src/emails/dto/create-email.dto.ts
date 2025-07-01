import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateEmailDto {
  @IsEmail()
  from_email: string;

  @IsEmail()
  to_email: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  body: string;
}
