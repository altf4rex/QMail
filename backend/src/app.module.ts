import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { EmailsModule } from './emails/emails.module';

@Module({
  imports: [DatabaseModule, EmailsModule],
})
export class AppModule {}
