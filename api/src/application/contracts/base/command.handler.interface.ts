import { ICommand } from './i-command';

export interface ICommandHandler
<
  TCommand extends ICommand,
  TResult = void,
> 
{
  execute(command: TCommand): Promise<TResult>;
}
