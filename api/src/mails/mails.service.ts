import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { MailHelper } from 'src/helpers/mail.helper';

@Injectable()
export class MailsService {
  constructor(@Inject('EMAIL_SERVICE') private readonly client: ClientKafka) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf(MailHelper.queue.topic);
    await this.client.connect();
  }

  /**
   * @description notification indicating that the specified product is in the alert zone.
   * @param product The name of the product that is in the alert zone.
   */
  alertLimit(product: string) {
    const content = `<div>O produto "<strong>${product}</strong>" está na zona de alerta.</div>`;

    this.client.emit(MailHelper.queue.topic, {
      to: 'example@example.com',
      subject: 'Alerta de Estoque Baixo - Notificação',
      content,
    });
  }
}
