import { Injectable } from '@nestjs/common';
import { MailsService } from 'src/mails/mails.service';
import { ConsumerDto } from './dto/consumer.dto';
import { isEmail, isNotEmpty } from 'class-validator';

@Injectable()
export class EventsService {
  constructor(private readonly mailsService: MailsService) {}

  /**
   * @description Consume events and sends an email.
   * @param payload DTO of event.
   */
  async consumer(payload: ConsumerDto) {
    if (
      isEmail(payload?.to) &&
      isNotEmpty(payload?.subject) &&
      isNotEmpty(payload?.content)
    ) {
      await this.mailsService.send(
        payload.to,
        payload.subject,
        payload.content,
      );

      console.log('Processed!');
    } else {
      console.log('Not processed!');
    }
  }
}
