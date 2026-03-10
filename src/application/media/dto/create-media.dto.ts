import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMediaTypeDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  extension?: string;
}

export class CreateMediaDto {
  @ApiProperty()
  @IsString()
  url: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  caption?: string;

  @ApiProperty()
  @IsString()
  mediaTypeId: string;
  
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  placeId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  routeId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  rewardId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;
}
