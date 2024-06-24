import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { MailsModule } from 'src/mails/mails.module';

@Module({
  imports: [MailsModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
