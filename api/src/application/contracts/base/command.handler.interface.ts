import { ICommand } from '@app/application';
export interface ICommandHandler
<
  TCommand extends ICommand,
  TResult = void,
> 
{
  execute(command: TCommand): Promise<TResult>;
}
