import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailsService {
  constructor(private mailerService: MailerService) {}

  send(to: string, subject: string, content: string) {
    this.mailerService.sendMail({
      to,
      subject,
      html: content,
    });
  }
}
