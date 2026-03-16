import {
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ICommand,
  ICommandHandler,
  IQuery,
  IQueryHandler,
  IResponse,
} from '@app/application';

export abstract class BaseController<
  TCreateCommand extends ICommand,
  TUpdateCommand extends ICommand,
  TDeleteCommand extends ICommand,
  TGetByIdQuery extends IQuery<TResponse>,
  TResponse extends IResponse,
> {
  constructor(
    protected readonly createHandler: ICommandHandler<TCreateCommand, TResponse>,
    protected readonly updateHandler: ICommandHandler<TUpdateCommand, TResponse>,
    protected readonly deleteHandler: ICommandHandler<TDeleteCommand, void>,
    protected readonly getByIdHandler: IQueryHandler<TGetByIdQuery, TResponse>,
  ) {}

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<TResponse> {
    return this.getByIdHandler.execute({ id } as unknown as TGetByIdQuery);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() command: TCreateCommand): Promise<TResponse> {
    return this.createHandler.execute(command);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: TUpdateCommand,
  ): Promise<TResponse> {
    return this.updateHandler.execute({ ...body, id } as unknown as TUpdateCommand);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.deleteHandler.execute({ id } as unknown as TDeleteCommand);
  }
}
