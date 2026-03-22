import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ICommand } from '@app/application';
import { ApiProperty } from '@nestjs/swagger';


export class CreateCategoryCommand implements ICommand {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  slug!: string;
}

export class UpdateCategoryCommand implements ICommand {
  @ApiProperty()
  id!: number;

  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  @MaxLength(100)
  slug?: string;
}

export class DeleteCategoryCommand implements ICommand {
  @ApiProperty()
  id!: number;
}
