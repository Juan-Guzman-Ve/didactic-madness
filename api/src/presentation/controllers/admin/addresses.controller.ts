import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiExtraModels, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import {
  AddressResponse,
  GetAddressByIdQuery,
  GetAddressByIdQueryHandler,
  ListAddressesQuery,
  ListAddressesQueryHandler,
  ListAddressesResponse,
} from '@app/application/features/address';
import { RequirePolicies } from '@app/presentation/decorators/policies.decorator';

@ApiTags('admin / addresses')
@ApiBearerAuth()
@ApiExtraModels(ListAddressesQuery)
@Controller('admin/addresses')
export class AdminAddressesController {
  constructor(
    private readonly getByIdHandler: GetAddressByIdQueryHandler,
    private readonly listHandler: ListAddressesQueryHandler,
  ) {}

  @RequirePolicies('addresses:read')
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  list(@Query() query: ListAddressesQuery): Promise<ListAddressesResponse> {
    return this.listHandler.execute(query);
  }

  @RequirePolicies('addresses:read')
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<AddressResponse> {
    return this.getByIdHandler.execute({ id } as GetAddressByIdQuery);
  }
}
