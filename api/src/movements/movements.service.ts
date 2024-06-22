import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from 'src/products/products.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { MovementType } from '@prisma/client';

@Injectable()
export class MovementsService {
  constructor(
    private prismaService: PrismaService,
    private readonly productsService: ProductsService,
  ) {}

  /**
   * @description List movements of products.
   */
  findAll() {
    return this.prismaService.movement.findMany();
  }

  /**
   * @description Create movement of product.
   * @param createMovementDto DTO of movement.
   */
  async create(createMovementDto: CreateMovementDto) {
    const product = await this.productsService.findOneById(
      createMovementDto.productId,
    );

    await this.prismaService.$transaction(async (tx) => {
      const newProductQuantity =
        createMovementDto.type === MovementType.INPUT
          ? product.quantity + createMovementDto.quantity
          : product.quantity - createMovementDto.quantity;

      if (newProductQuantity < 0) {
        throw new BadRequestException(
          'Quantidade informda para movimentação insuficiente do produto no estoque.',
        );
      }

      await tx.product.update({
        where: { id: createMovementDto.productId },
        data: { quantity: newProductQuantity },
      });

      await tx.movement.create({ data: createMovementDto });
    });
  }
}
