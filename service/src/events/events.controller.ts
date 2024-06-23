import { Controller } from '@nestjs/common';
import { EventsService } from './events.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ConsumerDto } from './dto/consumer.dto';

@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @MessagePattern('notification.email')
  consumer(@Payload() payload: ConsumerDto) {
    this.eventsService.consumer(payload);
  }
}
