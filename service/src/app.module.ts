import { Module } from '@nestjs/common';
import { MailsModule } from './mails/mails.module';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events.module';

@Module({
  imports: [ConfigModule.forRoot(), MailsModule, EventsModule],
})
export class AppModule {}
