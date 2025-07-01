import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Patch,
  Query,
  Param,
  Body,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  BadRequestException
} from '@nestjs/common';
import { EmailsService } from './emails.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { QueryEmailsDto } from './dto/query-emails.dto';
import { EmailRecord, EmailType } from './interfaces/email.interface';

@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) { }

  @Get()
  async list(@Query() query: QueryEmailsDto): Promise<EmailRecord[]> {
    return this.emailsService.list(query.type, query.search);
  }

  @Get('new')
  async listNew(): Promise<EmailRecord[]> {
    return this.emailsService.listNew();
  }

  @Get(':id')
  async getOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('type') type: EmailType
  ): Promise<EmailRecord> {
    return this.emailsService.getById(id, type);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('type') type: EmailType
  ): Promise<{ success: boolean }> {
    await this.emailsService.deleteById(id, type);
    return { success: true };
  }

  @Post()
  async create(
    @Query('type') type: EmailType,
    @Body() dto: CreateEmailDto
  ): Promise<EmailRecord> {
    if (type === 'inbox') {
      throw new BadRequestException('Cannot create emails in inbox');
    }
    if (type === 'draft') {
      return this.emailsService.saveDraft(dto);
    }
    return this.emailsService.sendEmail(dto);
  }

  @Put(':id')
  async updateDraft(
    @Param('id', ParseIntPipe) id: number,
    @Query('type') type: EmailType,
    @Body() dto: CreateEmailDto,
  ): Promise<EmailRecord> {
    if (type !== 'draft') {
      throw new BadRequestException('Only drafts can be updated');
    }
    return this.emailsService.updateDraft(id, dto);
  }

  @Patch(':id/read')
  async markAsRead(
    @Param('id', ParseIntPipe) id: number
  ): Promise<EmailRecord> {
    return this.emailsService.markAsRead(id);
  }

  @Patch(':id/send')
  async sendDraft(
    @Param('id', ParseIntPipe) id: number
  ): Promise<EmailRecord> {
    return this.emailsService.sendDraftById(id);
  }

  @Post('send-all')
  async sendAllDrafts(): Promise<{ count: number }> {
    const count = await this.emailsService.sendAllDrafts();
    return { count };
  }
}