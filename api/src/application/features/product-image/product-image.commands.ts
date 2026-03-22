import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsPositive, IsUrl, Min } from 'class-validator';
import { ICommand } from '@app/application';
 

export class CreateProductImageCommand implements ICommand {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  productId!: number;

  @ApiProperty()
  @IsString()
  @IsUrl()
  url!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;
}

export class UpdateProductImageCommand implements ICommand {
  @ApiProperty()
  id!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsUrl()
  url?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;
}

export class DeleteProductImageCommand implements ICommand {
  @ApiProperty()
  id!: number;
}
