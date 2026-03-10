import { IsString, IsOptional, IsInt, IsHexColor } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDifficultyLevelDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsHexColor()
  @IsOptional()
  color?: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  order?: number;
}
