import { IsString, IsOptional } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsString()
  status: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
