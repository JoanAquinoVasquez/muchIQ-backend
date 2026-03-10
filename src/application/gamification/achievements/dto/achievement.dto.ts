import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAchievementDto {
  @ApiProperty({ example: 'First Discovery', description: 'Name of the achievement' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Discover your first place', description: 'Description of the achievement' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 50, description: 'Points awarded' })
  @IsOptional()
  @IsNumber()
  points?: number;

  @ApiPropertyOptional({ example: true, description: 'Is achievement active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: { type: 'visit_count', target: 1 }, description: 'Criteria to unlock' })
  @IsOptional()
  @IsObject()
  criteria?: any;

  @ApiPropertyOptional({ example: 'star-icon', description: 'Icon identifier' })
  @IsOptional()
  @IsString()
  icon?: string;
}

export class UpdateAchievementDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  points?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  criteria?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  icon?: string;
}
