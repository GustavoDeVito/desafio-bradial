import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailsService {
  constructor(private mailerService: MailerService) {}

  /**
   * @description Send email.
   * @param to The recipient's email address.
   * @param subject The subject of the email.
   * @param content The HTML content of the email.
   */
  async send(to: string, subject: string, content: string) {
    await this.mailerService.sendMail({
      to,
      subject,
      html: content,
    });
  }
}
