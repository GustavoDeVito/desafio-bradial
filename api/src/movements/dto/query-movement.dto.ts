import { Transform } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class QueryMovementDto {
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => +value)
  page: number = 1;

  @IsNumber()
  @Min(1)
  @Transform(({ value }) => +value)
  pageSize: number = 10;
}
