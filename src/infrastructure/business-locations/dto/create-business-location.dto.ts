import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';

export class CreateBusinessLocationDto {
    @ApiProperty({ description: 'Nombre del local', example: 'Sucursal Centro Histórico' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(150)
    name: string;

    @ApiProperty({ description: 'Descripción del local', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @ApiProperty({ description: 'Teléfono del local', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    phone?: string;

    @ApiProperty({ description: 'Email del local', required: false })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({ description: 'Latitud', example: -6.7711, required: false })
    @IsOptional()
    @IsNumber()
    latitude?: number;

    @ApiProperty({ description: 'Longitud', example: -79.8409, required: false })
    @IsOptional()
    @IsNumber()
    longitude?: number;

    @ApiProperty({ description: 'Dirección', example: 'Jr. Colón 123', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    address?: string;

    @ApiProperty({ description: 'Distrito', example: 'Chiclayo', required: false })
    @IsOptional()
    @IsString()
    district?: string;

    @ApiProperty({ description: 'Ciudad', example: 'Chiclayo', required: false })
    @IsOptional()
    @IsString()
    city?: string;

    @ApiProperty({ description: 'País (ISO 2)', example: 'PE', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(2)
    country?: string;
}
