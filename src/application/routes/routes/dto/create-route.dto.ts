import { IsString, IsOptional, IsInt, IsNumber, IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRouteDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsUUID()
  difficultyId: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  estimatedTime?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  distanceKm?: number;

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: any;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
