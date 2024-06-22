import { Body, Controller, Get, Post } from '@nestjs/common';
import { MovimentsService } from './moviments.service';
import { CreateMovimentDto } from './dto/create-moviment.dto';

@Controller('moviments')
export class MovimentsController {
  constructor(private readonly movimentsService: MovimentsService) {}

  @Get()
  findAll() {
    return this.movimentsService.findAll();
  }

  @Post()
  create(@Body() createMovimentDto: CreateMovimentDto) {
    return this.movimentsService.create(createMovimentDto);
  }
}
