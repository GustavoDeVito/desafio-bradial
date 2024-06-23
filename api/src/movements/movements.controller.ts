import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { QueryMovementDto } from './dto/query-movement.dto';

@Controller('movements')
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Get()
  findAll(@Query() queryMovementDto: QueryMovementDto) {
    return this.movementsService.findAll(queryMovementDto);
  }

  @Post()
  create(@Body() createMovementDto: CreateMovementDto) {
    return this.movementsService.create(createMovementDto);
  }
}
