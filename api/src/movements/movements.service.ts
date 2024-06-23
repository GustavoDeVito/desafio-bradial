import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from 'src/products/products.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { MovementType } from '@prisma/client';
import { QueryMovementDto } from './dto/query-movement.dto';
import { MailsService } from 'src/mails/mails.service';

@Injectable()
export class MovementsService {
  constructor(
    private prismaService: PrismaService,
    private readonly productsService: ProductsService,
    private readonly mailsService: MailsService,
  ) {}

  /**
   * @description List movements of products.
   * @param queryMovementDto DTO for movements listing.
   */
  async findAll(queryMovementDto: QueryMovementDto) {
    const { page, pageSize } = queryMovementDto;

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const movements = await this.prismaService.movement.findMany({
      select: {
        id: true,
        type: true,
        products: {
          select: {
            id: true,
            name: true,
          },
        },
        quantity: true,
        createdAt: true,
      },
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalMovements = await this.prismaService.movement.count();

    return {
      data: movements,
      items: totalMovements,
      pages: Math.ceil(totalMovements / pageSize),
      page,
    };
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
          'A quantidade informada para a movimentação é insuficiente em relação ao estoque disponível do produto.',
        );
      }

      // verify alert limit
      if (
        createMovementDto.type === MovementType.OUTPUT &&
        newProductQuantity <= product.alertLimit
      ) {
        this.mailsService.alertLimit(product.name);
      }

      await tx.product.update({
        where: { id: createMovementDto.productId },
        data: { quantity: newProductQuantity },
      });

      await tx.movement.create({ data: createMovementDto });
    });
  }
}
