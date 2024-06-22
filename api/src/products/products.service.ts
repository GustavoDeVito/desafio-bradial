import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) {}

  /**
   * @description List products.
   * @param queryProductDto DTO for product listing.
   */
  async findAll(queryProductDto: QueryProductDto) {
    const { search, page, pageSize } = queryProductDto;

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const products = await this.prismaService.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        quantity: true,
        alertLimit: true,
        status: true,
      },
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      skip,
      take,
      orderBy: {
        name: 'asc',
      },
    });

    const totalProducts = await this.prismaService.product.count({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
    });

    return {
      data: products,
      items: totalProducts,
      pages: Math.ceil(totalProducts / pageSize),
      page,
    };
  }

  /**
   * @description List product by id.
   */
  async findOneById(id: number) {
    const product = await this.prismaService.product.findUnique({
      select: {
        id: true,
        name: true,
        description: true,
        quantity: true,
        alertLimit: true,
        movements: {
          select: {
            id: true,
            type: true,
            quantity: true,
            createdAt: true,
          },
        },
        status: true,
      },
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }

    return product;
  }

  /**
   * @description List product by name.
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
   * @description Create product.
   * @param createProductDto DTO of product.
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

  /**
   * @description Update product by id.
   * @param id Identify of product.
   * @param updateProductDto DTO of product.
   */
  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOneById(id);

    // verify duplicate
    if (updateProductDto?.name) {
      const product = await this.findOneByName(updateProductDto.name);

      if (product?.name && product?.id !== id) {
        throw new ConflictException('Já exite um produto com este nome.');
      }
    }

    await this.prismaService.product.update({
      where: { id },
      data: updateProductDto,
    });
  }
}
