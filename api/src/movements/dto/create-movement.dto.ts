import { MovementType } from '@prisma/client';
import { IsEnum, IsInt, Min } from 'class-validator';

export class CreateMovementDto {
  @IsEnum(MovementType)
  type: MovementType;

  @IsInt()
  productId: number;

  @Min(1)
  @IsInt()
  quantity: number;
}
