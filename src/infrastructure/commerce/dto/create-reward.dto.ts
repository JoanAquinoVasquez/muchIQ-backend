import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateRewardDto {
    @ApiProperty({ example: 'Ceviche Gratis' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'Canjea tus puntos por un ceviche personal.' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 500 })
    @IsNumber()
    cost: number;

    @ApiProperty({ example: 10, required: false })
    @IsOptional()
    @IsNumber()
    stock?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    companyId?: string;
}
