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

  alertLimit(product: string) {
    const content = `<div>O produto "<strong>${product}</strong>" está na zona de alerta.</div>`;

    this.client.emit(MailHelper.queue.topic, {
      to: 'gustavodevito38@gmail.com',
      subject: 'Alerta de Estoque Baixo - Notificação',
      content,
    });
  }
}
