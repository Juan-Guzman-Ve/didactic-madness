import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { PoliciesGuard } from '../../../common/guards/policies.guard';
import { RequirePolicies } from '../../../common/decorators/policies.decorator';
import { Public } from '../../../common/decorators/public.decorator';

@Controller('categories')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  async findAll() {
    // TODO: Get all categories
    return {
      data: [],
      message: 'Get categories - implementation pending',
    };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    // TODO: Get category by ID
    return {
      message: `Get category ${id} - implementation pending`,
    };
  }

  @Post()
  @RequirePolicies('categories:create')
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    // TODO: Create category
    return {
      message: 'Create category - implementation pending',
      dto: createCategoryDto,
    };
  }

  @Put(':id')
  @RequirePolicies('categories:update')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    // TODO: Update category
    return {
      message: `Update category ${id} - implementation pending`,
    };
  }

  @Delete(':id')
  @RequirePolicies('categories:delete')
  async remove(@Param('id') id: string) {
    // TODO: Delete category
    return {
      message: `Delete category ${id} - implementation pending`,
    };
  }
}
