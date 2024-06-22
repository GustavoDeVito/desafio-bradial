import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MovimentsService {
  constructor(private prismaService: PrismaService) {}

  /**
   * @description List moviments of products.
   */
  findAll() {
    return this.prismaService.moviment.findMany();
  }
}
