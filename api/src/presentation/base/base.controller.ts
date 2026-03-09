import {
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ObjectLiteral } from 'typeorm';
import { IBaseService, PaginationQuery } from '../../application/contracts/base/base-service.interface';

export abstract class BaseController<
  TEntity extends ObjectLiteral,
  TCreateDto,
  TUpdateDto,
  TResponseDto,
> {
  constructor(
    protected readonly service: IBaseService<TEntity, TCreateDto, TUpdateDto>,
    protected readonly entityName: string,
  ) {}

  protected abstract toResponseDto(entity: TEntity): TResponseDto;
  protected abstract toResponseDtoList(entities: TEntity[]): TResponseDto[];

  @Get(':id')
  async findById(@Param('id') id: string): Promise<TResponseDto> {
    const entity = await this.service.findById(id);
    
    if (!entity) {
      throw new NotFoundException(`${this.entityName} with ID ${id} not found`);
    }

    return this.toResponseDto(entity);
  }

  @Get()
  async findAll(@Query() query: PaginationQuery) {
    const result = await this.service.findAll(query);
    
    return {
      data: this.toResponseDtoList(result.data),
      meta: result.meta,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: TCreateDto): Promise<TResponseDto> {
    const entity = await this.service.create(dto);
    return this.toResponseDto(entity);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: TUpdateDto,
  ): Promise<TResponseDto> {
    const entity = await this.service.update(id, dto);
    return this.toResponseDto(entity);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.service.delete(id);
  }

  @Delete('bulk/delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMany(@Body('ids') ids: string[]): Promise<void> {
    await this.service.deleteMany(ids);
  }

  @Post('bulk/create')
  @HttpCode(HttpStatus.CREATED)
  async createMany(@Body('items') dtos: TCreateDto[]): Promise<TResponseDto[]> {
    const entities = await this.service.createMany(dtos);
    return this.toResponseDtoList(entities);
  }

  @Put('bulk/update')
  async updateMany(
    @Body('updates') updates: Array<{ id: string; data: TUpdateDto }>,
  ): Promise<TResponseDto[]> {
    const mappedUpdates = updates.map(({ id, data }) => ({ id, dto: data }));
    const entities = await this.service.updateMany(mappedUpdates);
    return this.toResponseDtoList(entities);
  }
}
