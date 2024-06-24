import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { MovementsModule } from './movements/movements.module';
import { MailsModule } from './mails/mails.module';

@Module({
  imports: [PrismaModule, ProductsModule, MovementsModule, MailsModule],
})
export class AppModule {}
