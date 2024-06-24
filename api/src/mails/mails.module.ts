import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'EMAIL_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'mail',
            brokers: [process.env.BROKER_HOST],
          },
          producerOnlyMode: true,
          consumer: {
            allowAutoTopicCreation: true,
            groupId: 'mail-consumer',
          },
        },
      },
    ]),
  ],
  providers: [MailsService],
  exports: [MailsService],
})
export class MailsModule {}
