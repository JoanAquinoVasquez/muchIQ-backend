import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDiscoveryDto {
  @ApiProperty({ example: 'uuid', description: 'User ID who discovered the place' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'uuid', description: 'Place ID discovered' })
  @IsUUID()
  @IsNotEmpty()
  placeId: string;

  @ApiPropertyOptional({ example: 10, description: 'Points awarded for discovery' })
  @IsOptional()
  @IsNumber()
  points?: number;
}
