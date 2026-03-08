import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { PoliciesGuard } from '../../../common/guards/policies.guard';
import { RequirePolicies } from '../../../common/decorators/policies.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(@Query('status') status?: string) {
    // TODO: Get all orders (admin) or user's orders
    return {
      data: [],
      message: 'Get orders - implementation pending',
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // TODO: Get order by ID
    return {
      message: `Get order ${id} - implementation pending`,
    };
  }

  @Post()
  @RequirePolicies('orders:create')
  async create(@Body() createOrderDto: CreateOrderDto) {
    // TODO: Create new order from cart
    return {
      message: 'Create order - implementation pending',
      dto: createOrderDto,
    };
  }

  @Put(':id/status')
  @RequirePolicies('orders:update')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ) {
    // TODO: Update order status (admin only)
    return {
      message: `Update order ${id} status - implementation pending`,
      dto: updateStatusDto,
    };
  }

  @Put(':id/cancel')
  @RequirePolicies('orders:cancel')
  async cancel(@Param('id') id: string) {
    // TODO: Cancel order
    return {
      message: `Cancel order ${id} - implementation pending`,
    };
  }
}
