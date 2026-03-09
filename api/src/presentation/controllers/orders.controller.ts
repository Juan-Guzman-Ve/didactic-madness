import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  // TODO: Implement order endpoints
  // - GET /orders
  // - GET /orders/:id
  // - POST /orders
  // - PATCH /orders/:id/status
}
