import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) {}

  /**
   * @description List Products.
   */
  findAll() {
    return this.prismaService.product.findMany();
  }

  /**
   * @description List Product by id.
   */
  async findOneById(id: number) {
    const product = await this.prismaService.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }

    return product;
  }

  /**
   * @description List Product by name.
   */
  private findOneByName(name: string) {
    return this.prismaService.product.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });
  }

  /**
   * @description Create Product.
   */
  async create(createProductDto: CreateProductDto) {
    const existProduct = await this.findOneByName(createProductDto.name);

    if (existProduct?.name) {
      throw new ConflictException('Já exite um produto com este nome.');
    }

    const createProduct = await this.prismaService.product.create({
      data: createProductDto,
      select: {
        id: true,
        name: true,
        description: true,
        quantity: true,
        alertLimit: true,
      },
    });

    return createProduct;
  }
}
