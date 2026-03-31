import { IResponse } from '@app/application';
import { ApiProperty } from '@nestjs/swagger';

export class AuthUserResponse implements IResponse {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: 'John' })
  firstName!: string;

  @ApiProperty({ example: 'Doe' })
  lastName!: string;

  @ApiProperty({ example: 2 })
  roleId!: number;

  @ApiProperty({ example: 'Active' })
  status!: string;
}

export class AuthLoginResponse implements IResponse {
  @ApiProperty({ example: 'jwt.token.here' })
  access_token!: string;

  @ApiProperty({ type: AuthUserResponse })
  user!: AuthUserResponse;
}

export class AuthRegisterResponse implements IResponse {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: 'John' })
  firstName!: string;

  @ApiProperty({ example: 'Doe' })
  lastName!: string;

  @ApiProperty({ example: 2 })
  roleId!: number;

  @ApiProperty({ example: 'Active' })
  status!: string;
}
