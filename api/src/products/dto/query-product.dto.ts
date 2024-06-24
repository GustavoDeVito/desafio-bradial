import { Transform } from 'class-transformer';
import { IsNumber, IsString, Min } from 'class-validator';

export class QueryProductDto {
  @IsString()
  search: string = '';

  @IsNumber()
  @Min(1)
  @Transform(({ value }) => +value)
  page: number = 1;

  @IsNumber()
  @Min(1)
  @Transform(({ value }) => +value)
  pageSize: number = 10;
}
