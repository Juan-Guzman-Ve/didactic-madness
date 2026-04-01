import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import {
  AddressResponse,
  CreateAddressCommand,
  CreateAddressCommandHandler,
  DeleteAddressCommand,
  DeleteAddressCommandHandler,
  GetAddressByIdQuery,
  GetAddressByIdQueryHandler,
  ListAddressesQuery,
  ListAddressesQueryHandler,
  ListAddressesResponse,
  UpdateAddressCommand,
  UpdateAddressCommandHandler,
} from '@app/application/features/address';
import { BaseController } from '@app/presentation/base';
import { RequirePolicies } from '@app/presentation/decorators/policies.decorator';

@ApiTags('addresses')
@ApiBearerAuth()
@ApiExtraModels(ListAddressesQuery)
@Controller('addresses')
export class AddressController extends BaseController<
  CreateAddressCommand,
  UpdateAddressCommand,
  DeleteAddressCommand,
  GetAddressByIdQuery,
  AddressResponse
> {
  constructor(
    createHandler: CreateAddressCommandHandler,
    updateHandler: UpdateAddressCommandHandler,
    deleteHandler: DeleteAddressCommandHandler,
    getByIdHandler: GetAddressByIdQueryHandler,
    private readonly listHandler: ListAddressesQueryHandler,
  ) {
    super(createHandler, updateHandler, deleteHandler, getByIdHandler);
  }


  @RequirePolicies('addresses:read')
  @Get(':id')
  override getById(@Param('id', ParseIntPipe) id: number): Promise<AddressResponse> {
    return super.getById(id);
  }


  @RequirePolicies('addresses:create')
  @ApiBody({ type: CreateAddressCommand })
  @Post()
  override create(@Body() command: CreateAddressCommand): Promise<AddressResponse> {
    return super.create(command);
  }


  @RequirePolicies('addresses:update')
  @ApiBody({ type: UpdateAddressCommand })
  @Put(':id')
  override update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateAddressCommand,
  ): Promise<AddressResponse> {
    return super.update(id, body);
  }


  @RequirePolicies('addresses:delete')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  override delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return super.delete(id);
  }


  @RequirePolicies('addresses:read')
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  list(@Query() query: ListAddressesQuery): Promise<ListAddressesResponse> {
    return this.listHandler.execute(query);
  }
}
