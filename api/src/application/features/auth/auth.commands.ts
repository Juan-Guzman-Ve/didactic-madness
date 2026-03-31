import { IsEmail, IsString, MinLength } from 'class-validator';
import { ICommand } from '@app/application';
import { ApiProperty } from '@nestjs/swagger';


export class LoginCommand implements ICommand {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'StrongPassword123' })
  @IsString()
  password!: string;
}

export class RegisterCommand implements ICommand {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @MinLength(2)
  firstName!: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @MinLength(2)
  lastName!: string;

  @ApiProperty({ example: 'StrongPassword123' })
  @IsString()
  @MinLength(8)
  password!: string;
}
