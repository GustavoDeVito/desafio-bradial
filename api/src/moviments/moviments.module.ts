import { Module } from '@nestjs/common';
import { MovimentsService } from './moviments.service';
import { MovimentsController } from './moviments.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MovimentsController],
  providers: [MovimentsService],
})
export class MovimentsModule {}
