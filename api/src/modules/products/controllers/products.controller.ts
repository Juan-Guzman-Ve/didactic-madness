import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductQueryDto } from '../dto/product-query.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { PoliciesGuard } from '../../../common/guards/policies.guard';
import { RequirePolicies } from '../../../common/decorators/policies.decorator';
import { Public } from '../../../common/decorators/public.decorator';

@Controller('products')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  async findAll(@Query() query: ProductQueryDto) {
    // TODO: Implement product listing with filters, pagination, sorting
    return {
      data: [],
      meta: {
        page: query.page || 1,
        limit: query.limit || 20,
        total: 0,
      },
    };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    // TODO: Implement get product by ID
    return {
      message: `Get product ${id} - implementation pending`,
    };
  }

  @Post()
  @RequirePolicies('products:create')
  async create(@Body() createProductDto: CreateProductDto) {
    // TODO: Implement product creation
    return {
      message: 'Create product - implementation pending',
      dto: createProductDto,
    };
  }

  @Put(':id')
  @RequirePolicies('products:update')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    // TODO: Implement product update
    return {
      message: `Update product ${id} - implementation pending`,
      dto: updateProductDto,
    };
  }

  @Delete(':id')
  @RequirePolicies('products:delete')
  async remove(@Param('id') id: string) {
    // TODO: Implement product deletion (soft delete)
    return {
      message: `Delete product ${id} - implementation pending`,
    };
  }
}
