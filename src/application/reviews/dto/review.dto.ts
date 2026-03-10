import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUUID, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 5, description: 'Rating from 1 to 5' })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating: number;

  @ApiPropertyOptional({ example: 'Great place!', description: 'Optional text comment' })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiPropertyOptional({ example: 'uuid', description: 'ID of the Place being reviewed' })
  @IsOptional()
  @IsUUID()
  placeId?: string;

  @ApiPropertyOptional({ example: 'uuid', description: 'ID of the Route being reviewed' })
  @IsOptional()
  @IsUUID()
  routeId?: string;
  
  // Note: userId is extracted from JWT
}

export class UpdateReviewDto {
  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comment?: string;
}
