import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRewardDto {
  @ApiProperty({ example: 'Free Coffee', description: 'Name of the reward' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Get a free coffee with 100 points', description: 'Description of the reward' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 100, description: 'Points cost to redeem' })
  @IsNumber()
  @IsNotEmpty()
  cost: number;

  @ApiPropertyOptional({ example: -1, description: 'Stock available (-1 for unlimited)' })
  @IsOptional()
  @IsNumber()
  stock?: number;

  @ApiPropertyOptional({ example: true, description: 'Is reward active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 'uuid', description: 'Company ID if associated to a company' })
  @IsOptional()
  @IsUUID()
  companyId?: string;

  @ApiPropertyOptional({ example: 'uuid', description: 'Business Location ID if specific to a location' })
  @IsOptional()
  @IsUUID()
  businessLocationId?: string;
}

export class UpdateRewardDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  cost?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  stock?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  companyId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  businessLocationId?: string;
}
