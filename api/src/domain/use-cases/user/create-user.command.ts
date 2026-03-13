// modules/users/use-cases/commands/create-user.command.ts
import { ICommand } from '@app/application/contracts/base';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateUserCommand implements ICommand {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string | undefined;

  @ApiProperty({
    example: 'SecurePass123!',
    description: 'User password (min 8 characters)',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string | undefined;

  @ApiProperty({
    example: 'John',
    description: 'User first name',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName: string | undefined;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName: string | undefined;

  @ApiProperty({
    example: 'uuid-role-customer',
    description: 'Role ID to assign',
  })
  @IsUUID()
  roleId: string | undefined;
}
