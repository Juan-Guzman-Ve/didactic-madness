import { IQuery, IResponse } from '@app/application';

export interface IQueryHandler
<
  TQuery extends IQuery<TResult>, 
  TResult extends IResponse
> 
{
  execute(query: TQuery): Promise<TResult>;
}
