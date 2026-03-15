import { ICommand } from '@app/application/contracts/base';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePolicyCommand implements ICommand {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;
  @IsString()
  @MaxLength(255)
  description?: string;
}
