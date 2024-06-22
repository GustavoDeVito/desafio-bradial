import { MovimentType } from '@prisma/client';
import { IsEnum, IsInt, Min } from 'class-validator';

export class CreateMovimentDto {
  @IsEnum(MovimentType)
  type: MovimentType;

  @IsInt()
  productId: number;

  @Min(1)
  @IsInt()
  quantity: number;
}
