import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { MovimentsModule } from './moviments/moviments.module';

@Module({
  imports: [PrismaModule, ProductsModule, MovimentsModule],
})
export class AppModule {}
