import { Module } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { MovementsController } from './movements.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductsModule } from 'src/products/products.module';
import { MailsModule } from 'src/mails/mails.module';

@Module({
  imports: [PrismaModule, ProductsModule, MailsModule],
  controllers: [MovementsController],
  providers: [MovementsService],
})
export class MovementsModule {}
