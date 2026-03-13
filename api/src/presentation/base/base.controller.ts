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
} from '@nestjs/common';
import {
  ICommand,
  ICommandHandler,
  IQuery,
  IQueryHandler,
  IResponse,
} from '@app/application/contracts/base';

export abstract class BaseController<
  TCreateCommand extends ICommand,
  TUpdateCommand extends ICommand & { id: string },
  TDeleteCommand extends ICommand & { id: string },
  TGetByIdQuery extends IQuery<TResponse> & { id: string },
  TListQuery extends IQuery<TListResponse>,
  TResponse extends IResponse,
  TListResponse extends IResponse,
> {
  constructor(
    protected readonly createHandler: ICommandHandler<TCreateCommand, TResponse>,
    protected readonly updateHandler: ICommandHandler<TUpdateCommand, TResponse>,
    protected readonly deleteHandler: ICommandHandler<TDeleteCommand, void>,
    protected readonly getByIdHandler: IQueryHandler<TGetByIdQuery, TResponse>,
    protected readonly listHandler: IQueryHandler<TListQuery, TListResponse>,
  ) {}

  @Get(':id')
  async findById(@Param('id') id: string): Promise<TResponse> {
    const query = { id } as TGetByIdQuery;
    return this.getByIdHandler.execute(query);
  }

  @Get()
  async findAll(@Query() query: TListQuery): Promise<TListResponse> {
    return this.listHandler.execute(query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: TCreateCommand): Promise<TResponse> {
    return this.createHandler.execute(body);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: TUpdateCommand,
  ): Promise<TResponse> {
    const command = { ...body, id } as TUpdateCommand;
    return this.updateHandler.execute(command);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    const command = { id } as TDeleteCommand;
    await this.deleteHandler.execute(command);
  }
}
