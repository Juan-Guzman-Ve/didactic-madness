import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CurrentUser } from '@app/presentation/decorators';
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

@ApiTags('storefront / addresses')
@ApiBearerAuth()
@ApiExtraModels(ListAddressesQuery)
@Controller('addresses')
export class StorefrontAddressesController extends BaseController<
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

  @Get(':id')
  override getById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user?: { id: number },
  ): Promise<AddressResponse> {
    return this.getByIdHandler.execute({ id, userId: user?.id } as GetAddressByIdQuery);
  }

  @ApiBody({ type: CreateAddressCommand })
  @Post()
  override create(
    @Body() command: CreateAddressCommand,
    @CurrentUser() user?: { id: number },
  ): Promise<AddressResponse> {
    command.userId = user?.id ?? command.userId;
    return super.create(command);
  }

  @ApiBody({ type: UpdateAddressCommand })
  @Put(':id')
  override update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateAddressCommand,
    @CurrentUser() user?: { id: number },
  ): Promise<AddressResponse> {
    body.userId = user?.id;
    return super.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  override delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user?: { id: number },
  ): Promise<void> {
    return this.deleteHandler.execute({ id, userId: user?.id } as DeleteAddressCommand);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  list(
    @Query() query: ListAddressesQuery,
    @CurrentUser() user: { id: number },
  ): Promise<ListAddressesResponse> {
    query.userId = user.id;
    return this.listHandler.execute(query);
  }
}
