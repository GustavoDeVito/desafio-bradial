import { Module } from '@nestjs/common';
import { MovimentsService } from './moviments.service';
import { MovimentsController } from './moviments.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [PrismaModule, ProductsModule],
  controllers: [MovimentsController],
  providers: [MovimentsService],
})
export class MovimentsModule {}
