import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from 'src/products/products.service';
import { CreateMovimentDto } from './dto/create-moviment.dto';
import { MovimentType } from '@prisma/client';

@Injectable()
export class MovimentsService {
  constructor(
    private prismaService: PrismaService,
    private readonly productsService: ProductsService,
  ) {}

  /**
   * @description List moviments of products.
   */
  findAll() {
    return this.prismaService.moviment.findMany();
  }

  /**
   * @description Create Movement of product.
   * @param createMovimentDto DTO of moviment.
   */
  async create(createMovimentDto: CreateMovimentDto) {
    const product = await this.productsService.findOneById(
      createMovimentDto.productId,
    );

    await this.prismaService.$transaction(async (tx) => {
      const newProductQuantity =
        createMovimentDto.type === MovimentType.INPUT
          ? product.quantity + createMovimentDto.quantity
          : product.quantity - createMovimentDto.quantity;

      if (newProductQuantity < 0) {
        throw new BadRequestException(
          'Quantidade informda para movimentação insuficiente do produto no estoque.',
        );
      }

      await tx.product.update({
        where: { id: createMovimentDto.productId },
        data: { quantity: newProductQuantity },
      });

      await tx.moviment.create({ data: createMovimentDto });
    });
  }
}
