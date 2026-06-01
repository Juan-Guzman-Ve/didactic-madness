import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ICommand } from '@app/application';

export class CreateAddressCommand implements ICommand {
  @ApiProperty()
  @IsInt()
  userId!: number;

  @ApiProperty()
  @IsString()
  addressLine1!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiProperty()
  @IsString()
  city!: string;

  @ApiProperty()
  @IsString()
  state!: string;

  @ApiProperty()
  @IsString()
  postalCode!: string;

  @ApiProperty()
  @IsString()
  country!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateAddressCommand implements ICommand {
  @ApiProperty()
  id!: number;

  userId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  addressLine1?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class DeleteAddressCommand implements ICommand {
  @ApiProperty()
  id!: number;

  userId?: number;
}
