import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { MovementsModule } from './movements/movements.module';

@Module({
  imports: [PrismaModule, ProductsModule, MovementsModule],
})
export class AppModule {}
