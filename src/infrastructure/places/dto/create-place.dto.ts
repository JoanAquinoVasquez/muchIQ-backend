import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreatePlaceDto {
    @ApiProperty({ example: 'Museo Tumbas Reales de Sipán' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'Uno de los museos más importantes de Latinoamérica.' })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ example: -6.7011 })
    @IsNumber()
    latitude: number;

    @ApiProperty({ example: -79.9114 })
    @IsNumber()
    longitude: number;

    @ApiProperty({ example: 'uuid-de-la-categoria' })
    @IsUUID()
    categoryId: string;

    @ApiProperty({ required: false, example: { entryFee: 10, openHours: '9:00 - 17:00' } })
    @IsOptional()
    metadata?: any;
}
